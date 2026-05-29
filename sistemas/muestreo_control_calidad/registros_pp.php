<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registros</title>
    <link rel="stylesheet" href="sergiodev.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="registros_pp.js"></script>
</head>
<body>
    <h1>Registros</h1>

    <!-- Checkbox para filtrar datos por fecha -->
    <label>
        <input type="checkbox" id="filterToday"> Solo mostrar datos de hoy
    </label>

    <!-- Filtros de rango de fechas -->
    <label>
        Fecha de inicio: <input type="date" id="startDate">
    </label>
    <label>
        Fecha de fin: <input type="date" id="endDate">
    </label>

    <!-- Filtro de tipo de material (sólo para exportación a CSV) -->
    <label>
        Tipo de material:
        <select id="tipoMaterial">
            <option value="">Todos</option>
            <?php
            
            $host = 'localhost'; 
            $dbname = 'campoand_campoandino'; 
            $user = 'root'; 
            $password = ''; 

            try {
                $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                // Consulta tipos de material
                $query = "SELECT IdTipoMaterial, TipoMaterial FROM sig_vcc_tipomaterial_pp";
                $stmt = $pdo->query($query);
                $tiposMaterial = $stmt->fetchAll(PDO::FETCH_ASSOC);

             
                foreach ($tiposMaterial as $tipo) {
                    echo '<option value="' . htmlspecialchars($tipo['TipoMaterial']) . '">' . htmlspecialchars($tipo['TipoMaterial']) . '</option>';
                }
            } catch (PDOException $e) {
                echo 'Error al cargar tipos de material: ' . htmlspecialchars($e->getMessage());
            }
            ?>
        </select>
    </label>

    <!-- Contenedor para los registros -->
    <div id="registrosContainer"></div>

    <!-- Botón para exportar datos a CSV -->
    <button id="exportToCSV">Exportar a CSV</button>

     <!-- Botón para ir a formulario -->
    <button id="Nuevo">Nuevo</button>

    <script>
        // JavaScript para manejar la carga de datos y la exportación
        $(document).ready(function() {
            // Función para cargar datos filtrados
            function cargarDatos() {
                var filterToday = $('#filterToday').is(':checked');
                var startDate = $('#startDate').val();
                var endDate = $('#endDate').val();
                var tipoMaterial = $('#tipoMaterial').val();

                $.ajax({
                    url: 'exportar_pp.php',
                    method: 'GET',
                    data: {
                        filterToday: filterToday,
                        startDate: startDate,
                        endDate: endDate,
                        tipoMaterial: tipoMaterial
                    },
                    success: function(response) {
                        $('#registrosContainer').html(response);
                    }
                });
            }

            // Cargar datos al cambiar filtros
            $('#filterToday, #startDate, #endDate, #tipoMaterial').on('change', cargarDatos);

            //carga de datos
            cargarDatos();

            
            $('#exportToCSV').on('click', function() {
                var startDate = $('#startDate').val();
                var endDate = $('#endDate').val();
                var tipoMaterial = $('#tipoMaterial').val();
                var url = 'exportar_pp.php?export=1&startDate=' + startDate + '&endDate=' + endDate + '&tipoMaterial=' + tipoMaterial;
                window.location.href = url;
            });
        });
    </script>
</body>
</html>
