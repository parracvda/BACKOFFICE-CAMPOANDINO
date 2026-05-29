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
        if (!headers_sent()) header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'mensaje' => "Fatal: {$e['message']} en {$e['file']}:{$e['line']}"]);
    }
});
require_once __DIR__ . '/../../../shared/conexion.php';
header('Content-Type: application/json; charset=utf-8');

// ── Helper: leer datos desde POST o JSON ──────────────────────
function obtenerDatos() {
    $ct = $_SERVER['CONTENT_TYPE'] ?? '';
    if (strpos($ct, 'application/json') !== false) {
        return json_decode(file_get_contents('php://input'), true) ?: [];
    }
    return $_POST;
}

// ── Seguridad: requiere sesión activa ──────────────────────────
$action = $_GET['action'] ?? $_POST['action'] ?? (json_decode(file_get_contents('php://input'), true)['action'] ?? '');
if (empty($_SESSION['IdUsuario'])) {
    http_response_code(200);
    echo json_encode(['success' => false, 'mensaje' => 'Sesión no iniciada.', 'redirect' => '../../public/index.html']);
    exit;
}

$usuarioActual = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : 'sistema';

// ── Dispatcher ────────────────────────────────────────────────
switch ($action) {

    // ── CATEGORÍAS ──────────────────────────────────────────────
    case 'listar_categorias':
        listar_categorias($conn);
        break;

    // ── MAESTRO DE ACTIVOS ──────────────────────────────────────
    case 'listar_activos':
        listar_activos($conn);
        break;

    case 'obtener_activo':
        $id = intval($_GET['id'] ?? 0);
        obtener_activo($conn, $id);
        break;

    case 'guardar_activo':
        guardar_activo($conn, obtenerDatos(), $usuarioActual);
        break;

    case 'eliminar_activo':
        $data = obtenerDatos();
        eliminar_activo($conn, intval($data['id'] ?? 0), $usuarioActual);
        break;

    case 'cambiar_estado_activo':
        cambiar_estado_activo($conn, obtenerDatos(), $usuarioActual);
        break;

    // ── OPERADORES ──────────────────────────────────────────────
    case 'listar_operadores':
        listar_operadores($conn);
        break;

    case 'obtener_operador':
        $id = intval($_GET['id'] ?? 0);
        obtener_operador($conn, $id);
        break;

    case 'guardar_operador':
        guardar_operador($conn, obtenerDatos());
        break;

    case 'eliminar_operador':
        $data = obtenerDatos();
        eliminar_operador($conn, intval($data['id'] ?? 0));
        break;

    // ── CHECKLIST DIARIO ────────────────────────────────────────
    case 'listar_checklists':
        listar_checklists($conn);
        break;

    case 'obtener_checklist':
        $id = intval($_GET['id'] ?? 0);
        obtener_checklist($conn, $id);
        break;

    case 'guardar_checklist':
        guardar_checklist($conn, obtenerDatos(), $usuarioActual);
        break;

    case 'eliminar_checklist':
        $data = obtenerDatos();
        eliminar_checklist($conn, intval($data['id'] ?? 0));
        break;

    // ── COMBOS ──────────────────────────────────────────────────
    case 'cmb_tipos_activo':
        echo json_encode(['success' => true, 'data' => [
            'CAMION', 'CAMIONETA', 'MONTACARGAS', 'STOCKA', 'OTRO'
        ]]);
        break;

    case 'cmb_estados_activo':
        echo json_encode(['success' => true, 'data' => [
            'OPERATIVO', 'EN MANTENIMIENTO', 'INOPERATIVO', 'DE BAJA'
        ]]);
        break;

    case 'cmb_combustibles':
        echo json_encode(['success' => true, 'data' => [
            'DIESEL', 'GASOLINA 90', 'GASOLINA 95', 'GASOLINA 98',
            'ELECTRICO', 'GLP', 'GNV', 'HIBRIDO'
        ]]);
        break;

    case 'cmb_items_checklist':
        // Grupos e items del checklist (estructura árbol)
        $grupos = [
            [
                'id_grupo' => 1,
                'nombre_grupo' => 'Motor',
                'items' => [
                    'Funcionamiento del motor',
                    'Revisar nivel de refrigerante',
                    'Revisar estado del radiador',
                    'Verificar estado de las mangueras',
                    'Verificar estado del ventilador / paletas',
                    'Inspeccionar fajas del ventilador y alternador',
                    'Revisar nivel de aceite',
                    'Examinar filtro separador de combustible y agua (purgar)',
                    'Estado del equipo de gas GLP',
                    'Revisar estado del filtro de aire',
                    'Inspeccionar sistema de combustible, mangueras, cañerías e inyectores',
                    'Verificar fugas de combustible',
                    'Revisar estado del silenciador y empaques del sistema de escape',
                    'Verificar compresor de aire',
                    'Revisar estado de soportes del motor'
                ]
            ],
            [
                'id_grupo' => 2,
                'nombre_grupo' => 'Transmisión',
                'items' => [
                    'Revisar nivel de aceite de la caja de transmisión',
                    'Verificar que no existan fugas de aceite de la caja de transmisión',
                    'Verificar nivel de aceite',
                    'Verificar nivel de corona',
                    'Verificar respiradero de corona',
                    'Verificar aceite de mando final'
                ]
            ],
            [
                'id_grupo' => 3,
                'nombre_grupo' => 'Dirección',
                'items' => [
                    'Verificar funcionamiento del orbitrol',
                    'Verificar pistón de dirección',
                    'Verificar si existen fugas de aceite por el pistón de dirección',
                    'Verificar pernos de anclaje del puente de dirección',
                    'Verificar pernos de anclaje del pistón de dirección',
                    'Verificar juego de bocamaza',
                    'Verificar puntos de engrase',
                    'Verificar rótulas y pines de dirección',
                    'Verificar tuercas de ruedas'
                ]
            ],
            [
                'id_grupo' => 4,
                'nombre_grupo' => 'Frenos',
                'items' => [
                    'Controlar funcionamiento de los frenos de servicio',
                    'Revisar nivel de líquido de freno',
                    'Revisar si existen fugas',
                    'Verificar carga de aire del sistema',
                    'Controlar funcionamiento de los frenos de emergencia y estacionamiento'
                ]
            ],
            [
                'id_grupo' => 5,
                'nombre_grupo' => 'Sistema Hidráulico',
                'items' => [
                    'Verificar nivel de aceite del sistema',
                    'Revisar tapa del tanque',
                    'Verificar buen funcionamiento de los pistones del mástil',
                    'Verificar estado de los pistones de inclinación del mástil',
                    'Verificar pistón de sideshift',
                    'Verificar que no existan fugas en el sistema',
                    'Verificar buen estado de mangueras y tuberías del sistema',
                    'Verificar bloque de válvula de control principal'
                ]
            ],
            [
                'id_grupo' => 6,
                'nombre_grupo' => 'Aparatos Eléctricos',
                'items' => [
                    'Verificar funcionamiento de las luces direccionales',
                    'Verificar estado de la chapa de contacto',
                    'Verificar funcionamiento del claxon',
                    'Verificar buen funcionamiento de indicadores en el panel del operador',
                    'Verificar estado de la circulina',
                    'Revisar baterías',
                    'Verificar funcionamiento de la alarma de retroceso',
                    'Verificar sistema de carga del alternador',
                    'Verificar cableado del alternador',
                    'Verificar estado de fusibles y relés',
                    'Verificar cableado general del equipo'
                ]
            ],
            [
                'id_grupo' => 7,
                'nombre_grupo' => 'Cabina y Chasis',
                'items' => [
                    'Verificar poleas y rodajes del mástil',
                    'Verificar estado de la cadena',
                    'Verificar pin de remolque',
                    'Estado de pintura',
                    'Funcionamiento de indicadores del tablero',
                    'Funcionamiento de palancas de mando',
                    'Funcionamiento de plumillas',
                    'Estado del asiento del operador',
                    'Estado de correa de seguridad',
                    'Estado de espejos retrovisores',
                    'Estado de espejos laterales',
                    'Verificar parabrisas y lunas en general',
                    'Verificar estado de las puertas',
                    'Verificar estado de los pedales',
                    'Verificar piso',
                    'Verificar engrase general del equipo',
                    'Revisar estado del botiquín completo',
                    'Revisar estado y fecha de caducidad del extintor',
                    'Verificar estado del chasis (golpes, rayaduras, choques o falta de pintura)'
                ]
            ],
            [
                'id_grupo' => 8,
                'nombre_grupo' => 'Llantas y Zapatas',
                'items' => [
                    'Delantera izquierda',
                    'Delantera derecha',
                    'Posterior izquierda',
                    'Posterior derecha',
                    'Zapata / banda de freno',
                    'Condición general de aros y pernos'
                ]
            ],
            [
                'id_grupo' => 9,
                'nombre_grupo' => 'Herramientas',
                'items' => [
                    'Conos de seguridad',
                    'Botiquín',
                    'Extintor',
                    'Cuñas de rueda',
                    'Kit antiderrame'
                ]
            ]
        ];
        echo json_encode(['success' => true, 'data' => $grupos]);
        break;

    // ── MANTENIMIENTO ────────────────────────────────────────────
    case 'listar_mantenimientos':
        listar_mantenimientos($conn);
        break;

    case 'obtener_mantenimiento':
        $id = intval($_GET['id'] ?? 0);
        obtener_mantenimiento($conn, $id);
        break;

    case 'guardar_mantenimiento':
        guardar_mantenimiento($conn, obtenerDatos(), $usuarioActual);
        break;

    case 'eliminar_mantenimiento':
        $data = obtenerDatos();
        eliminar_mantenimiento($conn, intval($data['id'] ?? 0));
        break;

    case 'cmb_tipos_mantenimiento':
        echo json_encode(['success' => true, 'data' => ['PREVENTIVO', 'CORRECTIVO']]);
        break;

    case 'cmb_estados_mantenimiento':
        echo json_encode(['success' => true, 'data' => ['PROGRAMADO', 'EN EJECUCION', 'COMPLETADO', 'CANCELADO']]);
        break;

    // ── ALERTAS DE MANTENIMIENTO ──────────────────────────────────
    case 'listar_alertas':
        listar_alertas($conn);
        break;

    case 'obtener_alerta':
        $id = intval($_GET['id'] ?? 0);
        obtener_alerta($conn, $id);
        break;

    case 'guardar_alerta':
        guardar_alerta($conn, obtenerDatos());
        break;

    case 'eliminar_alerta':
        $data = obtenerDatos();
        eliminar_alerta($conn, intval($data['id'] ?? 0));
        break;

    case 'alertas_proximas':
        alertas_proximas($conn);
        break;

    default:
        echo json_encode(['success' => false, 'mensaje' => 'Acción no reconocida: ' . htmlspecialchars($action)]);
        break;
}

