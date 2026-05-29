<?php
session_start();
// Capturar errores fatales y devolverlos como JSON
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    echo json_encode(['success' => false, 'mensaje' => "PHP Error [{$errno}]: {$errstr} en {$errfile}:{$errline}"]);
    exit;
});
register_shutdown_function(function() {
    $e = error_get_last();
    if ($e && in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        // Limpiar cualquier output previo y devolver JSON
        if (!headers_sent()) header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'mensaje' => "Fatal: {$e['message']} en {$e['file']}:{$e['line']}"]);
    }
});
require_once __DIR__ . '/../../../shared/conexion.php';
header('Content-Type: application/json; charset=utf-8');

// ── Seguridad: requiere sesión activa (salvo acción pública por token) ──────
$action = $_GET['action'] ?? $_POST['action'] ?? (json_decode(file_get_contents('php://input'), true)['action'] ?? '');
$accionesPublicas = ['obtener_acta_publica', 'guardar_firmas_publica', 'guardar_firma_receptor', 'enviar_pdf_firmado'];
if (empty($_SESSION['IdUsuario']) && !in_array($action, $accionesPublicas)) {
    http_response_code(200); // Siempre 200 para que el JS pueda leer el JSON
    echo json_encode(['success' => false, 'mensaje' => 'Sesión no iniciada.', 'redirect' => '../../public/index.html']);
    exit;
}

$usuarioActual = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : 'sistema';

// ── Dispatcher ────────────────────────────────────────────────
switch ($action) {

    // ── INVENTARIO ──────────────────────────────────────────────

    case 'listar_equipos':
        listar_equipos($conn);
        break;

    case 'obtener_equipo':
        $id = intval($_GET['id'] ?? 0);
        obtener_equipo($conn, $id);
        break;

    case 'guardar_equipo':
        $data = json_decode(file_get_contents('php://input'), true);
        guardar_equipo($conn, $data, $usuarioActual);
        break;

    case 'eliminar_equipo':
        $data = json_decode(file_get_contents('php://input'), true);
        eliminar_equipo($conn, intval($data['id'] ?? 0), $usuarioActual);
        break;

    // ── MOVIMIENTOS ─────────────────────────────────────────────

    case 'listar_movimientos':
        $idEquipo = intval($_GET['id_equipo'] ?? 0);
        listar_movimientos($conn, $idEquipo);
        break;

    case 'guardar_movimiento':
        $data = json_decode(file_get_contents('php://input'), true);
        guardar_movimiento($conn, $data, $usuarioActual);
        break;

    case 'obtener_movimiento':
        $id = intval($_GET['id'] ?? 0);
        obtener_movimiento($conn, $id);
        break;

    // ── COMBOS ──────────────────────────────────────────────────

    case 'cmb_tipos':
        echo json_encode(['success' => true, 'data' => [
            'LAPTOP', 'PC DE ESCRITORIO', 'CELULAR', 'TABLET',
            'IMPRESORA', 'MONITOR', 'UPS', 'SWITCH', 'ROUTER',
            'ESCÁNER', 'PROYECTOR', 'OTRO'
        ]]);
        break;

    case 'cmb_estados_equipo':
        echo json_encode(['success' => true, 'data' => [
            'EN ALMACEN', 'ASIGNADO', 'PENDIENTE SOPORTE',
            'EN SOPORTE TECNICO', 'DE BAJA'
        ]]);
        break;

    case 'cmb_tipos_movimiento':
        echo json_encode(['success' => true, 'data' => [
            'ASIGNACION', 'DEVOLUCION', 'TRASLADO',
            'MANTENIMIENTO', 'RETORNO MANTENIMIENTO', 'BAJA'
        ]]);
        break;

    case 'cmb_usuarios':
        cmb_usuarios($conn);
        break;

    case 'cmb_equipos_disponibles':
        cmb_equipos_disponibles($conn);
        break;

    // ── ACTA DE ENTREGA ─────────────────────────────────────────

    case 'obtener_acta':
        obtener_acta($conn, intval($_GET['id'] ?? 0));
        break;

    case 'generar_token_acta':
        generar_token_acta($conn, intval($_GET['id'] ?? 0));
        break;

    case 'guardar_firma_ti':
        // Paso 1: TI firma el acta (solo firmaEntregador)
        $data = json_decode(file_get_contents('php://input'), true);
        guardar_firma_ti($conn, $data, $usuarioActual);
        break;

    case 'guardar_firmas_presencial':
        // Flujo presencial: TI y receptor firman en el mismo dispositivo
        $data = json_decode(file_get_contents('php://input'), true);
        guardar_firmas_presencial($conn, $data, $usuarioActual);
        break;

    case 'enviar_acta_receptor':
        // Paso 2: enviar correo al receptor con enlace para que firme
        $data = json_decode(file_get_contents('php://input'), true);
        enviar_acta_receptor($conn, $data);
        break;

    case 'guardar_firmas':
        // Backoffice: guardar ambas firmas de una vez (flujo alternativo)
        $data = json_decode(file_get_contents('php://input'), true);
        guardar_firmas($conn, $data, $usuarioActual);
        break;

    case 'obtener_acta_publica':
        obtener_acta_publica($conn, $_GET['token'] ?? '');
        break;

    case 'guardar_firma_receptor':
        // Paso 3: receptor firma desde su correo/celular
        $data = json_decode(file_get_contents('php://input'), true);
        guardar_firma_receptor($conn, $data);
        break;

    case 'guardar_firmas_publica':
        // Alias para compatibilidad
        $data = json_decode(file_get_contents('php://input'), true);
        guardar_firma_receptor($conn, $data);
        break;

    case 'enviar_pdf_firmado':
        // Recibir PDF base64 del cliente y enviarlo por correo a ambas partes
        $data = json_decode(file_get_contents('php://input'), true);
        enviar_pdf_firmado($conn, $data);
        break;

    default:
        echo json_encode(['success' => false, 'mensaje' => 'Acción no reconocida: ' . htmlspecialchars($action)]);
        break;
}

