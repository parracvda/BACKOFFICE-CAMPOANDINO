<?php
/**
 * Script de prueba de conexión al ERP SQL Server
 * Ejecutar con: php test_conexion_erp.php
 * 
 * ⚠️ La VPN debe estar activa antes de ejecutar este script
 */

echo "\n========================================\n";
echo "TEST DE CONEXIÓN AL ERP NISIRA\n";
echo date('Y-m-d H:i:s') . "\n";
echo "========================================\n\n";

// Configuración (ajustar según tu entorno)
$config = [
    'host' => '172.51.0.10\ORACLENIS',
    'port' => '50562',  // Puerto de la instancia ORACLENIS (obtenido vía SQL Browser)
    'database' => 'campoandino',
    'username' => 'jparra',
    'password' => 'ije161718',
];

echo "→ Configuración:\n";
echo "   Servidor: {$config['host']}\n";
echo "   Puerto: {$config['port']}\n";
echo "   Base de datos: {$config['database']}\n";
echo "   Usuario: {$config['username']}\n\n";

// Verificar extensiones disponibles
echo "→ Verificando extensiones PHP...\n";
$extensiones = get_loaded_extensions();
$sqlsrv_loaded = in_array('sqlsrv', $extensiones);
$pdo_sqlsrv_loaded = in_array('pdo_sqlsrv', $extensiones);

if ($sqlsrv_loaded) {
    echo "   ✓ sqlsrv: " . phpversion('sqlsrv') . "\n";
} else {
    echo "   ✗ sqlsrv: NO INSTALADA\n";
}

if ($pdo_sqlsrv_loaded) {
    echo "   ✓ pdo_sqlsrv: " . phpversion('pdo_sqlsrv') . "\n";
} else {
    echo "   ✗ pdo_sqlsrv: NO INSTALADA\n";
}

if (!$sqlsrv_loaded && !$pdo_sqlsrv_loaded) {
    echo "\n❌ ERROR: No hay extensiones de SQL Server instaladas\n";
    echo "Ejecuta primero: sudo bash install_sqlserver_drivers.sh\n\n";
    exit(1);
}

echo "\n";

// Probar conexión con PDO (si está disponible)
if ($pdo_sqlsrv_loaded) {
    echo "→ Probando conexión con PDO...\n";
    try {
        $dsn = "sqlsrv:Server={$config['host']},{$config['port']};Database={$config['database']}";
        $opciones = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];
        
        $inicio = microtime(true);
        $pdo = new PDO($dsn, $config['username'], $config['password'], $opciones);
        $tiempo = round((microtime(true) - $inicio) * 1000, 2);
        
        echo "   ✅ CONEXIÓN EXITOSA con PDO ({$tiempo}ms)\n";
        
        // Probar consulta simple
        $stmt = $pdo->query("SELECT @@VERSION AS version, DB_NAME() AS database_name");
        $result = $stmt->fetch();
        
        echo "   → Base de datos activa: {$result['database_name']}\n";
        echo "   → Versión SQL Server: " . substr($result['version'], 0, 50) . "...\n";
        
        // Probar consulta a tabla de órdenes (ajustar según tu ERP)
        try {
            $stmt = $pdo->query("SELECT TOP 5 * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE '%orden%' OR TABLE_NAME LIKE '%venta%'");
            $tablas = $stmt->fetchAll();
            
            if (count($tablas) > 0) {
                echo "\n   → Tablas encontradas relacionadas con órdenes/ventas:\n";
                foreach ($tablas as $tabla) {
                    echo "      • {$tabla['TABLE_SCHEMA']}.{$tabla['TABLE_NAME']} ({$tabla['TABLE_TYPE']})\n";
                }
                echo "\n   💡 Usa estas tablas para ajustar la consulta en sync_erp_ordenes_venta.php\n";
            } else {
                echo "\n   ⚠ No se encontraron tablas con 'orden' o 'venta' en el nombre\n";
                echo "   Verifica la estructura de tu base de datos\n";
            }
        } catch (Exception $e) {
            echo "\n   ⚠ No se pudo consultar tablas: " . $e->getMessage() . "\n";
        }
        
        $pdo = null;
        
    } catch (PDOException $e) {
        echo "   ❌ ERROR DE CONEXIÓN: " . $e->getMessage() . "\n";
        echo "\n   Posibles causas:\n";
        echo "   1. VPN no está activa (verifica con: sudo pritunl-client list)\n";
        echo "   2. Credenciales incorrectas\n";
        echo "   3. Servidor/puerto incorrecto\n";
        echo "   4. Firewall bloqueando puerto 1433\n\n";
        exit(1);
    }
}

// Probar conexión con sqlsrv (si PDO no funcionó)
if ($sqlsrv_loaded && !$pdo_sqlsrv_loaded) {
    echo "→ Probando conexión con sqlsrv nativo...\n";
    $serverName = $config['host'] . "," . $config['port'];
    $connectionInfo = [
        "Database" => $config['database'],
        "UID" => $config['username'],
        "PWD" => $config['password'],
        "CharacterSet" => "UTF-8"
    ];
    
    $inicio = microtime(true);
    $conn = sqlsrv_connect($serverName, $connectionInfo);
    
    if ($conn === false) {
        echo "   ❌ ERROR DE CONEXIÓN:\n";
        $errors = sqlsrv_errors();
        foreach ($errors as $error) {
            echo "   • [{$error['code']}] {$error['message']}\n";
        }
        echo "\n";
        exit(1);
    }
    
    $tiempo = round((microtime(true) - $inicio) * 1000, 2);
    echo "   ✅ CONEXIÓN EXITOSA con sqlsrv ({$tiempo}ms)\n";
    
    // Consulta de prueba
    $stmt = sqlsrv_query($conn, "SELECT @@VERSION AS version, DB_NAME() AS database_name");
    if ($stmt) {
        $result = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
        echo "   → Base de datos activa: {$result['database_name']}\n";
        echo "   → Versión SQL Server: " . substr($result['version'], 0, 50) . "...\n";
        sqlsrv_free_stmt($stmt);
    }
    
    sqlsrv_close($conn);
}

echo "\n========================================\n";
echo "✅ TEST FINALIZADO EXITOSAMENTE\n";
echo "========================================\n";
echo "\nPróximos pasos:\n";
echo "1. Editar sync_erp_ordenes_venta.php con las credenciales correctas\n";
echo "2. Ajustar la consulta SQL según las tablas mostradas arriba\n";
echo "3. Ejecutar: php sync_erp_ordenes_venta.php\n";
echo "4. Verificar datos en MySQL: SELECT * FROM erp_ordenes_venta;\n\n";
