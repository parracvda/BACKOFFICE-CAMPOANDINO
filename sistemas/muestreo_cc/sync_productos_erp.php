<?php
/**
 * Sincronización de productos desde ERP Nisira (SQL Server) → MySQL sig_cc_productos
 *
 * REQUISITOS:
 *   - VPN activa (conexión a 172.51.0.10)
 *   - PHP con extensión pdo_sqlsrv o sqlsrv instalada
 *
 * EJECUCIÓN MANUAL:
 *   php sync_productos_erp.php
 *
 * CRON (cada día a las 2 AM):
 *   0 2 * * * php /ruta/al/script/sync_productos_erp.php >> /ruta/log/sync_productos.log 2>&1
 *
 * DESDE NAVEGADOR (requiere sesión activa):
 *   http://localhost/BACKOFFICE/sistemas/muestreo_cc/sync_productos_erp.php?run=1
 */

date_default_timezone_set('America/Lima');
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/sync_productos_erp.log');

// Si se llama desde navegador, verificar sesión
$esCLI = (php_sapi_name() === 'cli');
if (!$esCLI) {
    session_start();
    if (!isset($_SESSION['usuario'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'mensaje' => 'No autorizado']);
        exit;
    }
    header('Content-Type: application/json; charset=utf-8');
}

$inicio = microtime(true);

// ─── Configuración ERP (SQL Server) ──────────────────────────────────────────
$erp_config = [
    'host'     => '172.51.0.10\ORACLENIS',
    'port'     => '50562',
    'database' => 'campoandino',
    'username' => 'jparra',
    'password' => 'HQQl5|L7Wd4>',
    'charset'  => 'UTF-8',
];

// ─── Conexión MySQL ───────────────────────────────────────────────────────────
require_once __DIR__ . '/../../shared/conexion.php';
// $conn disponible desde conexion.php

// ─── Función: conectar SQL Server ────────────────────────────────────────────
function conectarSQLServer($cfg) {
    if (extension_loaded('pdo_sqlsrv')) {
        $dsn = "sqlsrv:Server={$cfg['host']},{$cfg['port']};Database={$cfg['database']}";
        $opts = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::SQLSRV_ATTR_ENCODING    => PDO::SQLSRV_ENCODING_UTF8,
        ];
        return new PDO($dsn, $cfg['username'], $cfg['password'], $opts);
    }
    if (extension_loaded('sqlsrv')) {
        $srv  = $cfg['host'] . ',' . $cfg['port'];
        $info = ['Database' => $cfg['database'], 'UID' => $cfg['username'],
                 'PWD' => $cfg['password'], 'CharacterSet' => 'UTF-8'];
        $c = sqlsrv_connect($srv, $info);
        if ($c === false) {
            throw new Exception('sqlsrv_connect falló: ' . print_r(sqlsrv_errors(), true));
        }
        return $c;
    }
    throw new Exception('No hay extensiones SQL Server disponibles (pdo_sqlsrv / sqlsrv).');
}

// ─── Función: obtener productos del ERP ──────────────────────────────────────
//
// ⚠️  AJUSTA LA CONSULTA según los nombres de tabla/columnas de tu ERP Nisira.
//    Ejecuta test_conexion_erp.php para explorar la estructura.
//    Campos mínimos que necesitamos: código y descripción/nombre del producto.
//
function obtenerProductosERP($erpConn) {
    // Ejemplo genérico — cámbialo por la tabla/columnas reales de Nisira
    $sql = "
        SELECT
            LTRIM(RTRIM(CAST(cod_producto AS VARCHAR(60))))  AS codigo,
            LTRIM(RTRIM(CAST(des_producto AS VARCHAR(255)))) AS nombre
        FROM   dbo.PRODUCTOS          -- ← ajusta el nombre de la tabla
        WHERE  estado = 'A'           -- ← ajusta el filtro de activos si existe
        ORDER  BY cod_producto
    ";

    if ($erpConn instanceof PDO) {
        $stmt = $erpConn->query($sql);
        return $stmt->fetchAll();
    }

    // sqlsrv nativo
    $stmt = sqlsrv_query($erpConn, $sql);
    if ($stmt === false) {
        throw new Exception('Error query ERP: ' . print_r(sqlsrv_errors(), true));
    }
    $rows = [];
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        $rows[] = $row;
    }
    return $rows;
}

// ─── Sincronización principal ─────────────────────────────────────────────────
$resultado = ['success' => false, 'insertados' => 0, 'actualizados' => 0,
              'total_erp' => 0, 'mensaje' => ''];
try {
    // 1. Conectar ERP
    $erpConn = conectarSQLServer($erp_config);

    // 2. Obtener productos del ERP
    $productos = obtenerProductosERP($erpConn);
    $resultado['total_erp'] = count($productos);

    if (empty($productos)) {
        throw new Exception('El ERP no devolvió productos. Verifica la consulta SQL.');
    }

    // 3. Upsert en MySQL (INSERT … ON DUPLICATE KEY UPDATE)
    $stmtMysql = $conn->prepare(
        "INSERT INTO sig_cc_productos (codigo, nombre, activo, sync_at)
         VALUES (?, ?, 1, NOW())
         ON DUPLICATE KEY UPDATE
           nombre  = VALUES(nombre),
           activo  = 1,
           sync_at = NOW()"
    );

    $conn->begin_transaction();
    foreach ($productos as $p) {
        $codigo = strtoupper(trim($p['codigo'] ?? ''));
        $nombre = strtoupper(trim($p['nombre'] ?? ''));
        if (!$codigo) continue;

        $stmtMysql->bind_param('ss', $codigo, $nombre);
        $stmtMysql->execute();

        if ($stmtMysql->affected_rows === 1) {
            $resultado['insertados']++;
        } elseif ($stmtMysql->affected_rows === 2) {
            $resultado['actualizados']++;
        }
    }
    $conn->commit();

    $duracion = round(microtime(true) - $inicio, 2);
    $resultado['success'] = true;
    $resultado['mensaje'] = "Sync OK en {$duracion}s — "
        . "{$resultado['insertados']} insertados, "
        . "{$resultado['actualizados']} actualizados "
        . "de {$resultado['total_erp']} productos ERP.";

} catch (Exception $e) {
    if (isset($conn) && $conn->connect_errno === 0) {
        try { $conn->rollback(); } catch (Exception $re) {}
    }
    $resultado['mensaje'] = 'Error: ' . $e->getMessage();
    error_log('[sync_productos_erp] ' . $e->getMessage());
}

// ─── Respuesta ────────────────────────────────────────────────────────────────
if ($esCLI) {
    echo ($resultado['success'] ? "✓ " : "✗ ") . $resultado['mensaje'] . "\n";
    echo "  ERP → {$resultado['total_erp']} | Insertados: {$resultado['insertados']} | Actualizados: {$resultado['actualizados']}\n";
} else {
    echo json_encode($resultado, JSON_UNESCAPED_UNICODE);
}