// ════════════════════════════════════════════════════════════════
// FUNCIONES - CATEGORÍAS
// ════════════════════════════════════════════════════════════════

function listar_categorias($conn) {
    $res = $conn->query("SELECT * FROM activos_categoria ORDER BY nombre ASC");
    if (!$res) { echo json_encode(['success' => false, 'mensaje' => $conn->error]); return; }
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode(['success' => true, 'data' => $rows]);
}

// ════════════════════════════════════════════════════════════════
// FUNCIONES - MAESTRO DE ACTIVOS
// ════════════════════════════════════════════════════════════════

function listar_activos($conn) {
    $sql = "SELECT a.*, c.nombre AS categoria_nombre
            FROM activos_maestro a
            LEFT JOIN activos_categoria c ON a.id_categoria = c.id_categoria
            ORDER BY a.fecha_registro DESC";
    $res = $conn->query($sql);
    if (!$res) { echo json_encode(['success' => false, 'mensaje' => $conn->error]); return; }
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode(['success' => true, 'data' => $rows]);
}

function obtener_activo($conn, $id) {
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'Id inválido']); return; }
    $stmt = $conn->prepare("SELECT a.*, c.nombre AS categoria_nombre
                            FROM activos_maestro a
                            LEFT JOIN activos_categoria c ON a.id_categoria = c.id_categoria
                            WHERE a.id_activo = ? LIMIT 1");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $stmt->close();
    if (!$row) { echo json_encode(['success' => false, 'mensaje' => 'Activo no encontrado']); return; }
    echo json_encode(['success' => true, 'data' => $row]);
}

