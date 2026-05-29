<?php
// Reescritura completa: archivo limpio
include '../../shared/conexion.php';
// Asegurar que la sesión esté iniciada para obtener nombre de usuario
if (session_status() === PHP_SESSION_NONE) session_start();

// Determinar nombre del usuario logueado para mostrar en la cabecera (campo `Nombres` de la tabla `usuarios`)
$nombreUsuario = null;
$usuarioArea = null;
// Priorizar valor almacenado en sesión si existe
if (!empty($_SESSION['usuarionombre'])) {
	$nombreUsuario = $_SESSION['usuarionombre'];
}
// Intentar obtener Nombres y Area desde la tabla usuarios según lo disponible en sesión
if (!empty($_SESSION['IdUsuario'])) {
	$idU = intval($_SESSION['IdUsuario']);
	$r = $conn->query("SELECT Nombres, Area FROM usuarios WHERE IdUsuario = " . $idU . " LIMIT 1");
	if ($r && $row = $r->fetch_assoc()) {
		// Si no teníamos el nombre desde sesión, usar el de la tabla
		if (empty($nombreUsuario) && !empty($row['Nombres'])) $nombreUsuario = $row['Nombres'];
		if (!empty($row['Area'])) $usuarioArea = $row['Area'];
	}
} else if (!empty($_SESSION['usuario'])) {
	$u = $conn->real_escape_string($_SESSION['usuario']);
	$r = $conn->query("SELECT Nombres, Area FROM usuarios WHERE Usuario = '" . $u . "' LIMIT 1");
	if ($r && $row = $r->fetch_assoc()) {
		if (empty($nombreUsuario) && !empty($row['Nombres'])) $nombreUsuario = $row['Nombres'];
		if (!empty($row['Area'])) $usuarioArea = $row['Area'];
	}
}
// Si solo tenemos usuarionombre en sesión y no conseguimos Area, mantener nombre y dejar Area vacía

// Verificar existencia de la tabla requerida para evitar errores fatales
$checkTable = $conn->query("SHOW TABLES LIKE 'scm_requerimientosproduccion'");
if (!$checkTable || $checkTable->num_rows === 0) {
	// Mostrar mensaje amigable con instrucción y SQL sugerido
	$suggestedDDL = "CREATE TABLE IF NOT EXISTS scm_requerimientosproduccion (\n"
			. "  Id INT AUTO_INCREMENT PRIMARY KEY,\n"
			. "  NRequerimiento INT NOT NULL,\n"
			. "  Fecha DATE NOT NULL,\n"
			. "  Maquina VARCHAR(255) DEFAULT NULL,\n"
			. "  Zona VARCHAR(255) DEFAULT NULL,\n"
			. "  Motivo VARCHAR(100) DEFAULT NULL,\n"
			. "  Prioridad VARCHAR(10) DEFAULT 'Media',\n"
			. "  EstadoAprobacion VARCHAR(20) DEFAULT 'Pendiente',\n"
			. "  AprobadoPor VARCHAR(255) DEFAULT NULL,\n"
			. "  AprobadoAt DATETIME DEFAULT NULL,\n"
			. "  Producto VARCHAR(255) DEFAULT NULL,\n"
			. "  Codigo VARCHAR(100) DEFAULT NULL,\n"
			. "  NPallets INT DEFAULT 0,\n"
			. "  Observaciones TEXT,\n"
			. "  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n"
			. ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
	// (Nota: la tabla no existe si llegamos aquí — mostramos el DDL sugerido arriba)

	echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Tabla faltante</title></head><body style="font-family:Arial,sans-serif; padding:20px;">';
	echo '<div style="background:#fff3cd;border:1px solid #ffeeba;padding:16px;border-radius:6px;">';
	echo '<h3 style="margin-top:0;color:#856404;">Tabla faltante: <code>scm_requerimientosproduccion</code></h3>';
	echo '<p>La tabla <strong>scm_requerimientosproduccion</strong> no existe en la base de datos a la que está conectado este script. Puedes crearla pegando el siguiente SQL en phpMyAdmin o ejecutándolo en tu servidor MySQL:</p>';
	echo '<pre style="background:#f8f9fa;border:1px solid #e9ecef;padding:12px;border-radius:4px;">' . htmlspecialchars($suggestedDDL) . '</pre>';
	echo '<p>Si la tabla existe en otra base de datos, ajusta la variable <code>$dbname</code> en <code>conexion.php</code> para apuntar a la base correcta o exporta/importe la tabla a esta base.</p>';
	echo '</div></body></html>';
	exit;
}

// Variables de estado
$error_guardado = null;
$guardado_ok = false;

