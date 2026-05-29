<?php
// Requerimientos V2 - Usa estructura normalizada (backend) con interfaz V1
include '../../shared/conexion.php';
include '../../shared/funciones_v2.php';
// Asegurar que la sesión esté iniciada para obtener nombre de usuario
if (session_status() === PHP_SESSION_NONE) session_start();

// Determinar nombre del usuario logueado para mostrar en la cabecera (campo `Nombres` de la tabla `usuarios`)
$nombreUsuario = null;
$usuarioArea = null;
$usuarioActual = null; // Usuario para auditoría en campo CreadoPor

// Priorizar valor almacenado en sesión si existe
if (!empty($_SESSION['usuarionombre'])) {
	$nombreUsuario = $_SESSION['usuarionombre'];
}

// Determinar usuario actual para campo CreadoPor
if (!empty($_SESSION['usuario'])) {
	$usuarioActual = $_SESSION['usuario'];
} else if (!empty($_SESSION['usuarionombre'])) {
	$usuarioActual = $_SESSION['usuarionombre'];
} else if (!empty($_SESSION['IdUsuario'])) {
	$usuarioActual = 'Usuario_' . $_SESSION['IdUsuario'];
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

// Verificar existencia de las tablas V2
$checkTable = $conn->query("SHOW TABLES LIKE 'scm_requerimientos'");
if (!$checkTable || $checkTable->num_rows === 0) {
	// Mostrar mensaje amigable - falta estructura V2
	$suggestedDDL = "-- Ejecutar sql/create_nueva_estructura.sql\nCREATE TABLE IF NOT EXISTS scm_requerimientos (\n"
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
	// Soporte para acciones especiales (delete) - USANDO V2
	if (isset($_POST['action']) && $_POST['action'] === 'delete' && isset($_POST['delete_id'])) {
		$delId = intval($_POST['delete_id']);
		if ($delId > 0) {
			// En V2, eliminamos desde scm_requerimientos_detalle
			$stmtDel = $conn->prepare("DELETE FROM scm_requerimientos_detalle WHERE Id = ? LIMIT 1");
			if ($stmtDel) {
				$stmtDel->bind_param('i', $delId);
				$stmtDel->execute();
				$stmtDel->close();
				header('Location: ' . $_SERVER['PHP_SELF'] . (isset($_GET['rq']) ? '?rq=' . intval($_GET['rq']) : ''));
				exit;
			}
		}
	}
	// Validar que no sea acción delete
	if (!isset($_POST['action'])) {
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
	$codMaquina = $idMaquina; // El ID de la máquina es el código
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

	// ==================== INICIO LÓGICA V2: USO DE TABLAS NORMALIZADAS ====================
	// En V2, insertamos en scm_requerimientos (encabezado) y scm_requerimientos_detalle (items)
	// Mantenemos EXACTAMENTE la misma respuesta AJAX/Redirección para compatibilidad con frontend V1
	
	// 1. Crear/actualizar encabezado del requerimiento
	$resReq = crearOActualizarRequerimiento($conn, [
		'nrequerimiento' => $nrequerimiento_db,
		'fecha' => $fecha,
		'codmaquina' => $codMaquina, // código de la máquina seleccionada
		'maquina' => $nombreMaquina, // nombre descriptivo de la máquina
		'zona' => $zona,
		'motivo' => $motivo,
		'sucursal' => $sucursal,
		'almacen' => $almacen,
		'prioridad' => $prioridad,
		'creado_por' => $usuarioActual
	]);
	
	if (!$resReq['success']) {
		$error_guardado = 'Error al guardar encabezado: ' . $resReq['error'];
		error_log('requerimientos_v2.php: ' . $error_guardado);
		$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest');
		if ($isAjax) {
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode(['success' => false, 'error' => $resReq['error']]);
			exit;
		}
	} else {
		// 2. Agregar detalle (producto)
		error_log("requerimientos_v2.php - Observaciones antes de guardar: '" . $observaciones . "'");
		$resDet = agregarDetalleRequerimiento($conn, [
			'nrequerimiento' => $nrequerimiento_db,
			'codigo' => $codigo,
			'producto' => $producto,
			'npallets' => $npallets,
			'observaciones' => $observaciones
		]);
		
		if (!$resDet['success']) {
			$error_guardado = 'Error al guardar detalle: ' . $resDet['error'];
			error_log('requerimientos_v2.php: ' . $error_guardado);
			$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest');
			if ($isAjax) {
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode(['success' => false, 'error' => $resDet['error']]);
				exit;
			}
		} else {
			// ÉXITO: responder igual que V1 para mantener compatibilidad con frontend
			$insertedId = $resDet['id_detalle']; // ID del detalle recién insertado
			$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest');
			if ($isAjax) {
				header('Content-Type: application/json; charset=utf-8');
				$response = [
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
					'Responsable' => !empty($nombreUsuario) ? $nombreUsuario : '',
					'Area' => !empty($usuarioArea) ? $usuarioArea : '',
					'created_at' => date('Y-m-d H:i:s')
				];
				echo json_encode($response);
				exit;
			} else {
				// Redirección con parámetro de éxito
				header('Location: requerimientos_v2.php?guardado=1&rq=' . $nrequerimiento_db);
				exit;
			}
		}
	}
	// ==================== FIN LÓGICA V2 ====================
	} // Fin del if (!isset($_POST['action']))
} // Fin del if POST

if (isset($_GET['guardado']) && $_GET['guardado'] == '1') $guardado_ok = true;

$correlativo = 1;
// Primero calcular el siguiente correlativo por defecto - USANDO V2
$sqlCorrelativo = "SELECT MAX(NRequerimiento) AS max_req FROM scm_requerimientos";
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
		// comprobar si existen registros con ese NRequerimiento - USANDO V2
		try {
			$chkStmt = $conn->prepare('SELECT COUNT(*) AS cnt FROM scm_requerimientos WHERE NRequerimiento = ?');
			if ($chkStmt) {
				$chkStmt->bind_param('i', $cookieRq);
				if ($chkStmt->execute()) {
					$resChk = $chkStmt->get_result();
					$rowChk = $resChk ? $resChk->fetch_assoc() : null;
					$count = $rowChk && isset($rowChk['cnt']) ? intval($rowChk['cnt']) : 0;
					if ($count > 0) {
						// No permitir que una cookie local reduzca el correlativo global.
						// Solo usar la cookie si su RQ es mayor que el correlativo calculado
						// (esto evita mostrar números ya vencidos cuando la DB tiene registros más recientes).
						if ($cookieRq > intval($correlativo)) {
							$correlativo = $cookieRq;
						}
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
$sql = "SELECT IdMaquinaArea, MaquinaArea, IdSucursal FROM produccion_maquinashorasparadas ORDER BY MaquinaArea ASC";
$res = $conn->query($sql);
if ($res && $res->num_rows > 0) {
	while ($r = $res->fetch_assoc()) $maquinas[] = $r;
}

// Cargar registros existentes para el RQ actual (mini-grilla) - USANDO V2
$rq_records = [];
if (!empty($correlativo)) {
	// En V2, obtenemos los detalles desde las tablas normalizadas
	$detalles = obtenerDetallesRequerimiento($conn, $correlativo);
	if (!empty($detalles)) {
		// Convertir al formato esperado por el frontend (mantener compatibilidad con V1)
		foreach ($detalles as $det) {
			$rq_records[] = [
				'Id' => $det['id_detalle'],
				'Fecha' => $det['fecha'],
				'Maquina' => $det['maquina'],
				'Zona' => $det['zona'],
				'Sucursal' => $det['sucursal'],
				'Almacen' => $det['almacen'],
				'Motivo' => $det['motivo'],
				'Prioridad' => $det['prioridad'],
				'Producto' => $det['producto'],
				'Codigo' => $det['codigo'],
				'NPallets' => $det['npallets'],
				'Observaciones' => $det['observaciones']
			];
		}
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
			/* Número de RQ: grisado y texto en negrita cuando es readonly */
			#num_requerimiento[readonly] {
				background: #f5f7fa;
				cursor: not-allowed;
				color: #334;
				border-color: #dcdcdc;
				font-weight: 700;
			}
			/* Hacer que los inputs de la product-grid que son readonly aparezcan grisados igual que la fecha */
			.product-grid input[readonly], .product-grid input[disabled], .product-grid textarea[readonly] {
				background: #f5f7fa;
				cursor: not-allowed;
				color: #334;
				border-color: #dcdcdc;
			}
			input.readonly-field[readonly]::-webkit-calendar-picker-indicator { display: none; }
			/* For Firefox */
			input.readonly-field[readonly]::-moz-focus-inner { border: 0; }
			
		.container { max-width: 960px; margin: 40px auto; background: #fff; padding: 30px 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
		/* badge usuario en esquina superior derecha */
		.user-badge { position: absolute; top: 18px; right: 22px; background: #f5f5f7; padding: 6px 10px; border-radius: 6px; font-weight: 600; color: #222; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
		/* allow suggestions to position correctly within container */
		.container { position: relative; }
		h2 { text-align: center; margin-bottom: 20px; }
			label { display: block; margin-top: 14px; font-weight: bold; max-width: 100%; margin: 14px 0 0 0; text-align: left; }
			input[type="text"], input[type="date"], textarea, select { width: 100%; max-width: 100%; box-sizing: border-box; padding: 8px; margin-top: 6px; border: 1px solid #ccc; border-radius: 4px; display:block; margin:6px 0 0 0; }
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
		.table-responsive th, .table-responsive td { padding:6px; border:1px solid #ddd; vertical-align: middle; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

		/* Tamaño compacto para la mini-grilla: cabecera y filas más pequeñas */
		.table-responsive th, .table-responsive td { font-size: 13px; }
		.table-responsive thead th { font-size: 13px; font-weight: 600; }
		.table-responsive td { padding:5px; }
		/* Título de la mini-grilla ligeramente más pequeño */
		.container h3 { font-size: 18px; margin-top: 16px; }

			/* Layout específico para la sección de producto (evita overflow por columnas fijas) */
			.product-full { width: 100%; margin-bottom: 8px; position: relative; }
			.product-full input { width: 100%; font-size:14px; padding:8px; min-height:36px; box-sizing:border-box; border:1px solid #ccc; border-radius:4px; }
			.product-full .suggestions { position: absolute; left: 0; top: calc(100% + 6px); width: 100%; max-width: 820px; background: #fff; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); z-index: 60; }
					.product-grid { display: grid; grid-template-columns: 140px 90px 90px 1fr; gap:18px; max-width:920px; margin:8px 0 6px 0; align-items:start; width:100%; }
			.product-grid > label[for="producto"] { grid-column: 1 / -1; grid-row: 1; }
			.product-grid input#producto, .product-grid input[name="producto"] { grid-column: 1 / -1; grid-row: 2; }
			/* Hacer el control de Producto igual al select de Máquina */
			.product-grid input#producto {
				width: 100% !important;
				font-size: 14px;
				padding: 8px;
				box-sizing: border-box;
				min-height: 36px;
				border: 1px solid #ccc;
				border-radius: 4px;
			}
			.product-grid .col-code { grid-column: 1 / 2; }
			.product-grid .col-stock { grid-column: 2 / 3; }
			.product-grid .col-pallets { grid-column: 3 / 4; }
			.product-grid .col-observ { grid-column: 4 / 5; }
			.product-grid label { margin-top: 6px; display:block; }
				.product-grid .col-code label, .product-grid .col-stock label, .product-grid .col-pallets label, .product-grid .col-observ label { margin-top: 0.2rem; margin-bottom: 0.25rem; }
			/* Mantener el label de stock en una sola línea */
			.product-grid .col-stock label { white-space: nowrap; }
			/* Ajustes de espaciado para evitar solapamientos */
			.product-grid label { margin-top: 6px; display:block; }
            		.product-grid input, .product-grid textarea { margin-top: 6px; padding:8px; min-height:36px; box-sizing:border-box; }
			.product-grid .col-code, .product-grid .col-stock, .product-grid .col-pallets, .product-grid .col-observ { min-width:0; }
		.suggestions { position: absolute; left: 50%; transform: translateX(-50%); width: calc(100% - 80px); max-width: 600px; background: #fff; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); z-index: 50; margin-top:6px; }

		@media (max-width:800px) {
			.table-responsive table { min-width: 480px; }
		}
		/* RESPONSIVE MÓVIL */
		@media (max-width: 768px) {
			body { padding: 8px; }
			.container { max-width: 100%; margin: 10px auto; padding: 16px 12px; }
			h2 { font-size: 18px !important; margin-bottom: 12px; }
			.user-badge { position: static; display: block; text-align: center; margin-bottom: 12px; }
			.button-row { flex-direction: column; gap: 8px; max-width: 100%; }
			.button-row button { padding: 12px; font-size: 15px; min-height: 44px; }
			label { font-size: 14px; }
			input[type="text"], input[type="date"], textarea, select { font-size: 16px; padding: 10px; min-height: 44px; }
			.radio-group { flex-wrap: wrap; }
			.suggestions { width: calc(100% - 24px); left: 12px; transform: none; }
			.table-responsive { margin-left: -12px; margin-right: -12px; padding: 0 12px; }
			.table-responsive th, .table-responsive td { font-size: 12px; padding: 4px; }

			/* En móvil, convertir la rejilla de producto a una sola columna */
			.product-grid { grid-template-columns: 1fr !important; max-width: 100% !important; }
			/* Asegurar que cada columna pequeña ocupe toda la fila y no se solapen */
				.product-grid .col-code,
				.product-grid .col-stock,
				.product-grid .col-pallets,
				.product-grid .col-observ { grid-column: 1 / -1 !important; width: 100% !important; min-width: 0; margin-bottom: 8px; }
				.product-grid .col-code input,
				.product-grid .col-stock input,
				.product-grid .col-pallets textarea,
				.product-grid .col-observ input { width: 100% !important; box-sizing: border-box; }
			.product-full .suggestions { left: 0 !important; transform: none !important; width: calc(100% - 0px) !important; }
		}
		@media (max-width: 480px) {
			.container { padding: 12px 8px; }
			h2 { font-size: 16px !important; }
			.button-row button { font-size: 14px; }
		}
	</style>
</head>
<body>
	<div class="container">
		<h2>Requerimiento Producción</h2>
		<?php if (!empty($nombreUsuario)): ?>
			<div class="user-badge" aria-label="Usuario conectado"><?php echo htmlspecialchars($nombreUsuario); ?></div>
		<?php elseif (!empty($usuarioActual)): ?>
			<div class="user-badge" aria-label="Usuario conectado"><?php echo htmlspecialchars($usuarioActual); ?></div>
		<?php elseif (!empty($_SESSION['usuario'])): ?>
			<div class="user-badge" aria-label="Usuario conectado"><?php echo htmlspecialchars($_SESSION['usuario']); ?></div>
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
			<!-- Botón Reporte oculto temporalmente; lógica preservada para futura implementación -->
			<button type="button" id="btn-reporte" onclick="location.href='requerimientos_reporte.php'" style="display:none;">Reporte</button>
			<!-- Botón Panel: redirige al panel principal -->
			<button type="button" id="btn-panel" onclick="location.href='../../public/panel.html'">Panel</button>
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
						<select id="sucursal" disabled style="background-color:#eee;color:#555;">
							<option value="">Seleccione una sucursal</option>
							<?php foreach ($sucursales as $s): ?>
								<option value="<?php echo htmlspecialchars($s['Id']); ?>"><?php echo htmlspecialchars($s['Sucursal']); ?></option>
							<?php endforeach; ?>
						</select>
						<input type="hidden" id="sucursal_hidden" name="sucursal" value="" />


			<label for="maquina_text">Máquina</label>
			<div class="product-full">
				<input type="text" id="maquina_text" autocomplete="off" placeholder="Escribe para buscar máquina..." />
				<div id="maquina_suggestions" class="suggestions" style="display:none"></div>
			</div>
			<input type="hidden" id="maquina" name="maquina" />

			<!-- Selector de motivo reemplaza los radios -->

			<label for="producto" style="font-weight:600; display:block;">Producto</label>
			<div class="product-full">
				<input type="text" id="producto" name="producto" autocomplete="off" placeholder="Escribe para buscar producto..." />
				<div id="producto_suggestions" class="suggestions" style="display:none"></div>
			</div>
			<div class="product-grid">
				<div class="col-code">
					<label for="codigo" style="display:block;font-weight:600;">Código</label>
					<input type="text" id="codigo" name="codigo" readonly />
				</div>
				<div class="col-stock">
					<label for="stock" style="display:block;font-weight:600;">Stock(Und.)</label>
					<input type="text" id="stock" name="stock_display" readonly />
				</div>
				<div class="col-pallets">
					<label for="stock_pallets" style="display:block;font-weight:600;">Stock(Pallets)</label>
					<textarea id="stock_pallets" name="stock_pallets" readonly rows="1" style="resize:none; min-height:36px; box-sizing:border-box;"></textarea>
				</div>
				<div class="col-observ">
					<label for="observacion_producto" style="display:block;font-weight:600;">Observación</label>
					<input type="text" id="observacion_producto" name="observacion_producto" readonly />
				</div>
				<input type="hidden" id="producto_id" name="producto_id" />
				<input type="hidden" id="stock_val" name="cantidad" />
			</div>
            

			<label for="num_pallets">Cantidad Pallets</label>
			<input type="text" id="num_pallets" name="num_pallets" />

			<label for="observaciones">Observaciones</label>
		            <textarea id="observaciones" name="observaciones" rows="3" style="min-height:70px;max-width:100%;"></textarea>
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

		// Autocomplete para Máquina (usa la lista cargada en PHP)
		(function(){
			var maquinaInput = document.getElementById('maquina_text');
			var maquinaHidden = document.getElementById('maquina');
			var suggestionsBox = document.getElementById('maquina_suggestions');
			var debounceTimer = null;
			var activeIndex = -1;
			var currentSuggestions = [];
			var maquinasData = <?php echo json_encode($maquinas); ?> || [];

			function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

			function clearSuggestions(){
				currentSuggestions = [];
				activeIndex = -1;
				if (suggestionsBox) { suggestionsBox.innerHTML = ''; suggestionsBox.style.display = 'none'; }
			}

			function renderSuggestions(items){
				currentSuggestions = items;
				if (!items || items.length === 0) { clearSuggestions(); return; }
				suggestionsBox.innerHTML = '';
				items.forEach(function(it, idx){
					var div = document.createElement('div');
					div.className = 'suggestion-item';
					div.dataset.index = idx;
					div.innerHTML = '<strong>' + escapeHtml(it.MaquinaArea || '') + '</strong>';
					div.addEventListener('mousedown', function(e){ selectSuggestion(idx); setTimeout(function(){ maquinaInput.focus(); }, 10); });
					suggestionsBox.appendChild(div);
				});
				// posicionar y mostrar
				suggestionsBox.style.display = 'block';
				try {
					var parentRect = suggestionsBox.parentElement.getBoundingClientRect();
					var inputRect = maquinaInput.getBoundingClientRect();
					var left = inputRect.left - parentRect.left;
					var top = inputRect.bottom - parentRect.top + 6;
					suggestionsBox.style.position = 'absolute';
					suggestionsBox.style.transform = 'none';
					suggestionsBox.style.left = left + 'px';
					suggestionsBox.style.top = top + 'px';
					suggestionsBox.style.width = inputRect.width + 'px';
					suggestionsBox.style.zIndex = 9999;
				} catch(e){}
			}

			function selectSuggestion(idx){
				if (!currentSuggestions || !currentSuggestions[idx]) return;
				var it = currentSuggestions[idx];
				maquinaInput.value = (it.MaquinaArea || '').trim();
				if (maquinaHidden) maquinaHidden.value = it.IdMaquinaArea || '';
				// Asignar sucursal asociada (si existe) y bloquear el select
				try {
					var sucursalEl = document.getElementById('sucursal');
					if (sucursalEl) {
						var sucId = (typeof it.IdSucursal !== 'undefined' && it.IdSucursal !== null) ? String(it.IdSucursal) : '';
						var hiddenSuc = document.getElementById('sucursal_hidden');
						if (sucId !== '') {
							// seleccionar la opción si existe
							var opt = sucursalEl.querySelector('option[value="' + sucId + '"]');
							if (opt) {
								sucursalEl.value = sucId;
							} else {
								// si no existe, agregar temporalmente y seleccionar
								var newOpt = document.createElement('option');
								newOpt.value = sucId;
								newOpt.text = '(Sucursal ' + sucId + ')';
								sucursalEl.appendChild(newOpt);
								sucursalEl.value = sucId;
							}
							// bloquear y poner en gris
							sucursalEl.disabled = true;
							sucursalEl.style.backgroundColor = '#eee';
							sucursalEl.style.color = '#555';
							if (hiddenSuc) hiddenSuc.value = sucId;
						} else {
							// si la máquina no tiene sucursal, dejar el select habilitado
							sucursalEl.disabled = false;
							sucursalEl.style.backgroundColor = '';
							sucursalEl.style.color = '';
							if (hiddenSuc) hiddenSuc.value = '';
						}
					}
				} catch(e){ console.warn('No se pudo asignar sucursal automáticamente', e); }
				clearSuggestions();
			}

			function highlightActive(){
				var children = suggestionsBox.children;
				for (var i=0;i<children.length;i++){
					children[i].classList.toggle('active', i===activeIndex);
				}
			}

			function doSearch(q){
				if (!q || q.length < 2) { clearSuggestions(); return; }
				var qq = q.toLowerCase();
				var res = maquinasData.filter(function(x){ return (x.MaquinaArea || '').toLowerCase().indexOf(qq) !== -1; }).slice(0, 40);
				renderSuggestions(res);
			}

			if (maquinaInput){
				maquinaInput.addEventListener('input', function(){
					if (debounceTimer) clearTimeout(debounceTimer);
					// reset hidden id until a suggestion is selected
					if (maquinaHidden) maquinaHidden.value = '';
					// Si el usuario borra la máquina, reactivar y limpiar el select de sucursal
					try {
						var sucEl = document.getElementById('sucursal');
						if (sucEl) {
							sucEl.disabled = false;
							sucEl.style.backgroundColor = '';
							sucEl.style.color = '';
							// opcional: resetear selección
							sucEl.value = '';
						}
						try { var hiddenSuc = document.getElementById('sucursal_hidden'); if (hiddenSuc) hiddenSuc.value = ''; } catch(e) {}
					} catch(e) { }
					debounceTimer = setTimeout(function(){ doSearch(maquinaInput.value.trim()); }, 200);
				});

				maquinaInput.addEventListener('keydown', function(e){
					var key = e.key || e.keyCode;
					if (suggestionsBox.style.display === 'block'){
						if (key === 'ArrowDown' || key === 40){ e.preventDefault(); activeIndex = Math.min(activeIndex + 1, currentSuggestions.length - 1); highlightActive(); }
						else if (key === 'ArrowUp' || key === 38){ e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); highlightActive(); }
						else if (key === 'Enter' || key === 13){ e.preventDefault(); if (activeIndex >= 0) selectSuggestion(activeIndex); }
					}
				});

				document.addEventListener('click', function(e){ if (!suggestionsBox.contains(e.target) && e.target !== maquinaInput) clearSuggestions(); });
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
				// Mostrar y posicionar el dropdown justo bajo el input, alineado a su ancho
				suggestionsBox.style.display = 'block';
				try {
					var parentRect = suggestionsBox.parentElement.getBoundingClientRect();
					var inputRect = productoInput.getBoundingClientRect();
					var left = inputRect.left - parentRect.left;
					var top = inputRect.bottom - parentRect.top + 6;
					suggestionsBox.style.position = 'absolute';
					suggestionsBox.style.transform = 'none';
					suggestionsBox.style.left = left + 'px';
					suggestionsBox.style.top = top + 'px';
					suggestionsBox.style.width = inputRect.width + 'px';
					suggestionsBox.style.zIndex = 9999;
				} catch(e) { /* si falla, dejar estilos CSS por defecto */ }
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
				// asignar pallets (número de registros/pallets) si viene en la respuesta
				if (typeof it.Pallets !== 'undefined') {
					var palletsEl = document.getElementById('stock_pallets');
					if (palletsEl) palletsEl.value = String(it.Pallets).trim();
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
				var palletsEl = document.getElementById('stock_pallets');
				if (palletsEl) palletsEl.value = '';
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
						// limpiar campos para nuevo registro manteniendo NRequerimiento y fecha
						var productoInput = document.getElementById('producto');
						var productoIdInput = document.getElementById('producto_id');
						var codigoInput = document.getElementById('codigo');
						var stockDisplay = document.getElementById('stock');
						var stockVal = document.getElementById('stock_val');
						var palletsInput = document.getElementById('num_pallets');
						var stockPalletsEl = document.getElementById('stock_pallets');
						var observacionesInput = document.getElementById('observaciones');
						
						if (productoInput) productoInput.value = '';
						if (productoIdInput) productoIdInput.value = '';
						if (codigoInput) codigoInput.value = '';
						if (stockDisplay) stockDisplay.value = '';
						if (stockVal) stockVal.value = '';
						if (palletsInput) palletsInput.value = '';
						if (stockPalletsEl) stockPalletsEl.value = '';
						// Limpiar observación de producto y observaciones generales
						var obsProdInput = document.getElementById('observacion_producto');
						if (obsProdInput) obsProdInput.value = '';
						if (observacionesInput) {
							observacionesInput.value = '';
							try {
								var _ls = localStorage.getItem('swrq_form_v1');
								if (_ls) {
									var _obj = JSON.parse(_ls);
									if (_obj) {
										_obj['observaciones'] = '';
										_obj['observacion_producto'] = '';
										localStorage.setItem('swrq_form_v1', JSON.stringify(_obj));
									}
								}
							} catch(e){}
						}
						
						// NOTA: No se limpia el selector de máquina aquí para mantener la selección entre registros
						// (se preserva tanto el input oculto `maquina` como el visible `maquina_text`).
						// limpiar sucursal/almacen/motivo seleccionados
						var sucEl = document.getElementById('sucursal');
						if (sucEl) sucEl.value = '';
						try { var hiddenSuc = document.getElementById('sucursal_hidden'); if (hiddenSuc) hiddenSuc.value = ''; } catch(e) {}
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

					// Limpieza por defecto al iniciar sesión: si la página NO viene como edición
					// (no ?rq) y no hay registros previos para este RQ, aseguramos que los
					// controles estén limpios salvo N° RQ y Fecha, tal como solicita la UX.
					try {
						if (!window.__rq_from_query && !window.__rq_has_records) {
							var _fieldsToClear = ['maquina','sucursal','almacen','motivo','prioridad','producto','producto_id','codigo','stock','stock_val','stock_pallets','num_pallets','observaciones','observacion_producto','producto'];
							_fieldsToClear.forEach(function(n){
								var el = document.querySelector('[name="'+n+'"]');
								if (!el) return;
								try {
									if (el.type === 'radio' || el.type === 'checkbox') {
										// deseleccionar todos los radios/checkbox del mismo nombre
										var group = document.querySelectorAll('[name="'+n+'"]');
										group.forEach(function(g){ g.checked = false; });
									} else {
										el.value = '';
									}
								} catch(e) { try { el.value = ''; } catch(_){} }
							});
							// asegurar prioridad por defecto en 'Normal' si existe
							try { var pr = document.querySelector('input[name="prioridad"][value="Normal"]'); if (pr) pr.checked = true; } catch(e){}
							// dejar el campo fecha intacto; num_requerimiento también se preserva por diseño
						}
					} catch(e){}

			// guardar correlativo en cookie para mantenerlo entre reloads
			if (rq) setCookie('swrq_current', rq.value.replace(/^0+/, ''), 7);

			// guardar cambios del formulario en localStorage
			if (form) {
				form.addEventListener('input', function(){
					var fd = {};
					['num_requerimiento','fecha','maquina','sucursal','almacen','motivo','prioridad','producto','codigo','stock','stock_pallets','num_pallets','observaciones'].forEach(function(n){
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
						if (next !== '') window.location.href = 'requerimientos_v2.php?rq=' + next;
						else window.location.href = 'requerimientos_v2.php';
					} catch(e){ window.location.href = 'requerimientos_v2.php'; }
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
					if (next !== '') window.location.href = 'requerimientos_v2.php?rq=' + next;
					else window.location.href = 'requerimientos_v2.php';
				} catch(e){ window.location.href = 'requerimientos_v2.php'; }
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
					window.location.href = 'requerimientos_v2.php';
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
