<?php
// Script para agregar columna kilometraje_actual a activos_maestro en BD remota
$host = '201.148.105.9';
$db   = 'campoand_campoandino';
$user = 'campoand_sistemas2';
$pass = 'parracodex.';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
echo "Conectado a: " . $conn->server_info . "\n";

$sql = "ALTER TABLE `activos_maestro`
        ADD COLUMN `kilometraje_actual` INT DEFAULT 0 COMMENT 'Kilometraje actual del vehículo'
        AFTER `placa`";

if ($conn->query($sql)) {
    echo "Columna kilometraje_actual agregada correctamente.\n";
} else {
    echo "Error: " . $conn->error . "\n";
}

$conn->close();
