<?php
/**
 * Script mejorado de sincronización de stock_materiales desde Google Sheets
 * Mejoras:
 * - Validación de columnas por fila
 * - Logging completo de errores
 * - Detección de productos faltantes
 * - Manejo de encoding UTF-8
 * - Mayor tiempo de ejecución
 */

$token = 'SECRETO';

if (!isset($_GET['token']) || $_GET['token'] !== $token) {
    http_response_code(403);
    exit('No autorizado');
}

// Aumentar límites de ejecución
ini_set('max_execution_time', 600); // 10 minutos
ini_set('memory_limit', '512M');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/* =========================
   CONFIGURACIÓN
========================= */

$csv_url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTBwjwp9Pg9NnCyn2KuQtSwF-zVEOZRdbOdDRQIZMutYMzPMbMLY9HHIx3FRwPzCqM26zwUX-_ouiJ7/pub?gid=1311358694&single=true&output=csv";

// Usar configuración centralizada
require_once __DIR__ . '/../../shared/conexion.php';

$logFile = __DIR__ . '/cron_sync.log';
$errorLogFile = __DIR__ . '/cron_sync_errors.log';

/* =========================
   FUNCIONES
========================= */

function logMsg($msg, $file) {
    file_put_contents(
        $file,
        date('Y-m-d H:i:s') . " - " . $msg . "\n",
        FILE_APPEND
    );
}

function convertirFecha($valor, $formatoSalida) {
    if (empty($valor)) return null;

    $valor = trim($valor);

    $formatos = [
        'd-m-Y H:i:s',
        'd/m/Y H:i:s',
        'd-m-Y H:i',
        'd/m/Y H:i',
        'd-m-Y',
        'd/m/Y'
    ];

    foreach ($formatos as $formato) {
        $dt = DateTime::createFromFormat($formato, $valor);
        if ($dt !== false) {
            return $dt->format($formatoSalida);
        }
    }

    return null;
}

/* =========================
   INICIO
========================= */

logMsg("====== INICIO SINCRONIZACIÓN ======", $logFile);
logMsg("URL: $csv_url", $logFile);

/* =========================
   CONEXIÓN DB (usa conexion.php)
========================= */

// La conexión $conn ya está disponible desde conexion.php
if (!isset($conn) || $conn->connect_error) {
    $error = "Error DB: No se pudo establecer conexión";
    logMsg($error, $errorLogFile);
    die("❌ " . $error);
}

logMsg("Conexión DB establecida", $logFile);

/* =========================
   LECTURA CSV
========================= */

// Configurar contexto para manejar mejor el streaming
$context = stream_context_create([
    'http' => [
        'timeout' => 120,
        'user_agent' => 'Mozilla/5.0'
    ]
]);

$handle = fopen($csv_url, "r", false, $context);
if (!$handle) {
    $error = "No se pudo abrir el CSV";
    logMsg($error, $errorLogFile);
    die("❌ " . $error);
}

logMsg("CSV abierto correctamente", $logFile);

/* =========================
   LIMPIAR TABLA
========================= */

$conn->query("TRUNCATE TABLE stock_materiales");
logMsg("Tabla stock_materiales truncada", $logFile);

$linea = 0;
$insertados = 0;
$errores = 0;
$saltados = 0;
$codigosInsertados = [];
$codigosBuscados = ['303020060']; // Producto específico a monitorear

/* =========================
   PROCESO
========================= */

echo "<h3>Sincronizando stock_materiales...</h3>";
echo "<p>Procesando CSV...</p>";
flush();

