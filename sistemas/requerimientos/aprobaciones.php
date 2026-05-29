<?php
include '../../shared/conexion.php';
if (session_status() === PHP_SESSION_NONE) session_start();

// Control de acceso por usuario (solo determinados usuarios pueden ver esta página)
$allowedApprovers = array_map('strtolower', array('llarosa', 'phuaman'));
if (!isset($_SESSION['usuario']) || !in_array(strtolower($_SESSION['usuario']), $allowedApprovers)) {
    // Redirigir al flujo general de usuarios (registrosp)
    header('Location: registrosp.html?par_accion=agregar');
    exit;
}

// Manejo de acción POST (aprobar individual o por RQ)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    $action = $_POST['action'] ?? '';

    // Comprobar que la columna existe (común)
    $hasEstado = false; $hasAprobadoPor = false; $hasAprobadoAt = false;
    try {
        $r1 = $conn->query("SHOW COLUMNS FROM scm_requerimientosproduccion LIKE 'EstadoAprobacion'"); if ($r1 && $r1->num_rows>0) $hasEstado = true;
        $r2 = $conn->query("SHOW COLUMNS FROM scm_requerimientosproduccion LIKE 'AprobadoPor'"); if ($r2 && $r2->num_rows>0) $hasAprobadoPor = true;
        $r3 = $conn->query("SHOW COLUMNS FROM scm_requerimientosproduccion LIKE 'AprobadoAt'"); if ($r3 && $r3->num_rows>0) $hasAprobadoAt = true;
    } catch (Exception $e) { }
    if (!$hasEstado) {
        echo json_encode(['success'=>false, 'error'=>'La columna EstadoAprobacion no existe. Ejecute sql/alter_add_estadoaprobacion.sql']);
        exit;
    }

    if ($action === 'approve_rq') {
        $nreq = isset($_POST['nrequerimiento']) ? intval($_POST['nrequerimiento']) : 0;
        if ($nreq <= 0) { echo json_encode(['success'=>false,'error'=>'NRequerimiento inválido']); exit; }

        // Construir UPDATE dinámico para todo el RQ (solo pendientes)
        $sql = "UPDATE scm_requerimientosproduccion SET EstadoAprobacion = 'Aprobado'";
        $params = [];
        if ($hasAprobadoPor) { $sql .= ", AprobadoPor = ?"; $params[] = isset($_SESSION['usuarionombre']) ? $_SESSION['usuarionombre'] : null; }
        if ($hasAprobadoAt) { $sql .= ", AprobadoAt = ?"; $params[] = date('Y-m-d H:i:s'); }
        $sql .= " WHERE NRequerimiento = ? AND EstadoAprobacion = 'Pendiente'";

        $stmt = $conn->prepare($sql);
        if (!$stmt) { echo json_encode(['success'=>false,'error'=>$conn->error]); exit; }
        // bind params
        if (count($params) > 0) {
            $types = str_repeat('s', count($params)) . 'i';
            $bind = array_merge([$types], $params, [$nreq]);
            $tmp = [];
            foreach ($bind as $k => $v) $tmp[$k] = &$bind[$k];
            call_user_func_array([$stmt,'bind_param'],$tmp);
        } else {
            $stmt->bind_param('i', $nreq);
        }
        if ($stmt->execute()) {
            $affected = $stmt->affected_rows;
            echo json_encode(['success'=>true, 'affected'=> $affected, 'nrequerimiento'=>$nreq]);
            exit;
        } else {
            echo json_encode(['success'=>false,'error'=>$stmt->error]); exit;
        }
    }

    // acción por Id individual (compatibilidad)
    if ($action === 'approve') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        if ($id <= 0) { echo json_encode(['success'=>false,'error'=>'Id inválido']); exit; }

        // Construir UPDATE dinámico para la fila (igual lógica previa)
        $sql = "UPDATE scm_requerimientosproduccion SET EstadoAprobacion = 'Aprobado'";
        $params = [];
        if ($hasAprobadoPor) { $sql .= ", AprobadoPor = ?"; $params[] = isset($_SESSION['usuarionombre']) ? $_SESSION['usuarionombre'] : null; }
        if ($hasAprobadoAt) { $sql .= ", AprobadoAt = ?"; $params[] = date('Y-m-d H:i:s'); }
        $sql .= " WHERE Id = ? LIMIT 1";

        $stmt = $conn->prepare($sql);
        if (!$stmt) { echo json_encode(['success'=>false,'error'=>$conn->error]); exit; }
        if (count($params) > 0) {
            $types = str_repeat('s', count($params)) . 'i';
            $bind = array_merge([$types], $params, [$id]);
            $tmp = [];
            foreach ($bind as $k => $v) $tmp[$k] = &$bind[$k];
            call_user_func_array([$stmt,'bind_param'],$tmp);
        } else {
            $stmt->bind_param('i', $id);
        }
        if ($stmt->execute()) { echo json_encode(['success'=>true]); exit; }
        else { echo json_encode(['success'=>false,'error'=>$stmt->error]); exit; }
    }

    // Asignar despachador a un RQ completo
    if ($action === 'assign_rq') {
        $nreq = isset($_POST['nrequerimiento']) ? intval($_POST['nrequerimiento']) : 0;
        $usuario = isset($_POST['usuario']) ? trim($_POST['usuario']) : '';
        if ($nreq <= 0 || $usuario === '') { echo json_encode(['success'=>false,'error'=>'Parámetros inválidos']); exit; }

        // Intentar detectar una columna adecuada para almacenar la asignación
        $possible = ['AsignadoA','Despachador','AsignadoUsuario','UsuarioAsignado','Asignado_por'];
        $foundCol = null;
        foreach ($possible as $c) {
            $rcol = $conn->query("SHOW COLUMNS FROM scm_requerimientosproduccion LIKE '" . $conn->real_escape_string($c) . "'");
            if ($rcol && $rcol->num_rows>0) { $foundCol = $c; break; }
        }
        if (!$foundCol) { echo json_encode(['success'=>false,'error'=>'No existe columna para asignar. Crear columna AsignadoA en la tabla.']); exit; }

        $sql = "UPDATE scm_requerimientosproduccion SET `" . $foundCol . "` = ? WHERE NRequerimiento = ?";
        $stmt2 = $conn->prepare($sql);
        if (!$stmt2) { echo json_encode(['success'=>false,'error'=>$conn->error]); exit; }
        $stmt2->bind_param('si', $usuario, $nreq);
        if ($stmt2->execute()) { echo json_encode(['success'=>true]); exit; }
        else { echo json_encode(['success'=>false,'error'=>$stmt2->error]); exit; }
    }

    // Asignar despachador a un item individual
    if ($action === 'assign_item') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $usuario = isset($_POST['usuario']) ? trim($_POST['usuario']) : '';
        if ($id <= 0 || $usuario === '') { echo json_encode(['success'=>false,'error'=>'Parámetros inválidos']); exit; }

        $possible = ['AsignadoA','Despachador','AsignadoUsuario','UsuarioAsignado','Asignado_por'];
        $foundCol = null;
        foreach ($possible as $c) {
            $rcol = $conn->query("SHOW COLUMNS FROM scm_requerimientosproduccion LIKE '" . $conn->real_escape_string($c) . "'");
            if ($rcol && $rcol->num_rows>0) { $foundCol = $c; break; }
        }
        if (!$foundCol) { echo json_encode(['success'=>false,'error'=>'No existe columna para asignar. Crear columna AsignadoA en la tabla.']); exit; }

        $sql = "UPDATE scm_requerimientosproduccion SET `" . $foundCol . "` = ? WHERE Id = ? LIMIT 1";
        $stmt2 = $conn->prepare($sql);
        if (!$stmt2) { echo json_encode(['success'=>false,'error'=>$conn->error]); exit; }
        $stmt2->bind_param('si', $usuario, $id);
        if ($stmt2->execute()) { echo json_encode(['success'=>true]); exit; }
        else { echo json_encode(['success'=>false,'error'=>$stmt2->error]); exit; }
    }

    echo json_encode(['success'=>false,'error'=>'Acción no soportada']);
    exit;
}

