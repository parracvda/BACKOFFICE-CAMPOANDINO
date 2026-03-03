
<?php
require_once "conexion.php";


error_log('INICIO acceso.php');



// Obtener el parámetro
$campo = isset($_GET['Usu']) ? $_GET['Usu'] : '';
$campo2 = isset($_GET['Pass']) ? $_GET['Pass'] : '';

$sql = "SELECT IdUsuario, Nombres, TipoUsuario, Usuario FROM usuarios WHERE Usuario = ? AND Contrasena = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $campo, $campo2);
$stmt->execute();
$result = $stmt->get_result();

$response = array();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
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
            $q->execute();
            $res = $q->get_result();
            while ($f = $res->fetch_assoc()) {
                $features[] = $f['feature_key'];
            }
            $q->close();
        }
    } catch (Exception $e) {
        // Si la tabla no existe o hay error, devolvemos features vacías
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

header('Content-Type: application/json');
echo json_encode($response);
exit;
?>