<?php
// Datos de conexión a la base de datos
$servername = "201.148.104.227";
// $servername = "127.0.0.1";
$username = "campoand_sistemas2";
$password = "parracodex.";
$database = "campoand_campoandino";

session_start();
function conectarDB($servername, $username, $password, $database) {
    $conn = new mysqli($servername, $username, $password, $database);
    if ($conn->connect_error) {
        die("Error de conexión: " . $conn->connect_error);
    }

    if (!$conn->set_charset("utf8mb4")) {
        die("Error cargando el conjunto de caracteres utf8mb4: " . $conn->error);
    }
    return $conn;
}

function obtenerDatosUsuarios($conn) {
    $sql = "SELECT * FROM campoand_campoandino.produccion_lineasensamblaje";
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

function cmbMaquinaArea($conn,$as_parametros) {
    $sql = "SELECT * FROM produccion_maquinasareas where IdSubArea=" . $as_parametros;
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

function cmbMotivo($conn,$as_parametros) {
    $sql = "SELECT * FROM produccion_cpm_motivosparadas where IdAreaResponsable=" . $as_parametros;
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

function produccion_registrocontrolparadas_agregar_buck($conn,$as_parametros) {

    
    $sql =
    "
    INSERT INTO `produccion_registrocontrolparadas` 
    (`Idregistrocontrolparadas`, `Sede`, `Fecha`, `HoraInicio`, `TipoProducto`, `Area`, `SubArea`, `Maquina`, `AreaResponsable`, `Motivo`, `Estado`) 
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

function produccion_registrocontrolparadas_agregar($conn,$as_parametros) {  
    
    $idusuario = isset($_SESSION['idusuario']) ? $_SESSION['idusuario'] : '';
    $as_parametros = $as_parametros . "," . $idusuario ;
    //$stmt = $conn->prepare("CALL usp_produccion_registrocontrolparadas_insert(?)");
    $stmt = $conn->prepare("CALL usp_produccion_registrocontrolparadasjp2_insert(?)");
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

    $sql = " SELECT  Idregistrocontrolparadas, DATE_FORMAT(Fecha, '%d/%m/%Y') as Fecha
    , DATE_FORMAT(HoraInicio, '%H:%i') HoraInicio
    , DATE_FORMAT(HoraFin, '%H:%i') as HoraFin
    ,b.Estado as Estado 
 FROM campoand_campoandino.produccion_registrocontrolparadas a
 inner join produccion_estadosregistros b
 on a.estado = b.IdEstado
 where (idusuario=". $idusuario 
 . " or '".$tipousuario."'='ANALISTA DE PRODUCCION - VER PARADAS')";
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
 campoand_campoandino.produccion_registrocontrolparadas a
 
	left join general_sedes b
	 on a.Sede = b.IdSedes
	left join produccion_tipoproducto c
	 on a.TipoProducto = c.IdTipoProducto
	left join produccion_areas d
	 on a.Area = d.IdArea
	left join produccion_subareas e
	 on a.SubArea = e.IdSubArea
	left join produccion_maquinasareas f
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
    } elseif ($action == 'produccion_registrocontrolparadas_agregar') {
        $datos = produccion_registrocontrolparadas_agregar($conn,$parametros);  
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
    } else {
        throw new Exception("Acción no válida");
    }

    echo json_encode($datos);

    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(array("error" => $e->getMessage()));
}
    
?>