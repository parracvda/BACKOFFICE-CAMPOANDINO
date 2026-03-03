<?php
// ====================================================================
// API: Obtener historial de turnos
// ====================================================================

header('Content-Type: application/json; charset=utf-8');
session_start();

require_once '../../../shared/conexion.php';
require_once '../../../shared/funciones_turnos.php';

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
        'mensaje' => 'No tiene permisos para ver el historial de turnos.'
    ]);
    exit;
}

$limite = isset($_GET['limite']) ? intval($_GET['limite']) : 30;

try {
    $conn = getConnection();
    
    // Obtener historial
    $turnos = obtenerHistorialTurnos($conn, $limite);
    
    echo json_encode([
        'success' => true,
        'turnos' => $turnos,
        'mensaje' => 'Historial obtenido exitosamente'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error al obtener historial: ' . $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>