// ════════════════════════════════════════════════════════════════
// FUNCIONES
// ════════════════════════════════════════════════════════════════

function listar_equipos($conn) {
    $sql = "SELECT e.*,
                   (SELECT m.Usuario FROM ti_registromovimientosequipos m
                    WHERE m.IdEquipo = e.Id
                    ORDER BY m.Fecha DESC, m.Id DESC
                    LIMIT 1) AS UsuarioAsignado
            FROM ti_equipos e
            ORDER BY e.NInventario ASC, e.Id DESC";
    $res = $conn->query($sql);
    if (!$res) {
        echo json_encode(['success' => false, 'mensaje' => $conn->error]);
        return;
    }
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode(['success' => true, 'data' => $rows]);
}

function obtener_equipo($conn, $id) {
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'Id inválido']); return; }
    $stmt = $conn->prepare("SELECT * FROM ti_equipos WHERE Id = ? LIMIT 1");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $stmt->close();
    if (!$row) { echo json_encode(['success' => false, 'mensaje' => 'Equipo no encontrado']); return; }
    echo json_encode(['success' => true, 'data' => $row]);
}

function guardar_equipo($conn, $data, $usuarioActual) {
    if (empty($data)) { echo json_encode(['success' => false, 'mensaje' => 'Sin datos']); return; }

    $id           = intval($data['Id'] ?? 0);
    $nInventario  = trim($data['NInventario']  ?? '');
    $marca        = trim($data['Marca']        ?? '');
    $tipo         = trim($data['Tipo']         ?? '');
    $modelo       = trim($data['Modelo']       ?? '');
    $nSerie       = trim($data['NSerie']       ?? '');
    $pin          = trim($data['Pin']          ?? '');
    $ubicacion    = trim($data['Ubicacion']    ?? '');
    $correo       = trim($data['Correo']       ?? '');
    $contrasena   = trim($data['Contraseña']   ?? '');
    $estado       = trim($data['Estado']       ?? 'EN ALMACEN');
    $accesorios   = trim($data['Accesorios']   ?? '');
    $observaciones= trim($data['Observaciones']?? '');

    if (empty($marca) || empty($modelo)) {
        echo json_encode(['success' => false, 'mensaje' => 'Marca y Modelo son requeridos.']);
        return;
    }

    if ($id > 0) {
        // UPDATE
        $stmt = $conn->prepare("UPDATE ti_equipos SET
            NInventario=?, Marca=?, Tipo=?, Modelo=?, NSerie=?, Pin=?,
            Ubicacion=?, Correo=?, Contraseña=?, Estado=?, Accesorios=?,
            Observaciones=?, modificadoPor=?, fechaModif=NOW()
            WHERE Id=?");
        $stmt->bind_param('sssssssssssssi',
            $nInventario, $marca, $tipo, $modelo, $nSerie, $pin,
            $ubicacion, $correo, $contrasena, $estado, $accesorios,
            $observaciones, $usuarioActual, $id);
    } else {
        // INSERT
        $stmt = $conn->prepare("INSERT INTO ti_equipos
            (NInventario, Marca, Tipo, Modelo, NSerie, Pin,
             Ubicacion, Correo, Contraseña, Estado, Accesorios,
             Observaciones, creadoPor, fechaCreacion)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())");
        $stmt->bind_param('sssssssssssss',
            $nInventario, $marca, $tipo, $modelo, $nSerie, $pin,
            $ubicacion, $correo, $contrasena, $estado, $accesorios,
            $observaciones, $usuarioActual);
    }

    if ($stmt->execute()) {
        $newId = $id > 0 ? $id : $conn->insert_id;
        echo json_encode(['success' => true, 'id' => $newId, 'mensaje' => $id > 0 ? 'Equipo actualizado.' : 'Equipo registrado.']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => $stmt->error]);
    }
    $stmt->close();
}

