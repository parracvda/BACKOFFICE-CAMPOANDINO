<?php
// api_buscar_producto.php
// Retorna JSON con coincidencias parciales en la columna `Codigo` de `stock_materiales`
header('Content-Type: application/json; charset=utf-8');
require_once '../../../shared/conexion.php';

$q = isset($_GET['q']) ? trim($_GET['q']) : '';
if ($q === '') {
  echo json_encode(['success' => true, 'result' => []]);
  exit;
}

// Limitar longitud de búsqueda por seguridad
$q = mb_substr($q, 0, 200);

// Para búsqueda más eficiente, buscar al inicio del código o en cualquier parte de la descripción
$likeInicio = $q . "%";  // Para código: buscar solo al inicio
$likeCualquiera = "%" . $q . "%";  // Para producto: buscar en cualquier parte

try {
  // Buscar en stock_materiales por código (al inicio) o por producto (cualquier parte)
  // Agrupar por Codigo para obtener datos únicos (usar MAX para producto ya que puede variar)
      $sql = "SELECT Codigo, 
        MAX(Producto) as Descripcion,
        SUM(Cantidad) as Cantidad, 
        COUNT(DISTINCT Id) as Pallets,
        MAX(Observacion) as Observacion
        FROM stock_materiales 
        WHERE (Codigo LIKE ? OR Producto LIKE ?) AND UPPER(Ubicacion) NOT IN ('MP','PAMPA')
        GROUP BY Codigo
        LIMIT 50";
  
  if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param('ss', $likeInicio, $likeCualquiera);
    $stmt->execute();
    $res = $stmt->get_result();
    $out = [];
    
    while ($row = $res->fetch_assoc()) {
      // Buscar Subgrupo desde maestronisira usando el código
      $subgrupo = '';
      $sqlMaestro = "SELECT Subgrupo FROM maestronisira WHERE Codigo = ? LIMIT 1";
      if ($stmtMaestro = $conn->prepare($sqlMaestro)) {
        $stmtMaestro->bind_param('s', $row['Codigo']);
        $stmtMaestro->execute();
        $resMaestro = $stmtMaestro->get_result();
        if ($rowMaestro = $resMaestro->fetch_assoc()) {
          $subgrupo = isset($rowMaestro['Subgrupo']) ? $rowMaestro['Subgrupo'] : '';
        }
        $stmtMaestro->close();
      }
      
      // Si no se encontró por código, intentar buscar por descripción completa
      if (empty($subgrupo) && !empty($row['Descripcion'])) {
        $sqlMaestroDesc = "SELECT Subgrupo FROM maestronisira WHERE Descripcion LIKE ? LIMIT 1";
        if ($stmtMaestroDesc = $conn->prepare($sqlMaestroDesc)) {
          $descLike = '%' . $row['Descripcion'] . '%';
          $stmtMaestroDesc->bind_param('s', $descLike);
          $stmtMaestroDesc->execute();
          $resMaestroDesc = $stmtMaestroDesc->get_result();
          if ($rowMaestroDesc = $resMaestroDesc->fetch_assoc()) {
            $subgrupo = isset($rowMaestroDesc['Subgrupo']) ? $rowMaestroDesc['Subgrupo'] : '';
          }
          $stmtMaestroDesc->close();
        }
      }
      
      $out[] = [
        'Id' => $row['Codigo'], // Usar código como ID
        'Codigo' => $row['Codigo'],
        'Descripcion' => isset($row['Descripcion']) ? $row['Descripcion'] : '',
        'Subgrupo' => $subgrupo,
        'Cantidad' => isset($row['Cantidad']) ? $row['Cantidad'] : '0',
        'Pallets' => isset($row['Pallets']) ? $row['Pallets'] : '0',
        'Observacion' => isset($row['Observacion']) ? $row['Observacion'] : ''
      ];
    }
    $stmt->close();
    echo json_encode(['success' => true, 'result' => $out]);
    exit;
  } else {
    echo json_encode(['success' => false, 'mensaje' => 'Error preparando consulta: ' . $conn->error]);
    exit;
  }
} catch (Exception $e) {
  echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
  exit;
}