function guardar_activo($conn, $data, $usuarioActual) {
    if (empty($data)) { echo json_encode(['success' => false, 'mensaje' => 'Sin datos']); return; }

    $id                     = intval($data['id_activo'] ?? 0);
    $id_categoria           = intval($data['id_categoria'] ?? 0);
    $codigo_patrimonial     = $conn->real_escape_string(trim($data['codigo_patrimonial'] ?? ''));
    $tipo_activo            = $conn->real_escape_string(trim($data['tipo_activo'] ?? 'CAMION'));
    $altura_elevacion       = floatval($data['altura_elevacion'] ?? 0);
    $longitud_unas          = floatval($data['longitud_unas'] ?? 0);
    $soat_codigo            = $conn->real_escape_string(trim($data['soat_codigo'] ?? ''));
    $soat_vencimiento       = $conn->real_escape_string(trim($data['soat_vencimiento'] ?? ''));
    $revision_tecnica_codigo = $conn->real_escape_string(trim($data['revision_tecnica_codigo'] ?? ''));
    $revision_tecnica_vencimiento = $conn->real_escape_string(trim($data['revision_tecnica_vencimiento'] ?? ''));
    $fecha_adquisicion      = $conn->real_escape_string(trim($data['fecha_adquisicion'] ?? ''));
    $marca                  = $conn->real_escape_string(trim($data['marca'] ?? ''));
    $modelo                 = $conn->real_escape_string(trim($data['modelo'] ?? ''));
    $numero_serie           = $conn->real_escape_string(trim($data['numero_serie'] ?? ''));
    $anio_fabricacion       = intval($data['anio_fabricacion'] ?? 0);
    $color                  = $conn->real_escape_string(trim($data['color'] ?? ''));
    $placa                  = $conn->real_escape_string(trim($data['placa'] ?? ''));
    $kilometraje_actual     = intval($data['kilometraje_actual'] ?? 0);
    $capacidad_carga        = $conn->real_escape_string(trim($data['capacidad_carga'] ?? ''));
    $combustible            = $conn->real_escape_string(trim($data['combustible'] ?? ''));
    $dimensiones            = $conn->real_escape_string(trim($data['dimensiones'] ?? ''));
    $peso_bruto             = floatval($data['peso_bruto'] ?? 0);
    $ubicacion_fisica       = $conn->real_escape_string(trim($data['ubicacion_fisica'] ?? ''));
    $estado_activo          = $conn->real_escape_string(trim($data['estado_activo'] ?? 'OPERATIVO'));
    $valor_libros           = floatval($data['valor_libros'] ?? 0);
    $foto_url               = $conn->real_escape_string(trim($data['foto_url'] ?? ''));
    $observaciones          = $conn->real_escape_string(trim($data['observaciones'] ?? ''));
    $usuarioActualEsc       = $conn->real_escape_string($usuarioActual);

    if ($id_categoria <= 0) {
        echo json_encode(['success' => false, 'mensaje' => 'Debe seleccionar una categoría.']);
        return;
    }
    if (empty($marca) || empty($modelo)) {
        echo json_encode(['success' => false, 'mensaje' => 'Marca y Modelo son requeridos.']);
        return;
    }

    $soat_v = empty($soat_vencimiento) ? 'NULL' : "'$soat_vencimiento'";
    $rt_v   = empty($revision_tecnica_vencimiento) ? 'NULL' : "'$revision_tecnica_vencimiento'";
    $fecha_a = empty($fecha_adquisicion) ? 'NULL' : "'$fecha_adquisicion'";

    if ($id > 0) {
        $sql = "UPDATE activos_maestro SET
            id_categoria=$id_categoria,
            codigo_patrimonial='$codigo_patrimonial',
            tipo_activo='$tipo_activo',
            altura_elevacion=$altura_elevacion,
            longitud_unas=$longitud_unas,
            soat_codigo='$soat_codigo',
            soat_vencimiento=$soat_v,
            revision_tecnica_codigo='$revision_tecnica_codigo',
            revision_tecnica_vencimiento=$rt_v,
            fecha_adquisicion=$fecha_a,
            marca='$marca',
            modelo='$modelo',
            numero_serie='$numero_serie',
            anio_fabricacion=$anio_fabricacion,
            color='$color',
            placa='$placa',
            kilometraje_actual=$kilometraje_actual,
            capacidad_carga='$capacidad_carga',
            combustible='$combustible',
            dimensiones='$dimensiones',
            peso_bruto=$peso_bruto,
            ubicacion_fisica='$ubicacion_fisica',
            estado_activo='$estado_activo',
            valor_libros=$valor_libros,
            foto_url='$foto_url',
            observaciones='$observaciones',
            updated_at=NOW()
            WHERE id_activo=$id";
    } else {
        $sql = "INSERT INTO activos_maestro
            (id_categoria, codigo_patrimonial, tipo_activo, altura_elevacion, longitud_unas,
             soat_codigo, soat_vencimiento, revision_tecnica_codigo, revision_tecnica_vencimiento, fecha_adquisicion,
             marca, modelo, numero_serie, anio_fabricacion, color, placa, kilometraje_actual,
             capacidad_carga, combustible, dimensiones, peso_bruto, ubicacion_fisica,
             estado_activo, valor_libros, foto_url, observaciones, usuario_registro)
            VALUES (
             $id_categoria, '$codigo_patrimonial', '$tipo_activo', $altura_elevacion, $longitud_unas,
             '$soat_codigo', $soat_v, '$revision_tecnica_codigo', $rt_v, $fecha_a,
             '$marca', '$modelo', '$numero_serie', $anio_fabricacion, '$color', '$placa', $kilometraje_actual,
             '$capacidad_carga', '$combustible', '$dimensiones', $peso_bruto, '$ubicacion_fisica',
             '$estado_activo', $valor_libros, '$foto_url', '$observaciones', '$usuarioActualEsc')";
    }

    if ($conn->query($sql)) {
        $newId = $id > 0 ? $id : $conn->insert_id;
        echo json_encode(['success' => true, 'id' => $newId, 'mensaje' => $id > 0 ? 'Activo actualizado.' : 'Activo registrado.']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => $conn->error]);
    }
}