function eliminar_equipo($conn, $id, $usuarioActual) {
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'Id inválido']); return; }
    // Soft-delete: cambiar estado a "De baja" y registrar quién lo hizo
    $stmt = $conn->prepare("UPDATE ti_equipos SET Estado='De baja', modificadoPor=?, fechaModif=NOW() WHERE Id=?");
    $stmt->bind_param('si', $usuarioActual, $id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'mensaje' => 'Equipo dado de baja.']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => $stmt->error]);
    }
    $stmt->close();
}

function listar_movimientos($conn, $idEquipo = 0) {
    if ($idEquipo > 0) {
        $stmt = $conn->prepare("SELECT * FROM ti_registromovimientosequipos WHERE IdEquipo = ? ORDER BY Fecha DESC, Id DESC");
        $stmt->bind_param('i', $idEquipo);
        $stmt->execute();
        $res = $stmt->get_result();
        $stmt->close();
    } else {
        $res = $conn->query("SELECT * FROM ti_registromovimientosequipos ORDER BY Fecha DESC, Id DESC");
    }
    if (!$res) { echo json_encode(['success' => false, 'mensaje' => $conn->error]); return; }
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode(['success' => true, 'data' => $rows]);
}

function obtener_movimiento($conn, $id) {
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'Id inválido']); return; }
    $stmt = $conn->prepare("SELECT * FROM ti_registromovimientosequipos WHERE Id = ? LIMIT 1");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $stmt->close();
    if (!$row) { echo json_encode(['success' => false, 'mensaje' => 'Movimiento no encontrado']); return; }
    echo json_encode(['success' => true, 'data' => $row]);
}

function guardar_movimiento($conn, $data, $usuarioActual) {
    if (empty($data)) { echo json_encode(['success' => false, 'mensaje' => 'Sin datos']); return; }

    $id             = intval($data['Id']            ?? 0);
    $idEquipo       = intval($data['IdEquipo']       ?? 0);
    $usuario        = trim($data['Usuario']          ?? '');
    $cargo          = trim($data['Cargo']            ?? '');
    $area           = trim($data['Area']             ?? '');
    $marca          = trim($data['Marca']            ?? '');
    $tipo           = trim($data['Tipo']             ?? '');
    $modelo         = trim($data['Modelo']           ?? '');
    $nSerie         = trim($data['NSerie']           ?? '');
    $pin            = trim($data['Pin']              ?? '');
    $ubicacion      = trim($data['Ubicacion']        ?? '');
    $nInventario    = trim($data['NInventario']      ?? '');
    $correo         = trim($data['Correo']           ?? '');
    $contrasena     = trim($data['Contraseña']       ?? '');
    $fecha          = trim($data['Fecha']            ?? date('Y-m-d'));
    $tipoMovimiento = trim($data['TipoMovimiento']   ?? '');
    $accesorios     = trim($data['Accesorios']       ?? '');
    $observaciones  = trim($data['Observaciones']    ?? '');

    if (empty($usuario) || empty($tipoMovimiento)) {
        echo json_encode(['success' => false, 'mensaje' => 'Usuario y Tipo de Movimiento son requeridos.']);
        return;
    }

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE ti_registromovimientosequipos SET
            IdEquipo=?, Usuario=?, Cargo=?, Area=?, Marca=?, Tipo=?,
            Modelo=?, NSerie=?, Pin=?, Ubicacion=?, NInventario=?,
            Correo=?, Contraseña=?, Fecha=?, TipoMovimiento=?, Accesorios=?,
            Observaciones=?, modificadoPor=?, fechaModif=NOW()
            WHERE Id=?");
        $stmt->bind_param('isssssssssssssssssi',
            $idEquipo, $usuario, $cargo, $area, $marca, $tipo,
            $modelo, $nSerie, $pin, $ubicacion, $nInventario,
            $correo, $contrasena, $fecha, $tipoMovimiento, $accesorios,
            $observaciones, $usuarioActual, $id);
    } else {
        $stmt = $conn->prepare("INSERT INTO ti_registromovimientosequipos
            (IdEquipo, Usuario, Cargo, Area, Marca, Tipo, Modelo, NSerie,
             Pin, Ubicacion, NInventario, Correo, Contraseña, Fecha,
             TipoMovimiento, Accesorios, Observaciones, registradoPor, fechaRegistro)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())");
        $stmt->bind_param('isssssssssssssssss',
            $idEquipo, $usuario, $cargo, $area, $marca, $tipo,
            $modelo, $nSerie, $pin, $ubicacion, $nInventario,
            $correo, $contrasena, $fecha, $tipoMovimiento, $accesorios,
            $observaciones, $usuarioActual);
    }

    if (!$stmt->execute()) {
        echo json_encode(['success' => false, 'mensaje' => $stmt->error]);
        $stmt->close();
        return;
    }
    $newId = $id > 0 ? $id : $conn->insert_id;
    $stmt->close();

    // Actualizar estado del equipo en ti_equipos según tipo de movimiento
    if ($idEquipo > 0) {
        $nuevoEstado = null;
        switch ($tipoMovimiento) {
            case 'ASIGNACION':           $nuevoEstado = 'ASIGNADO';          break;
            case 'DEVOLUCION':           $nuevoEstado = 'EN ALMACEN';        break;
            case 'TRASLADO':             $nuevoEstado = 'ASIGNADO';          break;
            case 'MANTENIMIENTO':        $nuevoEstado = 'PENDIENTE SOPORTE'; break;
            case 'RETORNO MANTENIMIENTO': $nuevoEstado = 'EN ALMACEN';       break;
            case 'BAJA':                 $nuevoEstado = 'DE BAJA';           break;
        }
        if ($nuevoEstado !== null) {
            $upd = $conn->prepare("UPDATE ti_equipos SET Estado=?, modificadoPor=?, fechaModif=NOW() WHERE Id=?");
            $upd->bind_param('ssi', $nuevoEstado, $usuarioActual, $idEquipo);
            $upd->execute();
            $upd->close();
        }
    }

    echo json_encode(['success' => true, 'id' => $newId, 'mensaje' => $id > 0 ? 'Movimiento actualizado.' : 'Movimiento registrado.']);
}

