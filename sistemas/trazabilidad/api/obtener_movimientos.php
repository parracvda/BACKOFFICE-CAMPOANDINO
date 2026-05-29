<?php
// api/obtener_movimientos.php - Devuelve la lista de movimientos activos
session_start();
require_once __DIR__ . '/../../../shared/conexion.php';

// Verificar sesión
$usuarioNombre = '';
if (isset($_SESSION['usuarionombre']) && strlen(trim($_SESSION['usuarionombre']))) {
  $usuarioNombre = $_SESSION['usuarionombre'];
} elseif (isset($_SESSION['usuario']) && strlen(trim($_SESSION['usuario']))) {
  $usuarioNombre = $_SESSION['usuario'];
}

if (trim($usuarioNombre) === '') {
  header('Content-Type: application/json');
  echo json_encode(['success' => false, 'mensaje' => 'Sesión no iniciada']);
  exit;
}

header('Content-Type: application/json');

try {
  $result = $conn->query("SELECT id, nombre FROM produccion_movimiento WHERE activo = 1 ORDER BY nombre ASC");
  
  $movimientos = [];
  if ($result) {
    while ($row = $result->fetch_assoc()) {
      $movimientos[] = [
        'id'     => $row['id'],
        'nombre' => $row['nombre'],
        'label'  => $row['nombre']
      ];
    }
  }
  
  echo json_encode(['success' => true, 'data' => $movimientos]);
} catch (Exception $e) {
  echo json_encode(['success' => false, 'mensaje' => $e->getMessage()]);
}
