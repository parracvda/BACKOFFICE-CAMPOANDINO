<?php
date_default_timezone_set('America/Lima');
require_once __DIR__ . '/../../../shared/conexion.php';
session_start();

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'mensaje' => 'No autorizado']);
    exit;
}

$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';

// Leer body JSON en peticiones POST
$body = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    if ($raw) $body = json_decode($raw, true) ?: [];
    if (!$body) $body = $_POST;
}

switch ($action) {
    case 'listar_materiales':       listar_materiales();              break;
    case 'guardar_material':        guardar_material($body);          break;
    case 'eliminar_material':       eliminar_material($body);         break;
    case 'listar_observaciones':    listar_observaciones();           break;
    case 'guardar_observacion':     guardar_observacion($body);       break;
    case 'eliminar_observacion':    eliminar_observacion($body);      break;
    case 'listar_materiales_obs':   listar_materiales_obs();          break;
    case 'turno_actual':            turno_actual();                   break;
    case 'listar_maquinas':         listar_maquinas();                break;
    case 'listar_productos':        listar_productos();               break;
    case 'debug_grupos':            debug_grupos();                   break;
    case 'guardar_registro':        guardar_registro($body);          break;
    case 'actualizar_registro':     actualizar_registro($body);       break;
    case 'anular_registro':         anular_registro($body);           break;
    case 'listar_almacenes':        listar_almacenes();               break;
    case 'guardar_almacen':         guardar_almacen($body);           break;
    case 'eliminar_almacen':        eliminar_almacen($body);          break;
    case 'listar_tipoproducto':     listar_tipoproducto();            break;
    case 'guardar_tipoproducto':    guardar_tipoproducto($body);      break;
    case 'eliminar_tipoproducto':   eliminar_tipoproducto($body);     break;
    default:
        echo json_encode(['success' => false, 'mensaje' => 'Acción desconocida']);
}

// ══ Máquinas desde nisira_maquinas ══════════════════════════════════════
function guardar_registro($b) {
    global $conn;

    // Campos principales
    $almacen        = strtoupper(trim($b['almacen']        ?? ''));
    $fecha          = trim($b['fecha']          ?? '');
    $turno          = strtoupper(trim($b['turno']          ?? ''));
    $hora           = trim($b['hora']           ?? '');
    $id_maquina     = intval($b['id_maquina']   ?? 0);
    $maquina        = strtoupper(trim($b['maquina']        ?? ''));
    $id_descripcion = intval($b['id_descripcion'] ?? 0);
    $descripcion    = strtoupper(trim($b['descripcion']    ?? ''));
    $id_usuario     = intval($_SESSION['idusuario'] ?? $b['id_usuario'] ?? 0);
    $responsable    = strtoupper(trim($_SESSION['usuarionombre'] ?? $b['responsable'] ?? ''));
    $tipo_producto  = strtoupper(trim($b['tipo_producto']  ?? '')) ?: null;
    $humedad        = isset($b['humedad'])        ? floatval($b['humedad'])        : null;
    $cant_muestr    = isset($b['cant_muestreada']) ? intval($b['cant_muestreada']) : 0;
    $observaciones  = strtoupper(trim($b['observaciones'] ?? 'NO'));
    $cant_obs       = ($observaciones === 'SI') ? intval($b['cant_observada'] ?? 0) : 0;
    $pct_general    = ($observaciones === 'SI') ? floatval($b['porcentaje_general'] ?? 0) : 0;
    $comentarios    = strtoupper(trim($b['comentarios']    ?? '')) ?: null;
    $acciones       = strtoupper(trim($b['acciones_preventivas'] ?? '')) ?: null;
    $obs_detalle    = isset($b['obs_detalle']) && is_array($b['obs_detalle']) ? $b['obs_detalle'] : [];

    if (!$almacen || !$fecha || !$turno) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan campos obligatorios']); return;
    }

    $conn->begin_transaction();
    try {
        // Insertar registro principal
        $stmt = $conn->prepare(
            "INSERT INTO sig_registrocc
             (almacen, fecha, turno, hora, id_maquina, maquina,
              id_descripcion, descripcion, id_usuario, responsable,
              tipo_producto, humedad_promedio, cantidad_muestreada,
              observaciones, cantidad_observada, porcentaje_general,
              comentarios, acciones_preventivas, fecha_registro)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())"
        );
        $stmt->bind_param(
            'ssssisissssdisdiss',
            $almacen, $fecha, $turno, $hora,
            $id_maquina, $maquina,
            $id_descripcion, $descripcion,
            $id_usuario, $responsable,
            $tipo_producto, $humedad,
            $cant_muestr, $observaciones,
            $cant_obs, $pct_general,
            $comentarios, $acciones
        );
        $stmt->execute();
        $id_registro = $conn->insert_id;

        // Insertar detalle de observaciones
        if ($observaciones === 'SI' && $obs_detalle) {
            $stmtObs = $conn->prepare(
                "INSERT INTO sig_registrocc_observaciones
                 (id_registro, id_material, nombre_material, id_observacion, nombre_obs, cantidad, porcentaje)
                 VALUES (?,?,?,?,?,?,?)"
            );
            foreach ($obs_detalle as $od) {
                $id_mat    = intval($od['id_material']    ?? 0);
                $nom_mat   = strtoupper(trim($od['nombre_material']  ?? ''));
                $id_obs    = intval($od['id_observacion'] ?? 0);
                $nom_obs   = strtoupper(trim($od['nombre_obs']       ?? ''));
                $cantidad  = intval($od['cantidad']       ?? 0);
                $pct_ind   = floatval($od['porcentaje']   ?? 0);
                $stmtObs->bind_param('iisisid',
                    $id_registro, $id_mat, $nom_mat, $id_obs, $nom_obs, $cantidad, $pct_ind
                );
                $stmtObs->execute();
            }
        }

        $conn->commit();
        echo json_encode(['success' => true, 'id' => $id_registro]);

    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'mensaje' => 'Error al guardar: ' . $e->getMessage()]);
    }
}