function cmb_usuarios($conn) {
    $res = $conn->query("SELECT IdColaborador, Colaborador, Puesto, CentroCostos
                         FROM rrhhcolaboradores
                         ORDER BY Colaborador ASC");
    if (!$res) { echo json_encode(['success' => false, 'mensaje' => $conn->error]); return; }
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode(['success' => true, 'data' => $rows]);
}

function cmb_equipos_disponibles($conn) {
    $res = $conn->query("SELECT Id, NInventario, Marca, Tipo, Modelo, NSerie, Estado, Ubicacion, Correo, Contraseña, Pin
                         FROM ti_equipos
                         ORDER BY NInventario ASC, Marca ASC");
    if (!$res) { echo json_encode(['success' => false, 'mensaje' => $conn->error]); return; }
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode(['success' => true, 'data' => $rows]);
}

// ════════════════════════════════════════════════════════════════
// ACTA DE ENTREGA
// ════════════════════════════════════════════════════════════════

/**
 * Reconstruye un data URI completo desde base64 puro o desde un data URI ya completo.
 * El JS envía solo el base64 sin prefijo para evitar filtros de ModSecurity.
 */
function reconstruirDataUri($raw) {
    $raw = trim($raw);
    if (empty($raw)) return '';
    if (substr($raw, 0, 5) === 'data:') return $raw;
    if (substr($raw, 0, 3) === '/9j' || substr($raw, 0, 3) === '/9J') {
        return 'data:image/jpeg;base64,' . $raw;
    }
    if (substr($raw, 0, 5) === 'iVBOR') {
        return 'data:image/png;base64,' . $raw;
    }
    return 'data:image/jpeg;base64,' . $raw;
}

function obtener_acta($conn, $id) {
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'ID inválido']); return; }
    $stmt = $conn->prepare("SELECT m.* FROM ti_registromovimientosequipos m WHERE m.Id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    if (!$row) { echo json_encode(['success' => false, 'mensaje' => 'Movimiento no encontrado']); return; }
    echo json_encode(['success' => true, 'data' => $row]);
}

function generar_token_acta($conn, $id) {
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'ID inválido']); return; }
    $check = $conn->prepare("SELECT actaToken FROM ti_registromovimientosequipos WHERE Id=?");
    $check->bind_param('i', $id);
    $check->execute();
    $existing = $check->get_result()->fetch_assoc();
    $check->close();
    if (!empty($existing['actaToken'])) {
        echo json_encode(['success' => true, 'token' => $existing['actaToken']]); return;
    }
    $token = bin2hex(random_bytes(24));
    $stmt = $conn->prepare("UPDATE ti_registromovimientosequipos SET actaToken=? WHERE Id=?");
    $stmt->bind_param('si', $token, $id);
    $stmt->execute();
    $stmt->close();
    echo json_encode(['success' => true, 'token' => $token]);
}