function eliminar_activo($conn, $id, $usuarioActual) {
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'Id inválido']); return; }
    $stmt = $conn->prepare("DELETE FROM activos_maestro WHERE id_activo = ?");
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'mensaje' => 'Activo eliminado.']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => $stmt->error]);
    }
    $stmt->close();
}

function cambiar_estado_activo($conn, $data, $usuarioActual) {
    $id = intval($data['id'] ?? 0);
    $estado = trim($data['estado'] ?? '');
    if ($id <= 0 || empty($estado)) {
        echo json_encode(['success' => false, 'mensaje' => 'Datos inválidos']);
        return;
    }
    $stmt = $conn->prepare("UPDATE activos_maestro SET estado_activo = ?, updated_at = NOW() WHERE id_activo = ?");
    $stmt->bind_param('si', $estado, $id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'mensaje' => 'Estado actualizado.']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => $stmt->error]);
    }
    $stmt->close();
}

// ════════════════════════════════════════════════════════════════
// FUNCIONES - OPERADORES
// ════════════════════════════════════════════════════════════════

function listar_operadores($conn) {
    $res = $conn->query("SELECT * FROM activos_operadores ORDER BY nombre_completo ASC");
    if (!$res) { echo json_encode(['success' => false, 'mensaje' => $conn->error]); return; }
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode(['success' => true, 'data' => $rows]);
}

function obtener_operador($conn, $id) {
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'Id inválido']); return; }
    $stmt = $conn->prepare("SELECT * FROM activos_operadores WHERE id_operador = ? LIMIT 1");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $stmt->close();
    if (!$row) { echo json_encode(['success' => false, 'mensaje' => 'Operador no encontrado']); return; }
    echo json_encode(['success' => true, 'data' => $row]);
}

function guardar_operador($conn, $data) {
    if (empty($data)) { echo json_encode(['success' => false, 'mensaje' => 'Sin datos']); return; }

    $id             = intval($data['id_operador'] ?? 0);
    $nombre_completo = trim($data['nombre_completo'] ?? '');
    $documento      = trim($data['documento'] ?? '');
    $licencia       = trim($data['licencia'] ?? '');
    $telefono       = trim($data['telefono'] ?? '');
    $correo         = trim($data['correo'] ?? '');
    $activo         = isset($data['activo']) ? intval($data['activo']) : 1;
    $observaciones  = trim($data['observaciones'] ?? '');

    if (empty($nombre_completo)) {
        echo json_encode(['success' => false, 'mensaje' => 'El nombre del operador es requerido.']);
        return;
    }

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE activos_operadores SET
            nombre_completo=?, documento=?, licencia=?, telefono=?, correo=?, activo=?, observaciones=?
            WHERE id_operador=?");
        $stmt->bind_param('sssssssi', $nombre_completo, $documento, $licencia, $telefono, $correo, $activo, $observaciones, $id);
    } else {
        $stmt = $conn->prepare("INSERT INTO activos_operadores
            (nombre_completo, documento, licencia, telefono, correo, activo, observaciones)
            VALUES (?,?,?,?,?,?,?)");
        $stmt->bind_param('sssssss', $nombre_completo, $documento, $licencia, $telefono, $correo, $activo, $observaciones);
    }

    if ($stmt->execute()) {
        $newId = $id > 0 ? $id : $conn->insert_id;
        echo json_encode(['success' => true, 'id' => $newId, 'mensaje' => $id > 0 ? 'Operador actualizado.' : 'Operador registrado.']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => $stmt->error]);
    }
    $stmt->close();
}

function eliminar_operador($conn, $id) {
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'Id inválido']); return; }
    $stmt = $conn->prepare("DELETE FROM activos_operadores WHERE id_operador = ?");
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'mensaje' => 'Operador eliminado.']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => $stmt->error]);
    }
    $stmt->close();
}

// ════════════════════════════════════════════════════════════════
// FUNCIONES - CHECKLIST DIARIO
// ════════════════════════════════════════════════════════════════

