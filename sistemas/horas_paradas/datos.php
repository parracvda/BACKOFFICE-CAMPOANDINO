<?php
session_start();
error_log("INICIO datos.php");
require_once __DIR__ . '/../../shared/conexion.php';


function obtenerDatosUsuarios($conn) {
    $sql = "SELECT * FROM produccion_lineasensamblaje";
    $result = $conn->query($sql);
    if (!$result) {
        die("Error en la consulta: " . $conn->error);
    }
    
    $datos = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            // Forzar el campo IdSedes como string, aunque sea null
            if (!isset($row['IdSedes'])) {
                $row['IdSedes'] = '';
            } else {
                $row['IdSedes'] = strval($row['IdSedes']);
            }
            error_log('detalle_registro (debug): ' . json_encode($row));
            if (!isset($row['IdSedes'])) {
                error_log('ATENCIÓN: detalle_registro sin IdSedes');
            } else {
                error_log('detalle_registro IdSedes: ' . $row['IdSedes']);
            }
            $datos[] = $row;
        }
    }
    return $datos;
}

function obtenerDatosProductos($conn) {
    $sql = "SELECT id, nombre, precio FROM productos";
    $result = $conn->query($sql);
    if (!$result) {
        die("Error en la consulta: " . $conn->error);
    }
    
    $datos = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }
    return $datos;
}

function cmbSede($conn) {
    $sql = "SELECT * FROM general_sedes";
    $result = $conn->query($sql);
    if (!$result) {
        die("Error en la consulta: " . $conn->error);
    }
    
    $datos = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }
    return $datos;
}

function cmbTipoProducto($conn, $as_parametros) {
    $sql = "SELECT * FROM produccion_tipoproducto where IdSedes=" . $as_parametros;
    $result = $conn->query($sql);
    if (!$result) {
        die("Error en la consulta: " . $conn->error);
    }
    
    $datos = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }
    return $datos;
}

function cmbArea($conn,$as_parametros) {
    $sql = "SELECT * FROM produccion_areas where IdTipoProducto=" . $as_parametros;
    $result = $conn->query($sql);
    if (!$result) {
        die("Error en la consulta: " . $conn->error);
    }
    
    $datos = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }
    return $datos;
}

function cmbSubArea($conn,$as_parametros) {
    $sql = "SELECT * FROM produccion_subareas where IdArea=" . $as_parametros;
    $result = $conn->query($sql);
    if (!$result) {
        die("Error en la consulta: " . $conn->error);
    }
    
    $datos = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }
    return $datos;
}

function cmbMaquinaArea($conn) {
    $sql = "SELECT * FROM produccion_maquinashorasparadas order by MaquinaArea ASC";
    $result = $conn->query($sql);
    
    if (!$result) {
        die("Error en la consulta: " . $conn->error);
    }
    
    $datos = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }
    return $datos;
    
}

function cmbAreaResponsable($conn) {
    $sql = "SELECT * FROM produccion_cpm_areasresponsables";
    $result = $conn->query($sql);
    if (!$result) {
        die("Error en la consulta: " . $conn->error);
    }
    
    $datos = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }
    return $datos;
}

function cmbMotivo($conn) {
    $sql = "SELECT * FROM produccion_cpm_motivosparadas";
    $result = $conn->query($sql);
    if (!$result) {
        die("Error en la consulta: " . $conn->error);
    }
    
    $datos = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }
    return $datos;
}

function cmbTurno($conn) {
    $sql = "SELECT * FROM produccion_turnos";
    $result = $conn->query($sql);
    if (!$result) {
        die("Error en la consulta: " . $conn->error);
    }
    
    $datos = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }
    return $datos;
}