while (($data = fgetcsv($handle, 20000, ",")) !== false) {

    $linea++;
    
    // Saltar encabezados
    if ($linea == 1) {
        logMsg("Encabezados detectados: " . count($data) . " columnas", $logFile);
        continue;
    }

    // Validar que tenga al menos 20 columnas
    if (count($data) < 20) {
        $saltados++;
        $msg = "Fila $linea SALTADA: solo tiene " . count($data) . " columnas (esperadas: 20)";
        logMsg($msg, $errorLogFile);
        echo "⚠️ $msg<br>";
        continue;
    }

    // Validar que no sea una fila completamente vacía
    $hayDatos = false;
    foreach ($data as $val) {
        if (!empty(trim($val))) {
            $hayDatos = true;
            break;
        }
    }
    
    if (!$hayDatos) {
        $saltados++;
        continue;
    }

    // Limpiar datos y verificar encoding
    foreach ($data as $k => $v) {
        // Asegurar UTF-8
        if (!mb_check_encoding($v, 'UTF-8')) {
            $v = mb_convert_encoding($v, 'UTF-8', 'auto');
        }
        $data[$k] = $conn->real_escape_string(trim($v));
    }

    // Si es uno de los códigos que buscamos, registrar
    $codigo = trim($data[5]);
    if (in_array($codigo, $codigosBuscados)) {
        logMsg("PRODUCTO ENCONTRADO EN CSV - Línea $linea - Código: $codigo - Producto: {$data[6]}", $logFile);
        $codigosInsertados[] = $codigo;
    }

    // Fechas
    $fechaRegistro   = convertirFecha($data[1], 'Y-m-d H:i:s');
    $fechaProduccion = convertirFecha($data[4], 'Y-m-d');

    $sql = "
    INSERT INTO stock_materiales (
        Operacion,
        FechaRegistro,
        QR,
        Lote,
        FechaProduccion,
        Codigo,
        Producto,
        Cantidad,
        Destino,
        Trazabilidad,
        Movimiento,
        Observacion,
        Requerimiento,
        MaquinaArea,
        TipoOperacion,
        Ubicacion,
        Zona,
        CantidadReal,
        Usuario,
        Llave
    ) VALUES (
        '{$data[0]}',
        " . ($fechaRegistro ? "'$fechaRegistro'" : "NULL") . ",
        '{$data[2]}',
        '{$data[3]}',
        " . ($fechaProduccion ? "'$fechaProduccion'" : "NULL") . ",
        '{$data[5]}',
        '{$data[6]}',
        '{$data[7]}',
        '{$data[8]}',
        '{$data[9]}',
        '{$data[10]}',
        '{$data[11]}',
        '{$data[12]}',
        '{$data[13]}',
        '{$data[14]}',
        '{$data[15]}',
        '{$data[16]}',
        '{$data[17]}',
        '{$data[18]}',
        '{$data[19]}'
    )
    ";

    if ($conn->query($sql)) {
        $insertados++;
        // Mostrar progreso cada 100 registros
        if ($insertados % 100 == 0) {
            echo "Procesados: $insertados registros...<br>";
            flush();
        }
    } else {
        $errores++;
        $errorMsg = "ERROR Fila $linea - Código: {$data[5]} - Error: " . $conn->error;
        logMsg($errorMsg, $errorLogFile);
        echo "❌ $errorMsg<br>";
        
        // Si es producto buscado, alertar
        if (in_array($codigo, $codigosBuscados)) {
            logMsg("CRÍTICO: Producto monitoreado NO INSERTADO - Código: $codigo", $errorLogFile);
            echo "<strong style='color:red;'>⚠️ PRODUCTO MONITOREADO CON ERROR: $codigo</strong><br>";
        }
    }
}

/* =========================
   VERIFICACIÓN FINAL
========================= */

// Verificar si los productos buscados quedaron en la tabla
foreach ($codigosBuscados as $codigoBuscado) {
    $result = $conn->query("SELECT COUNT(*) as total, GROUP_CONCAT(DISTINCT Producto) as productos FROM stock_materiales WHERE Codigo = '$codigoBuscado'");
    if ($result) {
        $row = $result->fetch_assoc();
        $total = $row['total'];
        $productos = $row['productos'];
        
        $msg = "VERIFICACIÓN - Código $codigoBuscado: $total registros en DB";
        if ($total > 0) {
            $msg .= " - Productos: $productos";
            logMsg($msg, $logFile);
            echo "✅ $msg<br>";
        } else {
            $msg .= " - NO ENCONTRADO EN DB";
            logMsg($msg, $errorLogFile);
            echo "<strong style='color:red;'>❌ $msg</strong><br>";
            
            // Verificar si estaba en CSV
            if (in_array($codigoBuscado, $codigosInsertados)) {
                echo "<strong style='color:orange;'>⚠️ El código SÍ apareció en el CSV pero NO se insertó (revisa errores SQL arriba)</strong><br>";
                logMsg("PROBLEMA: Código $codigoBuscado apareció en CSV pero no se insertó", $errorLogFile);
            } else {
                echo "<strong style='color:orange;'>⚠️ El código NO apareció en el CSV (problema en la fuente de datos)</strong><br>";
                logMsg("PROBLEMA: Código $codigoBuscado NO apareció en el CSV", $errorLogFile);
            }
        }
    }
}

/* =========================
   ESTADÍSTICAS
========================= */

$totalDB = $conn->query("SELECT COUNT(*) as total FROM stock_materiales")->fetch_assoc()['total'];

/* =========================
   CIERRE
========================= */

fclose($handle);
$conn->close();

$resumen = "Procesadas: $linea líneas | Insertados: $insertados | Errores: $errores | Saltados: $saltados | Total DB: $totalDB";
logMsg($resumen, $logFile);
logMsg("====== FIN SINCRONIZACIÓN ======", $logFile);

echo "<br><h3>Resumen:</h3>";
echo "✔ Líneas procesadas: <strong>$linea</strong><br>";
echo "✔ Registros insertados: <strong>$insertados</strong><br>";
echo "❌ Errores: <strong>$errores</strong><br>";
echo "⚠️ Filas saltadas: <strong>$saltados</strong><br>";
echo "📊 Total en DB: <strong>$totalDB</strong><br>";
echo "<br><p>Revisa los logs para más detalles:</p>";
echo "<ul>";
echo "<li>Log general: <code>cron_sync.log</code></li>";
echo "<li>Log de errores: <code>cron_sync_errors.log</code></li>";
echo "</ul>";
echo "<p><small>Tiempo de ejecución: " . round(microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'], 2) . " segundos</small></p>";
?>
