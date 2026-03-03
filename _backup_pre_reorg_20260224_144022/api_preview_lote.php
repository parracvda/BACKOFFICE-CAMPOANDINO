<?php
// api_preview_lote.php
// Devuelve el siguiente lote que se generaría para una especie (sin incrementar el contador)
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$especie = isset($_GET['especie']) ? trim($_GET['especie']) : '';
if ($especie === '') {
  echo json_encode(['success' => false, 'mensaje' => 'Especie requerida']);
  exit;
}

try {
  $stmt = $conn->prepare("SELECT last_number, prefijo, padding FROM scm_lotes_correlativos WHERE especie = ?");
  if (!$stmt) {
    throw new Exception('Error preparando consulta: ' . $conn->error);
  }
  
  $stmt->bind_param('s', $especie);
  $stmt->execute();
  $stmt->bind_result($last_number, $prefijo, $padding);
  
  if (!$stmt->fetch()) {
    $stmt->close();
    echo json_encode(['success' => false, 'mensaje' => 'Especie no configurada: ' . $especie]);
    exit;
  }
  $stmt->close();
  
  // Calcular el siguiente número (sin guardarlo)
  $siguiente_numero = $last_number + 1;
  $siguiente_lote = $prefijo . '-' . str_pad((string)$siguiente_numero, $padding, '0', STR_PAD_LEFT);
  
  echo json_encode([
    'success' => true,
    'lote' => $siguiente_lote,
    'numero' => $siguiente_numero,
    'prefijo' => $prefijo
  ]);
  
} catch (Exception $e) {
  echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
}