function listar_checklists($conn) {
    $sql = "SELECT c.*, a.marca, a.modelo, a.placa, a.tipo_activo,
                   CONCAT(a.marca, ' ', a.modelo, IF(a.placa!='',CONCAT(' - ',a.placa),'')) AS activo_nombre,
                   o.nombre_completo AS operador_nombre,
                   (SELECT CONCAT(
                       IF(SUM(IF(d.resultado='BUENO',1,0))>0, CONCAT(SUM(IF(d.resultado='BUENO',1,0)), ' Bueno'), ''),
                       IF(SUM(IF(d.resultado='CORREGIR',1,0))>0, CONCAT(IF(SUM(IF(d.resultado='BUENO',1,0))>0,' | ',''), SUM(IF(d.resultado='CORREGIR',1,0)), ' Corregir'), ''),
                       IF(SUM(IF(d.resultado='MAL_ESTADO',1,0))>0, CONCAT(IF(SUM(IF(d.resultado='BUENO',1,0))>0 OR SUM(IF(d.resultado='CORREGIR',1,0))>0,' | ',''), SUM(IF(d.resultado='MAL_ESTADO',1,0)), ' Mal Estado'), '')
                    ) FROM activos_checklist_detalle d WHERE d.id_checklist = c.id_checklist
                   ) AS resultado_total
            FROM activos_checklist_diario c
            LEFT JOIN activos_maestro a ON c.id_activo = a.id_activo
            LEFT JOIN activos_operadores o ON c.id_operador = o.id_operador
            ORDER BY c.fecha_checklist DESC, c.fecha_registro DESC";
    $res = $conn->query($sql);
    if (!$res) { echo json_encode(['success' => false, 'mensaje' => $conn->error]); return; }
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode(['success' => true, 'data' => $rows]);
}

function obtener_checklist($conn, $id) {
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'Id inválido']); return; }
    $stmt = $conn->prepare("SELECT c.*, a.marca, a.modelo, a.placa, a.tipo_activo,
                                   o.nombre_completo AS operador_nombre
                            FROM activos_checklist_diario c
                            LEFT JOIN activos_maestro a ON c.id_activo = a.id_activo
                            LEFT JOIN activos_operadores o ON c.id_operador = o.id_operador
                            WHERE c.id_checklist = ? LIMIT 1");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $stmt->close();
    if (!$row) { echo json_encode(['success' => false, 'mensaje' => 'Checklist no encontrado']); return; }

    // Obtener detalles
    $stmt2 = $conn->prepare("SELECT * FROM activos_checklist_detalle WHERE id_checklist = ? ORDER BY id_detalle ASC");
    $stmt2->bind_param('i', $id);
    $stmt2->execute();
    $res2 = $stmt2->get_result();
    $detalles = [];
    while ($d = $res2->fetch_assoc()) $detalles[] = $d;
    $stmt2->close();

    // Obtener fotos por item (con tolerancia a que la tabla no exista)
    $fotosPorItem = [];
    $stmt3 = @$conn->prepare("SELECT id_item, url FROM activos_checklist_fotos WHERE id_checklist = ? ORDER BY id_foto ASC");
    if ($stmt3 !== false) {
        $stmt3->bind_param('i', $id);
        $stmt3->execute();
        $res3 = $stmt3->get_result();
        while ($f = $res3->fetch_assoc()) {
            $item = intval($f['id_item']);
            if (!isset($fotosPorItem[$item])) $fotosPorItem[$item] = [];
            $fotosPorItem[$item][] = $f['url'];
        }
        $stmt3->close();
    }

    $row['detalles'] = $detalles;
    $row['fotos_por_item'] = $fotosPorItem;
    echo json_encode(['success' => true, 'data' => $row]);
}

function guardar_checklist($conn, $data, $usuarioActual) {
    if (empty($data)) { echo json_encode(['success' => false, 'mensaje' => 'Sin datos']); return; }

    $id_checklist     = intval($data['id_checklist'] ?? 0);
    $id_activo        = intval($data['id_activo'] ?? 0);
    $id_operador      = intval($data['id_operador'] ?? 0);
    $fecha_checklist  = trim($data['fecha_checklist'] ?? date('Y-m-d'));
    $hora_checklist   = trim($data['hora_checklist'] ?? '');
    $kilometraje      = trim($data['kilometraje'] ?? '');
    $estado_general   = trim($data['estado_general'] ?? 'BUENO');
    $observaciones    = trim($data['observaciones'] ?? '');
    $detallesRaw      = $data['detalles'] ?? '[]';
    $detalles         = is_string($detallesRaw) ? json_decode($detallesRaw, true) : $detallesRaw;
    if (!is_array($detalles)) $detalles = [];

    if ($id_activo <= 0 || $id_operador <= 0) {
        echo json_encode(['success' => false, 'mensaje' => 'Debe seleccionar activo y operador.']);
        return;
    }

    $conn->begin_transaction();
    try {
        if ($id_checklist > 0) {
            $stmt = $conn->prepare("UPDATE activos_checklist_diario SET
                id_activo=?, id_operador=?, fecha_checklist=?, hora_checklist=?,
                kilometraje=?, estado_general=?, observaciones=?
                WHERE id_checklist=?");
            $stmt->bind_param('iisssssi',
                $id_activo, $id_operador, $fecha_checklist, $hora_checklist,
                $kilometraje, $estado_general, $observaciones, $id_checklist);
            $stmt->execute();
            $stmt->close();

            // Eliminar detalles anteriores
            $del = $conn->prepare("DELETE FROM activos_checklist_detalle WHERE id_checklist = ?");
            $del->bind_param('i', $id_checklist);
            $del->execute();
            $del->close();

            // Eliminar fotos anteriores (tolerante a que la tabla no exista)
            $delFotos = @$conn->prepare("DELETE FROM activos_checklist_fotos WHERE id_checklist = ?");
            if ($delFotos !== false) {
                $delFotos->bind_param('i', $id_checklist);
                $delFotos->execute();
                $delFotos->close();
            }
        } else {
            $stmt = $conn->prepare("INSERT INTO activos_checklist_diario
                (id_activo, id_operador, fecha_checklist, hora_checklist,
                 kilometraje, estado_general, observaciones, usuario_registro)
                VALUES (?,?,?,?,?,?,?,?)");
            $stmt->bind_param('iissssss',
                $id_activo, $id_operador, $fecha_checklist, $hora_checklist,
                $kilometraje, $estado_general, $observaciones, $usuarioActual);
            $stmt->execute();
            $id_checklist = $conn->insert_id;
            $stmt->close();
        }

        // Insertar detalles
        if (!empty($detalles) && is_array($detalles)) {
            $stmtDet = $conn->prepare("INSERT INTO activos_checklist_detalle
                (id_checklist, id_item, resultado, comentario) VALUES (?,?,?,?)");
            foreach ($detalles as $det) {
                $id_item    = intval($det['id_item'] ?? 0);
                $resultado  = trim($det['resultado'] ?? 'BUENO');
                $comentario = trim($det['comentario'] ?? '');
                if ($id_item <= 0) continue;
                $stmtDet->bind_param('iiss', $id_checklist, $id_item, $resultado, $comentario);
                $stmtDet->execute();

                // Guardar fotos de este item (vienen como array de URLs)
                $fotos = $det['fotos'] ?? [];
                if (!empty($fotos) && is_array($fotos)) {
                    $stmtFoto = @$conn->prepare("INSERT INTO activos_checklist_fotos
                        (id_checklist, id_item, url) VALUES (?,?,?)");
                    if ($stmtFoto !== false) {
                        foreach ($fotos as $fotoUrl) {
                            $url = trim($fotoUrl);
                            if (empty($url)) continue;
                            $stmtFoto->bind_param('iis', $id_checklist, $id_item, $url);
                            $stmtFoto->execute();
                        }
                        $stmtFoto->close();
                    }
                }
            }
            $stmtDet->close();
        }

        $conn->commit();
        echo json_encode(['success' => true, 'id' => $id_checklist, 'mensaje' => 'Checklist guardado.']);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'mensaje' => 'Error al guardar checklist: ' . $e->getMessage()]);
    }
}

function eliminar_checklist($conn, $id) {
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'Id inválido']); return; }
    $stmt = $conn->prepare("DELETE FROM activos_checklist_diario WHERE id_checklist = ?");
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'mensaje' => 'Checklist eliminado.']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => $stmt->error]);
    }
    $stmt->close();
}

