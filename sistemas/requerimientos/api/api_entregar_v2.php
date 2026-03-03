<?php
/**
 * api_entregar_v2.php
 * API para registrar entregas parciales o completas
 */

header('Content-Type: application/json');

include '../../../shared/conexion.php';
include '../../../shared/funciones_v2.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['detalle_id']) || !isset($input['cantidad']) || !isset($input['entregado_por'])) {
    echo json_encode(['success' => false, 'error' => 'Parámetros incompletos']);
    exit;
}

$detalleId = intval($input['detalle_id']);
$cantidad = intval($input['cantidad']);
$entregadoPor = $input['entregado_por'];
$observaciones = $input['observaciones'] ?? '';

$result = registrarEntrega($conn, $detalleId, $cantidad, $entregadoPor, $observaciones);

echo json_encode($result);