// Procesar POST (guardar) antes de cualquier salida
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	// Soporte para acciones especiales (delete)
	if (isset($_POST['action']) && $_POST['action'] === 'delete' && isset($_POST['delete_id'])) {
		$delId = intval($_POST['delete_id']);
		if ($delId > 0) {
			$stmtDel = $conn->prepare("DELETE FROM scm_requerimientosproduccion WHERE Id = ? LIMIT 1");
			if ($stmtDel) {
				$stmtDel->bind_param('i', $delId);
					$stmtDel->execute();
					$stmtDel->close();
					header('Location: ' . $_SERVER['PHP_SELF'] . (isset($_GET['rq']) ? '?rq=' . intval($_GET['rq']) : ''));
					exit;
				}
				}
			}
	$nrequerimiento = $_POST['num_requerimiento'] ?? '';
	$nrequerimiento_db = intval(ltrim($nrequerimiento, '0'));
	$fecha = $_POST['fecha'] ?? '';
	$idMaquina = $_POST['maquina'] ?? '';
	$motivo_sel = $_POST['motivo'] ?? '';
	$sucursal_sel = $_POST['sucursal'] ?? '';
	$almacen_sel = $_POST['almacen'] ?? '';
	// Prioridad: Alta, Normal (default Normal)
	$prioridad_sel = $_POST['prioridad'] ?? 'Normal';
	// Limpiar espacios en producto y codigo recibidos
	$producto = isset($_POST['producto']) ? trim($_POST['producto']) : '';
	$codigo = isset($_POST['codigo']) ? trim($_POST['codigo']) : '';
	$npallets = intval($_POST['num_pallets'] ?? 0);
	// Observaciones: forzar mayúsculas en servidor y limpiar
	$observaciones = isset($_POST['observaciones']) ? strtoupper(trim($_POST['observaciones'])) : '';

	// Resolver texto de motivo/sucursal/almacen cuando vienen como Ids
	$motivo = '';
	if (ctype_digit(strval($motivo_sel)) && intval($motivo_sel) > 0) {
		$mid = intval($motivo_sel);
		$stmtM = $conn->prepare('SELECT Motivo FROM scm_motivo WHERE Id = ? LIMIT 1');
		if ($stmtM) {
			$stmtM->bind_param('i', $mid);
			$stmtM->execute();
			$resM = $stmtM->get_result();
			if ($resM && $rowM = $resM->fetch_assoc()) $motivo = $rowM['Motivo'];
			$stmtM->close();
		}
	} else {
		$motivo = trim($motivo_sel);
	}

	$sucursal = '';
	if (ctype_digit(strval($sucursal_sel)) && intval($sucursal_sel) > 0) {
		$sid = intval($sucursal_sel);
		$stmtS = $conn->prepare('SELECT Sucursal FROM scm_sucursal WHERE Id = ? LIMIT 1');
		if ($stmtS) {
			$stmtS->bind_param('i', $sid);
			$stmtS->execute();
			$resS = $stmtS->get_result();
			if ($resS && $rowS = $resS->fetch_assoc()) $sucursal = $rowS['Sucursal'];
			$stmtS->close();
		}
	} else {
		$sucursal = trim($sucursal_sel);
	}

	$almacen = '';
	if (ctype_digit(strval($almacen_sel)) && intval($almacen_sel) > 0) {
		$aid = intval($almacen_sel);
		$stmtA = $conn->prepare('SELECT Almacen FROM scm_almacen WHERE Id = ? LIMIT 1');
		if ($stmtA) {
			$stmtA->bind_param('i', $aid);
			$stmtA->execute();
			$resA = $stmtA->get_result();
			if ($resA && $rowA = $resA->fetch_assoc()) $almacen = $rowA['Almacen'];
			$stmtA->close();
		}
	} else {
		$almacen = trim($almacen_sel);
	}

	// Normalizar prioridad y validar valor esperado
	$prioridad = strtoupper(trim($prioridad_sel));
	if ($prioridad === 'ALTA') {
	    $prioridad = 'Alta';
	} else {
	    $prioridad = 'Normal';
	}

	// Obtener nombre de máquina y zona
	$nombreMaquina = '';
	$zona = '';
	if (!empty($idMaquina)) {
		$sqlMaq = "SELECT MaquinaArea, IdAreaMaquina FROM produccion_maquinashorasparadas WHERE IdMaquinaArea = '" . $conn->real_escape_string($idMaquina) . "' LIMIT 1";
		$resMaq = $conn->query($sqlMaq);
		if ($resMaq && $rowMaq = $resMaq->fetch_assoc()) {
			$nombreMaquina = $rowMaq['MaquinaArea'];
			$idArea = $rowMaq['IdAreaMaquina'];
			if (!empty($idArea)) {
				$sqlArea = "SELECT AreaMaquina FROM scm_areasmaquinas WHERE IdAreaMaquina = '" . $conn->real_escape_string($idArea) . "' LIMIT 1";
				$resArea = $conn->query($sqlArea);
				if ($resArea && $rowArea = $resArea->fetch_assoc()) {
					$zona = $rowArea['AreaMaquina'];
				}
			}
		}
	}

	// Insertar en la tabla
	// Validación servidor: campos obligatorios (fecha, maquina, producto/codigo, NPallets>0). Observaciones opcional.
	$serverErrors = [];
	if (empty($fecha)) $serverErrors[] = 'Fecha es obligatoria.';
	if (empty($idMaquina)) $serverErrors[] = 'Máquina es obligatoria.';
	if (empty($producto) && empty($codigo)) $serverErrors[] = 'Producto o Código es obligatorio.';
	if (empty($npallets) || intval($npallets) <= 0) $serverErrors[] = 'N° Pallets debe ser mayor que 0.';
	// Si hay errores y es AJAX, devolver JSON
	$isAjaxReq = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest');
	if (!empty($serverErrors)) {
		if ($isAjaxReq) {
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode(array('success'=>false, 'error'=> implode(' ', $serverErrors)));
			exit;
		} else {
			$error_guardado = implode(' ', $serverErrors);
		}
	}

	// Construir INSERT dinámico según columnas disponibles (añadir created_by y created_at si existen)
	$hasCreatedBy = false; $hasCreatedAt = false;
	try {
		$rc = $conn->query("SHOW COLUMNS FROM scm_requerimientosproduccion LIKE 'created_by'");
		if ($rc && $rc->num_rows > 0) $hasCreatedBy = true;
		$rc2 = $conn->query("SHOW COLUMNS FROM scm_requerimientosproduccion LIKE 'created_at'");
		if ($rc2 && $rc2->num_rows > 0) $hasCreatedAt = true;
	} catch (Exception $e) { }
	// Incluir Sucursal y Almacen (texto) antes de Motivo para guardar en la tabla
	// Añadir Responsable (nombre del usuario logueado) y Area (campo Area de la tabla usuarios)
	$responsable = !empty($nombreUsuario) ? $nombreUsuario : '';
	$area_responsable = !empty($usuarioArea) ? $usuarioArea : '';
	$cols = ['NRequerimiento','Fecha','Maquina','Zona','Sucursal','Almacen','Motivo','Prioridad','Producto','Codigo','NPallets','Observaciones','Responsable','Area'];
	$values = [$nrequerimiento_db, $fecha, $nombreMaquina, $zona, $sucursal, $almacen, $motivo, $prioridad, $producto, $codigo, $npallets, $observaciones, $responsable, $area_responsable];
	$types = 'i'; // NRequerimiento
	$types .= 's'; // Fecha
	$types .= 's'; // Maquina
	$types .= 's'; // Zona
	$types .= 's'; // Sucursal
	$types .= 's'; // Almacen
	$types .= 's'; // Motivo
	$types .= 's'; // Prioridad
	$types .= 's'; // Producto
	$types .= 's'; // Codigo
	$types .= 'i'; // NPallets
	$types .= 's'; // Observaciones
	$types .= 's'; // Responsable
	$types .= 's'; // Area
	if ($hasCreatedBy) { $cols[] = 'created_by'; $values[] = (isset($_SESSION['usuarionombre']) ? $_SESSION['usuarionombre'] : null); $types .= 's'; }
	if ($hasCreatedAt) { $cols[] = 'created_at'; $values[] = date('Y-m-d H:i:s'); $types .= 's'; }
	$placeholders = array_fill(0, count($cols), '?');
	$sqlInsert = "INSERT INTO scm_requerimientosproduccion (" . implode(',', $cols) . ") VALUES (" . implode(',', $placeholders) . ")";
	$stmt = $conn->prepare($sqlInsert);
	if ($stmt) {
		// bind_param requires references
		$bindParams = array_merge([$types], $values);
		$tmp = [];
		foreach ($bindParams as $key => $value) $tmp[$key] = &$bindParams[$key];
		call_user_func_array(array($stmt, 'bind_param'), $tmp);

		// Log temporal de parámetros para depuración (truncar observaciones para no llenar logs)
		try {
				$logParams = json_encode(array(
					'NRequerimiento' => $nrequerimiento_db,
					'Fecha' => $fecha,
					'Maquina' => $nombreMaquina,
					'Zona' => $zona,
					'Sucursal' => $sucursal,
					'Almacen' => $almacen,
					'Motivo' => $motivo,
					'Prioridad' => $prioridad,
					'Producto' => $producto,
					'Codigo' => $codigo,
					'NPallets' => $npallets,
					'Observaciones' => substr($observaciones,0,200),
					'Responsable' => $responsable,
					'Area' => $area_responsable
				));
			error_log('requerimientos.php: INSERT params: ' . $logParams);
		} catch (Exception $e) {
			error_log('requerimientos.php: error serializando params: ' . $e->getMessage());
		}
		if ($stmt->execute()) {
			$insertedId = $stmt->insert_id;
			// Si es petición AJAX (fetch/X-Requested-With), devolver JSON con los datos insertados
			$isAjax = false;
			if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') $isAjax = true;
			if ($isAjax) {
				header('Content-Type: application/json; charset=utf-8');
					$response = array(
						'success' => true,
						'id' => $insertedId,
						'NRequerimiento' => $nrequerimiento_db,
						'Fecha' => $fecha,
						'Maquina' => $nombreMaquina,
						'Zona' => $zona,
						'Sucursal' => $sucursal,
						'Almacen' => $almacen,
						'Motivo' => $motivo,
						'Prioridad' => $prioridad,
						'Producto' => $producto,
						'Codigo' => $codigo,
						'NPallets' => $npallets,
						'Observaciones' => $observaciones,
						'Responsable' => $responsable,
						'Area' => $area_responsable
					);
					if (!empty($hasCreatedBy)) $response['created_by'] = isset($_SESSION['usuarionombre']) ? $_SESSION['usuarionombre'] : null;
					if (!empty($hasCreatedAt)) $response['created_at'] = date('Y-m-d H:i:s');
					echo json_encode($response);
					exit;
			} else {
				// redirigir manteniendo el rq actual para permitir múltiples registros bajo el mismo RQ
				header('Location: requerimientos.php?guardado=1&rq=' . $nrequerimiento_db);
				exit;
			}
		} else {
			// Registrar en error_log y devolver JSON de error si es AJAX
			$error_guardado = 'Error al guardar: ' . $stmt->error;
			error_log('requerimientos.php: Error al ejecutar INSERT: ' . $stmt->error . ' SQL: ' . $sqlInsert);
			$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest');
			if ($isAjax) {
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode(array('success' => false, 'error' => $stmt->error));
				exit;
			}
		}
		$stmt->close();
	} else {
		$error_guardado = 'Error en la preparación: ' . $conn->error;
		error_log('requerimientos.php: Error en prepare(): ' . $conn->error . ' SQL: ' . $sqlInsert);
		$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest');
		if ($isAjax) {
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode(array('success' => false, 'error' => $conn->error));
			exit;
		}
	}
}

