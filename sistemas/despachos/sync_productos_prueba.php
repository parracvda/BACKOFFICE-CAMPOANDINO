<?php
/**
 * Script de sincronización de PRUEBA - Maestro de Productos desde ERP Nisira
 * 
 * Este es un script temporal para probar la conexión al ERP
 * Una vez que funcione, ajustaremos para obtener órdenes de venta reales
 * 
 * EJECUTAR: php sync_productos_prueba.php
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

$inicio = microtime(true);
echo "\n========================================\n";
echo "PRUEBA - Sincronización Maestro Productos\n";
echo date('Y-m-d H:i:s') . "\n";
echo "========================================\n";

// Configuración ERP (credenciales ya configuradas)
$erp_config = [
    'host' => '172.51.0.10\ORACLENIS',
    'port' => '50562',  // Puerto de la instancia ORACLENIS (obtenido vía SQL Browser)
    'database' => 'campoandino',
    'username' => 'jparra',
    'password' => 'ije161718',
    'charset' => 'UTF-8'
];

// Conexión MySQL local
require_once __DIR__ . '/../../shared/conexion.php';

// ===========================
// CONECTAR A SQL SERVER
// ===========================
function conectarSQLServer($config) {
    try {
        if (extension_loaded('pdo_sqlsrv')) {
            $dsn = "sqlsrv:Server={$config['host']},{$config['port']};Database={$config['database']}";
            $opciones = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::SQLSRV_ATTR_ENCODING => PDO::SQLSRV_ENCODING_UTF8
            ];
            $pdo = new PDO($dsn, $config['username'], $config['password'], $opciones);
            echo "✓ Conexión a SQL Server exitosa (PDO)\n";
            return $pdo;
        } elseif (extension_loaded('sqlsrv')) {
            $serverName = $config['host'] . "," . $config['port'];
            $connectionInfo = [
                "Database" => $config['database'],
                "UID" => $config['username'],
                "PWD" => $config['password'],
                "CharacterSet" => "UTF-8"
            ];
            $conn = sqlsrv_connect($serverName, $connectionInfo);
            if ($conn === false) {
                throw new Exception("Error sqlsrv: " . print_r(sqlsrv_errors(), true));
            }
            echo "✓ Conexión a SQL Server exitosa (sqlsrv)\n";
            return $conn;
        } else {
            throw new Exception("No hay extensiones de SQL Server disponibles");
        }
    } catch (Exception $e) {
        echo "✗ Error al conectar a SQL Server: " . $e->getMessage() . "\n";
        return false;
    }
}

// ===========================
// CONSULTAR PRODUCTOS DEL ERP
// ===========================
function obtenerProductosERP($connERP) {
    // ⚠️⚠️⚠️ IMPORTANTE: ESTA ES UNA CONSULTA GENÉRICA ⚠️⚠️⚠️
    // Cuando ejecutes test_conexion_erp.php, verás los nombres reales de las tablas
    // Ajusta esta consulta según lo que veas en tu ERP
    
    // OPCIÓN 1: Si tu tabla se llama "Productos"
    $sql = "
        SELECT TOP 50
            Codigo AS codigo,
            Nombre AS nombre,
            Descripcion AS descripcion,
            Precio AS precio,
            Stock AS stock,
            Activo AS activo
        FROM Productos
        WHERE Activo = 1
        ORDER BY Codigo DESC
    ";
    
    // OPCIÓN 2: Si no sabes el nombre, buscar todas las tablas
    // Descomenta esto y comenta lo de arriba para ver tablas disponibles:
    /*
    $sql = "
        SELECT 
            TABLE_SCHEMA,
            TABLE_NAME,
            TABLE_TYPE
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_NAME LIKE '%product%'
           OR TABLE_NAME LIKE '%articulo%'
           OR TABLE_NAME LIKE '%item%'
        ORDER BY TABLE_NAME
    ";
    */
    
    try {
        if ($connERP instanceof PDO) {
            $stmt = $connERP->query($sql);
            return $stmt->fetchAll();
        } else {
            // sqlsrv nativo
            $stmt = sqlsrv_query($connERP, $sql);
            if ($stmt === false) {
                throw new Exception(print_r(sqlsrv_errors(), true));
            }
            $resultados = [];
            while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
                $resultados[] = $row;
            }
            sqlsrv_free_stmt($stmt);
            return $resultados;
        }
    } catch (Exception $e) {
        echo "✗ Error al consultar productos: " . $e->getMessage() . "\n";
        echo "\n💡 SUGERENCIA:\n";
        echo "   1. Ejecuta primero: php test_conexion_erp.php\n";
        echo "   2. Verás los nombres reales de las tablas del ERP\n";
        echo "   3. Ajusta la consulta SQL en este archivo (línea 64)\n\n";
        return [];
    }
}

