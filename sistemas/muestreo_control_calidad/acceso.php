<?php

error_reporting(E_ALL);
// No mostrar errores en la salida HTTP (evita HTML inesperado en responses JSON)
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_error.log');

// Iniciar sesión al comienzo
session_start();

$username = "campoand_sistemas2";
$password = "parracodex.";
$dbname = "campoand_campoandino";

// Forzar uso de la base de datos remota (producción)
$servername = "201.148.104.83";

// Si prefieres usar una base local, reemplaza la línea anterior por:
// $servername = 'localhost';

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    header('Content-Type: application/json');
    echo json_encode(["error" => true, "mensaje" => "Conexión fallida: " . $conn->connect_error]);
    exit;
}

// Obtener el parámetro
$campo = isset($_GET['Usu']) ? $_GET['Usu'] : '';
$campo2 = isset($_GET['Pass']) ? $_GET['Pass'] : '';

// Realizar una consulta a la base de datos con el parámetro
$sql = "SELECT idusuario,Nombres,tipousuario,usuario FROM usuarios where (Usuario = ? and Contrasena = ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $campo, $campo2);
$stmt->execute();
$result = $stmt->get_result();
$datos = array();
if ($result->num_rows > 0) {
    // Obtener los datos de cada fila
    while($row = $result->fetch_assoc()) {
        $datos[] = $row;
        // session_start() ya se llamó arriba
        $_SESSION['usuario'] = $row["usuario"];
        $_SESSION['usuarionombre'] = $row["Nombres"];
        $_SESSION['idusuario'] = $row["idusuario"];
        $_SESSION['tipousuario'] = $row["tipousuario"];
    }
    
    //if (isset($_SESSION[""]) && $_SESSION[""]

} else {
    //$datos= "0 resultados";
    $datos = array(
        "error" => true,
        "mensaje" => "0 resultados."
    );    
}

$stmt->close();
$conn->close();

// Devolver los datos como JSON
header('Content-Type: application/json');
echo json_encode($datos);
//echo $datos;
?>