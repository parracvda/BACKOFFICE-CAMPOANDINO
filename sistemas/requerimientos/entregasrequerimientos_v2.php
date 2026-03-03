<?php
// entregasrequerimientos_v2.php - V2 Backend con UI V1 idéntica
// Usa estructura normalizada (funciones_v2.php) pero mantiene interfaz de usuario V1
include '../../shared/conexion.php';
if (session_status() === PHP_SESSION_NONE) session_start();
include '../../shared/funciones_v2.php';

// Acceso: verificar usuario logueado
if (empty($_SESSION['usuario'])) {
    header('Location: index.html');
    exit;
}

// Manejo POST para marcar como entregado (por Id o por RQ)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    $action = $_POST['action'] ?? '';

    // V2: Marcar RQ completo como entregado
    if ($action === 'deliver_rq') {
        $nreq = isset($_POST['nrequerimiento']) ? intval($_POST['nrequerimiento']) : 0;
        if ($nreq <= 0) { echo json_encode(['success'=>false,'error'=>'NRequerimiento inválido']); exit; }

        // Obtener todos los detalles aprobados del RQ usando V2
        $detalles = obtenerDetallesRequerimiento($conn, $nreq);
        $affected = 0;
        $entregadoPor = $_SESSION['usuarionombre'] ?? $_SESSION['usuario'] ?? 'Sistema';
        
        foreach ($detalles as $det) {
            if (($det['estado'] ?? '') === 'Aprobado') {
                // Calcular cantidad pendiente y entregar TODO
                $stmtPend = $conn->prepare("SELECT COALESCE(SUM(Cantidad), 0) as entregado FROM scm_entregas_movimientos WHERE DetalleId = ? AND TipoMovimiento = 'Entrega'");
                $stmtPend->bind_param('i', $det['id_detalle']);
                $stmtPend->execute();
                $resPend = $stmtPend->get_result();
                $rowPend = $resPend->fetch_assoc();
                $yaEntregado = intval($rowPend['entregado']);
                $pendiente = intval($det['npallets']) - $yaEntregado;
                $stmtPend->close();
                
                if ($pendiente > 0) {
                    // Registrar entrega completa usando funciones_v2
                    $resEnt = registrarEntrega($conn, $det['id_detalle'], $pendiente, $entregadoPor);
                    if ($resEnt['success']) $affected++;
                }
            }
        }
        
        echo json_encode(['success'=>true, 'affected'=> $affected, 'nrequerimiento'=>$nreq]);
        exit;
    }

    // V2: Entregar item individual (parcial o total)
    if ($action === 'deliver') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        if ($id <= 0) { echo json_encode(['success'=>false,'error'=>'Id inválido']); exit; }
        
        $cantidadEntregar = isset($_POST['cantidad']) ? intval($_POST['cantidad']) : 0;
        if ($cantidadEntregar <= 0) {
            echo json_encode(['success'=>false,'error'=>'Cantidad inválida']); exit;
        }
        
        $entregadoPor = $_SESSION['usuarionombre'] ?? $_SESSION['usuario'] ?? 'Sistema';
        
        // Usar función V2 para registrar entrega (con validación y trazabilidad completa)
        $resultado = registrarEntrega($conn, $id, $cantidadEntregar, $entregadoPor);
        
        if ($resultado['success']) {
            echo json_encode($resultado);
            exit;
        } else {
            echo json_encode(['success'=>false,'error'=>$resultado['error']]);
            exit;
        }
    }

    echo json_encode(['success'=>false,'error'=>'Acción no soportada']);
    exit;
}