// ===========================
// GUARDAR EN MYSQL COMO PRUEBA
// ===========================
function guardarProductosPrueba($productos, $connMySQL) {
    // Por ahora, solo los guardamos en la tabla temporal de órdenes
    // para ver que la sincronización funciona
    
    $insertados = 0;
    
    $stmt = $connMySQL->prepare("
        INSERT INTO erp_ordenes_venta (
            orden_venta, cliente, ruc_cliente, fecha_orden, condicion_venta,
            estado, origen, destino, moneda, total, observaciones, fecha_sincronizacion, activo
        ) VALUES (?, ?, ?, NOW(), ?, ?, '', '', 'PEN', ?, ?, NOW(), 1)
        ON DUPLICATE KEY UPDATE
            cliente = VALUES(cliente),
            observaciones = VALUES(observaciones),
            total = VALUES(total),
            fecha_sincronizacion = NOW()
    ");
    
    if (!$stmt) {
        echo "✗ Error al preparar statement: " . $connMySQL->error . "\n";
        return;
    }
    
    foreach ($productos as $prod) {
        try {
            // Mapear campos de producto a campos de orden (temporal)
            $codigo = isset($prod['codigo']) ? $prod['codigo'] : 'PROD-' . uniqid();
            $nombre = isset($prod['nombre']) ? $prod['nombre'] : 'Sin nombre';
            $descripcion = isset($prod['descripcion']) ? $prod['descripcion'] : '';
            $precio = isset($prod['precio']) ? floatval($prod['precio']) : 0.0;
            $stock = isset($prod['stock']) ? $prod['stock'] : 0;
            $activo = isset($prod['activo']) ? $prod['activo'] : 1;
            
            $ruc = '';  // Temporal
            $condicion = 'PRODUCTO';
            $estado = $activo ? 'ACTIVO' : 'INACTIVO';
            $obs = $descripcion . " | Stock: " . $stock;
            
            $stmt->bind_param(
                'sssssds',
                $codigo,      // orden_venta (temporal)
                $nombre,      // cliente (temporal)
                $ruc,         // ruc_cliente
                $condicion,   // condicion_venta
                $estado,      // estado
                $precio,      // total
                $obs          // observaciones
            );
            
            if ($stmt->execute()) {
                $insertados++;
            }
        } catch (Exception $e) {
            error_log("Error al guardar producto: " . $e->getMessage());
        }
    }
    
    $stmt->close();
    
    echo "\n--- Resultados ---\n";
    echo "✓ Productos sincronizados: $insertados\n";
    
    return $insertados;
}

// ===========================
// EJECUCIÓN
// ===========================
try {
    // 1. Conectar al ERP
    echo "\n→ Conectando al ERP Nisira...\n";
    $connERP = conectarSQLServer($erp_config);
    if (!$connERP) {
        throw new Exception("No se pudo conectar al ERP. Verifica:\n   1. VPN activa: sudo pritunl-client list\n   2. Ping al ERP: ping 172.51.0.10\n   3. Drivers instalados: php -m | grep sqlsrv");
    }
    
    // 2. Obtener productos
    echo "\n→ Consultando maestro de productos...\n";
    $productos = obtenerProductosERP($connERP);
    echo "✓ Obtenidos " . count($productos) . " productos\n";
    
    if (count($productos) == 0) {
        echo "\n⚠ No se obtuvieron productos.\n";
        echo "   Revisa la consulta SQL en la función obtenerProductosERP()\n";
        echo "   Ejecuta test_conexion_erp.php para ver las tablas disponibles\n\n";
    } else {
        // Mostrar algunos productos de ejemplo
        echo "\n→ Ejemplo de productos obtenidos:\n";
        for ($i = 0; $i < min(3, count($productos)); $i++) {
            echo "   " . ($i+1) . ". ";
            foreach ($productos[$i] as $key => $value) {
                if ($value !== null && $value !== '') {
                    echo "$key: $value | ";
                }
            }
            echo "\n";
        }
        
        // 3. Guardar en MySQL
        echo "\n→ Guardando en MySQL...\n";
        guardarProductosPrueba($productos, $conn);
    }
    
    // 4. Cerrar conexión ERP
    if ($connERP instanceof PDO) {
        $connERP = null;
    } else {
        sqlsrv_close($connERP);
    }
    
    // Tiempo total
    $tiempoTotal = round(microtime(true) - $inicio, 2);
    echo "\n✓ Proceso completado en {$tiempoTotal}s\n";
    echo "========================================\n\n";
    
    echo "📌 SIGUIENTE PASO:\n";
    echo "   Verifica los datos en MySQL:\n";
    echo "   mysql -u root -p -e \"SELECT * FROM campoand_campoandino.erp_ordenes_venta LIMIT 10;\"\n\n";
    
} catch (Exception $e) {
    echo "\n✗ ERROR: " . $e->getMessage() . "\n\n";
    exit(1);
}

$conn->close();
exit(0);
