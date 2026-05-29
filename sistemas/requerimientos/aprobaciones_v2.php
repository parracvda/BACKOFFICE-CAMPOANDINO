<?php
include '../../shared/conexion.php';
include '../../shared/funciones_v2.php';
if (session_status() === PHP_SESSION_NONE) session_start();

// Control de acceso: permitir solo usuarios cuyo TipoUsuario sea 'APROBADOR'
$tipoUsuario = $_SESSION['TipoUsuario'] ?? '';
$currentUser = isset($_SESSION['usuario']) ? strtolower(trim($_SESSION['usuario'])) : '';
// Usuarios explícitos permitidos como aprobadores aunque no tengan TipoUsuario marcado
$allowedApprovers = ['llarosa', 'jramos', 'jdelacruz', 'phuaman'];

// Helper: comprobar si el usuario tiene una feature específica
function user_has_feature($conn, $idusuario, $feature_key) {
    try {
        $q = $conn->prepare('SELECT 1 FROM user_features WHERE idusuario = ? AND feature_key = ? LIMIT 1');
        if ($q) {
            $q->bind_param('is', $idusuario, $feature_key);
            $q->execute();
            $res = $q->get_result();
            $has = ($res && $res->num_rows > 0);
            $q->close();
            return $has;
        }
    } catch (Exception $e) {
        error_log('user_has_feature error: ' . $e->getMessage());
    }
    return false;
}

// Verificar autorización: es aprobador por tipo, nombre explícito, o tiene la feature `panel_aprobacion_requerimientos`
$isAllowed = false;
if (isset($_SESSION['usuario'])) {
    $idSess = isset($_SESSION['IdUsuario']) ? intval($_SESSION['IdUsuario']) : 0;
    if (strtolower($currentUser) === 'jparra') $isAllowed = true;
    if (!$isAllowed && stripos(trim($tipoUsuario), 'APROBADOR') !== false) $isAllowed = true;
    if (!$isAllowed && in_array($currentUser, $allowedApprovers)) $isAllowed = true;
    if (!$isAllowed && $idSess > 0 && user_has_feature($conn, $idSess, 'panel_aprobacion_requerimientos')) $isAllowed = true;
}

if (!$isAllowed) {
    error_log('aprobaciones_v2.php: acceso denegado para usuario=' . ($_SESSION['usuario'] ?? 'NULL') . ', TipoUsuario=' . ($tipoUsuario ?? 'NULL') . ', isAllowed=' . ($isAllowed ? '1' : '0'));
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html><head><meta charset="utf-8"><title>Acceso denegado</title></head><body style="font-family:Arial,Helvetica,sans-serif;padding:24px;"><h2>Acceso denegado</h2><p>No tienes permisos para acceder a la sección de aprobaciones.</p><p><a href="../../public/panel.html">Volver al panel</a></p></body></html>';
    exit;
}