// Página GET: listar registros aprobados (pendientes de entrega) usando V2
// Endpoint auxiliar: si piden cargar items por RQ vía AJAX
if (isset($_GET['load_items']) && isset($_GET['rq'])) {
    $rqId = intval($_GET['rq']);
    $out = [];
    if ($rqId > 0) {
        $detalles = obtenerDetallesRequerimiento($conn, $rqId);
        foreach ($detalles as $det) {
            // Calcular cantidad pendiente
            $stmtPend = $conn->prepare("SELECT COALESCE(SUM(Cantidad), 0) as entregado FROM scm_entregas_movimientos WHERE DetalleId = ? AND TipoMovimiento = 'Entrega'");
            $stmtPend->bind_param('i', $det['id_detalle']);
            $stmtPend->execute();
            $resPend = $stmtPend->get_result();
            $rowPend = $resPend->fetch_assoc();
            $yaEntregado = intval($rowPend['entregado']);
            $pendiente = intval($det['npallets']) - $yaEntregado;
            $stmtPend->close();
            
            if ($pendiente > 0 && ($det['estado'] ?? '') === 'Aprobado') {
                $out[] = [
                    'Id' => $det['id_detalle'],
                    'Prioridad' => $det['prioridad'] ?? 'Normal',
                    'Maquina' => $det['maquina'] ?? '',
                    'Codigo' => $det['codigo'] ?? '',
                    'Producto' => $det['producto'] ?? '',
                    'NPallets' => $pendiente
                ];
            }
        }
    }
    header('Content-Type: application/json; charset=utf-8');
    $jsonOut = json_encode($out);
    // Log para depuración rápida: guardar respuesta del endpoint load_items
    @file_put_contents(__DIR__ . '/debug_assign.log', date('Y-m-d H:i:s') . " | load_items rq={$rqId} response=" . $jsonOut . "\n", FILE_APPEND);
    echo $jsonOut;
    exit;
}

$isMonta = false;
// Detectar si el usuario actual es montacarguista
if (!empty($_SESSION['tipousuario']) && stripos($_SESSION['tipousuario'],'montacarguista') !== false) $isMonta = true;
if (!$isMonta && !empty($_SESSION['TipoUsuario']) && stripos($_SESSION['TipoUsuario'],'montacarguista') !== false) $isMonta = true;

// V2: Obtener requerimientos pendientes de entrega usando funciones_v2
// Si es montacarguista, filtrar por AsignadoA
$usuarioFiltro = $isMonta ? ($_SESSION['usuario'] ?? null) : null;
$requerimientos = obtenerPendientesEntrega($conn, $usuarioFiltro);

// Convertir a formato compatible con UI V1 (aplanar y ajustar nombres de campos)
$rows = [];
if (!empty($requerimientos)) {
    foreach ($requerimientos as $rq) {
        if (!empty($rq['items']) && is_array($rq['items'])) {
            foreach ($rq['items'] as $item) {
                // Solo incluir si hay pallets pendientes
                $pendiente = intval($item['Pendiente'] ?? 0);
                if ($pendiente > 0) {
                    $rows[] = [
                        'Id' => $item['Id'] ?? 0,
                        'NRequerimiento' => $rq['nrequerimiento'] ?? 0,
                        'Fecha' => $rq['fecha'] ?? '',
                        'Maquina' => $rq['maquina'] ?? '',
                        'Zona' => '',
                        'Motivo' => '',
                        'Prioridad' => $rq['prioridad'] ?? 'Normal',
                        'Producto' => $item['Producto'] ?? '',
                        'Codigo' => $item['Codigo'] ?? '',
                        'NPallets' => $pendiente,
                        'NPalletsEntregados' => $item['Entregado'] ?? 0,
                        'NPalletsPendientes' => $pendiente,
                        'Observaciones' => $item['Observaciones'] ?? ''
                    ];
                }
            }
        }
    }
}

