<?php
// api/obtener_maquinas.php - Devuelve lista de máquinas desde nisira_maquinas
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
  echo json_encode(['success' => false, 'error' => 'Sesión no iniciada']);
  exit;
}

header('Content-Type: application/json');

try {
  $query = "SELECT Id AS id, Descripcion AS descripcion, CodMaquina AS codmaquina FROM nisira_maquinas ORDER BY Descripcion ASC";
  $result = $conn->query($query);

  if (!$result) {
    throw new Exception('Error en consulta: ' . $conn->error);
  }

  $maquinas = [];
  while ($row = $result->fetch_assoc()) {
    $maquinas[] = [
      'id' => $row['id'],
      'descripcion' => $row['descripcion'],
      'codmaquina' => $row['codmaquina'] ?? ''
    ];
  }

  echo json_encode(['success' => true, 'data' => $maquinas]);
} catch (Exception $e) {
  echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
