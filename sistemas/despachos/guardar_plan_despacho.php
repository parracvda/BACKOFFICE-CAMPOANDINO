<?php
// guardar_plan_despacho.php - API para guardar plan de despacho
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once '../../shared/conexion.php';

// Verificar sesión
if (!isset($_SESSION['usuario']) && !isset($_SESSION['usuarionombre'])) {
  echo json_encode(['success' => false, 'mensaje' => 'Sesión no válida. Por favor inicie sesión.']);
  exit;
}

// Sólo aceptar POST con JSON
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(['success' => false, 'mensaje' => 'Método no permitido.']);
  exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
  echo json_encode(['success' => false, 'mensaje' => 'Datos JSON inválidos.']);
  exit;
}

// Extraer y validar datos
$tipoOrden = isset($data['tipoOrden']) ? trim($data['tipoOrden']) : 'con';
$ordenVenta = isset($data['ordenVenta']) ? substr(trim($data['ordenVenta']), 0, 45) : '';
$ordenCompra = isset($data['ordenCompra']) ? substr(trim($data['ordenCompra']), 0, 45) : '';
$cliente = isset($data['cliente']) ? substr(trim($data['cliente']), 0, 100) : '';
$condicionVenta = isset($data['condicionVenta']) ? substr(trim($data['condicionVenta']), 0, 45) : '';
$origen = isset($data['origen']) ? substr(trim($data['origen']), 0, 100) : '';
$destino = isset($data['destino']) ? substr(trim($data['destino']), 0, 100) : '';
$codigo = isset($data['codigo']) ? substr(trim($data['codigo']), 0, 45) : '';
$cantidad = isset($data['cantidad']) && is_numeric($data['cantidad']) ? (int)$data['cantidad'] : 0;
$fechaSugerida = isset($data['fechaSugerida']) ? trim($data['fechaSugerida']) : null;
$observaciones = isset($data['observaciones']) ? substr(trim($data['observaciones']), 0, 200) : '';

// Validaciones básicas
$errors = [];

if ($tipoOrden === 'con') {
  if (empty($ordenVenta)) {
    $errors[] = 'La Orden de Venta es requerida.';
  }
} else {
  if (empty($ordenCompra) && empty($cliente)) {
    $errors[] = 'Debe ingresar al menos Orden de Compra o Cliente.';
  }
}

// Validar fecha si se proporcionó
if ($fechaSugerida && !preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $fechaSugerida)) {
  $errors[] = 'Formato de fecha sugerida inválido.';
}

if (!empty($errors)) {
  echo json_encode(['success' => false, 'mensaje' => implode(' ', $errors)]);
  exit;
}

// GENERAR CORRELATIVO Y GUARDAR (TRANSACCIÓN ATÓMICA)
$conn->autocommit(false);
$conn->begin_transaction();

try {
  // 1. Obtener configuración de correlativo y bloquear la fila
  $stmt_get = $conn->prepare("SELECT last_number, prefijo, padding FROM scm_correlativos_despacho WHERE tipo = 'DESPACHO' FOR UPDATE");
  if (!$stmt_get) {
    throw new Exception('Error preparando consulta de correlativo: ' . $conn->error);
  }
  $stmt_get->execute();
  $stmt_get->bind_result($last_number, $prefijo, $padding);
  
  if (!$stmt_get->fetch()) {
    $stmt_get->close();
    throw new Exception('No existe configuración de correlativos para DESPACHO. Ejecuta el script SQL de setup.');
  }
  $stmt_get->close();
  
  // 2. Incrementar el correlativo
  $nuevo_numero = $last_number + 1;
  
  // 3. Actualizar el last_number en la tabla de correlativos
  $stmt_upd = $conn->prepare("UPDATE scm_correlativos_despacho SET last_number = ? WHERE tipo = 'DESPACHO'");
  if (!$stmt_upd) {
    throw new Exception('Error preparando actualización de correlativo: ' . $conn->error);
  }
  $stmt_upd->bind_param('i', $nuevo_numero);
  $stmt_upd->execute();
  $stmt_upd->close();
  
  // 4. Formatear el DocDespacho: PREFIJO-XXXX (ej: DSP-0001)
  $docDespacho = $prefijo . '-' . str_pad((string)$nuevo_numero, $padding, '0', STR_PAD_LEFT);
  
  // 5. Obtener usuario para auditoría
  $registro_usuario = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : (isset($_SESSION['usuarionombre']) ? $_SESSION['usuarionombre'] : 'sistema');
  
  // 6. Preparar query de inserción con DocDespacho y campos de auditoría
  $stmt = $conn->prepare("
    INSERT INTO scm_plan_despacho 
    (DocDespacho, OrdenVenta, OrdenCompra, Cliente, CondicionVenta, Origen, Destino, Codigo, Cantidad, FechaSugerida, Observaciones, registro_usuario) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ");
  
  if (!$stmt) {
    throw new Exception('Error al preparar consulta de inserción: ' . $conn->error);
  }
  
  $stmt->bind_param(
    'ssssssssisss',
    $docDespacho,
    $ordenVenta,
    $ordenCompra,
    $cliente,
    $condicionVenta,
    $origen,
    $destino,
    $codigo,
    $cantidad,
    $fechaSugerida,
    $observaciones,
    $registro_usuario
  );
  
  if (!$stmt->execute()) {
    throw new Exception('Error al ejecutar inserción: ' . $stmt->error);
  }
  
  $insertId = $stmt->insert_id;
  $stmt->close();
  
  // 7. Commit de la transacción
  $conn->commit();
  $conn->autocommit(true);
  
  // Log de auditoría
  error_log("Plan de despacho guardado - ID: $insertId - DocDespacho: $docDespacho - Usuario: $registro_usuario - Tipo: $tipoOrden");
  
  echo json_encode([
    'success' => true,
    'mensaje' => 'Plan de despacho guardado exitosamente. Doc: ' . $docDespacho,
    'id' => $insertId,
    'docDespacho' => $docDespacho
  ]);
  
} catch (Exception $e) {
  // Rollback en caso de error
  $conn->rollback();
  $conn->autocommit(true);
  
  error_log('Error en guardar_plan_despacho.php: ' . $e->getMessage());
  echo json_encode([
    'success' => false,
    'mensaje' => 'Error al guardar en la base de datos: ' . $e->getMessage()
  ]);
}

$conn->close();
?>
