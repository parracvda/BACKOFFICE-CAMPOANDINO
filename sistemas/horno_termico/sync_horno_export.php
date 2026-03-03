<?php
// ====================================================================
// SCRIPT EXPORT - HOSTING
// Devuelve JSON con datos de la vista uv_reporte_controlhorno2
// Se consulta desde el servidor físico vía GET
// ====================================================================

// ============================
// CONFIGURACIÓN DE SEGURIDAD
// ============================
$TOKEN_VALIDO = 'TOKEN_SUPER_SEGURO_LARGO';

// Verificar token
if (!isset($_GET['token']) || $_GET['token'] !== $TOKEN_VALIDO) {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Token inválido']);
    exit;
}

// ============================
// PARÁMETRO LAST_SYNC
// ============================
$lastSync = $_GET['last_sync'] ?? '2026-01-01 00:00:00';

// ============================
// CONEXIÓN MYSQL HOSTING
// ============================
$dbHost = 'localhost';
$dbName = 'campoand_campoandino';
$dbUser = 'campoand_sistemas2';
$dbPass = 'parracodex.';

try {
    $pdo = new PDO(
        "mysql:host=$dbHost;dbname=$dbName;charset=utf8",
        $dbUser,
        $dbPass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Error de conexión: ' . $e->getMessage()]);
    exit;
}

// ============================
// CONSULTA A LA VISTA
// ============================
$sql = "SELECT 
            `FECHA TRATAMIENTO` AS fecha_tratamiento,
            `ESTACION` AS estacion,
            `LOTE` AS lote,
            `CODIGO PALLET` AS codigo_pallet,
            `CODIGO` AS codigo,
            `PRODUCTO` AS producto,
            `CANTIDAD (UND)` AS cantidad_und,
            `CANTIDAD (M3)` AS cantidad_m3
        FROM uv_reporte_controlhorno2
        WHERE `FECHA TRATAMIENTO` > :last_sync
        ORDER BY `FECHA TRATAMIENTO` DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute(['last_sync' => $lastSync]);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// ============================
// DEVOLVER JSON
// ============================
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'success' => true,
    'count' => count($rows),
    'last_sync' => $lastSync,
    'rows' => $rows
], JSON_UNESCAPED_UNICODE);
