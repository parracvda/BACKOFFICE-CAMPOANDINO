<?php
// ====================================================================
// API: Cerrar turno actual
// ====================================================================

header('Content-Type: application/json; charset=utf-8');
session_start();

// Evitar que warnings/notices se impriman como HTML; convertirlos en excepciones
ini_set('display_errors', 0);
error_reporting(E_ALL);
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

// Incluir dependencias dentro de try/catch para devolver JSON en caso de error
try {
    require_once '../../../shared/conexion.php';
    require_once '../../../shared/funciones_turnos.php';
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error al inicializar API: ' . $e->getMessage()
    ]);
    exit;
}

// Verificar sesión
if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'mensaje' => 'No autorizado. Debe iniciar sesión.'
    ]);
    exit;
}

$usuario = $_SESSION['usuario'];

// Verificar que el usuario sea aprobador
if (!esUsuarioAprobador($usuario)) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'mensaje' => 'No tiene permisos para cerrar turnos. Solo usuarios aprobadores pueden realizar esta acción.'
    ]);
    exit;
}

// Obtener datos del request
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'mensaje' => 'Datos inválidos en la solicitud'
    ]);
    exit;
}

$motivo = $data['motivo'] ?? '';

try {
    if (!isset($conn)) throw new Exception('Conexión a base de datos no inicializada');

    // Cerrar turno
    $resultado = cerrarTurno($conn, $usuario, $motivo);
    
    if (!$resultado['success']) {
        http_response_code(400);
    }
    
    echo json_encode($resultado);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error al cerrar turno: ' . $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>