// ════════════════════════════════════════════════════════════════
// FUNCIONES - MANTENIMIENTO
// ════════════════════════════════════════════════════════════════

function listar_mantenimientos($conn) {
    $sql = "SELECT m.*, a.marca, a.modelo, a.placa, a.tipo_activo, a.kilometraje_actual,
                   CONCAT(a.marca, ' ', a.modelo, IF(a.placa!='',CONCAT(' - ',a.placa),'')) AS activo_nombre
            FROM activos_mantenimiento m
            LEFT JOIN activos_maestro a ON m.id_activo = a.id_activo
            ORDER BY m.fecha_programada DESC, m.created_at DESC";
    $res = $conn->query($sql);
    if (!$res) { echo json_encode(['success' => false, 'mensaje' => $conn->error]); return; }
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode(['success' => true, 'data' => $rows]);
}

function obtener_mantenimiento($conn, $id) {
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'Id inválido']); return; }
    $stmt = $conn->prepare("SELECT m.*, a.marca, a.modelo, a.placa, a.tipo_activo, a.kilometraje_actual,
                                   CONCAT(a.marca, ' ', a.modelo, IF(a.placa!='',CONCAT(' - ',a.placa),'')) AS activo_nombre
                            FROM activos_mantenimiento m
                            LEFT JOIN activos_maestro a ON m.id_activo = a.id_activo
                            WHERE m.id_mantenimiento = ? LIMIT 1");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $stmt->close();
    if (!$row) { echo json_encode(['success' => false, 'mensaje' => 'Mantenimiento no encontrado']); return; }
    echo json_encode(['success' => true, 'data' => $row]);
}