function obtener_acta_publica($conn, $token) {
    if (empty($token)) { echo json_encode(['success' => false, 'mensaje' => 'Token inválido']); return; }
    $token = substr(preg_replace('/[^a-f0-9]/', '', $token), 0, 48);
    $stmt = $conn->prepare("SELECT m.* FROM ti_registromovimientosequipos m WHERE m.actaToken = ?");
    $stmt->bind_param('s', $token);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    if (!$row) { echo json_encode(['success' => false, 'mensaje' => 'Enlace inválido o expirado']); return; }
    // Ocultar campos sensibles en acceso público
    unset($row['Correo'], $row['Contraseña'], $row['Pin']);
    // Si TI no ha firmado aún, el receptor no puede acceder
    if (empty($row['actaFirmadaTI'])) {
        echo json_encode(['success' => false, 'mensaje' => 'El acta aún no ha sido firmada por el área de TI. Por favor espera a que te notifiquen.']);
        return;
    }
    echo json_encode(['success' => true, 'data' => $row]);
}

/**
 * Paso 1: TI firma el acta (firmaEntregador)
 */
function guardar_firma_ti($conn, $data, $usuarioActual) {
    $id              = intval($data['id'] ?? 0);
    // Acepta el campo sin prefijo (_b64) o con prefijo completo
    $rawFirma        = $data['firmaEntregador_b64'] ?? $data['firmaEntregador'] ?? '';
    $firmaEntregador = reconstruirDataUri($rawFirma);
    $nombreTI        = trim($data['nombreTI'] ?? $usuarioActual);

    if ($id <= 0 || empty($firmaEntregador)) {
        echo json_encode(['success' => false, 'mensaje' => 'ID y firma requeridos']); return;
    }

    // Generar token si no existe
    $check = $conn->prepare("SELECT actaToken, actaFirmadaTI FROM ti_registromovimientosequipos WHERE Id=?");
    $check->bind_param('i', $id);
    $check->execute();
    $row = $check->get_result()->fetch_assoc();
    $check->close();

    $token = $row['actaToken'] ?? '';
    if (empty($token)) {
        $token = bin2hex(random_bytes(24));
    }

    $stmt = $conn->prepare("UPDATE ti_registromovimientosequipos
                            SET firmaEntregador=?, actaFirmadaTI=1, actaToken=?, actaNombreTI=?
                            WHERE Id=?");
    $stmt->bind_param('sssi', $firmaEntregador, $token, $nombreTI, $id);
    if (!$stmt->execute()) {
        $err = $stmt->error;
        $stmt->close();
        echo json_encode(['success' => false, 'mensaje' => 'Error al guardar firma TI: ' . $err]); return;
    }
    $stmt->close();
    echo json_encode(['success' => true, 'token' => $token, 'mensaje' => 'Firma TI guardada.']);
}

/**
 * Flujo presencial: TI y receptor firman en el mismo dispositivo
 */
function guardar_firmas_presencial($conn, $data, $usuarioActual) {
    $id      = intval($data['id'] ?? 0);
    $rawFirmaE = $data['firmaEntregador_b64'] ?? $data['firmaEntregador'] ?? '';
    $rawFirmaR = $data['firmaReceptor_b64']   ?? $data['firmaReceptor']   ?? '';
    $nombreTI  = trim($data['nombreTI'] ?? $usuarioActual);

    if ($id <= 0 || empty($rawFirmaE) || empty($rawFirmaR)) {
        echo json_encode(['success' => false, 'mensaje' => 'ID y ambas firmas son requeridas']); return;
    }

    $firmaEntregador = reconstruirDataUri($rawFirmaE);
    $firmaReceptor   = reconstruirDataUri($rawFirmaR);

    $check = $conn->prepare("SELECT actaToken, actaFirmada FROM ti_registromovimientosequipos WHERE Id=? LIMIT 1");
    $check->bind_param('i', $id);
    $check->execute();
    $row = $check->get_result()->fetch_assoc();
    $check->close();

    if (!$row) { echo json_encode(['success' => false, 'mensaje' => 'Movimiento no encontrado']); return; }
    if (!empty($row['actaFirmada'])) { echo json_encode(['success' => false, 'mensaje' => 'Esta acta ya fue firmada']); return; }

    $token = $row['actaToken'] ?: bin2hex(random_bytes(24));

    $stmt = $conn->prepare("UPDATE ti_registromovimientosequipos
                            SET firmaEntregador=?, firmaReceptor=?,
                                actaFirmadaTI=1, actaFirmada=1, actaFechaFirma=NOW(),
                                actaToken=?, actaNombreTI=?
                            WHERE Id=?");
    $stmt->bind_param('ssssi', $firmaEntregador, $firmaReceptor, $token, $nombreTI, $id);
    if (!$stmt->execute()) {
        $err = $stmt->error; $stmt->close();
        echo json_encode(['success' => false, 'mensaje' => 'Error al guardar firmas: ' . $err]); return;
    }
    $stmt->close();
    echo json_encode(['success' => true, 'token' => $token, 'mensaje' => 'Acta firmada presencialmente.']);
}

/**
 * Paso 2: enviar correo al receptor con enlace del acta
 */
function enviar_acta_receptor($conn, $data) {
    $id = intval($data['id'] ?? 0);
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'ID requerido']); return; }

    // Cargar datos del movimiento
    $stmt = $conn->prepare("SELECT * FROM ti_registromovimientosequipos WHERE Id=? LIMIT 1");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $mov = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$mov) { echo json_encode(['success' => false, 'mensaje' => 'Movimiento no encontrado']); return; }
    if (empty($mov['actaFirmadaTI'])) { echo json_encode(['success' => false, 'mensaje' => 'TI debe firmar primero']); return; }
    if (empty($mov['Correo'])) { echo json_encode(['success' => false, 'mensaje' => 'El equipo no tiene correo registrado para el receptor']); return; }

    $cfg     = require __DIR__ . '/../mail_config.php';
    $token   = $mov['actaToken'];
    $baseUrl = rtrim($cfg['base_url'], '/');
    // Calcular ruta relativa al document root para que funcione en local (/BACKOFFICE/...)
    // y en hosting (/sistemas/...) sin hardcodear la carpeta BACKOFFICE
    $docRoot  = rtrim(str_replace('\\', '/', realpath($_SERVER['DOCUMENT_ROOT'] ?? '')), '/');
    $actaDir  = rtrim(str_replace('\\', '/', realpath(__DIR__ . '/..')), '/');
    $relPath  = $docRoot ? substr($actaDir, strlen($docRoot)) : '/sistemas/movimiento_ti';
    $enlace   = "{$baseUrl}{$relPath}/acta.php?token={$token}";

    $nombre   = htmlspecialchars($mov['Usuario']    ?? 'Colaborador');
    $equipo   = htmlspecialchars(($mov['Marca'] ?? '') . ' ' . ($mov['Modelo'] ?? ''));
    $nSerie   = htmlspecialchars($mov['NSerie']     ?? '');
    $fecha    = htmlspecialchars($mov['Fecha']      ?? '');
    $nombreTI = htmlspecialchars($mov['actaNombreTI'] ?? 'Área de TI');

    $asunto = "Acta de Recepción de Equipo – Campo Andino S.A.C.";

    $html = <<<HTML
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f8fb;margin:0;padding:20px">
  <div style="max-width:580px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1)">
    <div style="background:linear-gradient(90deg,#1fa9a0,#17857e);padding:28px 32px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:1.3rem;font-weight:700">Campo Andino S.A.C.</h1>
      <p style="color:rgba(255,255,255,.85);margin:6px 0 0;font-size:.95rem">Área de Tecnología de la Información</p>
    </div>
    <div style="padding:32px 32px 24px">
      <p style="color:#333;font-size:1rem;margin:0 0 18px">Estimado(a) <strong>{$nombre}</strong>,</p>
      <p style="color:#555;font-size:.95rem;line-height:1.6;margin:0 0 18px">
        El área de TI ha preparado el <strong>Acta de Recepción de Equipo</strong> correspondiente al equipo
        <strong>{$equipo}</strong> (N° Serie: <strong>{$nSerie}</strong>) asignado a usted con fecha <strong>{$fecha}</strong>.
      </p>
      <p style="color:#555;font-size:.95rem;line-height:1.6;margin:0 0 24px">
        Por favor acceda al siguiente enlace para <strong>leer y firmar digitalmente</strong> el acta.
        Puede hacerlo desde su computadora o celular.
      </p>
      <div style="text-align:center;margin:0 0 28px">
        <a href="{$enlace}"
           style="display:inline-block;background:#1fa9a0;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:1rem;font-weight:700">
          ✍ Firmar Acta de Recepción
        </a>
      </div>
      <p style="color:#888;font-size:.82rem;margin:0 0 8px">Si el botón no funciona, copie y pegue este enlace en su navegador:</p>
      <p style="color:#1fa9a0;font-size:.82rem;word-break:break-all;margin:0 0 24px">{$enlace}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:0 0 18px">
      <p style="color:#aaa;font-size:.80rem;margin:0">
        Este correo fue enviado por <strong>{$nombreTI}</strong> &mdash; Campo Andino S.A.C.<br>
        Si tiene dudas, comuníquese con el área de TI.
      </p>
    </div>
  </div>
