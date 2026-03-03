<?php
// Configuración universal de conexión
// Para forzar la conexión al servidor remoto desde un entorno local,
// crea un archivo vacío llamado `use_remote_db` en el mismo directorio o
// establece la variable de entorno USE_REMOTE_DB=1.
$forceRemote = false;
if (getenv('USE_REMOTE_DB') === '1' || file_exists(__DIR__ . '/use_remote_db')) {
	$forceRemote = true;
}

// Detectar entorno por defecto
if (!$forceRemote && in_array($_SERVER['SERVER_NAME'], ['localhost', '127.0.0.1'])) {
	// Entorno local (WAMP/XAMPP)
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "campoand_campoandino";
	$envUsed = 'local';
} else {
	// Entorno hosting/producción (o forzado)
	$servername = "201.148.104.83";
	$username = "campoand_sistemas2";
	$password = "parracodex.";
	$dbname = "campoand_campoandino";
	$envUsed = 'remote';
}

// Crear conexión (una sola vez)
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
	// Log y mensaje claro
	error_log("conexion.php: error de conexión a MySQL: " . $conn->connect_error);
	header('Content-Type: application/json');
	echo json_encode(["success" => false, "mensaje" => "Error de conexión: " . $conn->connect_error]);
	exit;
}
$conn->set_charset("utf8");

// Log útil para depuración: entorno utilizado y base seleccionada
error_log("conexion.php: envUsed=" . (isset($envUsed) ? $envUsed : 'unknown') . ", server={$servername}, user={$username}, db={$dbname}");
// Indicar la base actualmente seleccionada por la conexión
$resDb = $conn->query("SELECT DATABASE() AS db");
if ($resDb) {
	$rowDb = $resDb->fetch_assoc();
	error_log("conexion.php: conexion activa a base: " . ($rowDb['db'] ?? 'NULL'));
	$resDb->close();
}
// Verificar existencia de la tabla requerida (si existe)
$check = $conn->query("SHOW TABLES LIKE 'scm_requerimientosproduccion'");
if ($check) {
	error_log("conexion.php: existe tabla scm_requerimientosproduccion? " . ($check->num_rows > 0 ? 'SI' : 'NO'));
	$check->close();
} else {
	error_log("conexion.php: error verificando tabla scm_requerimientosproduccion: " . $conn->error);
}