function guardar_mantenimiento($conn, $data, $usuarioActual) {
    if (empty($data)) { echo json_encode(['success' => false, 'mensaje' => 'Sin datos']); return; }

    $id_mantenimiento   = intval($data['id_mantenimiento'] ?? 0);
    $id_activo          = intval($data['id_activo'] ?? 0);
    $tipo_mantenimiento = trim($data['tipo_mantenimiento'] ?? '');
    $fecha_programada   = trim($data['fecha_programada'] ?? '');
    $fecha_ejecucion    = trim($data['fecha_ejecucion'] ?? '');
    $proveedor          = trim($data['proveedor'] ?? '');
    $costo              = trim($data['costo'] ?? '');
    if ($costo === '' || !is_numeric($costo)) $costo = '0';
    $descripcion        = trim($data['descripcion'] ?? '');
    $observaciones      = trim($data['observaciones'] ?? '');
    $estado             = trim($data['estado'] ?? '');
    $kilometraje_actual = intval($data['kilometraje_actual'] ?? 0);

    // ── Validaciones de campos obligatorios ──
    if ($id_activo <= 0) {
        echo json_encode(['success' => false, 'mensaje' => 'Debe seleccionar un activo.']);
        return;
    }
    if ($tipo_mantenimiento === '') {
        echo json_encode(['success' => false, 'mensaje' => 'Debe seleccionar el tipo de mantenimiento.']);
        return;
    }
    if ($estado === '') {
        echo json_encode(['success' => false, 'mensaje' => 'Debe seleccionar el estado.']);
        return;
    }
    if ($fecha_programada === '') {
        echo json_encode(['success' => false, 'mensaje' => 'La fecha programada es obligatoria.']);
        return;
    }

    // ── Validaciones según estado ──
    if ($estado === 'COMPLETED' || $estado === 'COMPLETADO') {
        if ($fecha_ejecucion === '') {
            echo json_encode(['success' => false, 'mensaje' => 'La fecha de ejecución es obligatoria para estado Completado.']);
            return;
        }
        if ($proveedor === '') {
            echo json_encode(['success' => false, 'mensaje' => 'El proveedor/taller es obligatorio para estado Completado.']);
            return;
        }
    }

    if ($estado === 'CANCELED' || $estado === 'CANCELADO') {
        if ($observaciones === '') {
            echo json_encode(['success' => false, 'mensaje' => 'Debe indicar el motivo de cancelación en observaciones.']);
            return;
        }
    }

    // ── Validación de fechas ──
    if ($fecha_ejecucion !== '' && $fecha_ejecucion < $fecha_programada) {
        echo json_encode(['success' => false, 'mensaje' => 'La fecha de ejecución no puede ser anterior a la fecha programada.']);
        return;
    }

    // ── Si es preventivo y está programado, fecha programada debe ser >= hoy ──
    if ($tipo_mantenimiento === 'PREVENTIVO' && $estado === 'PROGRAMADO') {
        $hoy = date('Y-m-d');
        if ($fecha_programada < $hoy) {
            echo json_encode(['success' => false, 'mensaje' => 'Para mantenimiento preventivo programado, la fecha debe ser hoy o futura.']);
            return;
        }
    }

    if ($id_mantenimiento > 0) {
        $stmt = $conn->prepare("UPDATE activos_mantenimiento SET
            id_activo=?, tipo_mantenimiento=?, fecha_programada=?, fecha_ejecucion=?,
            proveedor=?, costo=?, descripcion=?, observaciones=?, estado=?
            WHERE id_mantenimiento=?");
        $stmt->bind_param('issssdsssi',
            $id_activo, $tipo_mantenimiento, $fecha_programada, $fecha_ejecucion,
            $proveedor, $costo, $descripcion, $observaciones, $estado, $id_mantenimiento);
        $stmt->execute();
        $stmt->close();

        // ── Si se completó, actualizar kilometraje del activo y alertas ──
        if ($estado === 'COMPLETADO' && $kilometraje_actual > 0) {
            $conn->query("UPDATE activos_maestro SET kilometraje_actual = $kilometraje_actual WHERE id_activo = $id_activo");
            actualizar_alertas_por_km($conn, $id_activo, $kilometraje_actual, $fecha_ejecucion);
        }

        echo json_encode(['success' => true, 'mensaje' => 'Mantenimiento actualizado.']);
    } else {
        $stmt = $conn->prepare("INSERT INTO activos_mantenimiento
            (id_activo, tipo_mantenimiento, fecha_programada, fecha_ejecucion,
             proveedor, costo, descripcion, observaciones, estado, usuario_registro)
            VALUES (?,?,?,?,?,?,?,?,?,?)");
        $stmt->bind_param('issssdsssi',
            $id_activo, $tipo_mantenimiento, $fecha_programada, $fecha_ejecucion,
            $proveedor, $costo, $descripcion, $observaciones, $estado, $usuarioActual);
        $stmt->execute();
        $id_insertado = $conn->insert_id;
        $stmt->close();

        // ── Si se completó, actualizar kilometraje del activo y alertas ──
        if ($estado === 'COMPLETADO' && $kilometraje_actual > 0) {
            $conn->query("UPDATE activos_maestro SET kilometraje_actual = $kilometraje_actual WHERE id_activo = $id_activo");
            actualizar_alertas_por_km($conn, $id_activo, $kilometraje_actual, $fecha_ejecucion);
        }

        echo json_encode(['success' => true, 'id' => $id_insertado, 'mensaje' => 'Mantenimiento registrado.']);
    }
}

/**
 * Actualiza las alertas de mantenimiento por kilometraje:
 * - Establece ultima_ejecucion con la fecha actual
 * - Calcula proxima_alerta sumando periodicidad_km al kilometraje_actual
 *   (se guarda como fecha estimada: hoy + (periodicidad_km / 1000 * 30) días aprox)
 */
function actualizar_alertas_por_km($conn, $id_activo, $kilometraje_actual, $fecha_ejecucion) {
    $res = $conn->query("SELECT id_alerta, periodicidad_km FROM activos_mantenimiento_alertas
                         WHERE id_activo = $id_activo AND activo = 1 AND periodicidad_km IS NOT NULL AND periodicidad_km > 0");
    while ($alerta = $res->fetch_assoc()) {
        $id_alerta = intval($alerta['id_alerta']);
        $periodicidad_km = intval($alerta['periodicidad_km']);

        // Calcular próxima alerta: si cada 5000 km y el vehículo recorre ~5000 km/mes,
        // estimamos días = (periodicidad_km / 500) * 30 → ~30 días por cada 500 km
        // Fórmula más realista: asumir 100 km/día promedio → días = periodicidad_km / 100
        $dias_estimados = max(1, intval($periodicidad_km / 100));
        $proxima_fecha = date('Y-m-d', strtotime($fecha_ejecucion . " + $dias_estimados days"));

        $fecha_e = $conn->real_escape_string($fecha_ejecucion);
        $prox_e  = $conn->real_escape_string($proxima_fecha);

        $conn->query("UPDATE activos_mantenimiento_alertas SET
            ultima_ejecucion = '$fecha_e',
            proxima_alerta = '$prox_e'
            WHERE id_alerta = $id_alerta");
    }
}

function eliminar_mantenimiento($conn, $id) {
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'Id inválido']); return; }
    $stmt = $conn->prepare("DELETE FROM activos_mantenimiento WHERE id_mantenimiento = ?");
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'mensaje' => 'Mantenimiento eliminado.']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => $stmt->error]);
    }
    $stmt->close();
}

// ════════════════════════════════════════════════════════════════
// FUNCIONES - ALERTAS DE MANTENIMIENTO
// ════════════════════════════════════════════════════════════════

function listar_alertas($conn) {
    $sql = "SELECT a.*,
                   CONCAT(am.marca, ' ', am.modelo, IF(am.placa!='',CONCAT(' - ',am.placa),'')) AS activo_nombre
            FROM activos_mantenimiento_alertas a
            LEFT JOIN activos_maestro am ON a.id_activo = am.id_activo
            ORDER BY a.proxima_alerta ASC, a.id_alerta DESC";
    $res = $conn->query($sql);
    if (!$res) { echo json_encode(['success' => false, 'mensaje' => $conn->error]); return; }
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode(['success' => true, 'data' => $rows]);
}

