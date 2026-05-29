<?php
// Script para agregar la columna longitud_unas a la tabla activos_maestro
// Conexión directa a la BD remota (hosting)
$servername = "201.148.105.9";
$username = "campoand_sistemas2";
$password = "parracodex.";
$dbname = "campoand_campoandino";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die('Error conexión: ' . $conn->connect_error);
}
echo 'Conectado a: ' . $conn->server_info . "\n<br>";

// Agregar columna longitud_unas después de altura_elevacion
$sql = "ALTER TABLE activos_maestro ADD COLUMN longitud_unas DECIMAL(5,2) DEFAULT NULL COMMENT 'Longitud de uñas en metros (montacargas, stocka)' AFTER altura_elevacion";
if ($conn->query($sql)) {
    echo "OK: Columna longitud_unas agregada correctamente.\n";
} else {
    echo "Error: " . $conn->error . "\n";
}
$conn->close();
