<?php
// obtener_productos.php - Listar productos para combobox de registro manual
error_reporting(0);
ini_set('display_errors', 0);
session_start();
require_once __DIR__ . '/../../../shared/conexion.php';

header('Content-Type: application/json');

// Verificar sesión
if (!isset($_SESSION['usuarionombre']) && !isset($_SESSION['usuario'])) {
    echo json_encode(['success' => false, 'error' => 'Sesión no iniciada']);
    exit;
}

try {
    $busq = isset($_GET['q']) ? '%' . trim($_GET['q']) . '%' : '%';

    $stmt = $conn->prepare(
        "SELECT id, codigo, nombre
         FROM sig_cc_productos
         WHERE activo = 1
           AND (codigo LIKE ? OR nombre LIKE ?)
           AND LOWER(TRIM(grupo)) IN (
             'materia prima',
             'materiales auxiliares',
             'productos en proceso',
             'producto terminado cu',
             'producto terminado cc',
             'producto terminado cp',
             'producto terminado ca',
             'producto terminado cm',
             'producto terminado parihuelas'
           )
         ORDER BY nombre LIMIT 5000"
    );
    if (!$stmt) {
        echo json_encode(['success' => false, 'error' => 'Error en prepare: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param('ss', $busq, $busq);
    $stmt->execute();
    $res  = $stmt->get_result();
    $rows = [];
    while ($r = $res->fetch_assoc()) {
        $rows[] = [
            'id'     => $r['id'],
            'codigo' => $r['codigo'],
            'nombre' => $r['nombre'],
            'label'  => trim($r['codigo']) . ' - ' . trim($r['nombre']),
        ];
    }
    echo json_encode(['success' => true, 'data' => $rows]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Excepción: ' . $e->getMessage()]);
}
