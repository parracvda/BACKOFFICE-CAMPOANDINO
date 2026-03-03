<?php
/**
 * api_aprobar_v2.php
 * API para aprobar y asignar detalles
 */

header('Content-Type: application/json');

include 'conexion.php';
include 'funciones_v2.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['detalle_id']) || !isset($input['aprobado_por']) || !isset($input['asignado_a'])) {
    echo json_encode(['success' => false, 'error' => 'Parámetros incompletos']);
    exit;
}

$detalleId = intval($input['detalle_id']);
$aprobadoPor = $input['aprobado_por'];
$asignadoA = $input['asignado_a'];

$result = aprobarDetalle($conn, $detalleId, $aprobadoPor, $asignadoA);

echo json_encode($result);