// Agrupar por NRequerimiento (igual que V1)
$groups = [];
foreach ($rows as $r) {
    $palletsPendientes = intval($r['NPalletsPendientes']);
    if ($palletsPendientes <= 0) continue;
    
    $nr = intval($r['NRequerimiento']);
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
    .btn-logout { background: linear-gradient(90deg,#ef4444,#d32f2f); color:#fff; border-radius:8px; padding:8px 12px; border:0; box-shadow:0 6px 14px rgba(211,47,47,0.12); font-weight:700; cursor:pointer; font-size:14px; min-height:44px; }
    .btn-logout:hover { transform: translateY(-1px); opacity:0.96 }
    .btn-logout:active { transform: scale(0.98); }
    .notif-container { position: fixed; left: 50%; top: 18%; transform: translateX(-50%); z-index: 14000; display:flex; flex-direction:column; gap:10px; align-items:center; max-width:90%; }
    .notif { min-width:220px; max-width:360px; padding:12px 16px; border-radius:6px; color:#fff; box-shadow:0 6px 18px rgba(0,0,0,0.12); font-weight:600; opacity:0.98; font-size:14px; }
    .notif-success { background: #2e7d32; }
    .notif-error { background: #d32f2f; }
    .mobile-card { display:none; }
    @media screen and (max-width: 768px) {
        body { padding:8px; font-size:14px; }
        .container { padding:8px; border-radius:8px; }
        header h2 { font-size:18px !important; }
        header > div:first-child > div { font-size:12px !important; }
        .rq-group-header { padding:10px; flex-direction:column; align-items:stretch; }
        .rq-group-header > div:first-child { width:100%; margin-bottom:8px; flex-wrap:wrap; }
        .rq-group-header > div:last-child { width:100%; display:flex; gap:8px; }
        .rq-group-header > div:last-child button { flex:1; }
        table.apb-grid { display:none; }
        .mobile-card { display:block; }
        .item-card { background: #fafbfc; border: 1px solid rgba(15,23,42,0.08); border-radius: 8px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.04); }
        .item-card-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(15,23,42,0.04); }
        .item-card-row:last-child { border-bottom: none; }
        .item-card-label { font-weight: 600; color: #556; font-size: 13px; }
        .item-card-value { font-weight: 500; color: #0f1724; text-align: right; font-size: 14px; }
        .item-card-actions { display: flex; gap: 8px; margin-top: 12px; align-items: center; }
        .item-card-actions .input-cantidad { flex: 0 0 80px; font-size: 16px; }
        .item-card-actions .btn-deliver { flex: 1; font-size: 15px; padding: 12px; }
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
            <button class="btn-logout" onclick="location.href='logout.php'">Cerrar sesión</button>
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
                                    $palletsPendientes = intval($r['NPalletsPendientes']);
                                ?>
                                <tr data-id="<?php echo intval($r['Id']); ?>" data-npallets="<?php echo $palletsPendientes; ?>">
                                    <td><span class="prio <?php echo $cls; ?>"><?php echo htmlspecialchars($p); ?></span></td>
                                    <td><?php echo htmlspecialchars($r['Maquina']); ?></td>
                                    <td><?php echo htmlspecialchars($r['Codigo']); ?></td>
                                    <td><?php echo htmlspecialchars($r['Producto']); ?></td>
                                    <td style="text-align:center" class="total-pallets"><?php echo $palletsPendientes; ?></td>
                                    <td style="text-align:center"><input type="number" class="input-cantidad" min="1" max="<?php echo $palletsPendientes; ?>" value="1"></td>
                                    <td style="text-align:center"><button class="btn-deliver" data-id="<?php echo intval($r['Id']); ?>">Entregar</button></td>
                                </tr>
                            <?php endforeach; ?>
                            </tbody>
                        </table>
                        <div class="mobile-card">
                            <?php foreach ($grp['items'] as $r): ?>
                                <?php 
                                    $p = isset($r['Prioridad']) ? trim($r['Prioridad']) : ''; 
                                    $cls = (strcasecmp($p,'Alta')===0)?'prio-alta':'prio-normal';
                                    $palletsPendientes = intval($r['NPalletsPendientes']);
                                ?>
                                <div class="item-card" data-id="<?php echo intval($r['Id']); ?>" data-npallets="<?php echo $palletsPendientes; ?>">
                                    <div class="item-card-row"><span class="item-card-label">Prioridad</span><span class="item-card-value"><span class="prio <?php echo $cls; ?>"><?php echo htmlspecialchars($p); ?></span></span></div>
                                    <div class="item-card-row"><span class="item-card-label">Máquina</span><span class="item-card-value"><?php echo htmlspecialchars($r['Maquina']); ?></span></div>
                                    <div class="item-card-row"><span class="item-card-label">Código</span><span class="item-card-value"><?php echo htmlspecialchars($r['Codigo']); ?></span></div>
                                    <div class="item-card-row"><span class="item-card-label">Producto</span><span class="item-card-value"><?php echo htmlspecialchars($r['Producto']); ?></span></div>
                                    <div class="item-card-row"><span class="item-card-label">Pallets Pendientes</span><span class="item-card-value total-pallets"><?php echo $palletsPendientes; ?></span></div>
                                    <div class="item-card-actions"><input type="number" class="input-cantidad" min="1" max="<?php echo $palletsPendientes; ?>" value="1" placeholder="Cantidad"><button class="btn-deliver" data-id="<?php echo intval($r['Id']); ?>">Entregar</button></div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>
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
<style>
.modal-backdrop { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 9999; background: rgba(0,0,0,0.45); backdrop-filter: blur(1px); }
.modal { position: relative; background: #fff; padding: 18px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); width: 92%; max-width: 420px; z-index: 10000; }
.modal h3 { margin:0 0 6px 0; font-size:16px; }
.modal-body { margin:0; color:#333; margin-bottom:14px; }
.modal-actions { text-align:right; display:flex; gap:8px; justify-content:flex-end }
.btn { padding:8px 12px;border-radius:6px;border:0;cursor:pointer;font-weight:600 }
.btn-cancel { background:#f1f3f5;color:#222 }
.btn-confirm { background:#0b5ed7;color:#fff }
.btn:focus { outline:2px solid rgba(25,118,210,0.25); }
</style>
<script>
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
        function cleanup(){ modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); btnOk.removeEventListener('click', onOk); btnCancel.removeEventListener('click', onCancel); document.removeEventListener('keydown', onKey); try{ if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus(); }catch(e){} }
        function onOk(){ cleanup(); resolve(true); }
        function onCancel(){ cleanup(); resolve(false); }
        function onKey(ev){ if (ev.key === 'Escape') { ev.preventDefault(); onCancel(); } if (ev.key === 'Enter') { ev.preventDefault(); onOk(); } }
        btnOk.addEventListener('click', onOk);
        btnCancel.addEventListener('click', onCancel);
        document.addEventListener('keydown', onKey);
    });
};
document.addEventListener('click', function(e){
    if (!e || !e.target) return;

    // Expandir/colapsar grupo y cargar items si es necesario
    var btnExpand = e.target.closest ? e.target.closest('.btn-expand') : null;
    if (btnExpand) {
        var grpEl = btnExpand.closest('.rq-group'); if (!grpEl) return;
        var body = grpEl.querySelector('.rq-group-body'); if (!body) return;
        var expanded = btnExpand.getAttribute('aria-expanded') === 'true';
        if (expanded) { body.style.display = 'none'; btnExpand.setAttribute('aria-expanded','false'); btnExpand.textContent = 'Ver'; return; }
        var tbody = body.querySelector('tbody');
        if (tbody && tbody.querySelectorAll('tr').length > 0) { body.style.display = 'block'; btnExpand.setAttribute('aria-expanded','true'); btnExpand.textContent = 'Ocultar'; return; }
        var nrq = btnExpand.getAttribute('data-nrq') || grpEl.getAttribute('data-nrq');
        if (!nrq) { body.style.display = 'block'; btnExpand.setAttribute('aria-expanded','true'); btnExpand.textContent = 'Ocultar'; return; }

        fetch(window.location.pathname + '?load_items=1&rq=' + encodeURIComponent(nrq))
            .then(function(res){ return res.json(); })
            .then(function(data){
                if (!Array.isArray(data) || data.length === 0) { body.style.display = 'block'; btnExpand.setAttribute('aria-expanded','true'); btnExpand.textContent = 'Ocultar'; return; }
                if (!tbody) { tbody = document.createElement('tbody'); var tbl = body.querySelector('table'); if (tbl) tbl.appendChild(tbody); }
                var mobileContainer = body.querySelector('.mobile-card');
                data.forEach(function(it){
                    var pcls = (it.Prioridad && it.Prioridad.toLowerCase() === 'alta') ? 'prio prio-alta' : 'prio prio-normal';
                    var npallets = parseInt(it.NPallets) || 0;
                    var tr = document.createElement('tr');
                    tr.setAttribute('data-id', it.Id || '');
                    tr.setAttribute('data-npallets', npallets);
                    tr.innerHTML = '<td><span class="' + pcls + '">' + (it.Prioridad || '') + '</span></td>' +
                                   '<td>' + (it.Maquina || '') + '</td>' +
                                   '<td>' + (it.Codigo || '') + '</td>' +
                                   '<td>' + (it.Producto || '') + '</td>' +
                                   '<td style="text-align:center" class="total-pallets">' + npallets + '</td>' +
                                   '<td style="text-align:center"><input type="number" class="input-cantidad" min="1" max="' + npallets + '" value="1"></td>' +
                                   '<td style="text-align:center"><button class="btn-deliver" data-id="' + (it.Id||'') + '">Entregar</button></td>';
                    tbody.appendChild(tr);
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
                                         '<div class="item-card-actions"><input type="number" class="input-cantidad" min="1" max="' + npallets + '" value="1" placeholder="Cantidad"><button class="btn-deliver" data-id="' + (it.Id||'') + '">Entregar</button></div>';
                        mobileContainer.appendChild(card);
                    }
                });
                body.style.display = 'block'; btnExpand.setAttribute('aria-expanded','true'); btnExpand.textContent = 'Ocultar';
            })
            .catch(function(err){ console.error('Error cargando items RQ', nrq, err); body.style.display = 'block'; btnExpand.setAttribute('aria-expanded','true'); btnExpand.textContent = 'Ocultar'; });
        return;
    }

    // Entregas (botones .btn-deliver)
    var clickedBtn = e.target.closest ? e.target.closest('.btn-deliver') : (e.target.classList && e.target.classList.contains('btn-deliver') ? e.target : null);
    if (!clickedBtn) return;

    var id = clickedBtn.getAttribute('data-id');
    var nrq = clickedBtn.getAttribute('data-nrq');

    if (id) {
        var tr = document.querySelector('tr[data-id="' + id + '"]');
        var card = document.querySelector('.item-card[data-id="' + id + '"]');
        var container = tr || card;
        if (!container) return;
        var inputCantidad = container.querySelector('.input-cantidad');
        var cantidadEntregar = inputCantidad ? parseInt(inputCantidad.value) : 0;
        var totalPallets = parseInt(container.getAttribute('data-npallets')) || 0;
        if (!cantidadEntregar || cantidadEntregar <= 0) { showNotification('Ingrese una cantidad válida', 'error', 3000); return; }
        if (cantidadEntregar > totalPallets) { showNotification('La cantidad excede el total de pallets', 'error', 3000); return; }
        var mensaje = cantidadEntregar === totalPallets  ? '¿Entregar TODOS los ' + cantidadEntregar + ' pallets?'  : '¿Entregar ' + cantidadEntregar + ' de ' + totalPallets + ' pallets?';
        showConfirm(mensaje).then(function(ok){
            if (!ok) return null;
            var fd = new FormData();
            fd.append('action','deliver'); fd.append('id', id); fd.append('cantidad', cantidadEntregar);
            return fetch(window.location.pathname, { method:'POST', headers:{ 'X-Requested-With':'XMLHttpRequest' }, body: fd });
        }).then(function(resp){ if (!resp) return null; return resp.json(); })
        .then(function(json){
            if (!json) return;
            if (json && json.success) {
                // Si la entrega completó el ítem, eliminar fila/card y posiblemente el grupo
                if (json.entregaCompleta) {
                    var rqGroup = null; var tbody = null; var mobileContainer = null;
                    if (tr) { rqGroup = tr.closest('.rq-group'); tbody = tr.parentNode; tr.parentNode.removeChild(tr); }
                    if (card) { if (!rqGroup) rqGroup = card.closest('.rq-group'); mobileContainer = card.parentNode; card.parentNode.removeChild(card); }
                    var remainingItems = 0;
                    if (tbody) remainingItems += tbody.querySelectorAll('tr').length;
                    if (mobileContainer) remainingItems += mobileContainer.querySelectorAll('.item-card').length;
                    if (remainingItems === 0 && rqGroup) { rqGroup.parentNode.removeChild(rqGroup); showNotification('Entregados ' + (json.cantidadEntregada || cantidadEntregar) + ' pallets - RQ completado', 'success', 3500); }
                    else { if (rqGroup) { var itemCountBadge = rqGroup.querySelector('.rq-group-header [style*="background:#eef2ff"]'); if (itemCountBadge) itemCountBadge.textContent = remainingItems + ' ítems'; } showNotification('Entregados ' + (json.cantidadEntregada || cantidadEntregar) + ' pallets - Ítem completado', 'success', 3500); }
                } else {
                    // Entrega parcial: actualizar contadores y inputs sin eliminar la fila
                    if (tr) {
                        var cellTotal = tr.querySelector('.total-pallets'); if (cellTotal) cellTotal.textContent = json.cantidadRestante;
                        tr.setAttribute('data-npallets', json.cantidadRestante);
                        var trInput = tr.querySelector('.input-cantidad'); if (trInput) { trInput.value = json.cantidadRestante; trInput.max = json.cantidadRestante; }
                    }
                    if (card) {
                        var cardTotal = card.querySelector('.total-pallets'); if (cardTotal) cardTotal.textContent = json.cantidadRestante;
                        card.setAttribute('data-npallets', json.cantidadRestante);
                        var cardInput = card.querySelector('.input-cantidad'); if (cardInput) { cardInput.value = json.cantidadRestante; cardInput.max = json.cantidadRestante; }
                    }
                    // Actualizar badge de conteo de ítems en el grupo si existe
                    var rqGroup2 = (tr && tr.closest) ? tr.closest('.rq-group') : (card && card.closest ? card.closest('.rq-group') : null);
                    if (rqGroup2) {
                        var itemCountBadge2 = rqGroup2.querySelector('.rq-group-header [style*="background:#eef2ff"]');
                        // recalcular número de elementos visibles en la tabla y en mobile
                        var tbody2 = rqGroup2.querySelector('tbody');
                        var mobile2 = rqGroup2.querySelector('.mobile-card');
                        var cnt = 0;
                        if (tbody2) cnt += tbody2.querySelectorAll('tr').length;
                        if (mobile2) cnt += mobile2.querySelectorAll('.item-card').length;
                        if (itemCountBadge2) itemCountBadge2.textContent = cnt + ' ítems';
                    }
                    showNotification('Entregados ' + (json.cantidadEntregada || cantidadEntregar) + ' pallets - Quedan ' + json.cantidadRestante, 'success', 3500);
                }
            } else { showNotification('Error: ' + (json && json.error ? json.error : 'Respuesta inválida'), 'error', 3500); }
        }).catch(function(){ showNotification('Error de red al entregar', 'error', 3500); });
        return;
    }

    if (nrq) {
        showConfirm('¿Marcar como ENTREGADO todos los ítems del RQ ' + String(nrq).padStart(5,'0') + '?')
        .then(function(ok){ if (!ok) return; var fd = new FormData(); fd.append('action','deliver_rq'); fd.append('nrequerimiento', nrq); return fetch(window.location.pathname, { method:'POST', headers:{ 'X-Requested-With':'XMLHttpRequest' }, body: fd }); })
        .then(function(resp){ if (!resp) return; return resp.json(); })
        .then(function(json){ if (json && json.success) { var grp = document.querySelector('.rq-group[data-nrq="' + nrq + '"]'); if (grp) grp.remove(); showNotification('RQ ' + String(nrq).padStart(5,'0') + ' marcado como entregado', 'success', 3000); } else { showNotification('Error: ' + (json && json.error ? json.error : 'Respuesta inválida'), 'error', 3500); } })
        .catch(function(){ showNotification('Error de red al entregar', 'error', 3500); });
    }
});
</script>
</body>
</html>