// Manejo de acciones vía POST (approve, assign_rq, assign_item)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = isset($_POST['action']) ? trim($_POST['action']) : '';
    if ($action === 'approve') {
            $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
            if ($id <= 0) { echo json_encode(['success'=>false,'error'=>'Id inválido']); exit; }
            $stmtNreq = $conn->prepare('SELECT NRequerimiento FROM scm_requerimientos_detalle WHERE Id = ? LIMIT 1');
            $stmtNreq->bind_param('i', $id);
            $stmtNreq->execute();
            $result = $stmtNreq->get_result();
            $row = $result->fetch_assoc();
            $nreq = $row['NRequerimiento'] ?? 0;
            
            // Registrar aprobación usando la función central (actualiza EstadoAprobacion y registra en scm_aprobaciones)
            $aprobadoPor = $_SESSION['usuarionombre'] ?? $_SESSION['usuario'] ?? 'Sistema';
            $resApr = aprobarDetalle($conn, $id, $aprobadoPor, '');
            if (!isset($resApr['success']) || $resApr['success'] !== true) {
                echo json_encode(['success'=>false,'error'=>($resApr['error'] ?? 'Error al aprobar')]);
                exit;
            }
            // Si se enviaron almacen/motivo en la petición, resolver sus nombres y actualizar cabecera del RQ
            $almacen_id = isset($_POST['almacen_id']) ? intval($_POST['almacen_id']) : 0;
            $motivo_id = isset($_POST['motivo_id']) ? intval($_POST['motivo_id']) : 0;
            if (($almacen_id>0) || ($motivo_id>0)) {
                $almacen_txt = null; $motivo_txt = null;
                if ($almacen_id>0) {
                    $sA = $conn->prepare('SELECT Almacen FROM scm_almacen WHERE Id = ? LIMIT 1');
                    if ($sA) { $sA->bind_param('i',$almacen_id); $sA->execute(); $rA = $sA->get_result(); if ($rA && $rowA = $rA->fetch_assoc()) $almacen_txt = $rowA['Almacen']; $sA->close(); }
                }
                if ($motivo_id>0) {
                    $sM = $conn->prepare('SELECT Motivo FROM scm_motivo WHERE Id = ? LIMIT 1');
                    if ($sM) { $sM->bind_param('i',$motivo_id); $sM->execute(); $rM = $sM->get_result(); if ($rM && $rowM = $rM->fetch_assoc()) $motivo_txt = $rowM['Motivo']; $sM->close(); }
                }
                // Actualizar la cabecera del requerimiento con los valores seleccionados (si existen)
                try {
                    $fields = [];
                    $params = [];
                    $types = '';
                    if (!is_null($almacen_txt)) { $fields[] = 'Almacen = ?'; $params[] = $almacen_txt; $types .= 's'; }
                    if (!is_null($motivo_txt)) { $fields[] = 'Motivo = ?'; $params[] = $motivo_txt; $types .= 's'; }
                    if (!empty($fields)) {
                        $sqlUpd = 'UPDATE scm_requerimientos SET ' . implode(', ', $fields) . ' WHERE NRequerimiento = ?';
                        $params[] = $nreq; $types .= 'i';
                        $stmtUpd = $conn->prepare($sqlUpd);
                        if ($stmtUpd) {
                            $stmtUpd->bind_param($types, ...$params);
                            $stmtUpd->execute();
                            $stmtUpd->close();
                        }
                    }
                } catch (Exception $e) { /* ignore update errors silently */ }
            }
            
            echo json_encode(['success'=>true]);
            exit;
    }

    // Aprobar todo un RQ (V2)
    if ($action === 'approve_rq') {
        $nreq = isset($_POST['nrequerimiento']) ? intval($_POST['nrequerimiento']) : 0;
        if ($nreq <= 0) { echo json_encode(['success'=>false,'error'=>'NRequerimiento inválido']); exit; }

        $aprobadoPor = $_SESSION['usuarionombre'] ?? $_SESSION['usuario'] ?? 'Sistema';
        $conn->begin_transaction();
        try {
            // Obtener detalles pendientes
            $sdet = $conn->prepare('SELECT Id FROM scm_requerimientos_detalle WHERE NRequerimiento = ? AND EstadoAprobacion = "Pendiente"');
            $sdet->bind_param('i', $nreq);
            $sdet->execute();
            $res = $sdet->get_result();
            $ids = [];
            while ($row = $res->fetch_assoc()) $ids[] = intval($row['Id']);
            $sdet->close();

                if (!empty($ids)) {
                // Marcar como aprobado
                $stmtUpd = $conn->prepare("UPDATE scm_requerimientos_detalle SET EstadoAprobacion = 'Aprobado' WHERE Id = ?");
                $stmtIns = $conn->prepare("INSERT INTO scm_aprobaciones (DetalleId, NRequerimiento, AprobadoPor, Accion, AprobadoAt) VALUES (?, ?, ?, 'Aprobado', NOW())");
                foreach ($ids as $did) {
                    $stmtUpd->bind_param('i', $did);
                    $stmtUpd->execute();
                    $stmtIns->bind_param('iis', $did, $nreq, $aprobadoPor);
                    $stmtIns->execute();
                }
                $stmtUpd->close();
                $stmtIns->close();
            }

            $conn->commit();
            echo json_encode(['success'=>true, 'approved_count' => count($ids)]);
            exit;
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(['success'=>false,'error'=>$e->getMessage()]);
            exit;
        }
    }

    // Asignar despachador a un RQ completo
    if ($action === 'assign_rq') {
        $nreq = isset($_POST['nrequerimiento']) ? intval($_POST['nrequerimiento']) : 0;
        $usuario = isset($_POST['usuario']) ? trim($_POST['usuario']) : '';
        if ($nreq <= 0 || $usuario === '') { echo json_encode(['success'=>false,'error'=>'Parámetros inválidos']); exit; }

        // V2: Actualizar AsignadoA en scm_aprobaciones para todos los detalles del RQ
        $sql = "UPDATE scm_aprobaciones SET AsignadoA = ? WHERE NRequerimiento = ? AND (AsignadoA IS NULL OR AsignadoA = '')";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('si', $usuario, $nreq);
        
        if ($stmt->execute()) { 
            // Log para depuración: usuario asignado y filas afectadas
            error_log("assign_rq: NRequerimiento={$nreq} asignadoA='{$usuario}' affected_rows={$stmt->affected_rows}");
            // Archivo de log dentro del proyecto para depuración rápida
            @file_put_contents(__DIR__ . '/debug_assign.log', date('Y-m-d H:i:s') . " | assign_rq: NRequerimiento={$nreq} asignadoA='{$usuario}' affected_rows={$stmt->affected_rows}\n", FILE_APPEND);
            // Si no se actualizaron filas significa que no existían registros en scm_aprobaciones
            if ($stmt->affected_rows === 0) {
                $stmt->close();
                // Insertar registros de asignación para cada detalle del RQ
                $sdet = $conn->prepare('SELECT Id FROM scm_requerimientos_detalle WHERE NRequerimiento = ?');
                if ($sdet) {
                    $sdet->bind_param('i', $nreq);
                    $sdet->execute();
                    $resd = $sdet->get_result();
                    $ins = $conn->prepare("INSERT INTO scm_aprobaciones (DetalleId, NRequerimiento, AsignadoA, Accion, AprobadoAt) VALUES (?, ?, ?, 'Asignado', NOW())");
                        if ($ins) {
                            while ($rowd = $resd->fetch_assoc()) {
                                $detid = intval($rowd['Id']);
                                $ins->bind_param('iis', $detid, $nreq, $usuario);
                                $ok = $ins->execute();
                                @file_put_contents(__DIR__ . '/debug_assign.log', date('Y-m-d H:i:s') . " | insert_assign_rq: DetalleId={$detid} nreq={$nreq} usuario='{$usuario}' ok=" . ($ok?1:0) . " error=" . ($ins->error ?? '') . "\n", FILE_APPEND);
                            }
                            $ins->close();
                        }
                    $sdet->close();
                }
            } else {
                $stmt->close();
            }
            echo json_encode(['success'=>true]); 
            exit; 
        } else { 
            error_log("assign_rq ERROR: NRequerimiento={$nreq} usuario='{$usuario}' error={$stmt->error}");
            @file_put_contents(__DIR__ . '/debug_assign.log', date('Y-m-d H:i:s') . " | assign_rq ERROR: NRequerimiento={$nreq} usuario='{$usuario}' error={$stmt->error}\n", FILE_APPEND);
            echo json_encode(['success'=>false,'error'=>$stmt->error]); 
            exit; 
        }
    }

    // Asignar despachador a un item individual
    if ($action === 'assign_item') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $usuario = isset($_POST['usuario']) ? trim($_POST['usuario']) : '';
        if ($id <= 0 || $usuario === '') { echo json_encode(['success'=>false,'error'=>'Parámetros inválidos']); exit; }

        // V2: Actualizar AsignadoA en scm_aprobaciones para este detalle específico
        $sql = "UPDATE scm_aprobaciones SET AsignadoA = ? WHERE DetalleId = ? AND (AsignadoA IS NULL OR AsignadoA = '')";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('si', $usuario, $id);
        
        if ($stmt->execute()) { 
            error_log("assign_item: DetalleId={$id} asignadoA='{$usuario}' affected_rows={$stmt->affected_rows}");
            @file_put_contents(__DIR__ . '/debug_assign.log', date('Y-m-d H:i:s') . " | assign_item: DetalleId={$id} asignadoA='{$usuario}' affected_rows={$stmt->affected_rows}\n", FILE_APPEND);
                if ($stmt->affected_rows === 0) {
                $stmt->close();
                $ins = $conn->prepare("INSERT INTO scm_aprobaciones (DetalleId, NRequerimiento, AsignadoA, Accion, AprobadoAt) VALUES (?, ?, ?, 'Asignado', NOW())");
                if ($ins) {
                    // obtener NRequerimiento para este detalle
                    $sdet = $conn->prepare('SELECT NRequerimiento FROM scm_requerimientos_detalle WHERE Id = ? LIMIT 1');
                    if ($sdet) {
                        $sdet->bind_param('i', $id);
                        $sdet->execute();
                        $rd = $sdet->get_result();
                        $rowd = $rd->fetch_assoc();
                        $nreq = intval($rowd['NRequerimiento'] ?? 0);
                        $sdet->close();
                        $ins->bind_param('iis', $id, $nreq, $usuario);
                        $ok2 = $ins->execute();
                        @file_put_contents(__DIR__ . '/debug_assign.log', date('Y-m-d H:i:s') . " | insert_assign_item: DetalleId={$id} nreq={$nreq} usuario='{$usuario}' ok=" . ($ok2?1:0) . " error=" . ($ins->error ?? '') . "\n", FILE_APPEND);
                        $ins->close();
                    }
                }
            } else {
                $stmt->close();
            }
            echo json_encode(['success'=>true]); 
            exit; 
        } else { 
            error_log("assign_item ERROR: DetalleId={$id} usuario='{$usuario}' error={$stmt->error}");
            @file_put_contents(__DIR__ . '/debug_assign.log', date('Y-m-d H:i:s') . " | assign_item ERROR: DetalleId={$id} usuario='{$usuario}' error={$stmt->error}\n", FILE_APPEND);
            echo json_encode(['success'=>false,'error'=>$stmt->error]); 
            exit; 
        }
    }

    echo json_encode(['success'=>false,'error'=>'Acción no soportada']);
    exit;
}