</body>
</html>
HTML;

    require_once __DIR__ . '/../mailer.php';
    $to     = $mov['Correo'];
    $toFmt  = "{$nombre} <{$mov['Correo']}>";
    $result = enviarCorreo($cfg, $toFmt, $asunto, $html);

    // Si SMTP falla, intentar con mail() nativo del hosting (cPanel/Exim)
    if ($result !== true) {
        $errorSmtp = $result;
        // Usar sendmail_from para que Exim envíe correctamente
        @ini_set('sendmail_from', $cfg['from_email']);
        $subjectEnc = "=?UTF-8?B?" . base64_encode($asunto) . "?=";
        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: =?UTF-8?B?" . base64_encode($cfg['from_name']) . "?= <{$cfg['from_email']}>\r\n";
        $headers .= "Reply-To: {$cfg['from_email']}\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
        $ok = @mail($to, $subjectEnc, $html, $headers);
        $result = $ok ? true : "SMTP: {$errorSmtp} | mail(): fallo tambien";
    }

    if ($result === true) {
        $upd = $conn->prepare("UPDATE ti_registromovimientosequipos SET actaCorreoEnviado=1 WHERE Id=?");
        $upd->bind_param('i', $id);
        $upd->execute();
        $upd->close();
        echo json_encode(['success' => true, 'mensaje' => "Correo enviado a {$mov['Correo']}"]);
    } else {
        echo json_encode(['success' => false, 'mensaje' => $result, 'enlace' => $enlace]);
    }
}