if (isset($_GET['guardado']) && $_GET['guardado'] == '1') $guardado_ok = true;

$correlativo = 1;
// Primero calcular el siguiente correlativo por defecto
$sqlCorrelativo = "SELECT MAX(NRequerimiento) AS max_req FROM scm_requerimientosproduccion";
$resCorr = $conn->query($sqlCorrelativo);
if ($resCorr && $rowC = $resCorr->fetch_assoc()) {
	if (!empty($rowC['max_req'])) $correlativo = intval($rowC['max_req']) + 1;
}
// Si existe cookie con RQ y no se proporcionó ?rq, usar la cookie para mantener el RQ al recargar
// Si existe cookie con RQ y no se proporcionó ?rq, usar la cookie para mantener el RQ al recargar
// Pero solo usarla si ese RQ aún tiene registros en la base; si no, eliminar la cookie y no restaurarla.
if (!isset($_GET['rq']) && !empty($_COOKIE['swrq_current'])) {
	$cookieRq = intval($_COOKIE['swrq_current']);
	if ($cookieRq > 0) {
		// comprobar si existen registros con ese NRequerimiento
		try {
			$chkStmt = $conn->prepare('SELECT COUNT(*) AS cnt FROM scm_requerimientosproduccion WHERE NRequerimiento = ?');
			if ($chkStmt) {
				$chkStmt->bind_param('i', $cookieRq);
				if ($chkStmt->execute()) {
					$resChk = $chkStmt->get_result();
					$rowChk = $resChk ? $resChk->fetch_assoc() : null;
					$count = $rowChk && isset($rowChk['cnt']) ? intval($rowChk['cnt']) : 0;
					if ($count > 0) {
						$correlativo = $cookieRq;
					} else {
						// eliminar cookie vieja que apunta a un RQ sin registros
						setcookie('swrq_current', '', time() - 3600, '/');
					}
				}
				$chkStmt->close();
			}
		} catch (Exception $e) {
			// si algo falla, no usar la cookie
			setcookie('swrq_current', '', time() - 3600, '/');
		}
	}
}
// Soporte para fijar correlativo vía GET (permite agregar varios registros al mismo RQ)
if (isset($_GET['rq'])) {
	$rqParam = intval($_GET['rq']);
	if ($rqParam > 0) {
		$correlativo = $rqParam;
	}
}

// Definir siempre $correlativo_display antes del HTML
if (!isset($correlativo)) {
	$correlativo = 1;
}
$correlativo_display = str_pad($correlativo, 5, '0', STR_PAD_LEFT);

// Cargar sucursales
$sucursales = [];

$sqlSuc = "SELECT Id, Sucursal FROM scm_sucursal";
$resSuc = $conn->query($sqlSuc);
$ordenPersonalizado = ['PLANTA ICA', 'PLANTA PISCO', 'OFICINA LIMA'];
$sucursalesOrdenadas = [];
if ($resSuc && $resSuc->num_rows > 0) {
	$resto = [];
	while ($s = $resSuc->fetch_assoc()) {
		if (in_array($s['Sucursal'], $ordenPersonalizado)) {
			$sucursalesOrdenadas[array_search($s['Sucursal'], $ordenPersonalizado)] = $s;
		} else {
			$resto[] = $s;
		}
	}
	ksort($sucursalesOrdenadas);
	// Ordenar el resto alfabéticamente
	usort($resto, function($a, $b) { return strcmp($a['Sucursal'], $b['Sucursal']); });
		$sucursales = array_merge($sucursalesOrdenadas, $resto);
	}

	// Cargar motivos
	$motivos = [];
	$sqlMot = "SELECT Id, Motivo FROM scm_motivo ORDER BY Motivo ASC";
	$resMot = $conn->query($sqlMot);
	if ($resMot && $resMot->num_rows > 0) {
		while ($m = $resMot->fetch_assoc()) $motivos[] = $m;
	}

// Cargar maquinas
$maquinas = [];
$sql = "SELECT IdMaquinaArea, MaquinaArea FROM produccion_maquinashorasparadas ORDER BY MaquinaArea ASC";
$res = $conn->query($sql);
if ($res && $res->num_rows > 0) {
	while ($r = $res->fetch_assoc()) $maquinas[] = $r;
}

// Cargar registros existentes para el RQ actual (mini-grilla)
$rq_records = [];
if (!empty($correlativo)) {
	$sqlRQ = "SELECT Id, Fecha, Maquina, Zona, Sucursal, Almacen, Motivo, Prioridad, Producto, Codigo, NPallets, Observaciones FROM scm_requerimientosproduccion WHERE NRequerimiento = ? ORDER BY Id DESC";
	$stmtRQ = $conn->prepare($sqlRQ);
	if ($stmtRQ) {
		$stmtRQ->bind_param('i', $correlativo);
		if ($stmtRQ->execute()) {
			$resRQ = $stmtRQ->get_result();
			while ($rr = $resRQ->fetch_assoc()) $rq_records[] = $rr;
		}
		$stmtRQ->close();
		}
	}