function obtener_alerta($conn, $id) {
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'Id inválido']); return; }
    $stmt = $conn->prepare("SELECT a.*,
                                   CONCAT(am.marca, ' ', am.modelo, IF(am.placa!='',CONCAT(' - ',am.placa),'')) AS activo_nombre
                            FROM activos_mantenimiento_alertas a
                            LEFT JOIN activos_maestro am ON a.id_activo = am.id_activo
                            WHERE a.id_alerta = ? LIMIT 1");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $stmt->close();
    if (!$row) { echo json_encode(['success' => false, 'mensaje' => 'Alerta no encontrada']); return; }
    echo json_encode(['success' => true, 'data' => $row]);
}

function guardar_alerta($conn, $data) {
    if (empty($data)) { echo json_encode(['success' => false, 'mensaje' => 'Sin datos']); return; }

    $id_alerta        = intval($data['id_alerta'] ?? 0);
    $id_activo        = intval($data['id_activo'] ?? 0);
    $tipo_alerta      = trim($data['tipo_alerta'] ?? '');
    $periodicidad_dias = $data['periodicidad_dias'] !== '' ? intval($data['periodicidad_dias']) : 'NULL';
    $periodicidad_km  = $data['periodicidad_km'] !== '' ? intval($data['periodicidad_km']) : 'NULL';
    $ultima_ejecucion = trim($data['ultima_ejecucion'] ?? '');
    $proxima_alerta   = trim($data['proxima_alerta'] ?? '');
    $activo_flag      = intval($data['activo'] ?? 1);

    if ($id_activo <= 0) {
        echo json_encode(['success' => false, 'mensaje' => 'Debe seleccionar un activo.']);
        return;
    }
    if ($tipo_alerta === '') {
        echo json_encode(['success' => false, 'mensaje' => 'Debe especificar el tipo de alerta.']);
        return;
    }

    // Escapar valores para SQL
    $id_activo_e        = intval($id_activo);
    $tipo_alerta_e      = $conn->real_escape_string($tipo_alerta);
    $periodicidad_dias_e = $periodicidad_dias === 'NULL' ? 'NULL' : intval($periodicidad_dias);
    $periodicidad_km_e  = $periodicidad_km === 'NULL' ? 'NULL' : intval($periodicidad_km);
    $ultima_ejecucion_e = $ultima_ejecucion ? "'" . $conn->real_escape_string($ultima_ejecucion) . "'" : 'NULL';
    $proxima_alerta_e   = $proxima_alerta ? "'" . $conn->real_escape_string($proxima_alerta) . "'" : 'NULL';
    $activo_flag_e      = intval($activo_flag);

    if ($id_alerta > 0) {
        $sql = "UPDATE activos_mantenimiento_alertas SET
                id_activo=$id_activo_e,
                tipo_alerta='$tipo_alerta_e',
                periodicidad_dias=$periodicidad_dias_e,
                periodicidad_km=$periodicidad_km_e,
                ultima_ejecucion=$ultima_ejecucion_e,
                proxima_alerta=$proxima_alerta_e,
                activo=$activo_flag_e
                WHERE id_alerta=" . intval($id_alerta);
        $conn->query($sql);
        if ($conn->error) {
            echo json_encode(['success' => false, 'mensaje' => 'Error al actualizar: ' . $conn->error]);
            return;
        }
        echo json_encode(['success' => true, 'mensaje' => 'Alerta actualizada.']);
    } else {
        $sql = "INSERT INTO activos_mantenimiento_alertas
                (id_activo, tipo_alerta, periodicidad_dias, periodicidad_km,
                 ultima_ejecucion, proxima_alerta, activo)
                VALUES ($id_activo_e, '$tipo_alerta_e', $periodicidad_dias_e, $periodicidad_km_e,
                        $ultima_ejecucion_e, $proxima_alerta_e, $activo_flag_e)";
        $conn->query($sql);
        if ($conn->error) {
            echo json_encode(['success' => false, 'mensaje' => 'Error al insertar: ' . $conn->error]);
            return;
        }
        $id_insertado = $conn->insert_id;
        echo json_encode(['success' => true, 'id' => $id_insertado, 'mensaje' => 'Alerta registrada.']);
    }
}

function eliminar_alerta($conn, $id) {
    if ($id <= 0) { echo json_encode(['success' => false, 'mensaje' => 'Id inválido']); return; }
    $stmt = $conn->prepare("DELETE FROM activos_mantenimiento_alertas WHERE id_alerta = ?");
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'mensaje' => 'Alerta eliminada.']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => $stmt->error]);
    }
    $stmt->close();
}

function alertas_proximas($conn) {
    $hoy = date('Y-m-d');
    $dentro7 = date('Y-m-d', strtotime('+7 days'));
    $sql = "SELECT a.*,
                   CONCAT(am.marca, ' ', am.modelo, IF(am.placa!='',CONCAT(' - ',am.placa),'')) AS activo_nombre,
                   am.tipo_activo,
                   DATEDIFF(a.proxima_alerta, '$hoy') AS dias_restantes
            FROM activos_mantenimiento_alertas a
            LEFT JOIN activos_maestro am ON a.id_activo = am.id_activo
            WHERE a.activo = 1
              AND a.proxima_alerta IS NOT NULL
              AND a.proxima_alerta <= '$dentro7'
            ORDER BY a.proxima_alerta ASC";
    $res = $conn->query($sql);
    if (!$res) { echo json_encode(['success' => false, 'mensaje' => $conn->error]); return; }
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode(['success' => true, 'data' => $rows]);
}