/**
 * Paso 3: receptor firma desde enlace público (cierra el acta)
 */
function guardar_firma_receptor($conn, $data) {
    $token    = $data['token'] ?? '';
    // Acepta el campo sin prefijo (_b64) o con prefijo completo
    $rawFirma = $data['firmaReceptor_b64'] ?? $data['firmaReceptor'] ?? '';
    $firmaReceptor = reconstruirDataUri($rawFirma);

    if (empty($token) || empty($firmaReceptor)) {
        echo json_encode(['success' => false, 'mensaje' => 'Token y firma requeridos']); return;
    }

    $token = substr(preg_replace('/[^a-f0-9]/', '', $token), 0, 48);

    // Verificar que TI firmó y que aún no está cerrada
    $check = $conn->prepare("SELECT Id, actaFirmadaTI, actaFirmada, Correo, Usuario, actaNombreTI, firmaEntregador
                              FROM ti_registromovimientosequipos WHERE actaToken=? LIMIT 1");
    $check->bind_param('s', $token);
    $check->execute();
    $mov = $check->get_result()->fetch_assoc();
    $check->close();

    if (!$mov) { echo json_encode(['success' => false, 'mensaje' => 'Enlace inválido']); return; }
    if (empty($mov['actaFirmadaTI'])) { echo json_encode(['success' => false, 'mensaje' => 'TI aún no ha firmado esta acta']); return; }
    if (!empty($mov['actaFirmada'])) { echo json_encode(['success' => false, 'actaYaCerrada' => true, 'mensaje' => 'Esta acta ya fue firmada previamente.']); return; }

    $stmt = $conn->prepare("UPDATE ti_registromovimientosequipos
                            SET firmaReceptor=?, actaFirmada=1, actaFechaFirma=NOW()
                            WHERE actaToken=?");
    $stmt->bind_param('ss', $firmaReceptor, $token);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => true, 'mensaje' => 'Acta firmada y cerrada correctamente. Recibirás una copia en tu correo.']);
    // El PDF con ambas firmas se envía desde el cliente vía enviar_pdf_firmado
}

/**
 * (Función eliminada: enviar_copia_pdf_ambos era redundante con enviar_pdf_firmado)
 */
function enviar_copia_pdf_ambos($conn, $id) {
    // No hace nada — el envío del PDF lo hace enviar_pdf_firmado desde el cliente
    return;
}

/**
 * Recibir PDF en base64 desde el cliente y enviarlo por correo
 */