// ══ Almacenes ════════════════════════════════════════════════════════════════

function listar_almacenes() {
    global $conn;
    $res  = $conn->query("SELECT id, nombre, activo FROM sig_cc_almacen ORDER BY nombre");
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode(['success' => true, 'data' => $rows]);
}

function guardar_almacen($b) {
    global $conn;
    $id     = intval($b['id'] ?? 0);
    $nombre = strtoupper(trim($b['nombre'] ?? ''));
    $activo = intval($b['activo'] ?? 1);
    if (!$nombre) { echo json_encode(['success' => false, 'mensaje' => 'Nombre requerido']); return; }
    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE sig_cc_almacen SET nombre=?, activo=? WHERE id=?");
        $stmt->bind_param('sii', $nombre, $activo, $id);
    } else {
        $stmt = $conn->prepare("INSERT INTO sig_cc_almacen (nombre, activo) VALUES (?,?)");
        $stmt->bind_param('si', $nombre, $activo);
    }
    echo $stmt->execute()
        ? json_encode(['success' => true, 'id' => $id > 0 ? $id : $conn->insert_id])
        : json_encode(['success' => false, 'mensaje' => $conn->error]);
}

function eliminar_almacen($b) {
    global $conn;
    $id = intval($b['id'] ?? 0);
    if (!$id) { echo json_encode(['success' => false, 'mensaje' => 'ID inválido']); return; }
    $chk = $conn->prepare("SELECT COUNT(*) AS c FROM sig_registrocc WHERE almacen=(SELECT nombre FROM sig_cc_almacen WHERE id=?)");
    $chk->bind_param('i', $id); $chk->execute();
    if ($chk->get_result()->fetch_assoc()['c'] > 0) {
        echo json_encode(['success' => false, 'mensaje' => 'El almacén tiene registros asociados']); return;
    }
    $stmt = $conn->prepare("DELETE FROM sig_cc_almacen WHERE id=?");
    $stmt->bind_param('i', $id);
    echo $stmt->execute() ? json_encode(['success' => true]) : json_encode(['success' => false, 'mensaje' => $conn->error]);
}

// ══ Tipos de producto ═════════════════════════════════════════════════════════

function listar_tipoproducto() {
    global $conn;
    $res  = $conn->query("SELECT id, nombre, activo FROM sig_cc_tipoproducto ORDER BY nombre");
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode(['success' => true, 'data' => $rows]);
}

