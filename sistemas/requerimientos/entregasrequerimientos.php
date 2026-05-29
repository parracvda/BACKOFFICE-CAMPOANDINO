<?php
// entregasrequerimientos.php - interfaz para montacarguistas: entregar materiales aprobados
include '../../shared/conexion.php';
if (session_status() === PHP_SESSION_NONE) session_start();

// Acceso: por ahora permitimos a cualquier usuario logueado. Cuando informes nombres de montacarguistas, podemos restringir aquí.
if (empty($_SESSION['usuario'])) {
    header('Location: index.html');
    exit;
}

// Manejo POST para marcar como entregado (por Id o por RQ)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    $action = $_POST['action'] ?? '';

    // Comprobar posibles columnas para entregar
    $hasEstadoEntrega = false; $hasEntregadoPor = false; $hasEntregadoAt = false;
    try {
        $r1 = $conn->query("SHOW COLUMNS FROM scm_requerimientosproduccion LIKE 'EstadoEntrega'"); if ($r1 && $r1->num_rows>0) $hasEstadoEntrega = true;
        $r2 = $conn->query("SHOW COLUMNS FROM scm_requerimientosproduccion LIKE 'EntregadoPor'"); if ($r2 && $r2->num_rows>0) $hasEntregadoPor = true;
        $r3 = $conn->query("SHOW COLUMNS FROM scm_requerimientosproduccion LIKE 'EntregadoAt'"); if ($r3 && $r3->num_rows>0) $hasEntregadoAt = true;
    } catch (Exception $e) {}

    if ($action === 'deliver_rq') {
        $nreq = isset($_POST['nrequerimiento']) ? intval($_POST['nrequerimiento']) : 0;
        if ($nreq <= 0) { echo json_encode(['success'=>false,'error'=>'NRequerimiento inválido']); exit; }

        if ($hasEstadoEntrega) {
            $sql = "UPDATE scm_requerimientosproduccion SET EstadoEntrega = 'Entregado'";
            $params = [];
            if ($hasEntregadoPor) { $sql .= ", EntregadoPor = ?"; $params[] = isset($_SESSION['usuarionombre']) ? $_SESSION['usuarionombre'] : null; }
            if ($hasEntregadoAt) { $sql .= ", EntregadoAt = ?"; $params[] = date('Y-m-d H:i:s'); }
            $sql .= " WHERE NRequerimiento = ? AND (EstadoEntrega IS NULL OR EstadoEntrega <> 'Entregado')";
        } else {
            // fallback: marcar EstadoAprobacion como 'Entregado' si no existe columna EstadoEntrega
            $sql = "UPDATE scm_requerimientosproduccion SET EstadoAprobacion = 'Entregado'";
            $params = [];
            $sql .= " WHERE NRequerimiento = ? AND EstadoAprobacion = 'Aprobado'";
        }

        $stmt = $conn->prepare($sql);
        if (!$stmt) { echo json_encode(['success'=>false,'error'=>$conn->error]); exit; }
        if (!empty($params)) {
            $types = str_repeat('s', count($params)) . 'i';
            $bind = array_merge([$types], $params, [$nreq]);
            $tmp = [];
            foreach ($bind as $k => $v) $tmp[$k] = &$bind[$k];
            call_user_func_array([$stmt,'bind_param'],$tmp);
        } else {
            $stmt->bind_param('i', $nreq);
        }
        if ($stmt->execute()) {
            echo json_encode(['success'=>true,'affected'=>$stmt->affected_rows,'nrequerimiento'=>$nreq]); exit;
        } else { echo json_encode(['success'=>false,'error'=>$stmt->error]); exit; }
    }

    if ($action === 'deliver') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        if ($id <= 0) { echo json_encode(['success'=>false,'error'=>'Id inválido']); exit; }
        
        $cantidadEntregar = isset($_POST['cantidad']) ? intval($_POST['cantidad']) : 0;
        
        // Verificar si existe la columna NPalletsEntregados
        $hasNPalletsEntregados = false;
        try {
            $r = $conn->query("SHOW COLUMNS FROM scm_requerimientosproduccion LIKE 'NPalletsEntregados'");
            if ($r && $r->num_rows > 0) $hasNPalletsEntregados = true;
        } catch (Exception $e) {}
        
        // Si no se especifica cantidad, entregar todo (comportamiento anterior)
        if ($cantidadEntregar <= 0) {
            if ($hasEstadoEntrega) {
                $sql = "UPDATE scm_requerimientosproduccion SET EstadoEntrega = 'Entregado'";
                $params = [];
                if ($hasEntregadoPor) { $sql .= ", EntregadoPor = ?"; $params[] = isset($_SESSION['usuarionombre']) ? $_SESSION['usuarionombre'] : null; }
                if ($hasEntregadoAt) { $sql .= ", EntregadoAt = ?"; $params[] = date('Y-m-d H:i:s'); }
                $sql .= " WHERE Id = ? LIMIT 1";
            } else {
                $sql = "UPDATE scm_requerimientosproduccion SET EstadoAprobacion = 'Entregado' WHERE Id = ? LIMIT 1";
                $params = [];
            }

            $stmt = $conn->prepare($sql);
            if (!$stmt) { echo json_encode(['success'=>false,'error'=>$conn->error]); exit; }
            if (!empty($params)) {
                $types = str_repeat('s', count($params)) . 'i';
                $bind = array_merge([$types], $params, [$id]);
                $tmp = [];
                foreach ($bind as $k => $v) $tmp[$k] = &$bind[$k];
                call_user_func_array([$stmt,'bind_param'],$tmp);
            } else {
                $stmt->bind_param('i', $id);
            }
            if ($stmt->execute()) { echo json_encode(['success'=>true,'entregaCompleta'=>true]); exit; }
            else { echo json_encode(['success'=>false,'error'=>$stmt->error]); exit; }
        } else {
            // Entrega parcial: usar NPalletsEntregados si existe
            // Primero obtenemos la cantidad total y la cantidad ya entregada
            $sqlGet = $hasNPalletsEntregados 
                ? "SELECT NPallets, COALESCE(NPalletsEntregados, 0) as NPalletsEntregados FROM scm_requerimientosproduccion WHERE Id = ?"
                : "SELECT NPallets FROM scm_requerimientosproduccion WHERE Id = ?";
            $stmtGet = $conn->prepare($sqlGet);
            if (!$stmtGet) { echo json_encode(['success'=>false,'error'=>$conn->error]); exit; }
            $stmtGet->bind_param('i', $id);
            $stmtGet->execute();
            $resultGet = $stmtGet->get_result();
            if ($resultGet->num_rows === 0) { echo json_encode(['success'=>false,'error'=>'Registro no encontrado']); exit; }
            $row = $resultGet->fetch_assoc();
            $cantidadTotal = intval($row['NPallets']);
            $cantidadYaEntregada = $hasNPalletsEntregados ? intval($row['NPalletsEntregados']) : 0;
            $stmtGet->close();
            
            $cantidadPendiente = $cantidadTotal - $cantidadYaEntregada;
            
            if ($cantidadEntregar > $cantidadPendiente) {
                echo json_encode(['success'=>false,'error'=>'La cantidad a entregar excede la cantidad pendiente']);
                exit;
            }
            
            $nuevaCantidadEntregada = $cantidadYaEntregada + $cantidadEntregar;
            $nuevaCantidadPendiente = $cantidadTotal - $nuevaCantidadEntregada;
            
            if ($nuevaCantidadPendiente <= 0) {
                // Si se entrega todo, marcar como entregado
                if ($hasNPalletsEntregados) {
                    // Usar NPalletsEntregados
                    if ($hasEstadoEntrega) {
                        $sql = "UPDATE scm_requerimientosproduccion SET EstadoEntrega = 'Entregado', NPalletsEntregados = ?";
                        $params = [$nuevaCantidadEntregada];
                        if ($hasEntregadoPor) { $sql .= ", EntregadoPor = ?"; $params[] = isset($_SESSION['usuarionombre']) ? $_SESSION['usuarionombre'] : null; }
                        if ($hasEntregadoAt) { $sql .= ", EntregadoAt = ?"; $params[] = date('Y-m-d H:i:s'); }
                        $sql .= " WHERE Id = ?";
                    } else {
                        $sql = "UPDATE scm_requerimientosproduccion SET EstadoAprobacion = 'Entregado', NPalletsEntregados = ? WHERE Id = ?";
                        $params = [$nuevaCantidadEntregada];
                    }
                    
                    $stmt = $conn->prepare($sql);
                    if (!$stmt) { echo json_encode(['success'=>false,'error'=>$conn->error]); exit; }
                    if ($hasEstadoEntrega && !empty($params)) {
                        $types = 'i' . str_repeat('s', count($params) - 1) . 'i';
                        $bind = array_merge([$types], $params, [$id]);
                        $tmp = [];
                        foreach ($bind as $k => $v) $tmp[$k] = &$bind[$k];
                        call_user_func_array([$stmt,'bind_param'],$tmp);
                    } else {
                        $stmt->bind_param('ii', $nuevaCantidadEntregada, $id);
                    }
                } else {
                    // Fallback: usar NPallets
                    if ($hasEstadoEntrega) {
                        $sql = "UPDATE scm_requerimientosproduccion SET EstadoEntrega = 'Entregado', NPallets = 0";
                        $params = [];
                        if ($hasEntregadoPor) { $sql .= ", EntregadoPor = ?"; $params[] = isset($_SESSION['usuarionombre']) ? $_SESSION['usuarionombre'] : null; }
                        if ($hasEntregadoAt) { $sql .= ", EntregadoAt = ?"; $params[] = date('Y-m-d H:i:s'); }
                        $sql .= " WHERE Id = ?";
                    } else {
                        $sql = "UPDATE scm_requerimientosproduccion SET EstadoAprobacion = 'Entregado', NPallets = 0 WHERE Id = ?";
                        $params = [];
                    }
                    
                    $stmt = $conn->prepare($sql);
                    if (!$stmt) { echo json_encode(['success'=>false,'error'=>$conn->error]); exit; }
                    if (!empty($params)) {
                        $types = str_repeat('s', count($params)) . 'i';
                        $bind = array_merge([$types], $params, [$id]);
                        $tmp = [];
                        foreach ($bind as $k => $v) $tmp[$k] = &$bind[$k];
                        call_user_func_array([$stmt,'bind_param'],$tmp);
                    } else {
                        $stmt->bind_param('i', $id);
                    }
                }
                
                if ($stmt->execute()) { 
                    echo json_encode(['success'=>true,'entregaCompleta'=>true,'cantidadEntregada'=>$cantidadEntregar]); 
                    exit; 
                } else { 
                    echo json_encode(['success'=>false,'error'=>$stmt->error]); 
                    exit; 
                }
            } else {
                // Entrega parcial: actualizar la cantidad entregada
                if ($hasNPalletsEntregados) {
                    $sqlUpdate = "UPDATE scm_requerimientosproduccion SET NPalletsEntregados = ? WHERE Id = ?";
                    $stmtUpdate = $conn->prepare($sqlUpdate);
                    if (!$stmtUpdate) { echo json_encode(['success'=>false,'error'=>$conn->error]); exit; }
                    $stmtUpdate->bind_param('ii', $nuevaCantidadEntregada, $id);
                } else {
                    // Fallback: restar de NPallets
                    $nuevaCantidad = $cantidadTotal - $cantidadEntregar;
                    $sqlUpdate = "UPDATE scm_requerimientosproduccion SET NPallets = ? WHERE Id = ?";
                    $stmtUpdate = $conn->prepare($sqlUpdate);
                    if (!$stmtUpdate) { echo json_encode(['success'=>false,'error'=>$conn->error]); exit; }
                    $stmtUpdate->bind_param('ii', $nuevaCantidad, $id);
                }
                
                if ($stmtUpdate->execute()) {
                    echo json_encode([
                        'success'=>true,
                        'entregaCompleta'=>false,
                        'cantidadEntregada'=>$cantidadEntregar,
                        'cantidadRestante'=>$nuevaCantidadPendiente
                    ]);
                    exit;
                } else {
                    echo json_encode(['success'=>false,'error'=>$stmtUpdate->error]);
                    exit;
                }
            }
        }
    }

    echo json_encode(['success'=>false,'error'=>'Acción no soportada']);
    exit;
}