// Página GET: listar pendientes
$hasEstado = false;
try { $r = $conn->query("SHOW COLUMNS FROM scm_requerimientosproduccion LIKE 'EstadoAprobacion'"); if ($r && $r->num_rows>0) $hasEstado = true; } catch (Exception $e) {}

if (!$hasEstado) {
    // mostrar mensaje con instrucción
    ?><!DOCTYPE html><html><head><meta charset="utf-8"><title>Aprobaciones - Configuración requerida</title></head><body style="font-family:Arial,Helvetica,sans-serif;padding:24px"><?php
    echo '<div style="background:#fff3cd;border:1px solid #ffeeba;padding:16px;border-radius:6px;max-width:900px">';
    echo '<h2>Interfaz de Aprobaciones</h2>';
    echo '<p>La tabla <code>scm_requerimientosproduccion</code> no tiene la columna <code>EstadoAprobacion</code>. Para activar el módulo de aprobaciones ejecuta el siguiente SQL en tu base de datos:</p>';
    echo '<pre style="background:#f8f9fa;padding:12px;border-radius:4px;border:1px solid #e9ecef">' . htmlspecialchars(file_get_contents(__DIR__ . '/sql/alter_add_estadoaprobacion.sql')) . '</pre>';
    echo '<p>Una vez ejecutado, vuelve a esta página.</p>';
    echo '</div></body></html>';
    exit;
}

