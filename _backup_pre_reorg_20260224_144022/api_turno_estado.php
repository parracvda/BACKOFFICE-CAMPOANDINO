<?php
// ====================================================================
// API: Obtener estado del turno actual
// ====================================================================

header('Content-Type: application/json; charset=utf-8');
session_start();

// Evitar que warnings/notices se impriman como HTML; convertirlos en excepciones
ini_set('display_errors', 0);
error_reporting(E_ALL);
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

// Incluir dependencias dentro de un bloque try para capturar errores de include/require
try {
    require_once 'conexion.php';
    require_once 'funciones_turnos.php';
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

try {
    // Usar la conexión provista por `conexion.php`
    if (!isset($conn)) {
        throw new Exception('Conexión a base de datos no inicializada');
    }
    
    // Obtener turno actual
    $turno = obtenerTurnoActual($conn);
    
    if (!$turno) {
        // No hay turno hoy
        echo json_encode([
            'success' => true,
            'turno' => null,
            'mensaje' => 'No hay turno creado para hoy',
            'puede_crear' => true
        ]);
        exit;
    }
    
    // Obtener estadísticas actualizadas
    $stats = obtenerEstadisticasTurno($conn, $turno['id']);
    
    // Verificar si el usuario es aprobador
    $es_aprobador = esUsuarioAprobador($usuario);
    
    echo json_encode([
        'success' => true,
        'turno' => [
            'id' => $turno['id'],
            'fecha' => $turno['fecha'],
            'estado' => $turno['estado'],
            'creado_por' => $turno['creado_por'],
            'creado_at' => $turno['creado_at'],
            'cerrado_por' => $turno['cerrado_por'],
            'cerrado_at' => $turno['cerrado_at'],
            'motivo_cierre' => $turno['motivo_cierre']
        ],
        'estadisticas' => $stats,
        'permisos' => [
            'puede_cerrar' => $es_aprobador && $turno['estado'] === 'abierto',
            'es_aprobador' => $es_aprobador
        ],
        'mensaje' => 'Turno obtenido exitosamente'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error al obtener turno: ' . $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>
