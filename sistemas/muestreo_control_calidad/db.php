<?php
// Utilizar conexión centralizada del backoffice
require_once __DIR__ . '/../../shared/conexion.php';

// Convertir mysqli a PDO para compatibilidad con código existente
try {
    if (isset($conn) && $conn instanceof mysqli) {
        // Obtener datos de conexión del objeto mysqli existente
        $host = $conn->host_info;
        // Extraer solo el host sin información adicional
        preg_match('/via TCP\/IP/', $host) ? $host = $servername : null;
        $host = $servername;
        $dbname = $conn->query("SELECT DATABASE() as db")->fetch_assoc()['db'];
        
        // Crear PDO usando las mismas credenciales
        $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
} catch (PDOException $e) {
    error_log('Error db.php PDO conversion: ' . $e->getMessage());
    echo 'Error: ' . $e->getMessage();
}
?>
