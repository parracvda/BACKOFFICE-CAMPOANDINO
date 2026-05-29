<?php
// Utilizar conexión centralizada del backoffice
require_once __DIR__ . '/../../shared/conexion.php';

// Convertir mysqli a PDO para compatibilidad con código existente
try {
    if (isset($conn) && $conn instanceof mysqli) {
        $host = $servername;
        $dbname = $conn->query("SELECT DATABASE() as db")->fetch_assoc()['db'];
        $user = $username;
        
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    // Determinar si la solicitud es para exportar o mostrar en la página
    $isExport = isset($_GET['export']) && $_GET['export'] == 1;

    // Consulta para obtener los datos
    if ($isExport) {
        // Seleccionar todas las columnas para la exportación completa
        // $query = "SELECT rc.* FROM sig_registrocontrolcalidad rc LEFT JOIN sig_vcc_tipomaterial tm ON rc.TipoMaterial = tm.IdTipoMaterial";

        $query = "SELECT rc.idRegistroControlCalidad, se.Sedes, rc.Fecha, rc.Hora, tr.TipoRegistro, pr.Procedencia, pr2.Proveedor, rc.GuiaRemision
        , rc.NPlaca, rc.TotalPaquetes, rc.NContenedor, rc.NPrecinto, rc.OrdenCompra, rc.DescripcionMaterial, rc.CodigoMaterial, rt1.RevTrans_Paredes
        , rt2.RevTrans_Techo, rt3.RevTrans_Puerta, rt4.RevTrans_Plataforma, rc.CondicionTransporte, tm.TipoMaterial, do.Documentacion, rc.Documentos, rc.Observacion
        , rc.CantidadMuestra, om.Observacion, ca.Caracteristica, rc.Ancho_C, rc.Ancho_D, rc.Ancho_UM, rc.Ancho_P, rc.Largo_C, rc.Largo_D
        , rc.Largo_UM, rc.Largo_P, rc.Espesor_C, rc.Espesor_D, rc.Espesor_UM, rc.Espesor_P, rc.Peso_C, rc.Peso_D, rc.Peso_UM, rc.Peso_P
        , rc.Humedad_C, rc.Humedad_D, rc.Oxidacion_C, rc.Oxidacion_P, rc.NoRecubrimiento_C, rc.NoRecubrimiento_P, rc.Color_C, rc.Color_P
        , rc.Adhesivo_C, rc.Adhesivo_P, rc.Nudos_C, rc.Nudos_P, rc.Medula_C, rc.Medula_P, rc.Grietas_C, rc.Grietas_P, rc.Arqueado_C, rc.Arqueado_P
        , rc.DañoInsecto_C, rc.DañoInsecto_P, rc.Astillado_C, rc.Astillado_P, rc.DesnivelCorte_C, rc.DesnivelCorte_P, rc.SuperficieRaspada_C, rc.SuperficieRaspada_P
        , rc.HuecosYVacios_C, rc.HuecosYVacios_P, rc.SuperficieRugosa_C, rc.SuperficieRugosa_P, rc.DesprendimientoCapas_C, rc.DesprendimientoCapas_P
        , rc.Rasgados_C, rc.Rasgados_P, rc.Perforacion_C, rc.Perforacion_P, rc.MalaImpresion_C, rc.MalaImpresion_P, rc.NoColor_C, rc.NoColor_P
        , rc.NoUV_C, rc.NoUV_P, rc.ProblemasSecado_C, rc.ProblemasSecado_P, rc.MarcaRodillo_C, rc.MarcaRodillo_P, rc.PF_MetalAcero_C, rc.PF_MetalAcero_P
        , rc.PF_Insectos_C, rc.PF_Insectos_P, rc.PF_Piedras_C, rc.PF_Piedras_P, rc.PF_Ramas_C, rc.PF_Ramas_P, rc.PF_Melaza_C, rc.PF_Melaza_P
        , rc.PF_Oxido_C, rc.PF_Oxido_P, rc.PF_Plastico_C, rc.PF_Plastico_P, rc.PF_Carton_C, rc.PF_Carton_P, rc.PF_Vidrio_C, rc.PF_Vidrio_P
        , rc.PF_EPPS_C, rc.PF_EPPS_P, rc.PQ_Pinturas_C, rc.PQ_Pinturas_P, rc.PQ_Lubricantes_C, rc.PQ_Lubricantes_P, rc.PQ_Resina_C, rc.PQ_Resina_P
        , rc.PM_Hongos_C, rc.PM_Hongos_P, rc.PM_Moho_C, rc.PM_Moho_P, rc.PM_HecesAnimales_C, rc.PM_HecesAnimales_P, rc.ContMalIntencionada
        , rc.AL_Frutos_C, rc.AL_Frutos_P, rc.AL_Huevos_C, rc.AL_Huevos_P, rc.AL_Vegetales_C, rc.AL_Vegetales_P, rc.AL_ProductosAzucarados_C, rc.AL_ProductosAzucarados_P
        , rc.AL_Salsas_C, rc.AL_Salsas_P, rc.CantObservaciones, rc.PorcObservaciones, us.Nombres

        FROM sig_registrocontrolcalidad rc
        LEFT JOIN general_sedes se
        ON rc.Sede = se.IdSedes
        LEFT JOIN sig_vcc_tiporegistro tr
        ON rc.TipoRegistro = tr.IdTipoRegistro
        LEFT JOIN sig_vcc_procedencia pr
        ON rc.Procedencia = pr.IdProcedencia
        LEFT JOIN sig_vcc_proveedor pr2
        ON rc.Proveedor = pr2.IdProveedor  



        LEFT JOIN sig_vcc_revtrans_paredes rt1
        ON rc.Paredes = rt1.IdRevTrans_Paredes  

        LEFT JOIN sig_vcc_revtrans_techo rt2
        ON rc.Techo = rt2.IdRevTrans_Techo  

        LEFT JOIN sig_vcc_revtrans_puerta rt3
        ON rc.Puerta = rt3.IdRevTrans_Puerta  

        LEFT JOIN sig_vcc_revtrans_plataforma rt4
        ON rc.Plataforma = rt4.IdRevTrans_Plataforma  



        LEFT JOIN sig_vcc_tipomaterial tm
        ON rc.TipoMaterial = tm.IdTipoMaterial
        LEFT JOIN sig_vcc_documentacion do
        ON rc.Documentacion = do.IdDocumentacion
        LEFT JOIN sig_vcc_obsmues om
        ON rc.ObservacionMuestra = om.IdObservacion
        LEFT JOIN sig_vcc_caracteristica ca
        ON rc.Caracteristica = ca.IdCaracteristica
        LEFT JOIN usuarios us
        ON rc.IdUsuario = us.IdUsuario
        
        ";




    } else {
        // Seleccionar solo las columnas específicas para mostrar en la página
        $query = "SELECT rc.idRegistroControlCalidad, se.Sedes, rc.Fecha, rc.Hora, tr.TipoRegistro, tm.TipoMaterial
        FROM sig_registrocontrolcalidad rc
        LEFT JOIN general_sedes se
        ON rc.Sede = se.IdSedes
        LEFT JOIN sig_vcc_tiporegistro tr
        ON rc.TipoRegistro = tr.IdTipoRegistro
        LEFT JOIN sig_vcc_tipomaterial tm
        ON rc.TipoMaterial = tm.IdTipoMaterial";

        
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
    if (!empty($_GET['tipoMaterial'])) {
        $conditions[] = "tm.TipoMaterial = :tipoMaterial";
        $params[':tipoMaterial'] = $_GET['tipoMaterial'];
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
            echo '<th>Hora</th>';
            echo '<th>TipoRegistro</th>';
            echo '<th>TipoMaterial</th>';
        
            echo '</tr></thead><tbody>';

            foreach ($registros as $registro) {
                echo '<tr>';
                echo '<td>' . htmlspecialchars($registro['idRegistroControlCalidad']) . '</td>';
                echo '<td>' . htmlspecialchars($registro['Sedes']) . '</td>';
                echo '<td>' . htmlspecialchars($registro['Fecha']) . '</td>';
                echo '<td>' . htmlspecialchars($registro['Hora']) . '</td>';
                echo '<td>' . htmlspecialchars($registro['TipoRegistro']) . '</td>';
                echo '<td>' . htmlspecialchars($registro['TipoMaterial']) . '</td>';  
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
