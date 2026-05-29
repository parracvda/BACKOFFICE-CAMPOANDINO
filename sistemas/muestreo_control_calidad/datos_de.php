<?php
// Utilizar conexión centralizada del backoffice
require_once __DIR__ . '/../../shared/conexion.php';

session_start();
function conectarDB($servername, $username, $password, $database) {
    global $conn;
    // Retornar la conexión existente del backoffice
    if (isset($conn) && $conn instanceof mysqli) {
        return $conn;
    }
    // Fallback: crear nueva conexión si no existe
    $newConn = new mysqli($servername, $username, $password, $database);
    if ($newConn->connect_error) {
        die("Error de conexión: " . $newConn->connect_error);
    }
    if (!$newConn->set_charset("utf8mb4")) {
        die("Error cargando el conjunto de caracteres utf8mb4: " . $newConn->error);
    }
    return $newConn;
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

function cmbObservacionTransporte($conn) {
    $sql = "SELECT * FROM sig_vcc_obstrans_de";
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

function cmbTipoMaterial($conn) {
    $sql = "SELECT * FROM sig_vcc_tipomaterial_de";
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

function cmbObservacionMuestra($conn) {
    $sql = "SELECT * FROM sig_vcc_obsmues_de";
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

function sig_registrocontrolcalidad_agregar_buck($conn,$as_parametros) {

    $sql =
    "
    INSERT INTO `sig_registrocontrolcalidad_de` 
    (`IdRegistroControlCalidad`, `Sede`, `Fecha`, `HoraInicio`, `HoraFin`, `NombreCliente`, `PlacaTransporte`, `PlacaTracto`
    , `Conductor`, `EmpresaTransportista`, `Destino`, `NumeroViaje`, `PorHumedad`, `ObservacionTransporte`
    , `Paredes`, `Plataforma`, `Techo`, `Puerta`, `TotalObservacionesT`, `PorcentajeTotalObservacionesT`
    , `Lote`, `CodigoProducto`, `DescripcionProducto`, `Numero`, `HumedadCajas`, `PalletsTerminados`
    , `PuchosTerminados`, `TipoMaterial`, `CantidadMuestra`, `ObservacionMuestra`, `Despegado_C`, `Despegado_P`
    , `DobleEtiqueta_C`, `DobleEtiqueta_P`, `ImpresionSenasa_C`, `ImpresionSenasa_P`, `MalaSujecion_C`
    , `MalaSujecion_P`, `PiezaDanada_C`, `PiezaDanada_P`, `PuntoExpuesto_C`, `PuntoExpuesto_P`, `PuntoRoto_C`
    , `PuntoRoto_P`, `PuntoSuelto_C`, `PuntoSuelto_P`, `Rasgado_C`, `Rasgado_P`, `RotoQuebrado_C`, `RotoQuebrado_P`
    , `SinPunto_C`, `SinPunto_P`, `Volteado_C`, `Volteado_P`, `PF_MetalAcero_C`, `PF_MetalAcero_P`, `PF_Insectos_C`
    , `PF_Insectos_P`, `PF_Piedras_C`, `PF_Piedras_P`, `PF_Oxido_C`, `PF_Oxido_P`
    , `PF_Plastico_C`, `PF_Plastico_P`, `PF_Polvo_C`, `PF_Polvo_P`, `PQ_Pinturas_C`, `PQ_Pinturas_P`
    , `PQ_Lubricantes_C`, `PQ_Lubricantes_P`, `PQ_Petroleo_C`, `PQ_Petroleo_P`, `PQ_Grasas_C`, `PQ_Grasas_P`
    , `PQ_Tinta_C`, `PQ_Tinta_P`, `PM_Hongos_C`, `PM_Hongos_P`, `PM_Moho_C`, `PM_Moho_P`, `PM_HecesAnimales_C`, `PM_HecesAnimales_P`
    , `PM_Saliva_C`, `PM_Saliva_P`, `CantObservaciones`, `PorcObservaciones`)
    VALUES 
    " . $as_parametros . ";    
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

function sig_registrocontrolcalidad_agregar($conn,$as_parametros) {  
    
    $idusuario = isset($_SESSION['idusuario']) ? $_SESSION['idusuario'] : '';
    $as_parametros = $as_parametros . "," . $idusuario ;
    $stmt = $conn->prepare("CALL usp_sig_registrocontrolcalidad_de(?)");
    $stmt->bind_param("s", $as_parametros);
    $stmt->execute(); 
    $result = $stmt->get_result();
    $datos = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }
    return $datos;    
}

function dw_lista($conn,$as_parametros) {

    $idusuario = isset($_SESSION['idusuario']) ? $_SESSION['idusuario'] : '';
    $tipousuario = isset($_SESSION['tipousuario']) ? $_SESSION['tipousuario'] : '';

    $conn->query("SET lc_time_names = 'es_ES'");

    $sql = " SELECT IdRegistroControlCalidad
    , b.Sedes as Sede
    , DATE_FORMAT(Fecha, '%d/%m/%Y') as Fecha
    , DATE_FORMAT(Hora, '%H:%i') as Hora
    , c.TipoRegistro as TipoRegistro
    , d.TipoMaterial as TipoMaterial
    , e.Nombres as IdUsuario
 FROM campoand_campoandino.sig_registrocontrolcalidad a
inner join campoand_campoandino.general_sedes b
on a.sede = b.IdSedes
inner join campoand_campoandino.sig_vcc_tiporegistro c
on a.tiporegistro = c.IdTipoRegistro
inner join campoand_campoandino.sig_vcc_tipomaterial d
on a.tipomaterial = d.IdTipoMaterial
inner join campoand_campoandino.usuarios e
on a.IdUsuario = e.IdUsuario

 where a.fecha=CURDATE() 
 and (a.IdUsuario=". $idusuario 
 . " or '".$tipousuario."'='JEFE DE SISTEMAS INTEGRADOS DE GESTION')";
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

function dw_reporte($conn,$as_parametros) {

    $idusuario = isset($_SESSION['idusuario']) ? $_SESSION['idusuario'] : '';
    $tipousuario = isset($_SESSION['tipousuario']) ? $_SESSION['tipousuario'] : '';

    $conn->query("SET lc_time_names = 'es_ES'");

    $sql = " SELECT  Idregistrocontrolcalidad, DATE_FORMAT(Fecha, '%d/%m/%Y') as Fecha
    , DATE_FORMAT(HoraInicio, '%H:%i') HoraInicio
    , DATE_FORMAT(HoraFin, '%H:%i') as HoraFin
    ,b.Estado as Estado 
 FROM campoand_campoandino.sig_registrocontrolcalidad a
 left join produccion_estadosregistros b
 on a.estado = b.IdEstado
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
    $sql = "SELECT * FROM sig_registrocontrolcalidad where IdRegistroControlCalidad = " . $as_parametros;
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
    $usuario = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : '';
    $usuarionombre = isset($_SESSION['usuarionombre']) ? $_SESSION['usuarionombre'] : '';

    return $usuario ." - ".$usuarionombre;
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
    $conn = conectarDB($servername, $username, $password, $database);

    // Verificar qué acción ejecutar
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    $parametros = isset($_GET['parametros']) ? $_GET['parametros'] : '';

    if ($action == 'usuarios') {
        $datos = obtenerDatosUsuarios($conn);  
    } elseif ($action == 'cmbSede') {
        $datos = cmbSede($conn);
    } elseif ($action == 'cmbObservacionTransporte') {
        $datos = cmbObservacionTransporte($conn);
    } elseif ($action == 'cmbTipoMaterial') {
        $datos = cmbTipoMaterial($conn); 
    } elseif ($action == 'cmbObservacionMuestra') {
        $datos = cmbObservacionMuestra($conn);    
    } elseif ($action == 'sig_registrocontrolcalidad_agregar') {
        $datos = sig_registrocontrolcalidad_agregar($conn,$parametros);  
    } elseif ($action == 'dw_lista') {
        $datos = dw_lista($conn,$parametros);        
    } elseif ($action == 'obtenerPorID') {
        $datos = obtenerPorID($conn,$parametros);   
    } elseif ($action == 'wf_obtenerUsuario') {
        $datos = wf_obtenerUsuario();        
    } elseif ($action == 'wf_cerrarsesion') {
        $datos = wf_cerrarsesion();  
    } else {
        throw new Exception("Acción no válida");
    }

    echo json_encode($datos);

    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(array("error" => $e->getMessage()));
}
    