// Página GET: listar registros aprobados (pendientes de entrega)
$hasEstado = false;
try { $r = $conn->query("SHOW COLUMNS FROM scm_requerimientosproduccion LIKE 'EstadoAprobacion'"); if ($r && $r->num_rows>0) $hasEstado = true; } catch (Exception $e) {}

// Endpoint auxiliar: si piden cargar items por RQ vía AJAX
if (isset($_GET['load_items']) && isset($_GET['rq'])) {
    $rqId = intval($_GET['rq']);
    $out = [];
    if ($rqId > 0) {
        $sqlIt = "SELECT Id, Prioridad, Maquina, Codigo, Producto, NPallets FROM scm_requerimientosproduccion WHERE NRequerimiento = ? ORDER BY Id DESC";
        $stmtIt = $conn->prepare($sqlIt);
        if ($stmtIt) {
            $stmtIt->bind_param('i', $rqId);
            $stmtIt->execute();
            $resIt = $stmtIt->get_result();
            while ($row = $resIt->fetch_assoc()) $out[] = $row;
            $stmtIt->close();
        }
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($out);
    exit;
}

$isMonta = false;
// Detectar si el usuario actual es montacarguista (varias formas de la sesión)
if (!empty($_SESSION['tipousuario']) && stripos($_SESSION['tipousuario'],'montacarguista') !== false) $isMonta = true;
if (!$isMonta && !empty($_SESSION['TipoUsuario']) && stripos($_SESSION['TipoUsuario'],'montacarguista') !== false) $isMonta = true;

// Buscar posible columna de asignación en la tabla
$assignCol = null;
$possible = ['AsignadoA','Despachador','AsignadoUsuario','UsuarioAsignado','Asignado_por'];
try {
    foreach ($possible as $c) {
        $rcol = $conn->query("SHOW COLUMNS FROM scm_requerimientosproduccion LIKE '" . $conn->real_escape_string($c) . "'");
        if ($rcol && $rcol->num_rows>0) { $assignCol = $c; break; }
    }
} catch (Exception $e) { }

// Verificar si existe NPalletsEntregados para calcular pendientes
$hasNPalletsEntregados = false;
try {
    $r = $conn->query("SHOW COLUMNS FROM scm_requerimientosproduccion LIKE 'NPalletsEntregados'");
    if ($r && $r->num_rows > 0) $hasNPalletsEntregados = true;
} catch (Exception $e) {}

// Construir consulta: si es montacarguista y existe columna de asignación, filtrar por usuario asignado
if ($hasNPalletsEntregados) {
    $sql = "SELECT Id, NRequerimiento, Fecha, Maquina, Zona, Motivo, Prioridad, Producto, Codigo, NPallets, COALESCE(NPalletsEntregados, 0) as NPalletsEntregados, (NPallets - COALESCE(NPalletsEntregados, 0)) as NPalletsPendientes, Observaciones FROM scm_requerimientosproduccion WHERE EstadoAprobacion = 'Aprobado'";
} else {
    $sql = "SELECT Id, NRequerimiento, Fecha, Maquina, Zona, Motivo, Prioridad, Producto, Codigo, NPallets, Observaciones FROM scm_requerimientosproduccion WHERE EstadoAprobacion = 'Aprobado'";
}
if ($isMonta && $assignCol && !empty($_SESSION['usuario'])) {
    $userEsc = $conn->real_escape_string($_SESSION['usuario']);
    $sql .= " AND `" . $assignCol . "` = '" . $userEsc . "'";
}
$sql .= " ORDER BY NRequerimiento DESC, Id DESC";
$res = $conn->query($sql);
$rows = [];
if ($res && $res->num_rows > 0) {
    while ($r = $res->fetch_assoc()) $rows[] = $r;
}

// Agrupar por NRequerimiento (filtrar los que ya no tienen pallets pendientes)
$groups = [];
foreach ($rows as $r) {
    // Si existe NPalletsPendientes, solo incluir si es mayor a 0
    $palletsPendientes = isset($r['NPalletsPendientes']) ? intval($r['NPalletsPendientes']) : intval($r['NPallets']);
    if ($palletsPendientes <= 0) continue; // Saltar materiales ya entregados completamente
    
    $nr = isset($r['NRequerimiento']) ? intval($r['NRequerimiento']) : 0;
    if (!isset($groups[$nr])) {
        $groups[$nr] = [
            'nrequerimiento' => $nr,
            'count' => 0,
            'items' => [],
            'fecha' => $r['Fecha'] ?? '',
            'maquina' => $r['Maquina'] ?? '',
            'priority' => 'Normal',
        ];
    }
    $groups[$nr]['items'][] = $r;
    $groups[$nr]['count']++;
    if (isset($r['Prioridad']) && strcasecmp(trim((string)$r['Prioridad']), 'Alta') === 0) {
        $groups[$nr]['priority'] = 'Alta';
    }
}

?><!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>Entregas de Requerimientos</title>
<style>
    * { box-sizing: border-box; }
    body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:10px;background:#f5f7fa}
    .container{max-width:1100px;margin:0 auto;background:#fff;padding:12px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
    .rq-group { margin-bottom:14px; border-radius:10px; border:1px solid rgba(11,66,130,0.10); overflow:hidden; box-shadow:0 6px 20px rgba(11,66,130,0.04); }
    .rq-group-header { padding:12px 14px; background: linear-gradient(180deg,#f6fbff,#eef6ff); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; }
    .rq-group-body { display:none; padding:12px; background:#fff }
    .prio { font-weight:700; display:inline-block; padding:6px 10px; border-radius:999px; font-size:13px }
    .prio-alta { background: rgba(211,47,47,0.12); color: #d32f2f; }
    .prio-baja, .prio-normal { background: rgba(46,125,50,0.12); color: #2e7d32; }
    .btn-deliver { background: linear-gradient(90deg,#0d6efd,#0b5ed7); color:#fff; border-radius:8px; padding:10px 16px; border:0; box-shadow:0 6px 14px rgba(13,110,253,0.08); font-weight:700; cursor:pointer; font-size:14px; min-height:44px; }
    .btn-deliver:active { transform: scale(0.98); }
    .rq-group .btn-expand {
        background: #ffffff;
        border: 1px solid rgba(11,42,74,0.08);
        color: #0b5ed7;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 700;
        box-shadow: 0 6px 14px rgba(11,78,160,0.04);
        transition: background 180ms ease, transform 120ms ease, color 160ms ease;
        font-size:14px;
        min-height:44px;
    }
    .rq-group .btn-expand:hover { background: rgba(11,94,217,0.04); transform: translateY(-2px); }
    .rq-group .btn-expand:active { transform: scale(0.98); }
    .rq-group .btn-expand:focus { outline: 3px solid rgba(11,94,217,0.12); }
    .rq-group .btn-expand[aria-expanded="true"] { background: linear-gradient(90deg,#0d6efd,#0b5ed7); color:#fff; border-color: transparent; box-shadow: 0 8px 20px rgba(11,78,160,0.12); }
    table.apb-grid { width:100%; border-collapse:collapse }
    table.apb-grid thead th { background:#f5f7fb; padding:10px; text-align:left; font-size:13px; }
    table.apb-grid tbody td { padding:10px; border-bottom:1px solid rgba(15,23,42,0.04); font-size:14px; }
    .input-cantidad { width:70px; padding:8px; border:1px solid #ddd; border-radius:6px; text-align:center; font-size:16px; min-height:44px; }
    /* Logout button (visible, attention color) */
    .btn-logout { background: linear-gradient(90deg,#ef4444,#d32f2f); color:#fff; border-radius:8px; padding:8px 12px; border:0; box-shadow:0 6px 14px rgba(211,47,47,0.12); font-weight:700; cursor:pointer; font-size:14px; min-height:44px; }
    .btn-logout:hover { transform: translateY(-1px); opacity:0.96 }
    .btn-logout:active { transform: scale(0.98); }
    /* Notifications (toasts) */
    .notif-container { position: fixed; left: 50%; top: 18%; transform: translateX(-50%); z-index: 14000; display:flex; flex-direction:column; gap:10px; align-items:center; max-width:90%; }
    .notif { min-width:220px; max-width:360px; padding:12px 16px; border-radius:6px; color:#fff; box-shadow:0 6px 18px rgba(0,0,0,0.12); font-weight:600; opacity:0.98; font-size:14px; }
    .notif-success { background: #2e7d32; }
    .notif-error { background: #d32f2f; }
    
    /* Mobile Card Layout */
    .mobile-card { display:none; }
    
    /* RESPONSIVE STYLES FOR MOBILE */
    @media screen and (max-width: 768px) {
        body { padding:8px; font-size:14px; }
        .container { padding:8px; border-radius:8px; }
        
        header h2 { font-size:18px !important; }
        header > div:first-child > div { font-size:12px !important; }
        
        .rq-group-header { padding:10px; flex-direction:column; align-items:stretch; }
        .rq-group-header > div:first-child { width:100%; margin-bottom:8px; flex-wrap:wrap; }
        .rq-group-header > div:last-child { width:100%; display:flex; gap:8px; }
        .rq-group-header > div:last-child button { flex:1; }
        
        /* Hide table, show cards on mobile */
        table.apb-grid { display:none; }
        .mobile-card { display:block; }
        
        .item-card {
            background: #fafbfc;
            border: 1px solid rgba(15,23,42,0.08);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 12px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        }
        
        .item-card-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid rgba(15,23,42,0.04);
        }
        
        .item-card-row:last-child { border-bottom: none; }
        
        .item-card-label {
            font-weight: 600;
            color: #556;
            font-size: 13px;
        }
        
        .item-card-value {
            font-weight: 500;
            color: #0f1724;
            text-align: right;
            font-size: 14px;
        }
        
        .item-card-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
            align-items: center;
        }
        
        .item-card-actions .input-cantidad {
            flex: 0 0 80px;
            font-size: 16px;
        }
        
        .item-card-actions .btn-deliver {
            flex: 1;
            font-size: 15px;
            padding: 12px;
        }
        
        .btn-deliver { font-size:15px; padding:12px 16px; }
        .btn-logout { font-size:14px; padding:10px 14px; }
        .prio { font-size:11px; padding:4px 8px; }
        
        .notif-container { top: 10px; max-width:calc(100% - 16px); }
        .notif { min-width:auto; width:100%; font-size:13px; }
    }
    
    @media screen and (max-width: 480px) {
        body { padding:4px; }
        .container { padding:6px; }
        header h2 { font-size:16px !important; }
        .rq-group-header { padding:8px; }
        .item-card { padding:10px; }
    }
</style>
</head>
<body>
<div class="container">
    <header style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px">
        <div>
            <h2 style="margin:0;font-size:20px;color:#0f1724">Entregas de Requerimientos</h2>
            <div style="color:#556; font-size:13px; margin-top:6px">Requerimientos pendientes por entregar. Usuario: <strong style="color:#0b2a4a"><?php echo isset($_SESSION['usuarionombre'])?htmlspecialchars($_SESSION['usuarionombre']):'(no identificado)'; ?></strong></div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
            <button class="btn-logout" onclick="var baseUrl = window.location.pathname.includes('/BACKOFFICE/') ? '/BACKOFFICE' : ''; location.href = baseUrl + '/logout.php';">Cerrar sesión</button>
        </div>
    </header>

    <div class="table-wrap">
        <?php if (empty($groups)): ?>
            <div style="text-align:center;padding:18px;background:#f8f9fa;color:#666;border-radius:8px">No hay requerimientos pendientes por entregar.</div>
        <?php else: ?>
            <?php foreach ($groups as $grp): ?>
                <div class="rq-group" data-nrq="<?php echo intval($grp['nrequerimiento']); ?>">
                    <div class="rq-group-header">
                        <div style="display:flex;gap:14px;align-items:center">
                            <div style="font-weight:700;color:#0f1724">RQ <?php echo htmlspecialchars(str_pad((string)$grp['nrequerimiento'],5,'0',STR_PAD_LEFT)); ?></div>
                            <div style="color:#556;font-size:13px"><?php echo htmlspecialchars((!empty($grp['fecha']) && strtotime($grp['fecha'])) ? date('d-m-Y', strtotime($grp['fecha'])) : $grp['fecha']); ?></div>
                            <!-- Máquina eliminada del encabezado porque figura en cada material al desplegar -->
                            <div style="display:inline-block;background:#eef2ff;color:#0b5ed7;padding:6px 10px;border-radius:999px;font-weight:700"><?php echo intval($grp['count']); ?> ítems</div>
                            <?php $gprio = isset($grp['priority']) ? $grp['priority'] : 'Normal'; $gcls = (strcasecmp($gprio,'Alta')===0) ? 'prio prio-alta' : 'prio prio-normal'; ?>
                            <div style="margin-left:8px"><span class="<?php echo $gcls; ?>" style="font-size:12px;padding:6px 10px;border-radius:999px"><?php echo htmlspecialchars(strtoupper($gprio)); ?></span></div>
                        </div>
                        <div style="display:flex;gap:8px;align-items:center">
                            <button class="btn-expand" data-nrq="<?php echo intval($grp['nrequerimiento']); ?>" aria-expanded="false">Ver</button>
                            <button class="btn-deliver" data-nrq="<?php echo intval($grp['nrequerimiento']); ?>">Entregar RQ</button>
                        </div>
                    </div>
                    <div class="rq-group-body">
                        <!-- Desktop Table View -->
                        <table class="apb-grid" style="width:100%;border-collapse:collapse">
                            <thead>
                                <tr>
                                    <th>Prioridad</th>
                                    <th>Maquina</th>
                                    <th>Codigo</th>
                                    <th>Producto</th>
                                    <th>Total Pallets</th>
                                    <th>Cant. a Entregar</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                            <?php foreach ($grp['items'] as $r): ?>
                                <?php 
                                    $p = isset($r['Prioridad']) ? trim($r['Prioridad']) : ''; 
                                    $cls = (strcasecmp($p,'Alta')===0)?'prio-alta':'prio-normal';
                                    $palletsPendientes = isset($r['NPalletsPendientes']) ? intval($r['NPalletsPendientes']) : intval($r['NPallets']);
                                ?>
                                <tr data-id="<?php echo intval($r['Id']); ?>" data-npallets="<?php echo $palletsPendientes; ?>">
                                    <td><span class="prio <?php echo $cls; ?>"><?php echo htmlspecialchars($p); ?></span></td>
                                    <td><?php echo htmlspecialchars($r['Maquina']); ?></td>
                                    <td><?php echo htmlspecialchars($r['Codigo']); ?></td>
                                    <td><?php echo htmlspecialchars($r['Producto']); ?></td>
                                    <td style="text-align:center" class="total-pallets"><?php echo $palletsPendientes; ?></td>
                                    <td style="text-align:center"><input type="number" class="input-cantidad" min="1" max="<?php echo $palletsPendientes; ?>" value="<?php echo $palletsPendientes; ?>"></td>
                                    <td style="text-align:center"><button class="btn-deliver" data-id="<?php echo intval($r['Id']); ?>">Entregar</button></td>
                                </tr>
                            <?php endforeach; ?>
                            </tbody>
                        </table>
                        
                        <!-- Mobile Card View -->
                        <div class="mobile-card">
                            <?php foreach ($grp['items'] as $r): ?>
                                <?php 
                                    $p = isset($r['Prioridad']) ? trim($r['Prioridad']) : ''; 
                                    $cls = (strcasecmp($p,'Alta')===0)?'prio-alta':'prio-normal';
                                    $palletsPendientes = isset($r['NPalletsPendientes']) ? intval($r['NPalletsPendientes']) : intval($r['NPallets']);
                                ?>
                                <div class="item-card" data-id="<?php echo intval($r['Id']); ?>" data-npallets="<?php echo $palletsPendientes; ?>">
                                    <div class="item-card-row">
                                        <span class="item-card-label">Prioridad</span>
                                        <span class="item-card-value"><span class="prio <?php echo $cls; ?>"><?php echo htmlspecialchars($p); ?></span></span>
                                    </div>
                                    <div class="item-card-row">
                                        <span class="item-card-label">Máquina</span>
                                        <span class="item-card-value"><?php echo htmlspecialchars($r['Maquina']); ?></span>
                                    </div>
                                    <div class="item-card-row">
                                        <span class="item-card-label">Código</span>
                                        <span class="item-card-value"><?php echo htmlspecialchars($r['Codigo']); ?></span>
                                    </div>
                                    <div class="item-card-row">
                                        <span class="item-card-label">Producto</span>
                                        <span class="item-card-value"><?php echo htmlspecialchars($r['Producto']); ?></span>
                                    </div>
                                    <div class="item-card-row">
                                        <span class="item-card-label">Pallets Pendientes</span>
                                        <span class="item-card-value total-pallets"><?php echo $palletsPendientes; ?></span>
                                    </div>
                                    <div class="item-card-actions">
                                        <input type="number" class="input-cantidad" min="1" max="<?php echo $palletsPendientes; ?>" value="<?php echo $palletsPendientes; ?>" placeholder="Cantidad">
                                        <button class="btn-deliver" data-id="<?php echo intval($r['Id']); ?>">Entregar</button>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>

<!-- Modal confirm similar al de aprobaciones -->
<div id="confirmModal" class="modal-backdrop" style="display:none" aria-hidden="true">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="confirmModalTitle">
        <h3 id="confirmModalTitle">Confirmación</h3>
        <div class="modal-body" id="confirmModalMessage">¿Confirmar?</div>
        <div class="modal-actions">
            <button type="button" class="btn btn-cancel" id="confirmModalCancel">Cancelar</button>
            <button type="button" class="btn btn-confirm" id="confirmModalOk">Entregar</button>
        </div>
    </div>
</div>

<script>
// Notificaciones
(function(){
    var container = document.createElement('div');
    container.className = 'notif-container';
    document.body.appendChild(container);

    window.showNotification = function(message, type, timeout){
        timeout = timeout || 3000;
        var el = document.createElement('div');
        el.className = 'notif ' + (type === 'error' ? 'notif-error' : 'notif-success');
        el.textContent = message;
        container.appendChild(el);
        el.style.transform = 'translateY(-6px)'; el.style.opacity = '0';
        requestAnimationFrame(function(){
            el.style.transition = 'transform 220ms ease, opacity 220ms ease';
            el.style.transform = 'translateY(0)'; el.style.opacity = '1';
        });
        setTimeout(function(){
            el.style.transform = 'translateY(-8px)'; el.style.opacity = '0';
            setTimeout(function(){ el.remove(); }, 260);
        }, timeout);
    };
})();

// Modal confirm
window.showConfirm = function(message){
    return new Promise(function(resolve){
        var modal = document.getElementById('confirmModal');
        var msg = document.getElementById('confirmModalMessage');
        var btnOk = document.getElementById('confirmModalOk');
        var btnCancel = document.getElementById('confirmModalCancel');
        if (!modal || !msg || !btnOk || !btnCancel) { resolve(confirm(message)); return; }

        var previouslyFocused = document.activeElement;
        msg.textContent = message;
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden','false');
        btnOk.focus();

        function cleanup(){
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden','true');
            btnOk.removeEventListener('click', onOk);
            btnCancel.removeEventListener('click', onCancel);
            document.removeEventListener('keydown', onKey);
            try{ if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus(); }catch(e){}
        }
        function onOk(){ cleanup(); resolve(true); }
        function onCancel(){ cleanup(); resolve(false); }
        function onKey(ev){ if (ev.key === 'Escape') { ev.preventDefault(); onCancel(); } if (ev.key === 'Enter') { ev.preventDefault(); onOk(); } }

        btnOk.addEventListener('click', onOk);
        btnCancel.addEventListener('click', onCancel);
        document.addEventListener('keydown', onKey);
    });
};

// Toggle expand groups and handle delivers
document.addEventListener('click', function(e){
    if (!e.target) return;

    // Expand group
    if (e.target.classList && e.target.classList.contains('btn-expand')) {
        var btn = e.target;
        var grpEl = btn.closest('.rq-group'); if (!grpEl) return;
        var body = grpEl.querySelector('.rq-group-body');
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        if (expanded) { body.style.display = 'none'; btn.setAttribute('aria-expanded','false'); btn.textContent = 'Ver'; return; }

        var tbody = body.querySelector('tbody');
        if (tbody && tbody.querySelectorAll('tr').length > 0) { body.style.display = 'block'; btn.setAttribute('aria-expanded','true'); btn.textContent = 'Ocultar'; return; }

        var nrq = btn.getAttribute('data-nrq') || grpEl.getAttribute('data-nrq');
        if (!nrq) { body.style.display = 'block'; btn.setAttribute('aria-expanded','true'); btn.textContent = 'Ocultar'; return; }

        console.log('[entregas] cargando items para RQ', nrq);
        fetch(window.location.pathname + '?load_items=1&rq=' + encodeURIComponent(nrq))
            .then(function(res){ return res.json(); })
            .then(function(data){
                if (!Array.isArray(data) || data.length === 0) { body.style.display = 'block'; btn.setAttribute('aria-expanded','true'); btn.textContent = 'Ocultar'; return; }
                if (!tbody) { tbody = document.createElement('tbody'); body.querySelector('table') && body.querySelector('table').appendChild(tbody); }
                
                var mobileContainer = body.querySelector('.mobile-card');
                
                data.forEach(function(it){
                    var pcls = (it.Prioridad && it.Prioridad.toLowerCase() === 'alta') ? 'prio prio-alta' : 'prio prio-normal';
                    var npallets = parseInt(it.NPallets) || 0;
                    
                    // Add to table (desktop)
                    var tr = document.createElement('tr');
                    tr.setAttribute('data-id', it.Id || '');
                    tr.setAttribute('data-npallets', npallets);
                    tr.innerHTML = '<td><span class="' + pcls + '">' + (it.Prioridad || '') + '</span></td>' +
                                   '<td>' + (it.Maquina || '') + '</td>' +
                                   '<td>' + (it.Codigo || '') + '</td>' +
                                   '<td>' + (it.Producto || '') + '</td>' +
                                   '<td style="text-align:center" class="total-pallets">' + npallets + '</td>' +
                                   '<td style="text-align:center"><input type="number" class="input-cantidad" min="1" max="' + npallets + '" value="' + npallets + '"></td>' +
                                   '<td style="text-align:center"><button class="btn-deliver" data-id="' + (it.Id||'') + '">Entregar</button></td>';
                    tbody.appendChild(tr);
                    
                    // Add to mobile cards
                    if (mobileContainer) {
                        var card = document.createElement('div');
                        card.className = 'item-card';
                        card.setAttribute('data-id', it.Id || '');
                        card.setAttribute('data-npallets', npallets);
                        card.innerHTML = '<div class="item-card-row"><span class="item-card-label">Prioridad</span><span class="item-card-value"><span class="' + pcls + '">' + (it.Prioridad || '') + '</span></span></div>' +
                                        '<div class="item-card-row"><span class="item-card-label">Máquina</span><span class="item-card-value">' + (it.Maquina || '') + '</span></div>' +
                                        '<div class="item-card-row"><span class="item-card-label">Código</span><span class="item-card-value">' + (it.Codigo || '') + '</span></div>' +
                                        '<div class="item-card-row"><span class="item-card-label">Producto</span><span class="item-card-value">' + (it.Producto || '') + '</span></div>' +
                                        '<div class="item-card-row"><span class="item-card-label">Total Pallets</span><span class="item-card-value total-pallets">' + npallets + '</span></div>' +
                                        '<div class="item-card-actions"><input type="number" class="input-cantidad" min="1" max="' + npallets + '" value="' + npallets + '" placeholder="Cantidad"><button class="btn-deliver" data-id="' + (it.Id||'') + '">Entregar</button></div>';
                        mobileContainer.appendChild(card);
                    }
                });
                body.style.display = 'block'; btn.setAttribute('aria-expanded','true'); btn.textContent = 'Ocultar';
            })
            .catch(function(err){ console.error('Error cargando items RQ', nrq, err); body.style.display = 'block'; btn.setAttribute('aria-expanded','true'); btn.textContent = 'Ocultar'; });
        return;
    }

    // Deliver actions (group or single)
    if (e.target.classList && e.target.classList.contains('btn-deliver')) {
        var nrq = e.target.getAttribute('data-nrq');
        if (nrq) {
            showConfirm('¿Marcar como ENTREGADO todos los ítems del RQ ' + String(nrq).padStart(5,'0') + '?')
            .then(function(ok){
                if (!ok) return;
                var fd = new FormData(); fd.append('action','deliver_rq'); fd.append('nrequerimiento', nrq);
                return fetch(window.location.pathname, { method:'POST', headers:{ 'X-Requested-With':'XMLHttpRequest' }, body: fd });
            })
            .then(function(resp){ if (!resp) return; return resp.json(); })
            .then(function(json){
                if (json && json.success) { var grp = document.querySelector('.rq-group[data-nrq="' + nrq + '"]'); if (grp) grp.remove(); showNotification('RQ ' + String(nrq).padStart(5,'0') + ' marcado como entregado', 'success', 3000); }
                else { showNotification('Error: ' + (json && json.error ? json.error : 'Respuesta inválida'), 'error', 3500); }
            })
            .catch(function(){ showNotification('Error de red al entregar', 'error', 3500); });
            return;
        }

        var id = e.target.getAttribute('data-id');
        if (id) {
            var tr = document.querySelector('tr[data-id="' + id + '"]');
            var card = document.querySelector('.item-card[data-id="' + id + '"]');
            var container = tr || card;
            if (!container) return;
            
            var inputCantidad = container.querySelector('.input-cantidad');
            var cantidadEntregar = inputCantidad ? parseInt(inputCantidad.value) : 0;
            var totalPallets = parseInt(container.getAttribute('data-npallets')) || 0;
            
            // Debug: verificar el valor leído
            console.log('Input value:', inputCantidad ? inputCantidad.value : 'no input', 'Parsed:', cantidadEntregar);
            
            if (!cantidadEntregar || cantidadEntregar <= 0) {
                showNotification('Ingrese una cantidad válida', 'error', 3000);
                return;
            }
            
            if (cantidadEntregar > totalPallets) {
                showNotification('La cantidad excede el total de pallets', 'error', 3000);
                return;
            }
            
            var mensaje = cantidadEntregar === totalPallets 
                ? '¿Entregar TODOS los ' + cantidadEntregar + ' pallets?' 
                : '¿Entregar ' + cantidadEntregar + ' de ' + totalPallets + ' pallets?';
            
            showConfirm(mensaje)
            .then(function(ok){ 
                if (!ok) return null; // Retornar null si cancela
                var fd = new FormData(); 
                fd.append('action','deliver'); 
                fd.append('id', id); 
                fd.append('cantidad', cantidadEntregar);
                return fetch(window.location.pathname, { method:'POST', headers:{ 'X-Requested-With':'XMLHttpRequest' }, body: fd }); 
            })
            .then(function(resp){ 
                if (!resp) return null; // Si es null (canceló) o no hay respuesta, retornar null
                return resp.json(); 
            })
            .then(function(json){ 
                if (!json) return; // Si es null, no hacer nada
                if (json && json.success) { 
                    if (json.entregaCompleta) {
                        // Entrega completa: eliminar fila/card y verificar si queda algún material
                        var rqGroup = null;
                        var tbody = null;
                        var mobileContainer = null;
                        
                        if (tr) {
                            rqGroup = tr.closest('.rq-group');
                            tbody = tr.parentNode;
                            tr.parentNode.removeChild(tr);
                        }
                        if (card) {
                            if (!rqGroup) rqGroup = card.closest('.rq-group');
                            mobileContainer = card.parentNode;
                            card.parentNode.removeChild(card);
                        }
                        
                        // Verificar si quedan más materiales en el RQ
                        var remainingItems = 0;
                        if (tbody) {
                            remainingItems += tbody.querySelectorAll('tr').length;
                        }
                        if (mobileContainer) {
                            remainingItems += mobileContainer.querySelectorAll('.item-card').length;
                        }
                        
                        if (remainingItems === 0 && rqGroup) {
                            // No quedan materiales, eliminar el grupo completo
                            rqGroup.parentNode.removeChild(rqGroup);
                            showNotification('Entregados ' + (json.cantidadEntregada || cantidadEntregar) + ' pallets - RQ completado', 'success', 3500);
                        } else {
                            // Actualizar el contador de ítems en el encabezado
                            if (rqGroup) {
                                var itemCountBadge = rqGroup.querySelector('.rq-group-header [style*="background:#eef2ff"]');
                                if (itemCountBadge) {
                                    itemCountBadge.textContent = remainingItems + ' ítems';
                                }
                            }
                            showNotification('Entregados ' + (json.cantidadEntregada || cantidadEntregar) + ' pallets - Ítem completado', 'success', 3500);
                        }
                    } else {
                        // Entrega parcial: actualizar cantidad en ambos formatos
                        if (tr) {
                            var cellTotal = tr.querySelector('.total-pallets');
                            if (cellTotal) cellTotal.textContent = json.cantidadRestante;
                            tr.setAttribute('data-npallets', json.cantidadRestante);
                            var trInput = tr.querySelector('.input-cantidad');
                            if (trInput) {
                                trInput.value = json.cantidadRestante;
                                trInput.max = json.cantidadRestante;
                            }
                        }
                        if (card) {
                            var cardTotal = card.querySelector('.total-pallets');
                            if (cardTotal) cardTotal.textContent = json.cantidadRestante;
                            card.setAttribute('data-npallets', json.cantidadRestante);
                            var cardInput = card.querySelector('.input-cantidad');
                            if (cardInput) {
                                cardInput.value = json.cantidadRestante;
                                cardInput.max = json.cantidadRestante;
                            }
                        }
                        showNotification('Entregados ' + json.cantidadEntregada + ' pallets - Quedan ' + json.cantidadRestante, 'success', 3500); 
                    }
                } else { 
                    showNotification('Error: ' + (json && json.error ? json.error : 'Respuesta inválida'), 'error', 3500); 
                } 
            })
            .catch(function(){ showNotification('Error de red al entregar', 'error', 3500); });
            return;
        }
    }
});
</script>
</body>
</html>