function guardar_tipoproducto($b) {
    global $conn;
    $id     = intval($b['id'] ?? 0);
    $nombre = strtoupper(trim($b['nombre'] ?? ''));
    $activo = intval($b['activo'] ?? 1);
    if (!$nombre) { echo json_encode(['success' => false, 'mensaje' => 'Nombre requerido']); return; }
    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE sig_cc_tipoproducto SET nombre=?, activo=? WHERE id=?");
        $stmt->bind_param('sii', $nombre, $activo, $id);
    } else {
        $stmt = $conn->prepare("INSERT INTO sig_cc_tipoproducto (nombre, activo) VALUES (?,?)");
        $stmt->bind_param('si', $nombre, $activo);
    }
    echo $stmt->execute()
        ? json_encode(['success' => true, 'id' => $id > 0 ? $id : $conn->insert_id])
        : json_encode(['success' => false, 'mensaje' => $conn->error]);
}

function eliminar_tipoproducto($b) {
    global $conn;
    $id = intval($b['id'] ?? 0);
    if (!$id) { echo json_encode(['success' => false, 'mensaje' => 'ID inválido']); return; }
    $chk = $conn->prepare("SELECT COUNT(*) AS c FROM sig_registrocc WHERE tipo_producto=(SELECT nombre FROM sig_cc_tipoproducto WHERE id=?)");
    $chk->bind_param('i', $id); $chk->execute();
    if ($chk->get_result()->fetch_assoc()['c'] > 0) {
        echo json_encode(['success' => false, 'mensaje' => 'El tipo de producto tiene registros asociados']); return;
    }
    $stmt = $conn->prepare("DELETE FROM sig_cc_tipoproducto WHERE id=?");
    $stmt->bind_param('i', $id);
    echo $stmt->execute() ? json_encode(['success' => true]) : json_encode(['success' => false, 'mensaje' => $conn->error]);
}
// ══ Máquinas desde nisira_maquinas ═══════════════════════════════════════
function listar_maquinas() {
    global $conn;
    $res  = $conn->query("SELECT Id AS id, Descripcion AS label FROM nisira_maquinas ORDER BY Descripcion");
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode(['success' => true, 'data' => $rows]);
}

function listar_productos() {
    global $conn;
    $busq = isset($_GET['q']) ? '%' . trim($_GET['q']) . '%' : '%';

    // Filtro por grupos productivos (valores exactos según la BD)
    $stmt = $conn->prepare(
        "SELECT id, codigo, nombre, grupo
         FROM sig_cc_productos
         WHERE activo = 1
           AND (codigo LIKE ? OR nombre LIKE ?)
           AND LOWER(TRIM(grupo)) IN (
             'materia prima',
             'materiales auxiliares',
             'productos en proceso',
             'producto terminado cu',
             'producto terminado cc',
             'producto terminado cp',
             'producto terminado ca',
             'producto terminado cm',
             'producto terminado parihuelas'
           )
         ORDER BY nombre LIMIT 5000"
    );
    $stmt->bind_param('ss', $busq, $busq);
    $stmt->execute();
    $res  = $stmt->get_result();
    $rows = [];
    while ($r = $res->fetch_assoc()) {
        $rows[] = [
            'id'     => $r['id'],
            'codigo' => $r['codigo'],
            'nombre' => $r['nombre'],
            'label'  => trim($r['codigo']) . ' - ' . trim($r['nombre']),
            'grupo'  => $r['grupo'],
        ];
    }
    echo json_encode(['success' => true, 'data' => $rows]);
}

// ══ Diagnóstico: ver grupos distintos en sig_cc_productos ════════════════
function debug_grupos() {
    global $conn;
    $stmt = $conn->prepare(
        "SELECT TRIM(grupo) AS grupo, COUNT(*) AS total
         FROM sig_cc_productos
         WHERE activo = 1
         GROUP BY TRIM(grupo)
         ORDER BY total DESC
         LIMIT 50"
    );
    $stmt->execute();
    $res  = $stmt->get_result();
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode(['success' => true, 'data' => $rows]);
}

// ══ Turno actual según hora del servidor ═════════════════════════════════

