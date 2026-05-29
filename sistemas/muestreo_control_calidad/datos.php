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

// function obtenerDatosUsuarios($conn) {
//     $sql = "SELECT * FROM campoand_campoandino.produccion_lineasensamblaje";
//     $result = $conn->query($sql);
//     if (!$result) {
//         die("Error en la consulta: " . $conn->error);
//     }
    
//     $datos = array();
//     if ($result->num_rows > 0) {
//         while($row = $result->fetch_assoc()) {
//             $datos[] = $row;
//         }
//     }
//     return $datos;
// }

// function obtenerDatosProductos($conn) {
//     $sql = "SELECT id, nombre, precio FROM productos";
//     $result = $conn->query($sql);
//     if (!$result) {
//         die("Error en la consulta: " . $conn->error);
//     }
    
//     $datos = array();
//     if ($result->num_rows > 0) {
//         while($row = $result->fetch_assoc()) {
//             $datos[] = $row;
//         }
//     }
//     return $datos;
// }

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

function cmbTipoRegistro($conn) {
    $sql = "SELECT * FROM sig_vcc_tiporegistro";
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

function cmbProcedencia($conn) {
    $sql = "SELECT * FROM sig_vcc_procedencia";
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

function cmbProveedor($conn,$as_parametros) {
    $sql = "SELECT * FROM sig_vcc_proveedor where IdProcedencia=" . $as_parametros;
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

function cmbDescripcionMaterial($conn) {
    $sql = "SELECT DescripcionMaterial FROM logistica_estatus_compras";
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

function cmbParedes($conn) {
    $sql = "SELECT * FROM sig_vcc_revtrans_paredes";
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

function cmbTecho($conn) {
    $sql = "SELECT * FROM sig_vcc_revtrans_techo";
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

function cmbPuerta($conn) {
    $sql = "SELECT * FROM sig_vcc_revtrans_puerta";
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

function cmbPlataforma($conn) {
    $sql = "SELECT * FROM sig_vcc_revtrans_plataforma";
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
    $sql = "SELECT * FROM sig_vcc_tipomaterial";
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

function cmbDocumentacion($conn) {
    $sql = "SELECT * FROM sig_vcc_documentacion";
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
    $sql = "SELECT * FROM sig_vcc_obsmues";
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

function cmbCaracteristica($conn) {
    $sql = "SELECT * FROM sig_vcc_caracteristica";
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
    INSERT INTO `sig_registrocontrolcalidad` 
    (`IdRegistroControlCalidad`, `Sede`, `Fecha`, `Hora`, `TipoRegistro`, `Procedencia`, `Proveedor`, `GuiaRemision`
    , `GuiaTransportista`, `NPlaca`, `TotalPaquetes`, `NContenedor`, `NPrecinto`, `OrdenCompra`, `DescripcionMaterial`
    , `CodigoMaterial`, `Paredes`, `Techo`, `Puerta`, `Plataforma`, `CondicionTransporte`, `TipoMaterial`, `Documentacion`
    , `Documentos`, `Observacion`, `CantidadMuestra`, `ObservacionMuestra`, `Caracteristica`, `Ancho_C`, `Ancho_D`
    , `Ancho_UM`, `Ancho_P`, `Largo_C`, `Largo_D`, `Largo_UM`, `Largo_P`, `Espesor_C`, `Espesor_D`, `Espesor_UM`
    , `Espesor_P`, `Peso_C`, `Peso_D`, `Peso_UM`, `Peso_P`, `Humedad_C`, `Humedad_D`
    , `Oxidacion_C`, `Oxidacion_P`, `NoRecubrimiento_C`, `NoRecubrimiento_P`, `Color_C`, `Color_P`, `Adhesivo_C`
    , `Adhesivo_P`, `Nudos_C`, `Nudos_P`, `Medula_C`, `Medula_P`, `Grietas_C`, `Grietas_P`
    , `Arqueado_C`, `Arqueado_P`, `DañoInsecto_C`, `DañoInsecto_P`, `Astillado_C`, `Astillado_P`, `DesnivelCorte_C`
    , `DesnivelCorte_P`, `SuperficieRaspada_C`, `SuperficieRaspada_P`, `HuecosYVacios_C`, `HuecosYVacios_P`
    , `SuperficieRugosa_C`, `SuperficieRugosa_P`, `DesprendimientoCapas_C`, `DesprendimientoCapas_P`, `Rasgados_C`, `Rasgados_P`
    , `Perforacion_C`, `Perforacion_P`, `MalaImpresion_C`, `MalaImpresion_P`, `NoColor_C`, `NoColor_P`, `NoUV_C`, `NoUV_P`
    , `ProblemasSecado_C`, `ProblemasSecado_P`, `MarcaRodillo_C`, `MarcaRodillo_P`, `PF_MetalAcero_C`, `PF_MetalAcero_P`
    , `PF_Insectos_C`, `PF_Insectos_P`, `PF_Piedras_C`, `PF_Piedras_P`, `PF_Ramas_C`, `PF_Ramas_P`, `PF_Melaza_C`
    , `PF_Melaza_P`, `PF_Oxido_C`, `PF_Oxido_P`, `PF_Plastico_C`, `PF_Plastico_P`, `PF_Carton_C`, `PF_Carton_P`
    , `PF_Vidrio_C`, `PF_Vidrio_P`, `PF_EPPS_C`, `PF_EPPS_P`, `PQ_Pinturas_C`, `PQ_Pinturas_P`, `PQ_Lubricantes_C`
    , `PQ_Lubricantes_P`, `PQ_Resina_C`, `PQ_Resina_P`, `PM_Hongos_C`, `PM_Hongos_P`, `PM_Moho_C`, `PM_Moho_P`, `PM_HecesAnimales_C`, `PM_HecesAnimales_P`
    , `PM_Sangre_C`, `PM_Sangre_P`, `ContMalIntencionada`, `AL_Frutos_C`, `AL_Frutos_P`, `AL_Huevos_C`, `AL_Huevos_P`
    , `AL_Vegetales_C`, `AL_Vegetales_P`, `AL_ProductosAzucarados_C`, `AL_ProductosAzucarados_P`, `AL_Salsas_C`, `AL_Salsas_P`
    , `CantObservaciones`, `PorcObservaciones`)
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
    $stmt = $conn->prepare("CALL usp_sig_registrocontrolcalidad_insert5(?)");
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
    } elseif ($action == 'cmbTipoRegistro') {
        $datos = cmbTipoRegistro($conn);
    } elseif ($action == 'cmbProcedencia') {
        $datos = cmbProcedencia($conn); 
    } elseif ($action == 'cmbProveedor') {
        $datos = cmbProveedor($conn,$parametros); 
    } elseif ($action == 'cmbParedes') {
        $datos = cmbParedes($conn); 
    } elseif ($action == 'cmbTecho') {
        $datos = cmbTecho($conn);
    } elseif ($action == 'cmbPuerta') {
        $datos = cmbPuerta($conn);
    } elseif ($action == 'cmbPlataforma') {
        $datos = cmbPlataforma($conn);
    } elseif ($action == 'cmbTipoMaterial') {
        $datos = cmbTipoMaterial($conn);
    } elseif ($action == 'cmbDescripcionMaterial') {
        $datos = cmbDescripcionMaterial($conn);
    } elseif ($action == 'cmbDocumentacion') {
        $datos = cmbDocumentacion($conn);
    } elseif ($action == 'cmbObservacionMuestra') {
        $datos = cmbObservacionMuestra($conn);   
    } elseif ($action == 'cmbCaracteristica') {
        $datos = cmbCaracteristica($conn);  
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
    