// Cargar pendientes
// Cargar pendientes (sin agrupar aún)
$sql = "SELECT Id, NRequerimiento, Fecha, Maquina, Zona, Motivo, Prioridad, Producto, Codigo, NPallets, Observaciones FROM scm_requerimientosproduccion WHERE EstadoAprobacion = 'Pendiente' ORDER BY NRequerimiento DESC, Id DESC";
$res = $conn->query($sql);
$rows = [];
if ($res && $res->num_rows > 0) {
    while ($r = $res->fetch_assoc()) $rows[] = $r;
}

// Agrupar por NRequerimiento
$groups = [];
foreach ($rows as $r) {
    $nr = isset($r['NRequerimiento']) ? intval($r['NRequerimiento']) : 0;
    if (!isset($groups[$nr])) {
        $groups[$nr] = [
            'nrequerimiento' => $nr,
            'count' => 0,
            'items' => [],
            'fecha' => $r['Fecha'] ?? '',
            'maquina' => $r['Maquina'] ?? '',
            // prioridad agrupada: por defecto 'Normal', si algún ítem es 'Alta' el RQ será 'Alta'
            'priority' => 'Normal',
        ];
    }
    $groups[$nr]['items'][] = $r;
    $groups[$nr]['count']++;
    // Determinar prioridad del grupo: si algún item tiene Prioridad 'Alta' (case-insensitive), marcar grupo como Alta
    if (isset($r['Prioridad']) && strcasecmp(trim((string)$r['Prioridad']), 'Alta') === 0) {
        $groups[$nr]['priority'] = 'Alta';
    }
}

