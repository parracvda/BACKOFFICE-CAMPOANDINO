<?php
// Conexión a la base de datos
$host = '201.148.104.83';
$dbname = 'campoand_campoandino';
$user = 'campoand_sistemas2';
$password = 'parracodex.';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Determinar si la solicitud es para exportar o mostrar en la página
    $isExport = isset($_GET['export']) && $_GET['export'] == 1;

    // Consulta para obtener los datos
    if ($isExport) {
        // Seleccionar todas las columnas para la exportación completa
        // $query = "SELECT rc.* FROM sig_registrocontrolcalidad rc LEFT JOIN sig_vcc_tipomaterial tm ON rc.TipoMaterial = tm.IdTipoMaterial";

    $query = "SELECT rc.IdRegistroControlCalidad, se.Sedes, rc.Fecha, rc.HoraInicio, rc.HoraFin, rc.NombreCliente, rc.PlacaTransporte, rc.PlacaTracto
    , rc.Conductor, rc.EmpresaTransportista, rc.Destino, rc.NumeroViaje, rc.PorHumedad, ot.Observacion
    , rc.Paredes, rc.Plataforma, rc.Techo, rc.Puerta, rc.TotalObservacionesT, rc.PorcentajeTotalObservacionesT
    , rc.Lote, rc.CodigoProducto, rc.DescripcionProducto, rc.Numero, rc.HumedadCajas, rc.PalletsTerminados
    , rc.PuchosTerminados, tm.TipoMaterial, rc.CantidadMuestra, rc.ObservacionMuestra, rc.Despegado_C, rc.Despegado_P
    , rc.DobleEtiqueta_C, rc.DobleEtiqueta_P, rc.ImpresionSenasa_C, rc.ImpresionSenasa_P, rc.MalaSujecion_C
    , rc.MalaSujecion_P, rc.PiezaDanada_C, rc.PiezaDanada_P, rc.PuntoExpuesto_C, rc.PuntoExpuesto_P, rc.PuntoRoto_C
    , rc.PuntoRoto_P, rc.PuntoSuelto_C, rc.PuntoSuelto_P, rc.Rasgado_C, rc.Rasgado_P, rc.RotoQuebrado_C, rc.RotoQuebrado_P
    , rc.SinPunto_C, rc.SinPunto_P, rc.Volteado_C, rc.Volteado_P, rc.PF_MetalAcero_C, rc.PF_MetalAcero_P, rc.PF_Insectos_C
    , rc.PF_Insectos_P, rc.PF_Piedras_C, rc.PF_Piedras_P, rc.PF_Oxido_C, rc.PF_Oxido_P
    , rc.PF_Plastico_C, rc.PF_Plastico_P, rc.PF_Polvo_C, rc.PF_Polvo_P, rc.PQ_Pinturas_C, rc.PQ_Pinturas_P
    , rc.PQ_Lubricantes_C, rc.PQ_Lubricantes_P, rc.PQ_Petroleo_C, rc.PQ_Petroleo_P, rc.PQ_Grasas_C, rc.PQ_Grasas_P
    , rc.PM_Hongos_C, rc.PM_Hongos_P, rc.PM_Moho_C, rc.PM_Moho_P, rc.PM_HecesAnimales_C, rc.PM_HecesAnimales_P
    , rc.PM_Saliva_C, rc.PM_Saliva_P, rc.CantObservaciones, rc.PorcObservaciones

        FROM sig_registrocontrolcalidad_de rc
        LEFT JOIN general_sedes se
        ON rc.Sede = se.IdSedes   
        LEFT JOIN sig_vcc_obstrans_de ot
        ON rc.ObservacionTransporte = ot.IdObservacion     
        LEFT JOIN sig_vcc_tipomaterial_de tm
        ON rc.TipoMaterial = tm.IdTipoMaterial  
        LEFT JOIN sig_vcc_obsmues_de om
        ON rc.ObservacionMuestra = om.IdObservacion  
        LEFT JOIN usuarios us
        ON rc.IdUsuario = us.IdUsuario";

    } else {
        // Seleccionar solo las columnas específicas para mostrar en la página
        $query = "SELECT rc.idRegistroControlCalidad, se.Sedes, rc.Fecha, rc.HoraInicio
        FROM sig_registrocontrolcalidad_de rc
        LEFT JOIN general_sedes se
        ON rc.Sede = se.IdSedes
        -- LEFT JOIN sig_vcc_tipoproducto tp
        -- ON rc.TipoProducto = tp.IdTipoProducto
        -- LEFT JOIN sig_vcc_tipomaterial_pt tm
        -- ON rc.TipoMaterial = tm.IdTipoMaterial
        ";       
    }

    $params = [];
    $conditions = [];

    // Filtrar datos según los parámetros recibidos
    if (isset($_GET['filterToday']) && $_GET['filterToday'] == 'true') {
        $conditions[] = "DATE(rc.Fecha) = CURDATE()";
    }
    if (!empty($_GET['startDate']) && !empty($_GET['endDate'])) {
        $conditions[] = "rc.Fecha BETWEEN :startDate AND :endDate";
        $params[':startDate'] = $_GET['startDate'];
        $params[':endDate'] = $_GET['endDate'];
    }
    if (!empty($_GET['tipoMaterial_pt'])) {
        $conditions[] = "tm.TipoMaterial_pp = :tipoMaterial_pp";
        $params[':tipoMaterial_pp'] = $_GET['tipoMaterial_pp'];
    }

    if (count($conditions) > 0) {
        $query .= " WHERE " . implode(' AND ', $conditions);
    }

    $stmt = $pdo->prepare($query);
    foreach ($params as $key => &$val) {
        $stmt->bindParam($key, $val);
    }
    $stmt->execute();
    $registros = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($isExport) {
        // Exportar a CSV
        $filename = 'registros.csv';
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment;filename="' . $filename . '"');
        header('Cache-Control: max-age=0');

        $output = fopen('php://output', 'w');

        if (!empty($registros)) {
            fputcsv($output, array_keys($registros[0])); // Encabezados
            foreach ($registros as $registro) {
                fputcsv($output, $registro); // Datos
            }
        } else {
            fputcsv($output, ['No hay registros disponibles para los filtros seleccionados']);
        }

        fclose($output);
        exit;
    } else {
        // Mostrar datos en la página
        if (!empty($registros)) {
            echo '<table border="1">';
            echo '<thead><tr>';
            echo '<th>idRegistroControlCalidad</th>';
            echo '<th>Sede</th>';
            echo '<th>Fecha</th>';
            echo '<th>HoraInicio</th>';
            // echo '<th>TipoProducto</th>';
            // echo '<th>TipoMaterial</th>';
        
            echo '</tr></thead><tbody>';

            foreach ($registros as $registro) {
                echo '<tr>';
                echo '<td>' . htmlspecialchars($registro['idRegistroControlCalidad']) . '</td>';
                echo '<td>' . htmlspecialchars($registro['Sedes']) . '</td>';
                echo '<td>' . htmlspecialchars($registro['Fecha']) . '</td>';
                echo '<td>' . htmlspecialchars($registro['HoraInicio']) . '</td>';
                // echo '<td>' . htmlspecialchars($registro['TipoProducto']) . '</td>';
                // echo '<td>' . htmlspecialchars($registro['TipoMaterial_pt']) . '</td>';  
                echo '</tr>';
            }

            echo '</tbody></table>';
        } else {
            echo 'No hay registros disponibles para los filtros seleccionados.';
        }
    }

} catch (PDOException $e) {
    echo 'Error de conexión a la base de datos: ' . htmlspecialchars($e->getMessage());
}
?>
