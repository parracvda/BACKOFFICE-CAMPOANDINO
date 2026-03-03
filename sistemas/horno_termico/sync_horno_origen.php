<?php
// ====================================================================
// SCRIPT ORIGEN - SERVIDOR HOSTING
// Lee vista uv_reporte_controlhorno2 y envía a servidor físico
// Ejecutar mediante CRON cada 5 minutos
// ====================================================================

file_put_contents(__DIR__.'/sync_horno_run.log', date('c')." SCRIPT EJECUTADO\n", FILE_APPEND);

// Habilitar reporte de errores para depuración temporal
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
file_put_contents(__DIR__.'/sync_horno_debug_start.log', date('c')." DEBUG START\n", FILE_APPEND);
// ====================================
// CONFIGURACIÓN MYSQL ORIGEN (HOSTING)
// ====================================
$dbHost = 'localhost';
$dbName = 'campoand_campoandino';
$dbUser = 'jparra';
$dbPass = 'parracvda_x';

// ====================================
// CONFIGURACIÓN DESTINO (SERVIDOR FÍSICO)
// ====================================
$endpoint = 'http://192.168.2.244/sync_horno_receptor.php';
$token = 'TOKEN_SUPER_SEGURO_LARGO';

// Archivo donde guardamos la última fecha sincronizada
$stateFile = __DIR__.'/last_sync_horno.txt';

// ====================================
// FECHA INCREMENTAL
// ====================================
$lastSync = file_exists($stateFile)
    ? trim(file_get_contents($stateFile))
    : '2026-01-01 00:00:00';

// ====================================
// CONEXIÓN MYSQL ORIGEN (LOCAL)
// ====================================
try {
    $pdoOrigen = new PDO(
        "mysql:host=$dbHost;dbname=$dbName;charset=utf8",
        $dbUser,
        $dbPass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 5
        ]
    );
} catch (Exception $e) {
    file_put_contents(__DIR__.'/sync_horno_error.log', date('c')." ERROR DB ORIGEN: ".$e->getMessage().PHP_EOL, FILE_APPEND);
    exit;
}

// ====================================
// CONSULTA A LA VISTA
// ====================================
$sql = "SELECT 
            `FECHA TRATAMIENTO` AS fecha_tratamiento,
            `ESTACION` AS estacion,
            `LOTE` AS lote,
            `CODIGO PALLET` AS codigo_pallet,
            `CODIGO` AS codigo,
            `PRODUCTO` AS producto,
            `CANTIDAD (UND)` AS cantidad_und,
            `CANTIDAD (M3)` AS cantidad_m3
        FROM uv_reporte_controlhorno2
        WHERE `FECHA TRATAMIENTO` > :last_sync
        ORDER BY `FECHA TRATAMIENTO` ASC";

$stmt = $pdoOrigen->prepare($sql);
$stmt->execute(['last_sync' => $lastSync]);

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

file_put_contents(__DIR__.'/sync_horno_count.log', "Filas: ".count($rows).PHP_EOL, FILE_APPEND);
file_put_contents(__DIR__.'/sync_horno_sample.log', print_r(array_slice($rows, 0, 1), true));

if (!$rows) {
    file_put_contents(__DIR__.'/sync_horno_empty.log', date('c')." SIN FILAS\n", FILE_APPEND);
    exit;
}

// ====================================
// ENVIAR AL HOSTING
// ====================================
$payload = json_encode([
    'token' => $token,
    'rows' => $rows
]);

$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 60
]);

$response = curl_exec($ch);
$curlInfo = curl_getinfo($ch);
$error = curl_error($ch);

// Log response and HTTP code (trim body to 200 chars)
file_put_contents(__DIR__.'/sync_horno_response.log', date('c')." RESPONSE HTTP_CODE:".($curlInfo['http_code'] ?? 'NA')." ERROR:".$error." BODY:".substr((string)$response,0,200).PHP_EOL, FILE_APPEND);

curl_close($ch);

if ($error) {
    file_put_contents(__DIR__.'/sync_horno_error.log', date('c')." CURL ERROR: $error".PHP_EOL, FILE_APPEND);
    exit;
}

// ====================================
// GUARDAR NUEVA FECHA SINCRONIZADA
// ====================================
file_put_contents(__DIR__.'/sync_horno_lastrow.log', print_r(end($rows), true));

$lastRow = end($rows);
$fechaValor = null;

/* Detectar automáticamente el nombre real del campo fecha */
$fechaKeys = ['fecha_tratamiento', 'FECHA TRATAMIENTO', 'fecha_proceso', 'FECHA_TRATAMIENTO'];
foreach ($fechaKeys as $k) {
    if (isset($lastRow[$k]) && !empty($lastRow[$k])) {
        $fechaValor = $lastRow[$k];
        break;
    }
}

if (!$fechaValor) {
    file_put_contents(__DIR__.'/sync_horno_error.log',
        date('c')." ERROR: No se pudo detectar campo fecha en lastRow: ".json_encode($lastRow).PHP_EOL,
        FILE_APPEND
    );
    exit;
}

file_put_contents($stateFile, $fechaValor);

file_put_contents(
    __DIR__.'/sync_horno_ok.log',
    date('c')." Enviados: ".count($rows)." hasta ".$fechaValor.PHP_EOL,
    FILE_APPEND
);

echo "OK";