function turno_actual() {
    global $conn;
    // Hora actual del servidor en minutos desde medianoche
    $nowMins = (int)date('H') * 60 + (int)date('i');

    $stmt = $conn->prepare(
        "SELECT id, nombre, hora_inicio, hora_fin FROM sig_turno WHERE activo = 1"
    );
    $stmt->execute();
    $res    = $stmt->get_result();
    $turnos = [];
    while ($r = $res->fetch_assoc()) $turnos[] = $r;

    foreach ($turnos as $t) {
        list($hI, $mI) = array_map('intval', explode(':', $t['hora_inicio']));
        list($hF, $mF) = array_map('intval', explode(':', $t['hora_fin']));
        $ini = $hI * 60 + $mI;
        $fin = $hF * 60 + $mF;

        $enTurno = false;
        if ($ini <= $fin) {
            // Turno normal (no cruza medianoche)
            $enTurno = ($nowMins >= $ini && $nowMins <= $fin);
        } else {
            // Turno que cruza medianoche (ej. NOCHE: 15:45 – 00:14)
            $enTurno = ($nowMins >= $ini || $nowMins <= $fin);
        }

        if ($enTurno) {
            echo json_encode(['success' => true, 'turno' => $t]);
            return;
        }
    }

    // Fuera de rango definido: devolver igual el más cercano o vacío
    echo json_encode(['success' => false, 'turno' => null, 'mensaje' => 'Hora fuera de turno definido']);
}


function listar_materiales_obs() {
    global $conn;
    $almacen = isset($_GET['almacen'])       ? trim($_GET['almacen'])       : '';
    $tipo    = isset($_GET['tipo_producto']) ? trim($_GET['tipo_producto']) : '';

    if (!$almacen) { echo json_encode(['success' => true, 'data' => []]); return; }

    $sql    = "SELECT id, nombre FROM sig_cc_materiales WHERE almacen = ? AND activo = 1";
    $params = [$almacen]; $types = 's';

    if ($almacen === 'PRODUCTOS TERMINADOS' && $tipo !== '') {
        // Materiales de ese tipo O los que aplican a cualquier tipo (NULL)
        $sql .= " AND (tipo_producto = ? OR tipo_producto IS NULL)";
        $params[] = $tipo; $types .= 's';
    }
    $sql .= " ORDER BY nombre";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $res  = $stmt->get_result();
    $mats = [];
    while ($r = $res->fetch_assoc()) {
        $mats[] = ['id' => (int)$r['id'], 'nombre' => $r['nombre'], 'observaciones' => []];
    }

    if (!$mats) { echo json_encode(['success' => true, 'data' => []]); return; }

    // Una sola query para todas las observaciones de esos materiales
    $ids  = array_column($mats, 'id');
    $ph   = implode(',', array_fill(0, count($ids), '?'));
    $stmt2 = $conn->prepare(
        "SELECT id, id_material, nombre FROM sig_cc_observaciones
          WHERE id_material IN ($ph) AND activo = 1 ORDER BY nombre"
    );
    $stmt2->bind_param(str_repeat('i', count($ids)), ...$ids);
    $stmt2->execute();
    $res2 = $stmt2->get_result();

    $idx = array_flip(array_column($mats, 'id'));
    while ($r = $res2->fetch_assoc()) {
        $k = $idx[(int)$r['id_material']] ?? null;
        if ($k !== null) {
            $mats[$k]['observaciones'][] = ['id' => (int)$r['id'], 'nombre' => $r['nombre']];
        }
    }

    echo json_encode(['success' => true, 'data' => $mats]);
}

// ── Materiales ──────────────────────────────────────────────────────

function listar_materiales() {
    global $conn;
    $almacen = isset($_GET['almacen'])       ? trim($_GET['almacen'])       : '';
    $tipo    = isset($_GET['tipo_producto']) ? trim($_GET['tipo_producto']) : '';

    $sql = "SELECT id, nombre, almacen, tipo_producto, activo FROM sig_cc_materiales WHERE 1=1";
    $params = []; $types = '';

    if ($almacen !== '') { $sql .= " AND almacen = ?";       $params[] = $almacen; $types .= 's'; }
    if ($tipo    !== '') { $sql .= " AND tipo_producto = ?"; $params[] = $tipo;    $types .= 's'; }

    $sql .= " ORDER BY almacen, tipo_producto, nombre";

    $stmt = $conn->prepare($sql);
    if ($params) $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $res = $stmt->get_result();
    $data = [];
    while ($r = $res->fetch_assoc()) $data[] = $r;
    echo json_encode(['success' => true, 'data' => $data]);
}

