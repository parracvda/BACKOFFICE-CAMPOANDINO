
<?php
// Responder siempre JSON y proteger contra salidas HTML inesperadas
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
error_reporting(E_ALL);

// Flag para saber si ya se envió una respuesta (evitar que shutdown function pise)
$GLOBALS['_respuesta_enviada'] = false;

ob_start();
header('Content-Type: application/json; charset=utf-8');

// Capturar errores fatales y devolver JSON en caso de shutdown
register_shutdown_function(function() {
    // Si ya se envió una respuesta limpia (desde conexion.php u otro), no pisar
    if (!empty($GLOBALS['_respuesta_enviada'])) {
        return;
    }
    $err = error_get_last();
    if ($err !== NULL && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR])) {
        http_response_code(500);
        while (ob_get_level()) { ob_end_clean(); }
        $response = array("success" => false, "mensaje" => "Error interno del servidor", "error" => $err);
        echo json_encode($response);
    }
});

require_once __DIR__ . '/conexion.php';

// Si conexion.php ya envió respuesta (error) y terminó, no continuar
if (!empty($GLOBALS['_respuesta_enviada'])) {
    exit;
}

error_log('INICIO acceso.php');

// Obtener el parámetro
$campo = isset($_GET['Usu']) ? $_GET['Usu'] : '';
$campo2 = isset($_GET['Pass']) ? $_GET['Pass'] : '';

$sql = "SELECT IdUsuario, Nombres, TipoUsuario, Usuario FROM usuarios WHERE Usuario = ? AND Contrasena = ? LIMIT 1";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    error_log('acceso.php: prepare failed: ' . $conn->error);
    $GLOBALS['_respuesta_enviada'] = true;
    http_response_code(500);
    echo json_encode(["success" => false, "mensaje" => "Error interno del servidor", "error" => $conn->error]);
    exit;
}

$stmt->bind_param("ss", $campo, $campo2);
if (!$stmt->execute()) {
    error_log('acceso.php: execute failed: ' . $stmt->error);
    $GLOBALS['_respuesta_enviada'] = true;
    http_response_code(500);
    echo json_encode(["success" => false, "mensaje" => "Error interno del servidor", "error" => $stmt->error]);
    exit;
}

// Compatibilidad con entornos sin mysqlnd (sin get_result)
if (method_exists($stmt, 'get_result')) {
    $result = $stmt->get_result();
} else {
    $stmt->store_result();
    $result = null;
}

$response = array();

$row = null;
$hasRow = false;
if ($result !== null) {
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $hasRow = true;
    }
} else {
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($IdUsuario, $Nombres, $TipoUsuario, $Usuario);
        $stmt->fetch();
        $row = ["IdUsuario" => $IdUsuario, "Nombres" => $Nombres, "TipoUsuario" => $TipoUsuario, "Usuario" => $Usuario];
        $hasRow = true;
    }
}

if ($hasRow) {
    // $row ya está poblado
    session_start();
    // Normalizar claves de sesión usadas en el resto de la app
    $_SESSION['usuario'] = $row["Usuario"];
    $_SESSION['usuarionombre'] = $row["Nombres"];
    $_SESSION['IdUsuario'] = $row["IdUsuario"];
    $_SESSION['idusuario'] = $row["IdUsuario"];
    $_SESSION['TipoUsuario'] = $row["TipoUsuario"];
    $_SESSION['tipousuario'] = $row["TipoUsuario"];
    // Obtener features asignadas al usuario (si la tabla existe)
    $features = array();
    try {
        $q = $conn->prepare("SELECT feature_key FROM user_features WHERE idusuario = ?");
        if ($q) {
            $q->bind_param("i", $row["IdUsuario"]);
            if (!$q->execute()) {
                error_log('acceso.php: user_features execute failed: ' . $q->error);
            } else {
                if (method_exists($q, 'get_result')) {
                    $res = $q->get_result();
                    while ($f = $res->fetch_assoc()) {
                        $features[] = $f['feature_key'];
                    }
                } else {
                    $q->store_result();
                    $q->bind_result($feature_key);
                    while ($q->fetch()) {
                        $features[] = $feature_key;
                    }
                }
            }
            $q->close();
        }
    } catch (Exception $e) {
        error_log('Error leyendo user_features: ' . $e->getMessage());
        $features = array();
    }

    $response = array(
        "success" => true,
        "usuario" => $row["Usuario"],
        "nombre" => $row["Nombres"],
        "idusuario" => $row["IdUsuario"],
        "tipousuario" => $row["TipoUsuario"],
        "features" => $features
    );
} else {
    $response = array(
        "success" => false,
        "mensaje" => "Usuario o contraseña incorrectos."
    );
}

$stmt->close();
$conn->close();

// Marcar que vamos a enviar respuesta (para que shutdown function no intervenga)
$GLOBALS['_respuesta_enviada'] = true;
echo json_encode($response);
exit;
?>