// Página GET: listar pendientes usando funciones V2
$requerimientos = obtenerRequerimientosPendientes($conn);

// La función puede devolver ya una estructura agrupada por RQ (cada elemento con ['items']).
// Asegurarnos de trabajar con una lista plana de detalles para la agrupación posterior.
$requerimientos_flat = [];
if (!empty($requerimientos)) {
    $first = reset($requerimientos);
    if (is_array($first) && isset($first['items']) && is_array($first['items'])) {
        // aplanar
        foreach ($requerimientos as $grp) {
            if (!empty($grp['items']) && is_array($grp['items'])) {
                foreach ($grp['items'] as $it) $requerimientos_flat[] = $it;
            }
        }
    } else {
        $requerimientos_flat = $requerimientos;
    }
}

// Agrupar por NRequerimiento
$groups = [];
foreach ($requerimientos_flat as $r) {
    $nr = isset($r['nrequerimiento']) ? intval($r['nrequerimiento']) : 0;
    if (!isset($groups[$nr])) {
        $groups[$nr] = [
            'nrequerimiento' => $nr,
            'count' => 0,
            'items' => [],
            'fecha' => $r['fecha'] ?? '',
            'maquina' => $r['maquina'] ?? '',
            // prioridad agrupada: por defecto 'Normal', si algún ítem es 'Alta' el RQ será 'Alta'
            'priority' => 'Normal',
        ];
    }
    $groups[$nr]['items'][] = $r;
    $groups[$nr]['count']++;
    // Determinar prioridad del grupo: si algún item tiene Prioridad 'Alta' (case-insensitive), marcar grupo como Alta
    if (isset($r['prioridad']) && strcasecmp(trim((string)$r['prioridad']), 'Alta') === 0) {
        $groups[$nr]['priority'] = 'Alta';
    }
}

