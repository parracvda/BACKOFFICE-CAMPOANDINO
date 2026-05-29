<?php
/**
 * Test de conexión - Verifica si puede conectarse a la base de datos
 */

$token = 'SECRETO';

if (!isset($_GET['token']) || $_GET['token'] !== $token) {
    http_response_code(403);
    exit('No autorizado');
}

ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h2>🔌 Test de Conexión a Base de Datos</h2>";
echo "<hr>";

/* =========================
   MÉTODO 1: Usar conexion.php
========================= */

echo "<h3>MÉTODO 1: Usando conexion.php (recomendado)</h3>";

try {
    require_once __DIR__ . '/../../shared/conexion.php';
    
    if (isset($conn) && !$conn->connect_error) {
        echo "<div style='background:#d4edda;border:1px solid #c3e6cb;padding:15px;border-radius:5px;'>";
        echo "<h4 style='color:#155724;margin-top:0;'>✅ Conexión exitosa</h4>";
        
        // Obtener información del servidor
        $result = $conn->query("SELECT VERSION() as version, DATABASE() as db, USER() as user");
        if ($result) {
            $row = $result->fetch_assoc();
            echo "<ul>";
            echo "<li>Versión MySQL: <strong>" . htmlspecialchars($row['version']) . "</strong></li>";
            echo "<li>Base de datos: <strong>" . htmlspecialchars($row['db']) . "</strong></li>";
            echo "<li>Usuario: <strong>" . htmlspecialchars($row['user']) . "</strong></li>";
            echo "</ul>";
        }
        
        // Verificar tabla stock_materiales
        $result = $conn->query("SELECT COUNT(*) as total FROM stock_materiales");
        if ($result) {
            $row = $result->fetch_assoc();
            echo "<p>📊 Registros en stock_materiales: <strong>" . number_format($row['total']) . "</strong></p>";
        }
        
        // Verificar código específico
        $result = $conn->query("SELECT COUNT(*) as total FROM stock_materiales WHERE Codigo = '303020060'");
        if ($result) {
            $row = $result->fetch_assoc();
            $total = $row['total'];
            if ($total > 0) {
                echo "<p>✅ Código 303020060: <strong style='color:green;'>$total registros encontrados</strong></p>";
            } else {
                echo "<p>❌ Código 303020060: <strong style='color:red;'>NO encontrado en DB</strong></p>";
            }
        }
        
        echo "</div>";
        
    } else {
        echo "<div style='background:#f8d7da;border:1px solid #f5c6cb;padding:15px;border-radius:5px;'>";
        echo "<h4 style='color:#721c24;margin-top:0;'>❌ Error de conexión</h4>";
        echo "<p>" . htmlspecialchars($conn->connect_error) . "</p>";
        echo "</div>";
    }
} catch (Exception $e) {
    echo "<div style='background:#f8d7da;border:1px solid #f5c6cb;padding:15px;border-radius:5px;'>";
    echo "<h4 style='color:#721c24;margin-top:0;'>❌ Excepción</h4>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
    echo "</div>";
}

echo "<hr>";

/* =========================
   MÉTODO 2: Conexión directa
========================= */

echo "<h3>MÉTODO 2: Conexión directa (fallback)</h3>";

$configuraciones = [
    'Producción (IP remota)' => [
        'host' => '201.148.104.83',
        'user' => 'campoand_sistemas2',
        'pass' => 'parracodex.',
        'db' => 'campoand_campoandino'
    ],
    'Localhost' => [
        'host' => 'localhost',
        'user' => 'campoand_sistemas2',
        'pass' => 'parracodex.',
        'db' => 'campoand_campoandino'
    ],
    '127.0.0.1' => [
        'host' => '127.0.0.1',
        'user' => 'campoand_sistemas2',
        'pass' => 'parracodex.',
        'db' => 'campoand_campoandino'
    ]
];

foreach ($configuraciones as $nombre => $config) {
    echo "<h4>Probando: $nombre</h4>";
    
    $testConn = @new mysqli($config['host'], $config['user'], $config['pass'], $config['db']);
    
    if ($testConn->connect_error) {
        echo "<p>❌ <strong>Error:</strong> " . htmlspecialchars($testConn->connect_error) . "</p>";
    } else {
        echo "<div style='background:#d4edda;border:1px solid #c3e6cb;padding:10px;border-radius:5px;margin:10px 0;'>";
        echo "<p style='margin:0;'>✅ <strong style='color:green;'>Conexión exitosa con $nombre</strong></p>";
        
        // Verificar si tiene stock_materiales
        $result = $testConn->query("SELECT COUNT(*) as total FROM stock_materiales");
        if ($result) {
            $row = $result->fetch_assoc();
            echo "<p style='margin:5px 0 0 0;'>📊 Registros: " . number_format($row['total']) . "</p>";
        }
        
        $testConn->close();
        echo "</div>";
    }
}

echo "<hr>";

/* =========================
   INFORMACIÓN DEL SERVIDOR
========================= */

echo "<h3>📍 Información del Servidor</h3>";
echo "<ul>";
echo "<li>SERVER_NAME: <strong>" . htmlspecialchars($_SERVER['SERVER_NAME'] ?? 'N/A') . "</strong></li>";
echo "<li>SERVER_ADDR: <strong>" . htmlspecialchars($_SERVER['SERVER_ADDR'] ?? 'N/A') . "</strong></li>";
echo "<li>REMOTE_ADDR: <strong>" . htmlspecialchars($_SERVER['REMOTE_ADDR'] ?? 'N/A') . "</strong></li>";
echo "<li>HTTP_HOST: <strong>" . htmlspecialchars($_SERVER['HTTP_HOST'] ?? 'N/A') . "</strong></li>";
echo "<li>DOCUMENT_ROOT: <strong>" . htmlspecialchars($_SERVER['DOCUMENT_ROOT'] ?? 'N/A') . "</strong></li>";
echo "</ul>";

echo "<hr>";
echo "<h3>✅ Recomendación</h3>";
echo "<p>Una vez que identifiques la configuración que funciona, los demás scripts la usarán automáticamente.</p>";
?>