function produccion_registrocontrolparadas_agregar($conn, $as_parametros) {  
    // SOLO acepta el idUsuario por GET
    $idusuario = isset($_GET['idUsuario']) ? intval($_GET['idUsuario']) : 0;

    // Validar usuario
    if ($idusuario <= 0) {
        echo json_encode(['success' => false, 'mensaje' => 'Debe iniciar sesión para registrar.']);
        exit;
    }

    $as_parametros = $as_parametros . "," . $idusuario ;
    error_log("Parámetros enviados: " . $as_parametros);
    // Intentar preparar/executar el procedimiento (prueba 2025, 2026 y nombre sin sufijo)
    $procCandidates = [
        'usp_scm_registrocontrolparadas_insert_2025',
        'usp_scm_registrocontrolparadas_insert_2026',
        'usp_scm_registrocontrolparadas_insert'
    ];
    $stmt = false;
    $usedProc = null;
    foreach ($procCandidates as $proc) {
        $sqlCall = "CALL " . $proc . "(?)";
        $stmt = $conn->prepare($sqlCall);
        if ($stmt !== false) {
            $usedProc = $proc;
            error_log("datos.php: preparado procedimiento: " . $proc);
            break;
        } else {
            error_log("datos.php: fallo prepare({$sqlCall}): " . $conn->error);
        }
    }

    if ($stmt === false) {
        error_log("datos.php: no se pudo preparar CALL a ninguno de los procedimientos. Error final: " . $conn->error);
        echo json_encode(['success' => false, 'mensaje' => 'Error al preparar procedimiento: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param("s", $as_parametros);
    if (!$stmt->execute()) {
        $err = $stmt->error ?: $conn->error;
        error_log("datos.php: error execute() en {$usedProc}: " . $err);
        echo json_encode(['success' => false, 'mensaje' => 'Error al ejecutar procedimiento: ' . $err]);
        exit;
    }

    $result = $stmt->get_result();
    $datos = array();
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }

    // Si no devuelve filas, pero la ejecución afectó filas, devolver éxito con mensaje
    if (empty($datos)) {
        $affected = $conn->affected_rows;
        if ($affected > 0) {
            echo json_encode(['success' => true, 'datos' => [], 'mensaje' => "Ejecutado {$usedProc}; filas afectadas: {$affected}"]);
            exit;
        }
        // Si no hubo filas ni filas afectadas, informar para depuración
        $datos[] = ["id" => null, "error" => "No se insertó el registro. Parámetros: $as_parametros"];
    }

    echo json_encode(['success' => true, 'datos' => $datos]);
    exit;
}

function produccion_registroprogramacion_agregar($conn, $as_parametros) {  
    // SOLO acepta el idUsuario por GET
    $idusuario = isset($_GET['idUsuario']) ? intval($_GET['idUsuario']) : 0;

    // Validar usuario
    if ($idusuario <= 0) {
        echo json_encode(['success' => false, 'mensaje' => 'Debe iniciar sesión para registrar.']);
        exit;
    }

    $as_parametros = $as_parametros . "," . $idusuario ;
    $stmt = $conn->prepare("CALL usp_scm_registroprogramacion_insert(?)");
    $stmt->bind_param("s", $as_parametros);
    $stmt->execute(); 
    $result = $stmt->get_result();
    $datos = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }
    echo json_encode(['success' => true, 'datos' => $datos]);
    exit;
}

function dw_lista($conn,$as_parametros) {
    // Log de la fecha y hora actual de PHP
    error_log('Fecha PHP: ' . date('Y-m-d H:i:s'));
    // Log de la base de datos activa
    $dbActive = $conn->query("SELECT DATABASE()") ? $conn->query("SELECT DATABASE()") : false;
    if ($dbActive) {
        $dbName = $dbActive->fetch_row()[0];
        error_log('Base de datos activa en dw_lista: ' . $dbName);
    } else {
        error_log('No se pudo obtener la base de datos activa');
    }
    $tipousuario = isset($_SESSION['tipousuario']) ? $_SESSION['tipousuario'] : '';
    $idusuario = isset($_SESSION['idusuario']) ? $_SESSION['idusuario'] : '';
    // Todos los logs y usos de $tipousuario deben ir después de esta línea

    $conn->query("SET lc_time_names = 'es_ES'");


    if ($tipousuario == 'COORDINADOR DE PRODUCCION') {
        // Supervisor: ve sus registros y los de sus usuarios a cargo
        $usuarios = [$idusuario];
        error_log("SUPERVISOR: idusuario=$idusuario");
        $sqlUsuarios = "SELECT id_usuario FROM supervisor_usuarios WHERE id_supervisor = $idusuario";
        $resultUsuarios = $conn->query($sqlUsuarios);
        if ($resultUsuarios) {
            while ($row = $resultUsuarios->fetch_assoc()) {
                $usuarios[] = $row['id_usuario'];
            }
        }
        error_log("SUPERVISOR: usuarios a cargo=" . implode(',', $usuarios));
        $usuariosList = implode(',', $usuarios);
    $where = "WHERE a.idusuario IN ($usuariosList) AND DATE(a.Fecha) = CURDATE()";
    } else {
        // Usuario normal: solo sus registros
    $where = "WHERE a.idusuario = $idusuario AND DATE(a.Fecha) = CURDATE()";
    }

    $sql = "SELECT  a.Idregistrocontrolparadas, a.Sede as IdSedes, a.Turno as IdTurno, a.Maquina as IdMaquinaArea, DATE_FORMAT(a.Fecha, '%d/%m/%Y') as Fecha
    , c.maquinaarea as Maquina
    , DATE_FORMAT(a.HoraInicio, '%H:%i') HoraInicio
    , DATE_FORMAT(a.HoraFin, '%H:%i') as HoraFin
    , b.Estado as Estado
    , u.Usuario as Usuario
    FROM produccion_registrocontrolparadas a
    INNER JOIN produccion_estadosregistros b ON a.estado = b.IdEstado
    INNER JOIN produccion_maquinashorasparadas c ON a.Maquina = c.IdMaquinaArea
    LEFT JOIN usuarios u ON a.idusuario = u.idusuario
    $where";

    error_log('SQL ejecutado en dw_lista: ' . $sql);

    $result = $conn->query($sql);
    if (!$result) {
        error_log('Error en la consulta: ' . $conn->error);
        echo json_encode([
            'success' => false,
            'error' => 'Error en la consulta: ' . $conn->error,
            'sql' => $sql
        ]);
        exit;
    }
    
    $datos = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }
    error_log('Registros encontrados en dw_lista: ' . count($datos));
    if (count($datos) > 0) {
        foreach ($datos as $row) {
            error_log('Registro dw_lista (debug): ' . json_encode($row));
            if (!isset($row['IdSedes'])) {
                error_log('ATENCIÓN: El registro no tiene el campo IdSedes');
            } else {
                error_log('IdSedes encontrado: ' . $row['IdSedes']);
            }
        }
    } else {
        error_log('No se encontraron registros en dw_lista para usuario y fecha actual.');
    }
    error_log('JSON enviado a frontend: ' . json_encode($datos));
    echo json_encode($datos);
    exit;
}