function enviar_pdf_firmado($conn, $data) {
    $id        = intval($data['id'] ?? 0);
    $token     = $data['token'] ?? '';
    $pdfBase64 = $data['pdf']   ?? '';

    if (empty($pdfBase64)) { echo json_encode(['success' => false, 'mensaje' => 'PDF requerido']); return; }

    // Obtener el movimiento
    if ($id > 0) {
        $stmt = $conn->prepare("SELECT * FROM ti_registromovimientosequipos WHERE Id=? LIMIT 1");
        $stmt->bind_param('i', $id);
    } else {
        $t = substr(preg_replace('/[^a-f0-9]/', '', $token), 0, 48);
        $stmt = $conn->prepare("SELECT * FROM ti_registromovimientosequipos WHERE actaToken=? LIMIT 1");
        $stmt->bind_param('s', $t);
    }
    $stmt->execute();
    $mov = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$mov) { echo json_encode(['success' => false, 'mensaje' => 'Movimiento no encontrado']); return; }

    $cfg      = require __DIR__ . '/../mail_config.php';
    require_once __DIR__ . '/../mailer.php';

    $nombre   = $mov['Usuario']      ?? 'Colaborador';
    $nombreTI = $mov['actaNombreTI'] ?? 'Área de TI';
    $fecha    = date('d/m/Y');
    $asunto   = "Acta de Recepción FIRMADA – Campo Andino – {$nombre}";
    $nombrePDF = 'Acta_' . preg_replace('/[^a-zA-Z0-9]/', '_', $nombre) . '_' . date('Ymd') . '.pdf';

    $htmlCuerpo = <<<HTML
<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f8fb;padding:20px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1)">
  <div style="background:linear-gradient(90deg,#1fa9a0,#17857e);padding:22px 26px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:1.15rem">Campo Andino S.A.C. – TI</h1>
  </div>
  <div style="padding:26px">
    <div style="background:#d4edda;border:1px solid #c3e6cb;border-radius:8px;padding:12px 16px;text-align:center;margin-bottom:18px">
      <strong style="color:#155724">✔ Acta de Recepción firmada por ambas partes</strong>
    </div>
    <p style="color:#333">Adjunto encontrará el PDF del acta firmada el día <strong>{$fecha}</strong>.</p>
    <p style="color:#aaa;font-size:.8rem;margin-top:20px">Campo Andino S.A.C. &mdash; {$nombreTI}</p>
  </div>
</div>
</body></html>
HTML;

    $adjunto = [['nombre' => $nombrePDF, 'mime' => 'application/pdf', 'data' => $pdfBase64]];
    $errores = [];

    // Enviar al receptor
    if (!empty($mov['Correo'])) {
        $r = enviarCorreo($cfg, "{$nombre} <{$mov['Correo']}>", $asunto, $htmlCuerpo, $adjunto);
        if ($r !== true) $errores[] = "Receptor: {$r}";
    }

    // Copia al área TI
    if (!empty($cfg['from_email'])) {
        $r2 = enviarCorreo($cfg, $cfg['from_email'], "[COPIA TI] {$asunto}", $htmlCuerpo, $adjunto);
        if ($r2 !== true) $errores[] = "TI: {$r2}";
    }

    if (empty($errores)) {
        echo json_encode(['success' => true, 'mensaje' => 'PDF enviado correctamente a las dos partes.']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Algunos correos fallaron: ' . implode(' | ', $errores)]);
    }
}

/**
 * Guardar ambas firmas de una vez (flujo alternativo backoffice)
 */
function guardar_firmas($conn, $data, $usuarioActual) {
    $id              = intval($data['id'] ?? 0);
    $firmaEntregador = $data['firmaEntregador'] ?? '';
    $firmaReceptor   = $data['firmaReceptor']   ?? '';
    $nombreTI        = trim($data['nombreTI'] ?? $usuarioActual);

    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'ID requerido']); return; }

    // Generar token si no tiene
    $check = $conn->prepare("SELECT actaToken FROM ti_registromovimientosequipos WHERE Id=?");
    $check->bind_param('i', $id);
    $check->execute();
    $row   = $check->get_result()->fetch_assoc();
    $check->close();
    $token = $row['actaToken'] ?? '';
    if (empty($token)) $token = bin2hex(random_bytes(24));

    $stmt = $conn->prepare("UPDATE ti_registromovimientosequipos
                            SET firmaEntregador=?, firmaReceptor=?, actaFirmadaTI=1,
                                actaFirmada=1, actaFechaFirma=NOW(), actaToken=?, actaNombreTI=?
                            WHERE Id=?");
    $stmt->bind_param('ssssi', $firmaEntregador, $firmaReceptor, $token, $nombreTI, $id);
    $stmt->execute();
    $stmt->close();
    echo json_encode(['success' => true, 'mensaje' => 'Acta firmada y guardada correctamente.']);
}
