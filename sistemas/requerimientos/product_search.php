<?php
header('Content-Type: application/json; charset=utf-8');
include __DIR__ . '/../../shared/conexion.php';

$q = isset($_GET['q']) ? trim($_GET['q']) : '';
$limit = 20;

$out = [];
if ($q !== '') {
	// Split query into tokens (separadores por espacio), ignorar tokens vacíos
	$parts = preg_split('/\s+/', $q);
	$tokens = array_filter(array_map('trim', $parts), function($v){ return $v !== ''; });

	if (count($tokens) > 0) {
		// Construir condiciones LIKE para cada token (AND entre tokens) sobre la columna Producto
		$likes = array_fill(0, count($tokens), "Producto LIKE CONCAT('%', ?, '%')");
		$where = implode(' AND ', $likes);
		// Seleccionar por Codigo: Id=Código, Producto (alias Descripcion), sum(Cantidad) como Cantidad y concatenar Observacion
		// Agrupamos por Codigo y Producto de modo que el stock mostrado sea la sumatoria por código (pallets acumulados)
		$sql = "SELECT Codigo AS Id, Codigo, Producto AS Descripcion, SUM(Cantidad) AS Cantidad, COUNT(*) AS Pallets, GROUP_CONCAT(DISTINCT Observacion SEPARATOR ' | ') AS Observacion FROM stock_materiales WHERE (" . $where . ") AND UPPER(Ubicacion) NOT IN ('MP','PAMPA') GROUP BY Codigo, Producto LIMIT ?";

		$stmt = $conn->prepare($sql);
		if ($stmt) {
			// bind_param necesita referencias: tipos = n*s + i
			$types = str_repeat('s', count($tokens)) . 'i';
			$bindValues = array_values($tokens);
			$bindValues[] = $limit;

			// preparar array de referencias
			$params = [];
			$params[] = & $types;
			foreach ($bindValues as $k => $v) {
				$params[] = & $bindValues[$k];
			}

			call_user_func_array(array($stmt, 'bind_param'), $params);
			if ($stmt->execute()) {
				$res = $stmt->get_result();
				while ($r = $res->fetch_assoc()) {
					$out[] = $r;
				}
			}
			$stmt->close();
		}
	}
}

echo json_encode($out, JSON_UNESCAPED_UNICODE);
