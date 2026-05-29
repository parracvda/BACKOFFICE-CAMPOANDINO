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

    $query = "SELECT rc.IdRegistroControlCalidad, se.Sedes, rc.Fecha, tu.Turno, rc.HoraInicio, rc.HoraFin, ca.Campana, rc.CodigoPallet
        , rc.FechaProduccion, rc.LoteProduccion, rc.CodigoTrazabilidad, ma.Maquina, pr.Proceso, de.Destino
        , rc.Cantidad, rc.CodigoProducto, rc.DescripcionProducto, rc.ObservacionTrazabilidad, op.Observacion
        , rc.Contaminacion, rc.PeligrosPaletizado, rc.PaletizadoConforme, rc.SelladoConforme, tm.TipoMaterial, rc.CantidadMuestra
        , om.Observacion, rc.Ancho_C, rc.Ancho_D, rc.Ancho_UM, rc.Ancho_P, rc.Largo_C, rc.Largo_D, rc.Largo_UM, rc.Largo_P, rc.Alto_C
        , rc.Alto_D, rc.Alto_UM, rc.Alto_P, rc.Espesor_C, rc.Espesor_D, rc.Espesor_UM, rc.Espesor_P, rc.Humedad_C, rc.Humedad_D
        , rc.Arqueado_C, rc.Arqueado_P, rc.Color_C, rc.Color_P, rc.Corte_C, rc.Corte_P, rc.Cuadratura_C, rc.Cuadratura_P, rc.Despegado_C, rc.Despegado_P
        , rc.DobleEtiqueta_C, rc.DobleEtiqueta_P, rc.FalloImpresion_C, rc.FalloImpresion_P, rc.Grietas_C, rc.Grietas_P
        , rc.ImpresionSenasa_C, rc.ImpresionSenasa_P, rc.MalaDistribucion_C, rc.MalaDistribucion_P, rc.MalaSujecion_C
        , rc.MalaSujecion_P, rc.ManchasAzules_C, rc.ManchasAzules_P, rc.NoUV_C, rc.NoUV_P, rc.Nudo_C, rc.Nudo_P, rc.Orificios_C
        , rc.Orificios_P, rc.Partidura_C, rc.Partidura_P, rc.PuntoExpuesto_C, rc.PuntoExpuesto_P, rc.PuntoRoto_C, rc.PuntoRoto_P
        , rc.PuntoSuelto_C, rc.PuntoSuelto_P, rc.Rasgado_C, rc.Rasgado_P, rc.RotoQuebrado_C, rc.RotoQuebrado_P, rc.SinPunto_C
        , rc.SinPunto_P, rc.TexturaGranulada_C, rc.TexturaGranulada_P, rc.Vacio_C, rc.Vacio_P, rc.Ventilacion_C, rc.Ventilacion_P
        , rc.Volteado_C, rc.Volteado_P, rc.PF_CintaEmbalaje_C, rc.PF_CintaEmbalaje_P, rc.PF_MetalAcero_C, rc.PF_MetalAcero_P
        , rc.PF_Plastico_C, rc.PF_Plastico_P, rc.PF_Insectos_C, rc.PF_Insectos_P, rc.PF_Astillado_C, rc.PF_Astillado_P
        , rc.PF_EPPS_C, rc.PF_EPPS_P, rc.PF_Carton_C, rc.PF_Carton_P, rc.PF_Piedras_C, rc.PF_Piedras_P, rc.PF_Oxido_C, rc.PF_Oxido_P
        , rc.PF_Polvo_C, rc.PF_Polvo_P, rc.PF_Lija_C, rc.PF_Lija_P, rc.PQ_Pinturas_C, rc.PQ_Pinturas_P, rc.PQ_Tinta_C, rc.PQ_Tinta_P
        , rc.PQ_Petroleo_C, rc.PQ_Petroleo_P, rc.PQ_Cola_C, rc.PQ_Cola_P, rc.PQ_Lubricantes_C, rc.PQ_Lubricantes_P, rc.PQ_Grasas_C
        , rc.PQ_Grasas_P, rc.PM_Hongos_C, rc.PM_Hongos_P, rc.PM_Moho_C, rc.PM_Moho_P, rc.PM_HecesAnimales_C, rc.PM_HecesAnimales_P
        , rc.PM_Sangre_C, rc.PM_Sangre_P, rc.PM_Suciedad_C, rc.PM_Suciedad_P, rc.ContMalIntencionada, rc.AL_Frutos_C, rc.AL_Frutos_P
        , rc.AL_Huevos_C, rc.AL_Huevos_P, rc.AL_Vegetales_C, rc.AL_Vegetales_P, rc.AL_ProductosAzucarados_C
        , rc.AL_ProductosAzucarados_P, rc.AL_Lacteos_C, rc.AL_Lacteos_P, rc.CantObservaciones, rc.PorcObservaciones

        FROM sig_registrocontrolcalidad_pp rc
        LEFT JOIN general_sedes se
        ON rc.Sede = se.IdSedes
        LEFT JOIN sig_vcc_turno tu
        ON rc.Turno = tu.IdTurno
        LEFT JOIN sig_vcc_campana ca
        ON rc.Campana = ca.IdCampana
         LEFT JOIN sig_vcc_maquina ma
        ON rc.Maquina = ma.IdMaquina
        LEFT JOIN sig_vcc_proceso pr
        ON rc.Proceso = pr.IdProceso
        LEFT JOIN sig_vcc_destino de
        ON rc.Destino = de.IdDestino     
        LEFT JOIN sig_vcc_obspal_pp op
        ON rc.ObservacionPaletizado = op.IdObservacion     
        LEFT JOIN sig_vcc_tipomaterial_pp tm
        ON rc.TipoMaterial = tm.IdTipoMaterial  
         LEFT JOIN sig_vcc_obsmues_pt om
        ON rc.ObservacionMuestra = om.IdObservacion  
        LEFT JOIN usuarios us
        ON rc.IdUsuario = us.IdUsuario";

    } else {
        // Seleccionar solo las columnas específicas para mostrar en la página
        $query = "SELECT rc.idRegistroControlCalidad, se.Sedes, rc.Fecha, rc.HoraInicio
        FROM sig_registrocontrolcalidad_pp rc
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
