<?php
// api/guardar_trazabilidad.php - Guarda un registro escaneado en produccion_trazabilidad
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

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(['success' => false, 'mensaje' => 'Método no permitido']);
  exit;
}

// Leer JSON del body
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
  echo json_encode(['success' => false, 'mensaje' => 'Datos inválidos']);
  exit;
}

// Validar campos requeridos
$required = ['nuevo_lote', 'fecha', 'maquina_descripcion', 'codigo_producto', 'descripcion', 'lote', 'cantidad', 'concatenado'];
foreach ($required as $campo) {
  if (!isset($input[$campo]) || trim($input[$campo]) === '') {
    echo json_encode(['success' => false, 'mensaje' => "Campo requerido faltante: $campo"]);
    exit;
  }
}

try {
  $stmt = $conn->prepare("
    INSERT INTO produccion_trazabilidad
      (nuevo_lote, fecha, maquina_descripcion, codigo_producto, descripcion, lote, maquina_origen, cantidad, movimiento, observacion, concatenado, usuario_registro, fecha_registro)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  ");

  if (!$stmt) {
    throw new Exception('Error al preparar consulta: ' . $conn->error);
  }

  $nuevo_lote = $input['nuevo_lote'];
  $fecha = $input['fecha'];
  $maquina_descripcion = $input['maquina_descripcion'];
  $codigo_producto = $input['codigo_producto'];
  $descripcion = $input['descripcion'];
  $lote = $input['lote'];
  $maquina_origen = $input['maquina_origen'];
  $cantidad = $input['cantidad'];
  $movimiento = $input['movimiento'];
  $observacion = isset($input['observacion']) ? $input['observacion'] : '';
  $concatenado = $input['concatenado'];
  $usuario = $usuarioNombre;

  $stmt->bind_param(
    'ssssssssssss',
    $nuevo_lote,
    $fecha,
    $maquina_descripcion,
    $codigo_producto,
    $descripcion,
    $lote,
    $maquina_origen,
    $cantidad,
    $movimiento,
    $observacion,
    $concatenado,
    $usuario
  );

  if ($stmt->execute()) {
    echo json_encode(['success' => true, 'mensaje' => 'Guardado correctamente', 'id' => $stmt->insert_id]);
  } else {
    throw new Exception('Error al insertar: ' . $stmt->error);
  }

  $stmt->close();
} catch (Exception $e) {
  echo json_encode(['success' => false, 'mensaje' => $e->getMessage()]);
}