// Mostrar UI
// Cargar lista de montacarguistas (usuarios cuyo TipoUsuario contiene 'montacarguista')
$montaRows = [];
try {
    $mq = $conn->query("SELECT IdUsuario, Usuario, Nombres FROM usuarios WHERE LOWER(TipoUsuario) LIKE '%montacarguista%' ORDER BY Usuario");
    if ($mq && $mq->num_rows>0) {
        while ($mr = $mq->fetch_assoc()) $montaRows[] = $mr;
    }
} catch (Exception $e) { }
?><!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Aprobaciones - Requerimientos</title>
<style>
    body{font-family:Arial,Helvetica,sans-serif;margin:20px}
    .container{max-width:1000px;margin:20px auto;background:#fff;padding:18px;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
    table{width:100%;border-collapse:collapse}
    th,td{padding:8px;border:1px solid #ddd;text-align:left}
    /* cuerpo de la grilla: letra un poco más pequeña */
    .container table tbody td { font-size: 13px; }
    th{background:#f5f7fb}
    .btn-approve{background:#2e7d32;color:#fff;border:none;padding:6px 10px;border-radius:4px;cursor:pointer}
    .btn-approve:hover{background:#256028}
    /* Prioridad colores */
    .prio { font-weight:600; }
    .prio-alta { color: #d32f2f; }
    .prio-media { color: #ff9800; }
    .prio-baja { color: #2e7d32; }
    /* Notificaciones (toasts) - centradas horizontalmente y colocadas más arriba */
    .notif-container { position: fixed; left: 50%; top: 18%; transform: translateX(-50%); z-index: 14000; display:flex; flex-direction:column; gap:10px; align-items:center; }
    .notif { min-width:220px; max-width:360px; padding:10px 14px; border-radius:6px; color:#fff; box-shadow:0 6px 18px rgba(0,0,0,0.12); font-weight:600; opacity:0.98 }
    .notif-success { background: #2e7d32; }
    .notif-error { background: #d32f2f; }
    /* Fecha: dejar que el ancho se ajuste al contenido (como el resto de columnas) */
    .container table thead th.col-fecha { width: auto; white-space: nowrap; }
    .container table tbody td:nth-child(3) { white-space: nowrap; overflow: visible; text-overflow: clip; }
    /* Modal confirm styles */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.42); display:flex; align-items:center; justify-content:center; z-index:13000; }
    .modal { background: #fff; border-radius:8px; max-width:520px; width:92%; box-shadow:0 12px 32px rgba(0,0,0,0.28); padding:18px; font-size:15px; }
    .modal h3 { margin:0 0 8px 0; font-size:16px; }
    .modal .modal-body { color:#333; margin-bottom:14px; }
    .modal .modal-actions { text-align:right; display:flex; gap:8px; justify-content:flex-end }
    .btn { padding:8px 12px;border-radius:6px;border:0;cursor:pointer;font-weight:600 }
    .btn-cancel { background:#f1f3f5;color:#222 }
    .btn-confirm { background:#1976d2;color:#fff }
    .btn:focus { outline:2px solid rgba(25,118,210,0.25); }
    /* Modern professional overrides */
    .container { max-width:1100px; padding:22px; border-radius:12px; }
    header h2 { letter-spacing: -0.2px; }
    .table-wrap { overflow-x:auto; margin-top:6px; }
    .apb-grid { width:100%; border-collapse:separate; border-spacing:0; border-radius:8px; overflow:hidden; box-shadow:0 8px 30px rgba(15,23,42,0.06); table-layout: auto; }
    .apb-grid thead th { background: linear-gradient(180deg,#fbfdff,#f5f7fb); color:#21304a; font-weight:700; text-transform:none; font-size:13px; padding:10px 12px; border-bottom:1px solid rgba(15,23,42,0.06); }
    .apb-grid tbody td { background:#fff; padding:10px 12px; color:#233; border-bottom:1px solid rgba(15,23,42,0.04); white-space: nowrap; }
    .apb-grid tbody tr:nth-child(odd) td { background: #fbfcfd; }
    .apb-grid tbody tr:hover td { background: linear-gradient(90deg, rgba(13,110,253,0.03), rgba(13,110,253,0.02)); }
    .btn-approve { background: linear-gradient(90deg,#0d6efd,#0b5ed7); color:#fff; border-radius:8px; padding:8px 12px; border:0; box-shadow:0 8px 18px rgba(13,110,253,0.08); font-weight:700 }
    .btn-approve:hover { transform:translateY(-1px); }
    /* Logout button: visible, attention color but subtle */
    .btn-logout { background: linear-gradient(90deg,#ef4444,#d32f2f); color:#fff; border-radius:8px; padding:8px 12px; border:0; box-shadow:0 6px 14px rgba(211,47,47,0.12); font-weight:700; cursor:pointer }
    .btn-logout:hover { transform:translateY(-1px); opacity:0.95 }
    /* Priority badges refined */
    .prio { font-weight:700; display:inline-block; padding:6px 10px; border-radius:999px; font-size:13px }
    .prio-alta { background: rgba(211,47,47,0.12); color: #d32f2f; }
    .prio-media { background: rgba(255,152,0,0.12); color: #ff9800; }
    .prio-baja { background: rgba(46,125,50,0.12); color: #2e7d32; }
    /* Estilos para el agrupamiento RQ: resaltar el marco y cabecera */
    .rq-group { margin-bottom:14px; border-radius:10px; border:1px solid rgba(11,66,130,0.10); overflow:hidden; box-shadow:0 6px 20px rgba(11,66,130,0.04); }
    .rq-group-header { padding:12px 14px; background: linear-gradient(180deg,#f6fbff,#eef6ff); }
    .rq-group-body { display: none; padding:12px; background: #ffffff; }
    .rq-group .btn-approve-group { background: linear-gradient(90deg,#0d6efd,#0b5ed7); color:#fff; border-radius:8px; padding:8px 12px; border:0; box-shadow:0 6px 14px rgba(13,110,253,0.08); font-weight:700 }
    /* Banner que aparece después de aprobar para abrir la impresión (intenta auto-abrir, y si es bloqueada muestra botón) */
    .print-banner { display:flex; gap:10px; align-items:center; justify-content:space-between; background: linear-gradient(90deg,#f8fbff,#eef6ff); border:1px solid rgba(11,78,160,0.06); padding:10px 12px; border-radius:8px; margin:12px 0; box-shadow:0 8px 20px rgba(11,78,160,0.04); }
    .print-banner .msg { color:#0b3b6f; font-weight:700 }
    .print-banner .open-print { background: #0b5ed7; color:#fff; border:0; padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:700 }
    .print-banner .open-print:hover { transform: translateY(-2px); }
    .rq-group .btn-expand {
        background: #ffffff;
        border: 1px solid rgba(11,42,74,0.08);
        color: #0b5ed7;
        padding: 6px 10px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 700;
        box-shadow: 0 6px 14px rgba(11,78,160,0.04);
        transition: background 180ms ease, transform 120ms ease, color 160ms ease;
    }
    .rq-group .btn-expand:hover { background: rgba(11,94,217,0.04); transform: translateY(-2px); }
    .rq-group .btn-expand:focus { outline: 3px solid rgba(11,94,217,0.12); }
    /* Cuando el grupo está expandido, mostrar estilo activo (contraste con btn-approve) */
    .rq-group .btn-expand[aria-expanded="true"] { background: linear-gradient(90deg,#0d6efd,#0b5ed7); color:#fff; border-color: transparent; box-shadow: 0 8px 20px rgba(11,78,160,0.12); }
    /* Fecha: permitir que la columna se ajuste automáticamente al contenido */
    .apb-grid thead th.col-fecha { width:auto; }
    .apb-grid tbody td:nth-child(3) { white-space:nowrap; overflow:visible; text-overflow:clip; }
    /* Auto-adjust columns except Maquina (4) and Producto (now 7) which may wrap */
    .apb-grid thead th, .apb-grid tbody td { white-space: nowrap; }
    .apb-grid thead th:nth-child(4), .apb-grid tbody td:nth-child(4),
    .apb-grid thead th:nth-child(7), .apb-grid tbody td:nth-child(7) {
        white-space: normal; word-break: break-word; max-width: 300px;
    }
    /* Modal subtle styling */
    .modal { border-radius:12px; }
</style>
</head>
<body>
<div class="container">
    <header style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px">
        <div>
            <h2 style="margin:0;font-size:20px;color:#0f1724">Aprobaciones de Requerimientos</h2>
            <div style="color:#556; font-size:13px; margin-top:6px">Registros pendientes por aprobar. Usuario: <strong style="color:#0b2a4a"><?php echo isset($_SESSION['usuarionombre'])?htmlspecialchars($_SESSION['usuarionombre']):'(no identificado)'; ?></strong></div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
            <button class="btn-logout" onclick="var baseUrl = window.location.pathname.includes('/BACKOFFICE/') ? '/BACKOFFICE' : ''; location.href = baseUrl + '/logout.php';">Cerrar sesión</button>
        </div>
    </header>
    <div class="table-wrap">
        <?php if (empty($groups)): ?>
            <div style="text-align:center;padding:20px;background:#fff3cd;color:#856404;border-radius:8px;border:1px solid #ffeeba;font-weight:700">No hay requerimientos pendientes por aprobar.</div>
        <?php else: ?>
            <?php foreach ($groups as $grp): ?>
                <div class="rq-group" data-nrq="<?php echo intval($grp['nrequerimiento']); ?>">
                    <div class="rq-group-header">
                        <div style="display:flex;gap:14px;align-items:center">
                            <div style="font-weight:700;color:#0f1724">RQ <?php echo htmlspecialchars(str_pad((string)$grp['nrequerimiento'],5,'0',STR_PAD_LEFT)); ?></div>
                            <div style="color:#556;font-size:13px"><?php echo htmlspecialchars((!empty($grp['fecha']) && strtotime($grp['fecha'])) ? date('d-m-Y', strtotime($grp['fecha'])) : $grp['fecha']); ?></div>
                            <div style="color:#556;font-size:13px">Máquina: <?php echo htmlspecialchars($grp['maquina']); ?></div>
                            <div style="display:inline-block;background:#eef2ff;color:#0b5ed7;padding:6px 10px;border-radius:999px;font-weight:700"><?php echo intval($grp['count']); ?> ítems</div>
                            <?php
                                $gprio = isset($grp['priority']) ? $grp['priority'] : 'Normal';
                                $gcls = (strcasecmp($gprio,'Alta')===0) ? 'prio prio-alta' : 'prio prio-baja';
                            ?>
                            <div style="margin-left:8px"><span class="<?php echo $gcls; ?>" style="font-size:12px;padding:6px 10px;border-radius:999px"><?php echo htmlspecialchars(strtoupper($gprio)); ?></span></div>
                        </div>
                        <div style="display:flex;gap:8px;align-items:center">
                            <button class="btn-expand" data-nrq="<?php echo intval($grp['nrequerimiento']); ?>" aria-expanded="false">Ver</button>
                            <button class="btn-approve-group btn-approve" data-nrq="<?php echo intval($grp['nrequerimiento']); ?>">Aprobar RQ</button>
                        </div>
                    </div>
                    <div class="rq-group-body">
                        <table class="apb-grid" style="width:100%;border-collapse:collapse">
                            <thead>
                                <tr>
                                    <th>Prioridad</th>
                                    <th>N° RQ</th>
                                    <th class="col-fecha">Fecha</th>
                                    <th>Maquina</th>
                                    <th>Motivo</th>
                                    <th>Codigo</th>
                                    <th>Producto</th>
                                    <th>NPallets</th>
                                    <th>Observaciones</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                            <?php foreach ($grp['items'] as $r): ?>
                                <?php
                                    $p = isset($r['Prioridad']) ? trim($r['Prioridad']) : '';
                                    $cls = '';
                                    if (strcasecmp($p,'Alta')===0) $cls = 'prio-alta';
                                    elseif (strcasecmp($p,'Media')===0) $cls = 'prio-media';
                                    elseif (strcasecmp($p,'Baja')===0) $cls = 'prio-baja';
                                ?>
                                <tr data-id="<?php echo intval($r['Id']); ?>">
                                    <td><span class="prio <?php echo $cls; ?>"><?php echo htmlspecialchars($p); ?></span></td>
                                    <td><?php echo htmlspecialchars(str_pad((string)($r['NRequerimiento'] ?? ''),5,'0',STR_PAD_LEFT)); ?></td>
                                    <td><?php echo htmlspecialchars((!empty($r['Fecha']) && strtotime($r['Fecha'])) ? date('d-m-Y', strtotime($r['Fecha'])) : $r['Fecha']); ?></td>
                                    <td><?php echo htmlspecialchars($r['Maquina']); ?></td>
                                    <td><?php echo htmlspecialchars($r['Motivo']); ?></td>
                                    <td><?php echo htmlspecialchars($r['Codigo']); ?></td>
                                    <td><?php echo htmlspecialchars($r['Producto']); ?></td>
                                    <td style="text-align:center"><?php echo htmlspecialchars($r['NPallets']); ?></td>
                                    <td><?php echo htmlspecialchars($r['Observaciones']); ?></td>
                                    <td style="text-align:center"><button class="btn-approve" data-id="<?php echo intval($r['Id']); ?>">Aprobar</button></td>
                                </tr>
                            <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>
<!-- Confirm modal (hidden) -->
<div id="confirmModal" class="modal-backdrop" style="display:none" aria-hidden="true">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="confirmModalTitle">
        <h3 id="confirmModalTitle">Confirmación</h3>
        <div class="modal-body" id="confirmModalMessage">¿Confirmar?</div>
        <div class="modal-actions">
            <button type="button" class="btn btn-cancel" id="confirmModalCancel">Cancelar</button>
            <button type="button" class="btn btn-confirm" id="confirmModalOk">Aprobar</button>
        </div>
    </div>
</div>

<!-- Assign modal (seleccionar montacarguista) -->
<div id="assignModal" class="modal-backdrop" style="display:none" aria-hidden="true">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="assignModalTitle">
        <h3 id="assignModalTitle">Asignar despachador</h3>
        <div class="modal-body">
            <p>Seleccione el montacarguista que recibirá este requerimiento:</p>
            <div style="margin-top:8px">
                <select id="assignSelect" style="width:100%;padding:8px;border-radius:6px;border:1px solid #ddd">
                    <?php if (empty($montaRows)): ?>
                        <option value="">(No hay montacarguistas configurados)</option>
                    <?php else: ?>
                        <?php foreach ($montaRows as $m): ?>
                            <option value="<?php echo htmlspecialchars($m['Usuario']); ?>"><?php echo htmlspecialchars(!empty($m['Nombres']) ? $m['Nombres'] : $m['Usuario']); ?></option>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </select>
            </div>
        </div>
        <div class="modal-actions">
            <button type="button" class="btn btn-cancel" id="assignCancel">Cancelar</button>
            <button type="button" class="btn btn-confirm" id="assignOk">Asignar</button>
        </div>
        <input type="hidden" id="assign_type" value="">
        <input type="hidden" id="assign_id" value="">
        <input type="hidden" id="assign_nrq" value="">
    </div>
</div>

<script>
// Notification helper (toasts)
(function(){
    var container = document.createElement('div');
    container.className = 'notif-container';
    document.body.appendChild(container);

    window.showNotification = function(message, type, timeout){
        timeout = timeout || 3500;
        var el = document.createElement('div');
        el.className = 'notif ' + (type === 'error' ? 'notif-error' : 'notif-success');
        el.textContent = message;
        container.appendChild(el);
        // appear animation
        el.style.transform = 'translateY(-6px)';
        el.style.opacity = '0';
        requestAnimationFrame(function(){ el.style.transition = 'transform 220ms ease, opacity 220ms ease'; el.style.transform = 'translateY(0)'; el.style.opacity = '1'; });
        setTimeout(function(){
            el.style.transform = 'translateY(-8px)'; el.style.opacity = '0';
            setTimeout(function(){ el.remove(); }, 260);
        }, timeout);
    };
})();

// Confirm modal helper: returns a Promise that resolves true if confirmed
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
        // focus management
        btnOk.focus();

        function cleanup() {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden','true');
            btnOk.removeEventListener('click', onOk);
            btnCancel.removeEventListener('click', onCancel);
            document.removeEventListener('keydown', onKey);
            try { if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus(); } catch(e){}
        }

        function onOk(){ cleanup(); resolve(true); }
        function onCancel(){ cleanup(); resolve(false); }
        function onKey(ev){ if (ev.key === 'Escape') { ev.preventDefault(); onCancel(); } if (ev.key === 'Enter') { ev.preventDefault(); onOk(); } }

        btnOk.addEventListener('click', onOk);
        btnCancel.addEventListener('click', onCancel);
        document.addEventListener('keydown', onKey);
    });
};

document.addEventListener('click', function(e){
    var target = e.target || e.srcElement;
    if (!target) return;

    // Priorizar botones de grupo
    var btnGroup = (target.closest) ? target.closest('.btn-approve-group') : null;
    if (btnGroup) {
        var nrq = btnGroup.getAttribute('data-nrq');
        if (!nrq) return;
        showConfirm('¿Aprobar todos los registros del RQ ' + String(nrq).padStart(5,'0') + '?').then(function(ok){
            if (!ok) return;
            // Mostrar modal de asignación ANTES de aprobar
            showAssignModal({ type: 'rq', nrequerimiento: nrq, pendingApproval: true });
        });
        return;
    }

    // Botón aprobar individual (ignorar si es el botón de grupo)
    var btnApprove = (target.closest) ? target.closest('.btn-approve') : null;
    if (btnApprove && !btnApprove.classList.contains('btn-approve-group')) {
        var id = btnApprove.getAttribute('data-id');
        if (!id) return;
        showConfirm('¿Aprobar este material?').then(function(ok){
            if (!ok) return;
            // Mostrar modal de asignación ANTES de aprobar
            showAssignModal({ type: 'item', id: id, pendingApproval: true });
        });
        return;
    }

    // Toggle expand/collapse group (usar closest para detectar clicks en hijos)
    var btnExpand = (target.closest) ? target.closest('.btn-expand') : null;
    if (btnExpand) {
        var nrq2 = btnExpand.getAttribute('data-nrq');
        if (!nrq2) return;
        var grp2 = document.querySelector('.rq-group[data-nrq="' + nrq2 + '"]');
        if (!grp2) return;
        var body = grp2.querySelector('.rq-group-body');
        if (!body) return;
        var expanded = btnExpand.getAttribute('aria-expanded') === 'true';
        if (expanded) {
            body.style.display = 'none';
            btnExpand.setAttribute('aria-expanded','false');
            btnExpand.textContent = 'Ver';
        } else {
            body.style.display = 'block';
            btnExpand.setAttribute('aria-expanded','true');
            btnExpand.textContent = 'Ocultar';
        }
        return;
    }
});

// Modal de asignación: lógica para mostrar/ocultar y enviar asignación
var currentAssignOptions = null;

function showAssignModal(opts){
    var modal = document.getElementById('assignModal');
    if (!modal) return;
    var t = document.getElementById('assign_type');
    var i = document.getElementById('assign_id');
    var n = document.getElementById('assign_nrq');
    var sel = document.getElementById('assignSelect');
    if (!t || !i || !n || !sel) return;
    
    // Guardar las opciones para usarlas después
    currentAssignOptions = opts;
    
    t.value = opts.type || '';
    i.value = opts.id || '';
    n.value = opts.nrequerimiento || '';
    modal.style.display = 'flex'; modal.setAttribute('aria-hidden','false');
    try { sel.focus(); } catch(e){}
}

function hideAssignModal(){ 
    var m = document.getElementById('assignModal'); 
    if (!m) return; 
    m.style.display = 'none'; 
    m.setAttribute('aria-hidden','true');
    currentAssignOptions = null;
}

document.getElementById('assignCancel').addEventListener('click', function(){ 
    hideAssignModal();
    showNotification('Operación cancelada', 'error', 2000);
});

document.getElementById('assignOk').addEventListener('click', function(){
    var tipo = document.getElementById('assign_type').value;
    var id = document.getElementById('assign_id').value;
    var nrq = document.getElementById('assign_nrq').value;
    var usuario = document.getElementById('assignSelect').value;
    if (!usuario) { showNotification('Seleccione un montacarguista', 'error'); return; }
    
    var isPendingApproval = currentAssignOptions && currentAssignOptions.pendingApproval;
    
    if (isPendingApproval) {
        // NUEVO FLUJO: Primero aprobar, luego asignar
        var approveAction = tipo === 'rq' ? 'approve_rq' : 'approve';
        var fd1 = new FormData();
        fd1.append('action', approveAction);
        if (tipo === 'rq') {
            fd1.append('nrequerimiento', nrq);
        } else {
            fd1.append('id', id);
        }
        
        // Paso 1: Aprobar
        fetch(window.location.pathname, { method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest' }, body: fd1 })
        .then(function(res){ return res.json(); })
        .then(function(json){
            if (json && json.success) {
                // Paso 2: Asignar
                var fd2 = new FormData();
                if (tipo === 'rq') { fd2.append('action','assign_rq'); fd2.append('nrequerimiento', nrq); }
                else { fd2.append('action','assign_item'); fd2.append('id', id); }
                fd2.append('usuario', usuario);
                
                return fetch(window.location.pathname, { method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest' }, body: fd2 })
                .then(function(res2){ return res2.json(); })
                .then(function(json2){
                    if (json2 && json2.success) {
                        // Actualizar la interfaz
                        if (tipo === 'rq') {
                            var grp = document.querySelector('.rq-group[data-nrq="' + nrq + '"]');
                            if (grp) grp.parentNode.removeChild(grp);
                            showNotification('RQ ' + String(nrq).padStart(5,'0') + ' aprobado y direccionado', 'success', 3500);
                        } else {
                            var tr = document.querySelector('tr[data-id="' + id + '"]');
                            if (tr) {
                                var rqGroup = tr.closest('.rq-group');
                                var tbody = tr.parentNode;
                                tbody.removeChild(tr);
                                var remainingRows = tbody.querySelectorAll('tr');
                                if (remainingRows.length === 0 && rqGroup) {
                                    rqGroup.parentNode.removeChild(rqGroup);
                                    showNotification('Material aprobado y direccionado - RQ completado', 'success', 3500);
                                } else {
                                    if (rqGroup) {
                                        var itemCountBadge = rqGroup.querySelector('.rq-group-header [style*="background:#eef2ff"]');
                                        if (itemCountBadge) {
                                            itemCountBadge.textContent = remainingRows.length + ' ítems';
                                        }
                                    }
                                    showNotification('Material aprobado y direccionado', 'success', 3500);
                                }
                            }
                        }
                        hideAssignModal();
                    } else {
                        showNotification('Error al asignar: ' + (json2 && json2.error ? json2.error : 'respuesta inválida'), 'error');
                    }
                });
            } else {
                showNotification('Error al aprobar: ' + (json && json.error ? json.error : 'respuesta inválida'), 'error');
            }
        }).catch(function(){ showNotification('Error de red al aprobar', 'error'); });
    } else {
        // FLUJO ANTIGUO: Solo asignar (ya estaba aprobado)
        var fd = new FormData();
        if (tipo === 'rq') { fd.append('action','assign_rq'); fd.append('nrequerimiento', nrq); }
        else { fd.append('action','assign_item'); fd.append('id', id); }
        fd.append('usuario', usuario);
        fetch(window.location.pathname, { method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest' }, body: fd })
        .then(function(res){ return res.json(); })
        .then(function(json){
            if (json && json.success) {
                hideAssignModal();
                showNotification('Requerimiento direccionado', 'success', 3500);
            } else {
                showNotification('Error al asignar: ' + (json && json.error ? json.error : 'respuesta inválida'), 'error');
            }
        }).catch(function(){ showNotification('Error de red al asignar', 'error'); });
    }
});
</script>
</body>
</html>