function dw_reporte($conn,$as_parametros) {

    $idusuario = isset($_SESSION['idusuario']) ? $_SESSION['idusuario'] : '';
    $tipousuario = isset($_SESSION['tipousuario']) ? $_SESSION['tipousuario'] : '';

    $conn->query("SET lc_time_names = 'es_ES'");

    $sql = " SELECT 
Idregistrocontrolparadas as Codigo
	,b.Sedes as Sede
    , DATE_FORMAT(Fecha, '%d/%m/%Y') as Fecha
    , DATE_FORMAT(HoraInicio, '%H:%i') HoraInicio
    ,c.TipoProducto as TipoProducto
    ,d.Area as Area
	,e.SubArea as SubArea
    ,f.MaquinaArea as Maquina
    ,g.AreaResponsable as AreaResponsable
    ,h.MotivoParada as Motivo
	, DATE_FORMAT(HoraFin, '%H:%i') as HoraFin
    ,TiempoTotal as TiempoTotal
	,Observacion as Observacion
    ,i.Estado as Estado 
     
 FROM 
 produccion_registrocontrolparadas a
 
	left join general_sedes b
	 on a.Sede = b.IdSedes
	left join produccion_tipoproducto c
	 on a.TipoProducto = c.IdTipoProducto
	left join produccion_areas d
	 on a.Area = d.IdArea
	left join produccion_subareas e
	 on a.SubArea = e.IdSubArea
	left join produccion_maquinashorasparadas f
	 on a.Maquina = f.IdMaquinaArea
	left join produccion_cpm_areasresponsables g
	 on a.AreaResponsable = g.IdAreaResponsable
	left join produccion_cpm_motivosparadas h
	 on a.Motivo = h.IdMotivo
    left join produccion_estadosregistros i
	 on a.Estado = i.IdEstado

 ";
    $result = $conn->query($sql);
    if (!$result) {
        die("Error en la consulta: " . $conn->error);
    }
    
    $datos = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }
    return $datos;
}
function obtenerPorID($conn,$as_parametros) {
    $sql = "SELECT * FROM produccion_registrocontrolparadas where Idregistrocontrolparadas = " . $as_parametros;
    $result = $conn->query($sql);
    if (!$result) {
        die("Error en la consulta: " . $conn->error);
    }
    
    $datos = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }
    return $datos;
}