function guardar_material($b) {
    global $conn;
    $id      = isset($b['id']) ? intval($b['id']) : 0;
    $nombre  = strtoupper(trim($b['nombre']  ?? ''));
    $almacen = trim($b['almacen'] ?? '');
    $tipo    = (isset($b['tipo_producto']) && $b['tipo_producto'] !== '') ? trim($b['tipo_producto']) : null;
    $activo  = isset($b['activo']) ? intval($b['activo']) : 1;

    if (!$nombre || !$almacen) {
        echo json_encode(['success' => false, 'mensaje' => 'Nombre y almacén son requeridos']); return;
    }

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE sig_cc_materiales SET nombre=?, almacen=?, tipo_producto=?, activo=? WHERE id=?");
        $stmt->bind_param('sssii', $nombre, $almacen, $tipo, $activo, $id);
    } else {
        $stmt = $conn->prepare("INSERT INTO sig_cc_materiales (nombre, almacen, tipo_producto, activo) VALUES (?,?,?,?)");
        $stmt->bind_param('sssi', $nombre, $almacen, $tipo, $activo);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $id > 0 ? $id : $conn->insert_id]);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error BD: ' . $conn->error]);
    }
}

function eliminar_material($b) {
    global $conn;
    $id = intval($b['id'] ?? 0);
    if (!$id) { echo json_encode(['success' => false, 'mensaje' => 'ID inválido']); return; }

    // Verificar observaciones asociadas
    $chk = $conn->prepare("SELECT COUNT(*) AS c FROM sig_cc_observaciones WHERE id_material = ?");
    $chk->bind_param('i', $id); $chk->execute();
    if ($chk->get_result()->fetch_assoc()['c'] > 0) {
        echo json_encode(['success' => false, 'mensaje' => 'Primero elimina las observaciones del material']); return;
    }

    $stmt = $conn->prepare("DELETE FROM sig_cc_materiales WHERE id = ?");
    $stmt->bind_param('i', $id);
    echo $stmt->execute()
        ? json_encode(['success' => true])
        : json_encode(['success' => false, 'mensaje' => $conn->error]);
}

// ── Observaciones ───────────────────────────────────────────────────

function listar_observaciones() {
    global $conn;
    $id_mat = isset($_GET['id_material']) ? intval($_GET['id_material']) : 0;
    if (!$id_mat) { echo json_encode(['success' => true, 'data' => []]); return; }

    $stmt = $conn->prepare(
        "SELECT id, id_material, nombre, activo FROM sig_cc_observaciones WHERE id_material = ? ORDER BY nombre"
    );
    $stmt->bind_param('i', $id_mat); $stmt->execute();
    $res = $stmt->get_result();
    $data = [];
    while ($r = $res->fetch_assoc()) $data[] = $r;
    echo json_encode(['success' => true, 'data' => $data]);
}

function guardar_observacion($b) {
    global $conn;
    $id          = isset($b['id']) ? intval($b['id']) : 0;
    $id_material = intval($b['id_material'] ?? 0);
    $nombre      = strtoupper(trim($b['nombre'] ?? ''));
    $activo      = isset($b['activo']) ? intval($b['activo']) : 1;

    if (!$nombre || !$id_material) {
        echo json_encode(['success' => false, 'mensaje' => 'Nombre y material son requeridos']); return;
    }

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE sig_cc_observaciones SET nombre=?, activo=? WHERE id=?");
        $stmt->bind_param('sii', $nombre, $activo, $id);
    } else {
        $stmt = $conn->prepare("INSERT INTO sig_cc_observaciones (id_material, nombre, activo) VALUES (?,?,?)");
        $stmt->bind_param('isi', $id_material, $nombre, $activo);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $id > 0 ? $id : $conn->insert_id]);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error BD: ' . $conn->error]);
    }
}