// Si no hay requerimientos pendientes y el usuario es 'llarosa', mostrar TODOS los requerimientos creados
$currentUser = isset($_SESSION['usuario']) ? strtolower(trim($_SESSION['usuario'])) : '';
if (empty($groups) && $currentUser === 'llarosa') {
    $groups = [];
    try {
        $sqlAll = "SELECT 
                        d.Id as id_detalle,
                        d.NRequerimiento as nrequerimiento,
                        d.Codigo as codigo,
                        d.Producto as producto,
                        d.NPallets as npallets,
                        d.Observaciones as observaciones,
                        d.EstadoAprobacion as estado_aprobacion,
                        r.Fecha as fecha,
                        r.Maquina as maquina,
                        r.Zona as zona,
                        r.Motivo as motivo,
                        r.Prioridad as prioridad
                    FROM scm_requerimientos_detalle d
                    JOIN scm_requerimientos r ON d.NRequerimiento = r.NRequerimiento
                    ORDER BY r.NRequerimiento DESC, d.Id DESC";
        $resAll = $conn->query($sqlAll);
        if ($resAll && $resAll->num_rows > 0) {
            while ($row = $resAll->fetch_assoc()) {
                $nr = intval($row['nrequerimiento']);
                if (!isset($groups[$nr])) {
                    $groups[$nr] = [
                        'nrequerimiento' => $nr,
                        'count' => 0,
                        'items' => [],
                        'fecha' => $row['fecha'] ?? '',
                        'maquina' => $row['maquina'] ?? '',
                        'priority' => 'Normal',
                    ];
                }
                $groups[$nr]['items'][] = [
                    'id_detalle' => $row['id_detalle'],
                    'nrequerimiento' => $nr,
                    'fecha' => $row['fecha'] ?? '',
                    'maquina' => $row['maquina'] ?? '',
                    'motivo' => $row['motivo'] ?? '',
                    'prioridad' => $row['prioridad'] ?? 'Normal',
                    'codigo' => $row['codigo'] ?? '',
                    'producto' => $row['producto'] ?? '',
                    'npallets' => intval($row['npallets'] ?? 0),
                    'observaciones' => $row['observaciones'] ?? '',
                    'estado_aprobacion' => $row['estado_aprobacion'] ?? ''
                ];
                $groups[$nr]['count']++;
                if (isset($row['prioridad']) && strcasecmp(trim((string)$row['prioridad']), 'Alta') === 0) {
                    $groups[$nr]['priority'] = 'Alta';
                }
            }
        }
    } catch (Exception $e) {
        // Silenciar y continuar; la vista mostrará mensaje de vacío si algo falla
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
// Cargar almacenes y motivos (para selects en la UI de aprobaciones)
$almacenes = [];
try {
    $qA = $conn->query("SELECT Id, Almacen FROM scm_almacen ORDER BY Almacen");
    if ($qA && $qA->num_rows>0) {
        $seen = [];
        while ($ar = $qA->fetch_assoc()) {
            $name = isset($ar['Almacen']) ? trim($ar['Almacen']) : '';
            if ($name === '') continue;
            $key = mb_strtolower($name);
            if (isset($seen[$key])) continue; // saltar duplicados por nombre
            $seen[$key] = true;
            $almacenes[] = $ar;
        }
    }
} catch (Exception $e) {}
$motivosList = [];
try {
    $qM = $conn->query("SELECT Id, Motivo FROM scm_motivo ORDER BY Motivo");
    if ($qM && $qM->num_rows>0) {
        while ($mr = $qM->fetch_assoc()) $motivosList[] = $mr;
    }
} catch (Exception $e) {}
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
    /* Panel button: similar effect to logout but más llamativo */
    .btn-panel { background: linear-gradient(90deg,#11998e,#38ef7d); color:#fff; border-radius:8px; padding:8px 12px; border:0; box-shadow:0 8px 18px rgba(18,153,142,0.14); font-weight:700; cursor:pointer }
    .btn-panel:hover { transform:translateY(-2px); box-shadow:0 10px 22px rgba(18,153,142,0.18); opacity:0.98 }
    /* Priority badges refined */
    .prio { font-weight:700; display:inline-block; padding:6px 10px; border-radius:999px; font-size:13px }
    .prio-alta { background: rgba(211,47,47,0.12); color: #d32f2f; }
    .prio-media { background: rgba(255,152,0,0.12); color: #ff9800; }
    .prio-baja { background: rgba(46,125,50,0.12); color: #2e7d32; }
    /* Estilos para el agrupamiento RQ: resaltar el marco y cabecera */
    .rq-group { margin-bottom:14px; border-radius:10px; border:1px solid rgba(11,66,130,0.10); overflow:hidden; box-shadow:0 6px 20px rgba(11,66,130,0.04); }
    .rq-group-header { padding:12px 14px; background: linear-gradient(180deg,#f6fbff,#eef6ff); }
    .rq-group-body { display: none; padding:12px; background: #ffffff; }
    /* Permitir scroll horizontal por grupo para tablas con textos largos */
    .rq-group-body { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    /* Contenedor con altura limitada para la grilla: agrega scroll vertical cuando hay muchas filas */
    .rq-grid-wrapper { max-height: 260px; overflow-y: auto; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-right: 6px; }
    /* Estilo compacto para la tabla dentro del contenedor */
    .apb-grid.compact thead th { padding:6px 8px; font-size:12px; }
    .apb-grid.compact tbody td { padding:6px 8px; font-size:12px; }
    .apb-grid.compact .select-almacen, .apb-grid.compact .select-motivo { min-width:120px; padding:4px 6px; font-size:12px; }
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
    /* RESPONSIVE MÓVIL */
    @media (max-width: 768px) {
        body { margin: 8px; }
        .container { max-width: 100%; padding: 12px; margin: 8px auto; }
        header { flex-direction: column; align-items: stretch !important; }
        header > div:first-child { margin-bottom: 12px; }
        header h2 { font-size: 18px !important; }
        header > div:first-child > div { font-size: 12px !important; }
        .btn-logout { width: 100%; padding: 12px; font-size: 15px; }
        .rq-group-header { flex-direction: column; align-items: stretch; padding: 10px; }
        .rq-group-header > div:first-child { flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
        .rq-group-header > div:first-child > div { font-size: 12px; }
        .rq-group-header > div:last-child { display: flex; gap: 8px; }
        .rq-group-header > div:last-child button { flex: 1; padding: 10px 8px; font-size: 14px; }
        .table-wrap { overflow-x: auto; margin-left: -12px; margin-right: -12px; padding: 0 12px; }
        .apb-grid { font-size: 12px; }
        .apb-grid thead th, .apb-grid tbody td { padding: 6px 4px; font-size: 11px; }
        .btn-approve { padding: 6px 8px; font-size: 12px; }
        .prio { font-size: 10px; padding: 4px 6px; }
        .modal { width: 96%; max-width: 96%; padding: 14px; }
        .modal h3 { font-size: 15px; }
        .modal-body { font-size: 14px; }
        .btn { padding: 10px; font-size: 14px; }
    }
    @media (max-width: 480px) {
        body { margin: 4px; }
        .container { padding: 8px; }
        header h2 { font-size: 16px !important; }
        .rq-group-header { padding: 8px; }
        .apb-grid thead th, .apb-grid tbody td { padding: 4px 2px; font-size: 10px; }
    }

    /* Force horizontal headers and normal flow to override external CSS that rotates/writes headers vertically */
    .apb-grid, .apb-grid * {
        -webkit-transform: none !important;
        transform: none !important;
        writing-mode: horizontal-tb !important;
        text-orientation: mixed !important;
    }
    .apb-grid thead th {
        white-space: normal !important;
        word-break: break-word !important;
        vertical-align: middle !important;
        text-align: left !important;
        transform: none !important;
        -webkit-transform: none !important;
        writing-mode: horizontal-tb !important;
    }
    .apb-grid tbody td {
        white-space: normal !important;
        word-break: break-word !important;
        overflow: visible !important;
    }
     /* Ensure table uses full width and auto layout; establecer min-width para permitir scroll horizontal
         y permitir que las celdas se envuelvan para mostrar textos más largos */
     .apb-grid { table-layout: auto !important; width: 100% !important; min-width: 1400px; }
     .apb-grid.compact thead th, .apb-grid.compact tbody td { white-space: normal !important; word-break: break-word !important; }

    /* Mobile card layout similar to entregas view */
    .mobile-card { display: none; }
    @media screen and (max-width: 768px) {
        .apb-grid { display: none !important; }
        .mobile-card { display: block; }
        .item-card { background: #fafbfc; border: 1px solid rgba(15,23,42,0.08); border-radius: 8px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.04); }
        .item-card-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(15,23,42,0.04); }
        .item-card-row:last-child { border-bottom: none; }
        .item-card-label { font-weight: 600; color: #556; font-size: 13px; }
        .item-card-value { font-weight: 500; color: #0f1724; text-align: right; font-size: 14px; }
        .item-card-actions { display: flex; gap: 8px; margin-top: 12px; align-items: center; }
        .item-card-actions .btn-approve { flex: 1; font-size: 15px; padding: 12px; }
    }
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
            <button class="btn-panel" id="btn-panel" onclick="location.href='../../public/panel.html'">Panel</button>
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
                        <div class="rq-grid-wrapper">
                        <table class="apb-grid compact" style="width:100%;border-collapse:collapse">
                            <thead>
                                <tr>
                                    <th>Prioridad</th>
                                    <th>N° RQ</th>
                                    <th class="col-fecha">Fecha</th>
                                    <th>Maquina</th>
                                    <th>Almacén</th>
                                    <th>Tipo Movimiento</th>
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
                                    $p = isset($r['prioridad']) ? trim($r['prioridad']) : '';
                                    $cls = '';
                                    if (strcasecmp($p,'Alta')===0) $cls = 'prio-alta';
                                    elseif (strcasecmp($p,'Media')===0) $cls = 'prio-media';
                                    elseif (strcasecmp($p,'Baja')===0) $cls = 'prio-baja';
                                ?>
                                <tr data-id="<?php echo intval($r['id_detalle'] ?? 0); ?>">
                                    <td><span class="prio <?php echo $cls; ?>"><?php echo htmlspecialchars($p); ?></span></td>
                                    <td><?php echo htmlspecialchars(str_pad((string)($r['nrequerimiento'] ?? ''),5,'0',STR_PAD_LEFT)); ?></td>
                                    <td><?php echo htmlspecialchars((!empty($r['fecha']) && strtotime($r['fecha'])) ? date('d-m-Y', strtotime($r['fecha'])) : ($r['fecha'] ?? '')); ?></td>
                                    <td><?php echo htmlspecialchars($r['maquina'] ?? ''); ?></td>
                                    <td>
                                        <select class="select-almacen" data-id="<?php echo intval($r['id_detalle'] ?? 0); ?>" style="min-width:140px;padding:6px;border-radius:6px;border:1px solid #ddd">
                                            <option value="">Seleccione almacén</option>
                                            <?php foreach ($almacenes as $a): ?>
                                                <option value="<?php echo htmlspecialchars($a['Id']); ?>"><?php echo htmlspecialchars($a['Almacen']); ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </td>
                                    <td>
                                        <select class="select-motivo" data-id="<?php echo intval($r['id_detalle'] ?? 0); ?>" style="min-width:160px;padding:6px;border-radius:6px;border:1px solid #ddd">
                                            <option value="">Seleccione tipo movimiento</option>
                                            <?php foreach ($motivosList as $m): ?>
                                                <option value="<?php echo htmlspecialchars($m['Id']); ?>"><?php echo htmlspecialchars($m['Motivo']); ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </td>
                                    <td><?php echo htmlspecialchars($r['codigo'] ?? ''); ?></td>
                                    <td><?php echo htmlspecialchars($r['producto'] ?? ''); ?></td>
                                    <td style="text-align:center"><?php echo htmlspecialchars($r['npallets'] ?? 0); ?></td>
                                    <td><?php echo htmlspecialchars($r['observaciones'] ?? ''); ?></td>
                                    <td style="text-align:center"><button class="btn-approve" data-id="<?php echo intval($r['id_detalle'] ?? 0); ?>">Aprobar</button></td>
                                </tr>
                            <?php endforeach; ?>
                            </tbody>
                        </table>
                        </div>
                        <div class="mobile-card">
                            <?php foreach ($grp['items'] as $r): ?>
                                <?php $p = isset($r['prioridad']) ? trim($r['prioridad']) : ''; $cls = (strcasecmp($p,'Alta')===0)?'prio-alta':'prio-baja'; ?>
                                <div class="item-card" data-id="<?php echo intval($r['id_detalle'] ?? 0); ?>">
                                    <div class="item-card-row"><span class="item-card-label">Prioridad</span><span class="item-card-value"><span class="prio <?php echo $cls; ?>"><?php echo htmlspecialchars($p); ?></span></span></div>
                                    <div class="item-card-row"><span class="item-card-label">Máquina</span><span class="item-card-value"><?php echo htmlspecialchars($r['maquina'] ?? ''); ?></span></div>
                                    <div class="item-card-row"><span class="item-card-label">Código</span><span class="item-card-value"><?php echo htmlspecialchars($r['codigo'] ?? ''); ?></span></div>
                                    <div class="item-card-row"><span class="item-card-label">Producto</span><span class="item-card-value"><?php echo htmlspecialchars($r['producto'] ?? ''); ?></span></div>
                                    <div class="item-card-row"><span class="item-card-label">NPallets</span><span class="item-card-value"><?php echo htmlspecialchars($r['npallets'] ?? 0); ?></span></div>
                                    <div class="item-card-row"><span class="item-card-label">Observaciones</span><span class="item-card-value"><?php echo htmlspecialchars($r['observaciones'] ?? ''); ?></span></div>
                                        <div class="item-card-row"><span class="item-card-label">Almacén</span><span class="item-card-value">
                                            <select class="select-almacen" data-id="<?php echo intval($r['id_detalle'] ?? 0); ?>">
                                                <option value="">Seleccione</option>
                                                <?php foreach ($almacenes as $a): ?>
                                                    <option value="<?php echo htmlspecialchars($a['Id']); ?>"><?php echo htmlspecialchars($a['Almacen']); ?></option>
                                                <?php endforeach; ?>
                                            </select>
                                        </span></div>
                                        <div class="item-card-row"><span class="item-card-label">Tipo Movimiento</span><span class="item-card-value">
                                            <select class="select-motivo" data-id="<?php echo intval($r['id_detalle'] ?? 0); ?>">
                                                <option value="">Seleccione</option>
                                                <?php foreach ($motivosList as $m): ?>
                                                    <option value="<?php echo htmlspecialchars($m['Id']); ?>"><?php echo htmlspecialchars($m['Motivo']); ?></option>
                                                <?php endforeach; ?>
                                            </select>
                                        </span></div>
                                        <div class="item-card-actions"><button class="btn-approve" data-id="<?php echo intval($r['id_detalle'] ?? 0); ?>">Aprobar</button></div>
                                </div>
                            <?php endforeach; ?>
                        </div>
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

// Helper: determinar si un elemento es visible en el layout (no oculto por CSS)
function isVisible(el){
    if (!el) return false;
    try { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); } catch(e){ return false; }
}
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
            // Validar que cada item tenga Almacén y Tipo Movimiento seleccionados
            var grp = document.querySelector('.rq-group[data-nrq="' + nrq + '"]');
            if (!grp) return;
            var items = [];
            var missing = false;
            // Recolectar ids desde filas y desde tarjetas móviles (evitar duplicados)
            var idsSet = new Set();
            grp.querySelectorAll('tr[data-id]').forEach(function(r){ idsSet.add(r.getAttribute('data-id')); });
            grp.querySelectorAll('.item-card[data-id]').forEach(function(c){ idsSet.add(c.getAttribute('data-id')); });
            idsSet.forEach(function(id){
                var row = grp.querySelector('tr[data-id="' + id + '"]');
                var card = grp.querySelector('.item-card[data-id="' + id + '"]');
                var selA_row = row ? row.querySelector('.select-almacen') : null;
                var selM_row = row ? row.querySelector('.select-motivo') : null;
                var selA_card = card ? card.querySelector('.select-almacen') : null;
                var selM_card = card ? card.querySelector('.select-motivo') : null;
                // Priorizar select que ya tenga valor, luego el visible, finalmente cualquiera disponible
                var selA = (selA_row && selA_row.value) ? selA_row : (selA_card && selA_card.value) ? selA_card : (isVisible(selA_card) ? selA_card : selA_row || selA_card);
                var selM = (selM_row && selM_row.value) ? selM_row : (selM_card && selM_card.value) ? selM_card : (isVisible(selM_card) ? selM_card : selM_row || selM_card);
                var a = selA ? (selA.value || '') : '';
                var m = selM ? (selM.value || '') : '';
                if (!a || !m) missing = true;
                items.push({ id: id, almacen_id: a, motivo_id: m });
            });
            if (missing) {
                showNotification('Seleccione Almacén y Tipo Movimiento para todos los materiales antes de aprobar el RQ', 'error');
                // expandir grupo para que el usuario vea los selects
                var body = grp.querySelector('.rq-group-body'); if (body) body.style.display = 'block';
                return;
            }
            // Mostrar modal de asignación ANTES de aprobar, pasando items con selecciones
            showAssignModal({ type: 'rq', nrequerimiento: nrq, pendingApproval: true, items: items });
        });
        return;
    }

    // Botón aprobar individual (ignorar si es el botón de grupo)
    var btnApprove = (target.closest) ? target.closest('.btn-approve') : null;
    if (btnApprove && !btnApprove.classList.contains('btn-approve-group')) {
        var id = btnApprove.getAttribute('data-id');
        if (!id) return;
        // Validar que el usuario haya seleccionado almacén y tipo movimiento para este item
        var row = document.querySelector('tr[data-id="' + id + '"]');
        var card = document.querySelector('.item-card[data-id="' + id + '"]');
        var selA_row = row ? row.querySelector('.select-almacen') : null;
        var selM_row = row ? row.querySelector('.select-motivo') : null;
        var selA_card = card ? card.querySelector('.select-almacen') : null;
        var selM_card = card ? card.querySelector('.select-motivo') : null;
        var selA = (selA_row && selA_row.value) ? selA_row : (selA_card && selA_card.value) ? selA_card : (isVisible(selA_card) ? selA_card : selA_row || selA_card);
        var selM = (selM_row && selM_row.value) ? selM_row : (selM_card && selM_card.value) ? selM_card : (isVisible(selM_card) ? selM_card : selM_row || selM_card);
        var selAVal = selA ? (selA.value || '') : '';
        var selMVal = selM ? (selM.value || '') : '';
        if (!selAVal || !selMVal) {
            showNotification('Seleccione Almacén y Tipo Movimiento antes de aprobar', 'error');
            var grp = (row && row.closest) ? row.closest('.rq-group') : (card && card.closest ? card.closest('.rq-group') : null);
            if (grp) { var body = grp.querySelector('.rq-group-body'); if (body) body.style.display = 'block'; }
            return;
        }
        showConfirm('¿Aprobar este material?').then(function(ok){
            if (!ok) return;
            // Mostrar modal de asignación ANTES de aprobar, pasando almacén/motivo seleccionados
            showAssignModal({ type: 'item', id: id, pendingApproval: true, almacen_id: selAVal, motivo_id: selMVal });
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
            // Forzar estilos en la tabla al expandir para evitar reglas externas que rompan el layout
            try {
                var tbl = body.querySelector('table');
                if (tbl) {
                    tbl.style.tableLayout = 'auto';
                    tbl.style.width = '100%';
                    var ths = tbl.querySelectorAll('th');
                    ths.forEach(function(th){ th.style.whiteSpace = 'normal'; th.style.transform = 'none'; th.style.writingMode = 'horizontal-tb'; th.style.width = 'auto'; });
                    var tds = tbl.querySelectorAll('td');
                    tds.forEach(function(td){ td.style.whiteSpace = 'normal'; td.style.overflow = 'visible'; });
                }
            } catch(e) { /* ignore */ }
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
        // Si el modal recibió datos de almacen/motivo desde la interfaz, anexarlos
        if (currentAssignOptions && currentAssignOptions.almacen_id) fd1.append('almacen_id', currentAssignOptions.almacen_id);
        if (currentAssignOptions && currentAssignOptions.motivo_id) fd1.append('motivo_id', currentAssignOptions.motivo_id);
        
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