function wf_obtenerUsuario() {
    if (isset($_SESSION["idusuario"]) && isset($_SESSION["usuarionombre"])) {
        return [
            "idUsuario" => $_SESSION["idusuario"],
            "nombreUsuario" => $_SESSION["usuarionombre"],
            "usuario" => isset($_SESSION['usuario']) ? $_SESSION['usuario'] : null
        ];
    } else {
        return [
            "error" => true,
            "mensaje" => "Sesión no iniciada"
        ];
    }
}

function wf_cerrarsesion() {
   // Iniciar la sesión
    //session_start();

    // Eliminar todas las variables de sesión
    session_unset();

    // Destruir la sesión
    session_destroy();

    return "sesioncerrada";
}

try {
    // Usar la conexión global de conexion.php
    global $conn;

    // Verificar qué acción ejecutar
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    $parametros = isset($_GET['parametros']) ? $_GET['parametros'] : '';

    if ($action == 'usuarios') {
        $datos = obtenerDatosUsuarios($conn);
    } elseif ($action == 'productos') {
        $datos = obtenerDatosProductos($conn);
    } elseif ($action == 'cmbSede') {
        $datos = cmbSede($conn);
    } elseif ($action == 'cmbTipoProducto') {
        $datos = cmbTipoProducto($conn,$parametros);
    } elseif ($action == 'cmbArea') {
        $datos = cmbArea($conn,$parametros);
    } elseif ($action == 'cmbSubArea') {
        $datos = cmbSubArea($conn,$parametros);
    } elseif ($action == 'cmbMaquinaArea') {
        $datos = cmbMaquinaArea($conn,$parametros); 
    } elseif ($action == 'cmbAreaResponsable') {
        $datos = cmbAreaResponsable($conn); 
    } elseif ($action == 'cmbMotivo') {
        $datos = cmbMotivo($conn,$parametros);  
    } elseif ($action == 'cmbTurno') {
        $datos = cmbTurno($conn,$parametros);     
    } elseif ($action == 'produccion_registrocontrolparadas_agregar') {
        $datos = produccion_registrocontrolparadas_agregar($conn,$parametros);  
    } elseif ($action == 'produccion_registroprogramacion_agregar') {
    $datos = produccion_registroprogramacion_agregar($conn,$parametros);  
    } elseif ($action == 'dw_lista') {
        $datos = dw_lista($conn,$parametros);        
    } elseif ($action == 'dw_reporte') {
        $datos = dw_reporte($conn,$parametros); 
    } elseif ($action == 'obtenerPorID') {
        $datos = obtenerPorID($conn,$parametros);   
    } elseif ($action == 'wf_obtenerUsuario') {
        $datos = wf_obtenerUsuario();        
    } elseif ($action == 'wf_cerrarsesion') {
        $datos = wf_cerrarsesion();  
    } 
       
    elseif ($action == 'detalle_registro') {
        $idRegistro = $parametros;
        $datos = array();

        // CONSULTA PARA MOSTRAR DETALLE EN GRILLA DE MODAL
        $sql = "SELECT 
            t.Turno AS Turno,
            m.MaquinaArea AS Maquina,
            a.Sede AS IdSedes,
            a.Turno AS IdTurno,
            a.Maquina AS IdMaquinaArea,
            ROUND(p.TotalHoras / 60, 2) AS HProgramadas,
            ROUND((
                SELECT IFNULL(SUM(TotalHoras), 0)
                FROM produccion_registrocontrolparadas b
                WHERE DATE(b.Fecha) = DATE(a.Fecha)
                AND b.Turno = a.Turno
                AND b.Sede = a.Sede
                AND b.Maquina = a.Maquina
                AND b.idusuario = a.idusuario
            ) / 60, 2) AS HParadas,
            ROUND((p.TotalHoras - (
                SELECT IFNULL(SUM(TotalHoras), 0)
                FROM produccion_registrocontrolparadas b
                WHERE DATE(b.Fecha) = DATE(a.Fecha)
                AND b.Turno = a.Turno
                AND b.Sede = a.Sede
                AND b.Maquina = a.Maquina
                AND b.idusuario = a.idusuario
            )) / 60, 2) AS HxJustificar
        FROM produccion_registrocontrolparadas a
        LEFT JOIN produccion_turnos t ON a.Turno = t.IdTurno
        LEFT JOIN produccion_maquinashorasparadas m ON a.Maquina = m.IdMaquinaArea
        LEFT JOIN produccion_registroprogramacion p
            ON DATE(a.Fecha) = DATE(p.Fecha)
            AND a.Turno = p.Turno
            AND a.Sede = p.Sede
            AND a.Maquina = p.Maquina
        WHERE a.Idregistrocontrolparadas = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $idRegistro);
        $stmt->execute();
        $result = $stmt->get_result();

        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
            }      
    }

    elseif ($action == 'existe_programacion') {
        $fecha = $parametros;
        $sql = "SELECT COUNT(*) as total FROM produccion_registroprogramacion WHERE DATE(Fecha) = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $fecha);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        echo json_encode(['existe' => ($row['total'] > 0)]);
        $conn->close();
        exit;
    }

    elseif ($action == 'obtener_programacion_por_fecha') {
        $fecha = $parametros;
        $sql = "SELECT t.Turno, s.Sedes, m.MaquinaArea, HoraInicio, HoraFin, IdTurno, IdSedes, IdMaquinaArea 
                FROM produccion_registroprogramacion p 
                JOIN produccion_turnos t ON p.Turno = t.IdTurno 
                JOIN general_sedes s ON p.Sede = s.IdSedes 
                JOIN produccion_maquinashorasparadas m ON p.Maquina = m.IdMaquinaArea 
                WHERE DATE(p.Fecha) = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $fecha);
        $stmt->execute();
        $result = $stmt->get_result();
        $datos = array();
        while($row = $result->fetch_assoc()) {
            error_log('detalle_todas_maquinas (debug): ' . json_encode($row));
            $datos[] = $row;
        }
        echo json_encode($datos);
        $conn->close();
        exit;
    }

    elseif ($action == 'detalle_todas_maquinas') {
        $idusuario = isset($_SESSION['idusuario']) ? $_SESSION['idusuario'] : 0;
        $idusuario = isset($_SESSION['idusuario']) ? $_SESSION['idusuario'] : 0;
        $sql = "SELECT 
            prog.Fecha,
            t.Turno AS Turno,
            m.MaquinaArea AS Maquina,
                prog.Sede AS IdSedes,
                prog.Turno AS IdTurno,
                prog.Maquina AS IdMaquinaArea,
                prog.HProgramadas,
                IFNULL(par.HParadas, 0) AS HParadas,
                COALESCE(ROUND((prog.HProgramadas - IFNULL(par.HParadas, 0)), 2), 0) AS HxJustificar,
                CASE WHEN par.Cerrados > 0 THEN 'CERRADO' ELSE 'ABIERTO' END AS EstatusTurnoMaquina,
                NULL AS Accion
        FROM (
            SELECT 
                DATE(prp.Fecha) AS Fecha,
                prp.Turno,
                prp.Maquina,
                prp.Sede AS Sede,
                prp.Turno AS IdTurno,
                prp.Maquina AS IdMaquinaArea,
                ROUND(SUM(DISTINCT prp.TotalHoras) / 60, 2) AS HProgramadas
            FROM produccion_registroprogramacion prp
            WHERE DATE(prp.Fecha) = CURDATE()
            GROUP BY DATE(prp.Fecha), prp.Turno, prp.Maquina, prp.Sede
        ) prog
        JOIN produccion_turnos t ON prog.Turno = t.IdTurno
        JOIN produccion_maquinashorasparadas m ON prog.Maquina = m.IdMaquinaArea
        LEFT JOIN (
                                    SELECT 
                                            DATE(Fecha) AS Fecha,
                                            Turno,
                                            Maquina,
                                            IdUsuario,
                                            SUM(CASE WHEN EstatusTurnoMaquina = 'CERRADO' THEN 1 ELSE 0 END) AS Cerrados,
                                            ROUND(SUM(TotalHoras) / 60, 2) AS HParadas
                                    FROM produccion_registrocontrolparadas
                                    WHERE DATE(Fecha) = CURDATE()
                                        AND IdUsuario = $idusuario
                                    GROUP BY DATE(Fecha), Turno, Maquina, IdUsuario
                            ) par
        ON prog.Fecha = par.Fecha
           AND prog.Turno = par.Turno
           AND prog.Maquina = par.Maquina
        WHERE IFNULL(par.HParadas, 0) > 0
        ORDER BY prog.Fecha DESC, t.Turno, m.MaquinaArea";
        error_log("detalle_todas_maquinas (debug): INICIO, SQL: $sql");
        $result = $conn->query($sql);
        $datos = array();
        $rowCount = 0;
        if ($result) {
            while($row = $result->fetch_assoc()) {
                error_log("detalle_todas_maquinas (debug): " . json_encode($row));
                $datos[] = $row;
                $rowCount++;
            }
        }
        if ($rowCount === 0) {
            error_log("detalle_todas_maquinas (debug): SIN FILAS para SQL: $sql");
        }
        error_log("detalle_todas_maquinas (debug): FIN, filas: $rowCount");
        echo json_encode($datos);
        $conn->close();
        exit;
    }

    elseif ($action == 'validar_hora_inicio_superpuesta') {
        $fecha = $_GET['fecha'];
        $idMaquinaArea = $_GET['idMaquinaArea'];
        $horaInicio = $_GET['horaInicio'];

        error_log("VALIDAR_SUPERPUESTA: fecha=$fecha, maquina=$idMaquinaArea, horaInicio=$horaInicio");

        // Consulta para ver si la hora de inicio está dentro de algún rango existente
        $sql = "SELECT COUNT(*) as total FROM produccion_registrocontrolparadas
                WHERE Fecha = ?
                AND Maquina = ?
                AND HoraInicio <= ?
                AND HoraFin > ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $fecha, $idMaquinaArea, $horaInicio, $horaInicio);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        error_log("VALIDAR_SUPERPUESTA_RESULT: total=" . $row['total']);

        echo json_encode(['superpuesta' => $row['total'] > 0]);
        $conn->close();
        exit;
    }

    elseif ($action == 'resumen_registrocontrolparadas') {
        $sql = "SELECT * FROM uv_registrocontrolparadas";
        $result = $conn->query($sql);
        $datos = array();
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
        error_log("RESUMEN: registros devueltos=" . count($datos));
        if (count($datos) > 0) {
            error_log("RESUMEN: primer registro=" . json_encode($datos[0]));
        } else {
            error_log("RESUMEN: SIN DATOS");
        }
        echo json_encode($datos);
        $conn->close();
        exit;
    }

    elseif ($_GET['action'] == 'enviar_whatsapp_alerta') {
        // Asocia cada número con su API Key
        $telefonos = [
            ['numero' => $_GET['telefono'], 'apikey' => $_GET['apikey']], // este numero, se envías desde JS
            // ['numero' => '51934811554', 'apikey' => '2628573'], //ROY QUICAÑO
            // ['numero' => '51979746857', 'apikey' => '9933687'], //JIMMY SAMAN
            // ['numero' => '51944576025', 'apikey' => '5039351'], //PAUL ALIAGA
            // ['numero' => '51941773268', 'apikey' => '2564103'], //DIEGO VICENTE
            // ['numero' => '51947242012', 'apikey' => '5638306'], //CRISTIAN CONISLLA
            // ['numero' => '51939064427', 'apikey' => '3747539'] //JOEL MIRES
        ];
        $mensaje = urlencode($_GET['mensaje']);
        $responses = [];
        foreach ($telefonos as $t) {
            $url = "https://api.callmebot.com/whatsapp.php?phone={$t['numero']}&text=$mensaje&apikey={$t['apikey']}";
            $response = file_get_contents($url);
            $responses[] = ['telefono' => $t['numero'], 'response' => $response];
        }
        echo json_encode(['status' => 'ok', 'responses' => $responses]);
        exit;
    }

    elseif ($action == 'cerrar_turno_maquina') {
        $fecha = isset($_GET['fecha']) ? $_GET['fecha'] : '';
        $sede = isset($_GET['sede']) ? $_GET['sede'] : '';
        $turno = isset($_GET['turno']) ? $_GET['turno'] : '';
        $maquina = isset($_GET['maquina']) ? $_GET['maquina'] : '';
        $totalHoras = isset($_GET['totalHoras']) ? $_GET['totalHoras'] : '';
        $motivoCierre = isset($_GET['motivoCierre']) ? $_GET['motivoCierre'] : '';
        $statusTurnoMaquina = isset($_GET['statusTurnoMaquina']) ? $_GET['statusTurnoMaquina'] : '';
        $hxJustificar = isset($_GET['hxJustificar']) ? $_GET['hxJustificar'] : '';
        $idusuario = isset($_SESSION['idusuario']) ? $_SESSION['idusuario'] : '';
        // Recibes: fecha, sede, turno, maquina, motivoCierre, statusTurnoMaquina, hxJustificar
    // error_log("PARAMS: fecha=$fecha, sede=$sede, turno=$turno, maquina=$maquina, totalHoras=$totalHoras, motivoCierre=$motivoCierre, statusTurnoMaquina=$statusTurnoMaquina, hxJustificar=$hxJustificar, idusuario=$idusuario");

        $sqlCheck = "SELECT COUNT(*) as total FROM produccion_registrocontrolparadas
                    WHERE Fecha = '$fecha' AND Sede = '$sede' AND Turno = '$turno' AND Maquina = '$maquina'";
        $result = $conn->query($sqlCheck);
        $row = $result->fetch_assoc();
        if ($row['total'] == 0) {
            $sqlInsert = "INSERT INTO produccion_registrocontrolparadas
                (Fecha, Sede, Turno, Maquina, TotalHoras, MotivoCierre, EstatusTurnoMaquina, HxJustificar, idusuario, estado)
                VALUES ('$fecha', '$sede', '$turno', '$maquina', '$totalHoras', '$motivoCierre', '$statusTurnoMaquina', '$hxJustificar', '$idusuario', 2)";
            // error_log("INTENTANDO INSERT: $sqlInsert");
            if (!$conn->query($sqlInsert)) {
                error_log("ERROR SQL: " . $conn->error);
                echo json_encode(['status' => 'error', 'message' => $conn->error]);
                exit;
            }
        } else {
            $sqlUpdate = "UPDATE produccion_registrocontrolparadas
                SET MotivoCierre = '$motivoCierre', EstatusTurnoMaquina = '$statusTurnoMaquina', HxJustificar = '$hxJustificar', estado = 2
                WHERE Fecha = '$fecha' AND Sede = '$sede' AND Turno = '$turno' AND Maquina = '$maquina'";
            // error_log("INTENTANDO UPDATE: $sqlUpdate");
            if (!$conn->query($sqlUpdate)) {
                error_log("ERROR SQL: " . $conn->error);
                echo json_encode(['status' => 'error', 'message' => $conn->error]);
                exit;
            }
        }
        echo json_encode(['status' => 'ok']);
        exit;
    }

        
    else {
        throw new Exception("Acción no válida");
    }

    echo json_encode($datos);

    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(array("error" => $e->getMessage()));
}
    
?>