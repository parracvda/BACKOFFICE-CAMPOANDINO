<?php
// Configuración universal de conexión
// Para forzar la conexión al servidor remoto desde un entorno local,
// crea un archivo vacío llamado `use_remote_db` en el mismo directorio.
// NOTA: El archivo use_remote_db SOLO se considera si estamos en un
// entorno local (localhost/127.0.0.1). Si está presente en el hosting
// (porque se subió toda la carpeta), se ignora automáticamente.
$esLocal = in_array($_SERVER['SERVER_NAME'] ?? '', ['localhost', '127.0.0.1']);
$useRemoteFile = file_exists(__DIR__ . '/use_remote_db');

// Forzar DB remota SOLO si estamos en local Y el archivo use_remote_db existe
if ($esLocal && (getenv('USE_REMOTE_DB') === '1' || $useRemoteFile)) {
	// --- MODO LOCAL CON BD REMOTA FORZADA ---
	// Usa el archivo 'use_remote_db' en local para conectar a la IP del hosting
	$servername = "201.148.105.9"; // IP del servidor remoto (hosting)
	$username = "campoand_sistemas2";
	$password = "parracodex.";
	$dbname = "campoand_campoandino";
} else if ($esLocal) {
	// --- MODO LOCAL (WAMP/XAMPP) SIN BD REMOTA ---
	// En local sin use_remote_db: conexión local con root
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "campoand_campoandino";
} else {
	// --- MODO HOSTING/PRODUCCIÓN ---
	// En el hosting la BD está en localhost del mismo servidor
	// El archivo use_remote_db se ignora aunque exista
	$servername = "localhost";
	$username = "campoand_sistemas2";
	$password = "parracodex.";
	$dbname = "campoand_campoandino";
}

// Crear conexión (una sola vez)
$databases = [];
try {
	$conn = @new mysqli($servername, $username, $password, $dbname);
} catch (mysqli_sql_exception $e) {
	$errNo = $e->getCode();
	$errMsg = $e->getMessage();
	error_log("conexion.php: mysqli exception (errno {$errNo}): {$errMsg}");

	if ($errNo === 1049 || stripos($errMsg, 'Unknown database') !== false) {
		try {
			$connNoDb = new mysqli($servername, $username, $password);
			$res = $connNoDb->query('SHOW DATABASES');
			if ($res) {
				while ($row = $res->fetch_row()) { $databases[] = $row[0]; }
				$res->free();
			}
			$connNoDb->close();
		} catch (Exception $inner) {
			// Ignorar; devolveremos mensaje genérico abajo
		}

		$GLOBALS['_respuesta_enviada'] = true;
		header('Content-Type: application/json');
		echo json_encode([
			"success" => false,
			"mensaje" => "Base de datos '{$dbname}' no encontrada en el servidor MySQL.",
			"available_databases" => $databases
		]);
		exit;
	}

	$GLOBALS['_respuesta_enviada'] = true;
	header('Content-Type: application/json');
	echo json_encode(["success" => false, "mensaje" => "Error de conexión: " . $errMsg]);
	exit;
}

if ($conn->connect_error) {
	$errMsg = $conn->connect_error;
	$errNo  = $conn->connect_errno;
	error_log("conexion.php: error de conexión a MySQL (errno {$errNo}): {$errMsg}");

	if ($errNo === 1049 || stripos($errMsg, 'Unknown database') !== false) {
		try {
			$connNoDb = new mysqli($servername, $username, $password);
			$res = $connNoDb->query('SHOW DATABASES');
			if ($res) {
				while ($row = $res->fetch_row()) { $databases[] = $row[0]; }
				$res->free();
			}
			$connNoDb->close();
		} catch (Exception $inner) {}

		$GLOBALS['_respuesta_enviada'] = true;
		header('Content-Type: application/json');
		echo json_encode([
			"success" => false,
			"mensaje" => "Base de datos '{$dbname}' no encontrada en el servidor MySQL.",
			"available_databases" => $databases
		]);
		exit;
	}

	$GLOBALS['_respuesta_enviada'] = true;
	header('Content-Type: application/json');
	echo json_encode(["success" => false, "mensaje" => "Error de conexión: " . $errMsg]);
	exit;
}

$conn->set_charset("utf8");