function eliminar_observacion($b) {
    global $conn;
    $id = intval($b['id'] ?? 0);
    if (!$id) { echo json_encode(['success' => false, 'mensaje' => 'ID inválido']); return; }

    // Verificar uso en registros existentes
    $chk = $conn->prepare("SELECT COUNT(*) AS c FROM sig_registrocc_observaciones WHERE id_observacion = ?");
    $chk->bind_param('i', $id); $chk->execute();
    if ($chk->get_result()->fetch_assoc()['c'] > 0) {
        echo json_encode(['success' => false, 'mensaje' => 'La observación está en uso en registros existentes']); return;
    }

    $stmt = $conn->prepare("DELETE FROM sig_cc_observaciones WHERE id = ?");
    $stmt->bind_param('i', $id);
    echo $stmt->execute()
        ? json_encode(['success' => true])
        : json_encode(['success' => false, 'mensaje' => $conn->error]);
}

// ══ Actualizar registro (EDIT) ═══════════════════════════════════════════════
function actualizar_registro($b) {
    global $conn;

    $id             = intval($b['id'] ?? 0);
    $almacen        = strtoupper(trim($b['almacen']        ?? ''));
    $fecha          = trim($b['fecha']          ?? '');
    $turno          = strtoupper(trim($b['turno']          ?? ''));
    $hora           = trim($b['hora']           ?? '');
    $maquina        = strtoupper(trim($b['maquina']        ?? ''));
    $descripcion    = strtoupper(trim($b['descripcion']    ?? ''));
    $tipo_producto  = strtoupper(trim($b['tipo_producto']  ?? '')) ?: null;
    $humedad        = isset($b['humedad_promedio']) ? floatval($b['humedad_promedio']) : null;
    $cant_muestr    = isset($b['cantidad_muestreada']) ? intval($b['cantidad_muestreada']) : 0;
    $observaciones  = strtoupper(trim($b['observaciones'] ?? 'NO'));
    $cant_obs       = ($observaciones === 'SI') ? intval($b['cantidad_observada'] ?? 0) : 0;
    $pct_general    = ($observaciones === 'SI') ? floatval($b['porcentaje_general'] ?? 0) : 0;
    $comentarios    = strtoupper(trim($b['comentarios']    ?? '')) ?: null;
    $acciones       = strtoupper(trim($b['acciones_preventivas'] ?? '')) ?: null;

    if (!$id || !$almacen || !$fecha || !$turno) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan campos obligatorios']); return;
    }

    $conn->begin_transaction();
    try {
        $stmt = $conn->prepare(
            "UPDATE sig_registrocc SET
                almacen = ?, fecha = ?, turno = ?, hora = ?,
                maquina = ?, descripcion = ?,
                tipo_producto = ?, humedad_promedio = ?,
                cantidad_muestreada = ?,
                observaciones = ?, cantidad_observada = ?,
                porcentaje_general = ?,
                comentarios = ?, acciones_preventivas = ?,
                fecha_actualizacion = NOW()
             WHERE id = ? AND (anulado IS NULL OR anulado = 0)"
        );
        $stmt->bind_param(
            'sssssssdisdsssi',
            $almacen, $fecha, $turno, $hora,
            $maquina, $descripcion,
            $tipo_producto, $humedad,
            $cant_muestr,
            $observaciones, $cant_obs,
            $pct_general,
            $comentarios, $acciones,
            $id
        );
        $stmt->execute();

        if ($stmt->affected_rows === 0) {
            $conn->rollback();
            echo json_encode(['success' => false, 'mensaje' => 'Registro no encontrado o ya está anulado']);
            return;
        }

        $conn->commit();
        echo json_encode(['success' => true, 'mensaje' => 'Registro actualizado correctamente']);

    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'mensaje' => 'Error al actualizar: ' . $e->getMessage()]);
    }
}

// ══ Anular registro (ANULAR) ═════════════════════════════════════════════════
function anular_registro($b) {
    global $conn;

    $id = intval($b['id'] ?? 0);
    if (!$id) {
        echo json_encode(['success' => false, 'mensaje' => 'ID inválido']);
        return;
    }

    $stmt = $conn->prepare("UPDATE sig_registrocc SET anulado = 1, fecha_actualizacion = NOW() WHERE id = ? AND (anulado IS NULL OR anulado = 0)");
    $stmt->bind_param('i', $id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'mensaje' => 'Registro anulado correctamente']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Registro no encontrado o ya está anulado']);
    }
}