?>
<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Requerimiento Producción</title>
		<style>
			/* readonly/date disabled appearance */
			input.readonly-field[readonly] { background: #f5f7fa; cursor: not-allowed; color: #334; }
			input.readonly-field[readonly]::-webkit-calendar-picker-indicator { display: none; }
			/* For Firefox */
			input.readonly-field[readonly]::-moz-focus-inner { border: 0; }
			
		.container { max-width: 700px; margin: 40px auto; background: #fff; padding: 30px 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
		/* badge usuario en esquina superior derecha */
		.user-badge { position: absolute; top: 18px; right: 22px; background: #f5f5f7; padding: 6px 10px; border-radius: 6px; font-weight: 600; color: #222; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
		/* allow suggestions to position correctly within container */
		.container { position: relative; }
		h2 { text-align: center; margin-bottom: 20px; }
			label { display: block; margin-top: 14px; font-weight: bold; max-width: 600px; margin: 14px 0 0 0; text-align: left; }
			input[type="text"], input[type="date"], textarea, select { width: 100%; max-width: 820px; box-sizing: border-box; padding: 8px; margin-top: 6px; border: 1px solid #ccc; border-radius: 4px; display:block; margin:6px 0 0 0; }
		textarea { resize: vertical; }
		.radio-group { max-width: 600px; margin-left: auto; margin-right: auto; display:flex; gap:12px; align-items:center; }
		.radio-group label { display:inline-flex; align-items:center; gap:6px; margin-top:0; }
		.button-row { max-width: 600px; margin: 18px auto 0 auto; display:flex; gap:12px; }
		.button-row button { flex:1; padding:10px; border:none; border-radius:4px; background:#1976d2; color:#fff; cursor:pointer }
		.button-row button:hover { background:#1565c0 }
		/* Botón Guardar en verde */
		/* Botón Guardar en verde (especifidad mayor para evitar que reglas previas lo sobrescriban) */
		.button-row .btn-save { background: #2e7d32 !important; }
		.button-row .btn-save:hover { background: #256028 !important; }
		/* Botón Nuevo RQ - estilo secundario (mantener color por defecto para reporte) */
		.btn-newrq { background: #1976d2; }
		.btn-newrq[disabled] { opacity: 0.6; cursor: not-allowed; }
		.msg { margin-top:16px; padding:10px; border-radius:4px }
		.msg.ok { background:#e6ffea; color:#1a7f2c }
		.msg.err { background:#ffe6e6; color:#a12b2b }

		/* Autocomplete suggestions dropdown */
		.suggestions { position: absolute; left: 50%; transform: translateX(-50%); width: calc(100% - 80px); max-width: 600px; background: #fff; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); z-index: 50; margin-top:6px; }
		.suggestion-item { padding: 8px 10px; cursor: pointer; border-bottom: 1px solid #f0f0f0; }
		.suggestion-item:last-child { border-bottom: none; }
		.suggestion-item:hover, .suggestion-item.active { background:#f0f7ff; }

		/* Responsive table wrapper: evita que la grilla se salga del marco en pantallas pequeñas */
		.table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; margin-top:8px; }
		.table-responsive table { width: 100%; border-collapse: collapse; min-width: 600px; table-layout: auto; }
		/* Auto-ajustar el ancho de columnas según el contenido (nowrap),
		   excepto Maquina (col 2) y Producto (col 4) que se mantienen con wrap */
		.table-responsive th, .table-responsive td { padding:6px; border:1px solid #ddd; vertical-align: top; white-space: nowrap; }
		/* Permitir wrapping en Maquina y Producto (col 2 y 4) */
		.table-responsive th:nth-child(2), .table-responsive td:nth-child(2),
		.table-responsive th:nth-child(4), .table-responsive td:nth-child(4) {
			white-space: normal;
			word-break: break-word;
			max-width: 260px;
		}

		/* Tamaño compacto para la mini-grilla: cabecera y filas más pequeñas */
		.table-responsive th, .table-responsive td { font-size: 13px; }
		.table-responsive thead th { font-size: 13px; font-weight: 600; }
		.table-responsive td { padding:5px; }
		/* Título de la mini-grilla ligeramente más pequeño */
		.container h3 { font-size: 18px; margin-top: 16px; }
		@media (max-width:800px) {
			.table-responsive table { min-width: 480px; }
		}
	</style>
</head>
<body>
	<div class="container">
		<h2>Requerimiento Producción</h2>
		<?php if (!empty($nombreUsuario)): ?>
			<div class="user-badge" aria-label="Usuario conectado"><?php echo htmlspecialchars($nombreUsuario); ?></div>
		<?php endif; ?>

		<?php if ($guardado_ok): ?>
			<div class="msg ok" id="msg-guardado">Requerimiento guardado correctamente.</div>
		<?php endif; ?>
		<?php if ($error_guardado): ?>
			<div class="msg err"><?php echo htmlspecialchars($error_guardado); ?></div>
		<?php endif; ?>

		<div class="button-row">
			<button type="button" id="btn-nuevo" class="btn-save">Guardar</button>
			<?php $btnRqDisabled = (empty($rq_records) ? 'disabled' : ''); ?>
			<button type="button" id="btn-nuevo-rq" class="btn-newrq" <?php echo $btnRqDisabled; ?>>Nuevo RQ</button>
			<button type="button" onclick="location.href='requerimientos_reporte.php'">Reporte</button>
			<button type="button" id="btnCerrarSesionReq">Cerrar Sesión</button>
		</div>

		<form id="form-requerimiento" method="post">
				<!-- Prioridad: Alta / Normal (solo dos opciones, Normal por defecto) -->
				<label for="prioridad">Prioridad</label>
				<div style="max-width:600px;margin-left:auto;margin-right:auto;">
				    <div class="radio-group" style="justify-content:flex-start;">
				        <label><input type="radio" name="prioridad" value="Alta"> Alta</label>
				        <label><input type="radio" name="prioridad" value="Normal" checked> Normal</label>
				    </div>
				</div>
			<label for="num_requerimiento">N° Requerimiento</label>
			<input type="text" id="num_requerimiento" name="num_requerimiento" value="<?php echo $correlativo_display; ?>" readonly />


						<label for="fecha">Fecha</label>
						<input type="date" id="fecha" name="fecha" required readonly aria-disabled="true" class="readonly-field" />


						<label for="sucursal">Sucursal</label>
						<select id="sucursal" name="sucursal">
							<option value="">Seleccione una sucursal</option>
							<?php foreach ($sucursales as $s): ?>
								<option value="<?php echo htmlspecialchars($s['Id']); ?>"><?php echo htmlspecialchars($s['Sucursal']); ?></option>
							<?php endforeach; ?>
						</select>


						<label for="almacen">Almacén</label>
						<select id="almacen" name="almacen" disabled>
							<option value="">Seleccione una sucursal primero</option>
						</select>

						<label for="motivo">Motivo</label>
						<select id="motivo" name="motivo">
							<option value="">Seleccione un motivo</option>
							<?php foreach ($motivos as $m): ?>
								<option value="<?php echo htmlspecialchars($m['Id']); ?>"><?php echo htmlspecialchars($m['Motivo']); ?></option>
							<?php endforeach; ?>
						</select>

			<label for="maquina">Máquina</label>
			<select id="maquina" name="maquina">
				<option value="">Seleccione una máquina</option>
				<?php foreach ($maquinas as $m): ?>
					<option value="<?php echo htmlspecialchars($m['IdMaquinaArea']); ?>"><?php echo htmlspecialchars($m['MaquinaArea']); ?></option>
				<?php endforeach; ?>
			</select>

			<!-- Selector de motivo reemplaza los radios -->

			<div style="display:grid;grid-template-columns:1fr 160px 160px 200px;gap:12px;max-width:820px;margin:6px 0 0 0;align-items:start;width:100%;">
				<label for="producto" style="grid-column:1 / -1;font-weight:600;">Producto</label>
				<input type="text" id="producto" name="producto" autocomplete="off" placeholder="Escribe para buscar producto..." style="grid-column:1 / -1;" />
				<div style="grid-column:1 / -1; display:flex; gap:12px; align-items:flex-start;">
					<div style="flex:1;">
						<label for="codigo" style="display:block;font-weight:600;">Código</label>
						<input type="text" id="codigo" name="codigo" readonly style="width:160px;box-sizing:border-box;text-align:left;" />
					</div>
					<div style="width:160px;">
						<label for="stock" style="display:block;font-weight:600;">Stock</label>
						<input type="text" id="stock" name="stock_display" readonly style="width:100%;box-sizing:border-box;text-align:center;" />
					</div>
					<div style="width:200px;">
						<label for="observacion_producto" style="display:block;font-weight:600;">Observación</label>
						<input type="text" id="observacion_producto" name="observacion_producto" readonly style="width:100%;box-sizing:border-box;" />
					</div>
				</div>
				<input type="hidden" id="producto_id" name="producto_id" />
				<input type="hidden" id="stock_val" name="cantidad" />
			</div>
			<div id="producto_suggestions" class="suggestions" style="display:none"></div>

			<label for="num_pallets">Cantidad Pallets</label>
			<input type="text" id="num_pallets" name="num_pallets" />

			<label for="observaciones">Observaciones</label>
            	<textarea id="observaciones" name="observaciones" rows="6" style="min-height:140px;max-width:100%;"></textarea>
		</form>

			<h3 style="text-align:center;margin-top:20px">Registros para N° RQ <?php echo $correlativo_display; ?></h3>
			<?php if (!empty($rq_records)): ?>
			<div class="table-responsive">
			<table>
				<thead>
					<tr style="background:#f0f0f0">
						<th>Fecha</th>
						<th>Maquina</th>
						<th>Producto</th>
						<th>Codigo</th>
						<th>NPallets</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ($rq_records as $rec): ?>
					<tr>
						<td><?php echo htmlspecialchars((!empty($rec['Fecha']) && strtotime($rec['Fecha'])) ? date('d-m-Y', strtotime($rec['Fecha'])) : $rec['Fecha']); ?></td>
						<td><?php echo htmlspecialchars($rec['Maquina']); ?></td>
						<td><?php echo htmlspecialchars($rec['Producto']); ?></td>
						<td><?php echo htmlspecialchars($rec['Codigo']); ?></td>
						<td style="text-align:center"><?php echo htmlspecialchars($rec['NPallets']); ?></td>
						<td style="text-align:center">
							<form method="post" class="delete-form" style="display:inline">
								<input type="hidden" name="action" value="delete" />
								<input type="hidden" name="delete_id" value="<?php echo intval($rec['Id']); ?>" />
								<button type="submit" class="btn-delete" style="padding:6px 8px;background:#d32f2f;color:#fff;border:none;border-radius:4px;cursor:pointer">Eliminar</button>
							</form>
						</td>
					</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
			</div>
			<?php else: ?>
				<div style="text-align:center;margin-top:8px;color:#666">No hay registros todavía para este N° RQ.</div>
			<?php endif; ?>
	</div>

	<script>
		// Cargar almacenes según sucursal seleccionada
		document.addEventListener('DOMContentLoaded', function() {
			var sucursalSel = document.getElementById('sucursal');
			var almacenSel = document.getElementById('almacen');
			sucursalSel.addEventListener('change', function() {
				var sucId = sucursalSel.value;
				almacenSel.innerHTML = '<option value="">Cargando almacenes...</option>';
				almacenSel.disabled = true;
				if (!sucId) {
					almacenSel.innerHTML = '<option value="">Seleccione una sucursal primero</option>';
					almacenSel.disabled = true;
					return;
				}
				fetch('almacenes_por_sucursal.php?id_sucursal=' + encodeURIComponent(sucId))
					.then(function(res) { return res.json(); })
					.then(function(data) {
						almacenSel.innerHTML = '';
						if (data && data.length > 0) {
							almacenSel.innerHTML = '<option value="">Seleccione un almacén</option>';
							data.forEach(function(a) {
								almacenSel.innerHTML += '<option value="' + a.Id + '">' + a.Almacen + '</option>';
							});
							almacenSel.disabled = false;
						} else {
							almacenSel.innerHTML = '<option value="">No hay almacenes para esta sucursal</option>';
							almacenSel.disabled = true;
						}
					})
					.catch(function() {
						almacenSel.innerHTML = '<option value="">Error al cargar almacenes</option>';
						almacenSel.disabled = true;
					});
			});
		});
		// Flags del servidor para controlar restauración desde localStorage
		window.__rq_has_records = <?php echo (!empty($rq_records) ? 'true' : 'false'); ?>;
		window.__rq_from_query = <?php echo (isset($_GET['rq']) ? 'true' : 'false'); ?>;

		// Fecha por defecto
		(function(){
			var fechaInput = document.getElementById('fecha');
			if (fechaInput) {
				var hoy = new Date();
				var yyyy = hoy.getFullYear();
				var mm = String(hoy.getMonth() + 1).padStart(2,'0');
				var dd = String(hoy.getDate()).padStart(2,'0');
				fechaInput.value = yyyy + '-' + mm + '-' + dd;
			}
		})();

			// Asegurar que por defecto la prioridad sea 'Normal' si ninguna opción quedó marcada
			(function(){
			    try {
			        var radios = document.querySelectorAll('input[name="prioridad"]');
			        var any = false;
			        radios.forEach(function(r){ if (r.checked) any = true; });
			        if (!any) {
			            var normal = document.querySelector('input[name="prioridad"][value="Normal"]');
			            if (normal) normal.checked = true;
			        }
			    } catch(e) { console.warn('No se pudo asegurar prioridad por defecto:', e); }
			})();

		// Autocomplete de producto: consulta product_search.php y rellena código
		(function(){
			var productoInput = document.getElementById('producto');
			var productoId = document.getElementById('producto_id');
			var suggestionsBox = document.getElementById('producto_suggestions');
			var codigo = document.getElementById('codigo');
			var stockDisplay = document.getElementById('stock');
			var stockVal = document.getElementById('stock_val');
			var observacionEl = document.getElementById('observacion_producto');
			var debounceTimer = null;
			var activeIndex = -1;
			var currentSuggestions = [];

			function clearSuggestions(){
				currentSuggestions = [];
				activeIndex = -1;
				suggestionsBox.innerHTML = '';
				suggestionsBox.style.display = 'none';
				// nota: no limpiar campos de código/stock aquí para no sobrescribir valores
			}

			function renderSuggestions(items){
				currentSuggestions = items;
				if (!items || items.length === 0) { clearSuggestions(); return; }
				suggestionsBox.innerHTML = '';
				items.forEach(function(it, idx){
					var div = document.createElement('div');
					div.className = 'suggestion-item';
					div.dataset.index = idx;
						// Mostrar descripción, código y stock en la sugerencia
						var small = 'Código: ' + (it.Codigo ? escapeHtml(it.Codigo) : '') + (typeof it.Cantidad !== 'undefined' ? ' | Stock: ' + escapeHtml(String(it.Cantidad)) : '');
						if (typeof it.Observacion !== 'undefined' && it.Observacion !== null && String(it.Observacion).trim() !== '') {
							small += ' | Obs: ' + escapeHtml(String(it.Observacion));
						}
						div.innerHTML = '<strong>' + escapeHtml(it.Descripcion) + '</strong><div style="font-size:12px;color:#666">' + small + '</div>';
					div.addEventListener('mousedown', function(e){
						// mousedown para que ocurra antes del blur
						selectSuggestion(idx);
						setTimeout(function(){ productoInput.focus(); }, 10);
					});
					suggestionsBox.appendChild(div);
				});
				suggestionsBox.style.display = 'block';
			}

			function selectSuggestion(idx){
				if (!currentSuggestions || !currentSuggestions[idx]) return;
				var it = currentSuggestions[idx];
				// asignar valores limpios (trim)
				productoInput.value = (it.Descripcion || '').trim();
				productoId.value = it.Id;
				codigo.value = (it.Codigo || '').trim();
				// asignar stock y observación si vienen en la respuesta
				if (typeof it.Cantidad !== 'undefined') {
					if (stockDisplay) stockDisplay.value = String(it.Cantidad).trim();
					if (stockVal) stockVal.value = String(it.Cantidad).trim();
				}
				if (typeof it.Observacion !== 'undefined') {
					if (observacionEl) observacionEl.value = String(it.Observacion || '').trim();
				}
				clearSuggestions();
			}

			function highlightActive(){
				var children = suggestionsBox.children;
				for (var i=0;i<children.length;i++){
					children[i].classList.toggle('active', i===activeIndex);
				}
			}

			function doSearch(q){
				if (!q || q.length < 2){ clearSuggestions(); return; }
				fetch('product_search.php?q=' + encodeURIComponent(q))
					.then(function(res){ return res.json(); })
					.then(function(data){ renderSuggestions(data || []); })
					.catch(function(){ clearSuggestions(); });
			}

			productoInput.addEventListener('input', function(){
				productoId.value = '';
				codigo.value = '';
				if (stockDisplay) stockDisplay.value = '';
				if (stockVal) stockVal.value = '';
				if (observacionEl) observacionEl.value = '';
				if (debounceTimer) clearTimeout(debounceTimer);
				debounceTimer = setTimeout(function(){ doSearch(productoInput.value.trim()); }, 300);
			});

			// Forzar mayúsculas en observaciones en tiempo real
			var obsEl = document.getElementById('observaciones');
			if (obsEl) {
				obsEl.addEventListener('input', function(e){
					var start = obsEl.selectionStart; var end = obsEl.selectionEnd;
					obsEl.value = obsEl.value.toUpperCase();
					// restaurar caret
					obsEl.setSelectionRange(start, end);
				});
			}

			productoInput.addEventListener('keydown', function(e){
				var key = e.key || e.keyCode;
				if (suggestionsBox.style.display === 'block'){
					if (key === 'ArrowDown' || key === 40){
						e.preventDefault();
						activeIndex = Math.min(activeIndex + 1, currentSuggestions.length - 1);
						highlightActive();
					} else if (key === 'ArrowUp' || key === 38){
						e.preventDefault();
						activeIndex = Math.max(activeIndex - 1, 0);
						highlightActive();
					} else if (key === 'Enter' || key === 13){
						e.preventDefault();
						if (activeIndex >= 0) selectSuggestion(activeIndex);
					}
				}
			});

			document.addEventListener('click', function(e){
				if (!suggestionsBox.contains(e.target) && e.target !== productoInput){
					clearSuggestions();
				}
			});

			function escapeHtml(s){
				return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
			}

		})();

		// Botón Guardar y Nuevo: enviar el formulario por AJAX y actualizar la mini-grilla sin recargar
		(function(){
			var btnNuevo = document.getElementById('btn-nuevo');
			var form = document.getElementById('form-requerimiento');

			// Validation helper
			function validateFormFields(){
				var fecha = document.getElementById('fecha');
				var maquina = document.getElementById('maquina');
				var producto = document.getElementById('producto');
				var codigo = document.getElementById('codigo');
				var np = document.getElementById('num_pallets');
				var msgs = [];
				if (!fecha || !fecha.value) msgs.push('La fecha es obligatoria.');
				if (!maquina || !maquina.value) msgs.push('Seleccione una máquina.');
				// producto o codigo deben estar presentes
				if ((!producto || !producto.value.trim()) && (!codigo || !codigo.value.trim())) msgs.push('Indique el producto (o seleccione una sugerencia).');
				var npVal = np ? parseInt(String(np.value).replace(/\s+/g,''),10) : 0;
				if (!np || isNaN(npVal) || npVal <= 0) msgs.push('N° Pallets debe ser un número mayor que 0.');
				if (msgs.length) return { ok:false, message: msgs.join(' ') };
				return { ok:true };
			}
			function showTempMessage(text, isError){
				var div = document.createElement('div');
				div.className = 'msg ' + (isError ? 'err' : 'ok');
				div.textContent = text;
				form.parentNode.insertBefore(div, form);
				setTimeout(function(){ div.style.opacity = '0'; setTimeout(function(){ div.remove(); }, 500); }, 3000);
			}

			// Alert modal (single OK) - similar design to confirm modal
			function showAlertModal(message, isError){
				var am = document.getElementById('alert-modal');
				if (!am) return alert(message);
				var msg = am.querySelector('.alert-message');
				var ok = am.querySelector('.alert-ok');
				msg.textContent = message || '';
				am.setAttribute('aria-hidden','false'); am.style.display='flex';
				if (isError) ok.style.background = '#d32f2f'; else ok.style.background = '#2e7d32';
				ok.focus();
				function cleanup(){ ok.removeEventListener('click', onOk); document.removeEventListener('keydown', onKey); am.setAttribute('aria-hidden','true'); am.style.display='none'; }
				function onOk(){ cleanup(); }
				function onKey(e){ if (e.key === 'Escape' || e.key === 'Enter') onOk(); }
				ok.addEventListener('click', onOk);
				document.addEventListener('keydown', onKey);
			}

			function addRowToMiniGrilla(rec){
				var container = form.parentNode; // .container

				// eliminar mensaje "No hay registros todavía..." si existe
				var possibleNoRows = Array.prototype.slice.call(container.querySelectorAll('div'));
				possibleNoRows.forEach(function(d){
					if (d.textContent && d.textContent.trim().toLowerCase().indexOf('no hay registros') !== -1) {
						d.remove();
					}
				});

				// buscar wrapper .table-responsive y tabla existente dentro del contenedor
				var wrapper = container.querySelector('.table-responsive');
				var table = wrapper ? wrapper.querySelector('table') : null;

				// buscar header existente
				var existingHeader = container.querySelector('h3');
				if (!existingHeader) {
					existingHeader = document.createElement('h3');
					existingHeader.style.textAlign = 'center';
					existingHeader.style.marginTop = '20px';
					container.appendChild(existingHeader);
				}
				existingHeader.textContent = 'Registros para N° RQ ' + (String(rec.NRequerimiento).padStart(5,'0'));

				if (!table) {
					// crear wrapper y tabla si no existe
					wrapper = document.createElement('div');
					wrapper.className = 'table-responsive';
					table = document.createElement('table');
					var thead = document.createElement('thead');
					thead.innerHTML = '<tr style="background:#f0f0f0"><th>Fecha</th><th>Maquina</th><th>Producto</th><th>Codigo</th><th>NPallets</th><th>Acciones</th></tr>';
					table.appendChild(thead);
					var tb = document.createElement('tbody'); tb.className = 'mini-grilla-body'; table.appendChild(tb);
					wrapper.appendChild(table);
					// insertar la wrapper después del header existente
					existingHeader.parentNode.insertBefore(wrapper, existingHeader.nextSibling);
				}

				var tbody = table.querySelector('tbody') || table.querySelector('.mini-grilla-body');
				if (!tbody) {
					tbody = document.createElement('tbody'); tbody.className = 'mini-grilla-body'; table.appendChild(tbody);
				}

				function formatDateJS(d){
					if (!d) return '';
					// aceptar formato YYYY-MM-DD o YYYY-MM-DD HH:MM:SS
					var parts = d.split(' ');
					var dateOnly = parts[0];
					var p = dateOnly.split('-');
					if (p.length === 3) return p[2] + '-' + p[1] + '-' + p[0];
					return d;
				}

				var tr = document.createElement('tr');
				tr.innerHTML = '<td style="padding:6px;border:1px solid #ddd">' + escapeHtml(formatDateJS(rec.Fecha)) + '</td>' +
					'<td style="padding:6px;border:1px solid #ddd">' + escapeHtml(rec.Maquina) + '</td>' +
					'<td style="padding:6px;border:1px solid #ddd">' + escapeHtml(rec.Producto) + '</td>' +
					'<td style="padding:6px;border:1px solid #ddd">' + escapeHtml(rec.Codigo) + '</td>' +
					'<td style="padding:6px;border:1px solid #ddd;text-align:center">' + escapeHtml(String(rec.NPallets)) + '</td>' +
					'<td style="padding:6px;border:1px solid #ddd;text-align:center"><form method="post" class="delete-form" style="display:inline"><input type="hidden" name="action" value="delete" /><input type="hidden" name="delete_id" value="' + parseInt(rec.id) + '" /><button type="submit" class="btn-delete" style="padding:6px 8px;background:#d32f2f;color:#fff;border:none;border-radius:4px;cursor:pointer">Eliminar</button></form></td>';
				tbody.insertBefore(tr, tbody.firstChild);
			}

			function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

		btnNuevo.addEventListener('click', function(){
						// validar campos requeridos antes de enviar
						var valid = validateFormFields();
						if (!valid.ok) {
							showAlertModal(valid.message, true);
							return;
						}
						// asegurar que los campos de producto y codigo están trimmeados y observaciones en MAYUS antes de enviar
						var prod = document.getElementById('producto');
						var cod = document.getElementById('codigo');
						var obs = document.getElementById('observaciones');
						if (prod) prod.value = prod.value.trim();
						if (cod) cod.value = cod.value.trim();
						if (obs) obs.value = obs.value.toUpperCase().trim();

						var formData = new FormData(form);
				// enviar peticion AJAX
				fetch(window.location.pathname, {
					method: 'POST',
					headers: {
						'X-Requested-With': 'XMLHttpRequest'
					},
					body: formData
				}).then(function(res){
					return res.json();
				}).then(function(json){
					if (json && json.success) {
						// añadir fila a mini-grilla
						addRowToMiniGrilla({
							id: json.id,
							NRequerimiento: json.NRequerimiento,
							Fecha: json.Fecha,
							Maquina: json.Maquina,
							Zona: json.Zona,
							Producto: json.Producto,
							Codigo: json.Codigo,
							NPallets: json.NPallets,
							Observaciones: json.Observaciones
						});
						showTempMessage('Requerimiento guardado', false);
						// limpiar algunos campos para nuevo registro manteniendo NRequerimiento y fecha
						document.getElementById('producto').value = '';
						document.getElementById('producto_id').value = '';
						document.getElementById('codigo').value = '';
						// limpiar stock mostrado
						var sd = document.getElementById('stock'); if (sd) sd.value = '';
						var sv = document.getElementById('stock_val'); if (sv) sv.value = '';
						document.getElementById('num_pallets').value = '';
						document.getElementById('observaciones').value = '';
						// limpiar selector de máquina y restablecer motivo por defecto
						var maq = document.getElementById('maquina');
						if (maq) maq.value = '';
						// limpiar sucursal/almacen/motivo seleccionados
						var sucEl = document.getElementById('sucursal');
						if (sucEl) sucEl.value = '';
						var almEl = document.getElementById('almacen');
						if (almEl) { almEl.innerHTML = '<option value="">Seleccione una sucursal primero</option>'; almEl.disabled = true; }
						var motivoSel = document.getElementById('motivo');
						if (motivoSel) motivoSel.value = '';

						// Asegurar que el campo N° Requerimiento muestre el valor devuelto por el servidor
						try {
							var rqInput = document.getElementById('num_requerimiento');
							if (rqInput && json.NRequerimiento !== undefined) {
								rqInput.value = String(json.NRequerimiento).padStart(5,'0');
								// actualizar cookie para persistencia
								document.cookie = 'swrq_current=' + encodeURIComponent(String(json.NRequerimiento)) + '; path=/';
							}
						} catch(e) { console.warn('No se pudo actualizar num_requerimiento tras guardar', e); }

						// Habilitar el botón 'Comenzar nuevo RQ' una vez que haya al menos un material guardado
						try {
							var btnNuevoRqClient = document.getElementById('btn-nuevo-rq');
							if (btnNuevoRqClient) { btnNuevoRqClient.disabled = false; }
						} catch(e) { /* no crítico */ }
					} else {
						showTempMessage('Error guardando: ' + (json && json.error ? json.error : 'Respuesta inválida'), true);
					}
				}).catch(function(err){
					showTempMessage('Error de red al guardar', true);
				});
			});
		})();

		// Ocultar mensaje de guardado después de 3 segundos
		(function(){
			var msg = document.getElementById('msg-guardado');
			if (msg) {
				setTimeout(function(){
					msg.style.transition = 'opacity 0.5s';
					msg.style.opacity = '0';
					setTimeout(function(){ msg.remove(); }, 600);
				}, 3000);
			}
		})();

		// Persistencia: guardar correlativo actual en cookie y formulario en localStorage
		(function(){
			var rq = document.getElementById('num_requerimiento');
			var form = document.getElementById('form-requerimiento');
			var storageKey = 'swrq_form_v1';
			function setCookie(name, value, days){
				var expires = '';
				if (days) {
					var d = new Date(); d.setTime(d.getTime() + (days*24*60*60*1000));
					expires = '; expires=' + d.toUTCString();
				}
				document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
			}
			function removeCookie(name){ setCookie(name,'',-1); }

			// Al cargar, restaurar formulario si existe
			try {
				var saved = localStorage.getItem(storageKey);
				if (saved) {
					var obj = JSON.parse(saved);
					if (obj) {
						// Restaurar solo si el num_requerimiento guardado coincide con el correlativo actual
						// y si la página corresponde a edición (viene con ?rq) o si ya hay registros para este RQ
						try {
							var currentRqEl = document.querySelector('[name="num_requerimiento"]');
							var currentRq = currentRqEl ? String(currentRqEl.value || '').replace(/^0+/, '') : '';
							var savedRq = obj['num_requerimiento'] ? String(obj['num_requerimiento']).replace(/^0+/, '') : '';
							var canRestore = (savedRq !== '' && currentRq !== '' && savedRq === currentRq) && (window.__rq_from_query || window.__rq_has_records);
							if (canRestore) {
								Object.keys(obj).forEach(function(k){
									var el = document.querySelector('[name="'+k+'"]');
									if (!el) return;
									try {
										if (el.tagName && el.tagName.toLowerCase() === 'input' && el.type === 'radio') {
											// seleccionar el radio cuyo valor coincide
											var r = document.querySelector('input[name="'+k+'"][value="'+String(obj[k]).replace(/"/g,'')+'"]');
											if (r) r.checked = true;
										} else {
											el.value = obj[k];
										}
									} catch(e){ el.value = obj[k]; }
								});
							} else {
								// No restaurar si el RQ guardado no coincide con el actual o si no es edición/registro existente
								console.log('swrq: no restaura (condición) savedRq=' + savedRq + ' currentRq=' + currentRq + ' fromQuery=' + window.__rq_from_query + ' hasRecords=' + window.__rq_has_records);
							}
						} catch(e){
							console.warn('Error al validar restauración desde localStorage', e);
						}
					}
				}
			} catch(e){}

			// guardar correlativo en cookie para mantenerlo entre reloads
			if (rq) setCookie('swrq_current', rq.value.replace(/^0+/, ''), 7);

			// guardar cambios del formulario en localStorage
			if (form) {
				form.addEventListener('input', function(){
					var fd = {};
					['num_requerimiento','fecha','maquina','sucursal','almacen','motivo','prioridad','producto','codigo','stock','num_pallets','observaciones'].forEach(function(n){
						var el = document.querySelector('[name="'+n+'"]');
						if (el) fd[n] = el.value;
					});
					localStorage.setItem(storageKey, JSON.stringify(fd));
				});
			}

			// limpiar al crear nuevo requerimiento
			var btnNuevoRq = document.getElementById('btn-nuevo-rq');
			if (btnNuevoRq) {
				btnNuevoRq.addEventListener('click', function(){
					// eliminar cookie/localStorage y navegar al siguiente correlativo
					removeCookie('swrq_current');
					localStorage.removeItem(storageKey);
					try {
						var cur = document.getElementById('num_requerimiento');
						var curVal = cur ? parseInt(String(cur.value).replace(/^0+/,''),10) : NaN;
						var next = (!isNaN(curVal) ? (curVal + 1) : '');
						if (next !== '') window.location.href = 'requerimientos.php?rq=' + next;
						else window.location.href = 'requerimientos.php';
					} catch(e){ window.location.href = 'requerimientos.php'; }
				});
			}
		})();

		// Nuevo Requerimiento: recargar la página sin el parámetro rq para obtener el siguiente correlativo
		var btnNuevoRq = document.getElementById('btn-nuevo-rq');
		if (btnNuevoRq) {
			btnNuevoRq.addEventListener('click', function(){
				// navegar al siguiente correlativo calculado a partir del valor actual
				try {
					var cur = document.getElementById('num_requerimiento');
					var curVal = cur ? parseInt(String(cur.value).replace(/^0+/,''),10) : NaN;
					var next = (!isNaN(curVal) ? (curVal + 1) : '');
					if (next !== '') window.location.href = 'requerimientos.php?rq=' + next;
					else window.location.href = 'requerimientos.php';
				} catch(e){ window.location.href = 'requerimientos.php'; }
			});
		}

		// Cerrar sesión (handler para este formulario de requerimientos)
		var btnCerrarSesionReq = document.getElementById('btnCerrarSesionReq');
		if (btnCerrarSesionReq) {
			btnCerrarSesionReq.addEventListener('click', function(){
				fetch('/logout.php', { method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
				.then(function(resp){
					try { localStorage.removeItem('nombreUsuario'); } catch(e){}
					var baseUrl = window.location.pathname.includes('/BACKOFFICE/') ? '/BACKOFFICE' : '';
					window.location.href = baseUrl + '/public/index.html';
				}).catch(function(err){
					console.error('Error logout:', err);
					try { localStorage.removeItem('nombreUsuario'); } catch(e){}
					var baseUrl = window.location.pathname.includes('/BACKOFFICE/') ? '/BACKOFFICE' : '';
					window.location.href = baseUrl + '/public/index.html';
				});
			});
		}

		// Asegurar que el botón 'Nuevo Requerimiento' siempre responda (handler robusto con log)
		(function(){
			try {
				var btnFallback = document.getElementById('btn-nuevo-rq');
				if (!btnFallback) { console.warn('btn-nuevo-rq no encontrado (fallback)'); return; }
				// Evitar añadir múltiples listeners
				btnFallback.removeEventListener('click', window._rqClickHandler);
				window._rqClickHandler = function(e){
					console.log('btn-nuevo-rq CLICK (fallback)');
					// eliminar cookie y storage relacionados con el RQ
					document.cookie = 'swrq_current=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
					try { localStorage.removeItem('swrq_form_v1'); } catch(err){}
					// forzar navegación para obtener nuevo correlativo
					window.location.href = 'requerimientos.php';
				};
				btnFallback.addEventListener('click', window._rqClickHandler);
			} catch(e){ console.error('Error al asignar fallback para btn-nuevo-rq', e); }
		})();
	</script>

	<!-- Alert modal (single OK) -->
	<div id="alert-modal" class="confirm-modal" aria-hidden="true" style="display:none;">
		<div class="confirm-overlay"></div>
		<div class="confirm-box" role="dialog" aria-modal="true">
			<p class="alert-message" style="margin:0 0 12px;color:#333;font-size:15px"></p>
			<div style="display:flex;gap:10px;justify-content:flex-end;">
				<button class="alert-ok" style="padding:8px 12px;border-radius:4px;border:none;background:#2e7d32;color:#fff;cursor:pointer">OK</button>
			</div>
		</div>
	</div>

	<!-- Confirm modal for deletions (styled custom dialog) -->
	<div id="confirm-modal" class="confirm-modal" aria-hidden="true" style="display:none;">
		<div class="confirm-overlay"></div>
		<div class="confirm-box" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
			<h4 id="confirm-title">Confirmar eliminación</h4>
			<p id="confirm-message">¿Eliminar este registro?</p>
			<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px">
				<button id="confirm-cancel" style="padding:8px 12px;border-radius:4px;border:1px solid #ccc;background:#fff;cursor:pointer">Cancelar</button>
				<button id="confirm-ok" style="padding:8px 12px;border-radius:4px;border:none;background:#d32f2f;color:#fff;cursor:pointer">Eliminar</button>
			</div>
		</div>
	</div>

	<style>
		/* Modal styles */
		.confirm-modal { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 9999; }
		.confirm-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(1px); }
		.confirm-box { position: relative; background: #fff; padding: 18px; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); width: 92%; max-width: 420px; z-index: 10000; }
		.confirm-box h4 { margin:0 0 6px 0; font-size:16px; }
		.confirm-box p { margin:0; color:#333; }
		/* transition */
		.confirm-modal[aria-hidden="true"] { display: none; }
		.confirm-modal[aria-hidden="false"] { display:flex; }
	</style>

	<script>
		// Reemplaza el confirm() nativo por un modal estilizado.
		(function(){
			var modal = document.getElementById('confirm-modal');
			var msgEl = document.getElementById('confirm-message');
			var btnOk = document.getElementById('confirm-ok');
			var btnCancel = document.getElementById('confirm-cancel');
			var activeForm = null;

			function showConfirm(message){
				return new Promise(function(resolve){
					if (!modal) return resolve(false);
					msgEl.textContent = message || '¿Confirmar?';
					modal.setAttribute('aria-hidden','false');
					modal.style.display = 'flex';
					// focus management
					btnCancel.focus();

					function cleanup(){
						btnOk.removeEventListener('click', onOk);
						btnCancel.removeEventListener('click', onCancel);
						document.removeEventListener('keydown', onKey);
					}

					function onOk(){ cleanup(); modal.setAttribute('aria-hidden','true'); modal.style.display='none'; resolve(true); }
					function onCancel(){ cleanup(); modal.setAttribute('aria-hidden','true'); modal.style.display='none'; resolve(false); }
					function onKey(e){ if (e.key === 'Escape') onCancel(); if (e.key === 'Enter') onOk(); }

					btnOk.addEventListener('click', onOk);
					btnCancel.addEventListener('click', onCancel);
					document.addEventListener('keydown', onKey);
				});
			}

			// Interceptar submits de forms con clase .delete-form (capturing phase para atraparlo antes)
			document.addEventListener('submit', function(e){
				var form = e.target;
				if (!form || !form.classList || !form.classList.contains('delete-form')) return;
				e.preventDefault();
				// Mensaje personalizado: incluir id si existe
				var idField = form.querySelector('input[name="delete_id"]');
				var mid = idField ? idField.value : '';
				var msg = '¿Eliminar este registro' + (mid ? ' (Id ' + mid + ')' : '') + '?';
				showConfirm(msg).then(function(ok){
					if (ok) {
						try {
							// Antes de enviar, limpiar formulario principal y storage para evitar que valores previos reaparezcan
							try { localStorage.removeItem('swrq_form_v1'); } catch(e){}
							var mainForm = document.getElementById('form-requerimiento');
							if (mainForm) {
								var fields = ['producto','producto_id','codigo','stock','stock_val','num_pallets','observaciones','maquina','prioridad'];
								fields.forEach(function(n){
									var el = mainForm.querySelector('[name="'+n+'"]');
									if (el) {
										if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
										else el.value = '';
									}
								});
								// restablecer motivo por defecto
								var motivoDefault = document.querySelector('input[name="motivo"][value="motivo1"]');
								if (motivoDefault) motivoDefault.checked = true;
								// restablecer prioridad por defecto (Media)
								try {
									var pr = document.querySelector('input[name="prioridad"][value="Media"]');
									if (pr) pr.checked = true;
								} catch(e) {}
							}
						} catch(e) { console.warn('Error limpiando formulario antes de eliminar:', e); }
						// pequeño delay para dejar que DOM/storage se actualice visualmente antes de enviar
						setTimeout(function(){ form.submit(); }, 80);
					}
				});
			}, true);
		})();
	</script>
</body>
</html>
