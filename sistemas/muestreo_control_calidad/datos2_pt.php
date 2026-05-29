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
        $query = "SELECT rc.* FROM sig_registrocontrolcalidad rc LEFT JOIN sig_vcc_tipomaterial tm ON rc.TipoMaterial = tm.IdTipoMaterial";
    } else {
        // Seleccionar solo las columnas específicas para mostrar en la página
        $query = "SELECT rc.idRegistroControlCalidad, rc.Sede, rc.Fecha, rc.Hora, rc.TipoRegistro FROM sig_registrocontrolcalidad rc LEFT JOIN sig_vcc_tipomaterial tm ON rc.TipoMaterial = tm.IdTipoMaterial";
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
            echo '</tr></thead><tbody>';

            foreach ($registros as $registro) {
                echo '<tr>';
                echo '<td>' . htmlspecialchars($registro['idRegistroControlCalidad']) . '</td>';
                echo '<td>' . htmlspecialchars($registro['Sede']) . '</td>';
                echo '<td>' . htmlspecialchars($registro['Fecha']) . '</td>';
                echo '<td>' . htmlspecialchars($registro['Hora']) . '</td>';
                echo '<td>' . htmlspecialchars($registro['TipoRegistro']) . '</td>';
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
