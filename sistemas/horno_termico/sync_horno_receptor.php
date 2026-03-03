<?php
// ====================================================================
// SCRIPT RECEPTOR - SERVIDOR FÍSICO (192.168.2.244)
// Recibe datos del hosting y los inserta en tabla control_horno_v2
// Base de datos: campoand_campoandino_v2
// ====================================================================

// ============================
// CONFIGURACIÓN DE SEGURIDAD
// ============================
$TOKEN_VALIDO = 'TOKEN_SUPER_SEGURO_LARGO';

// ============================
// CONFIGURACIÓN MYSQL DESTINO (SERVIDOR FÍSICO)
// ============================
$dbHost = 'localhost';  // O '127.0.0.1' si es local
$dbName = 'campoand_campoandino_v2';
$dbUser = 'jparra';
$dbPass = 'parracvda_x';

// ============================
// LEER JSON RECIBIDO
// ============================
// Leer cuerpo crudo y guardarlo en log para depuración
$rawInput = file_get_contents('php://input');
file_put_contents(__DIR__.'/sync_horno_raw_request.log', date('c')." RAW: ".substr($rawInput,0,200).PHP_EOL, FILE_APPEND);

$input = json_decode($rawInput, true);

if (!$input || !isset($input['token']) || $input['token'] !== $TOKEN_VALIDO) {
    http_response_code(403);
    exit('Token inválido');
}

$rows = $input['rows'] ?? [];
if (!$rows) {
    exit('Sin datos');
}

// ============================
// CONEXIÓN A MYSQL SERVIDOR FÍSICO
// ============================
try {
    $pdo = new PDO(
        "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4",
        $dbUser,
        $dbPass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (Exception $e) {
    file_put_contents(__DIR__.'/sync_horno_error.log', date('c')." ERROR DB: ".$e->getMessage().PHP_EOL, FILE_APPEND);
    exit;
}

// ============================
// INSERT + UPDATE (UPSERT)
// ============================
$sql = "
INSERT INTO control_horno_v2 (
    fecha_tratamiento,
    estacion,
    lote,
    codigo_pallet,
    codigo,
    producto,
    cantidad_und,
    cantidad_m3
) VALUES (
    :fecha_tratamiento,
    :estacion,
    :lote,
    :codigo_pallet,
    :codigo,
    :producto,
    :cantidad_und,
    :cantidad_m3
)
ON DUPLICATE KEY UPDATE
    producto = VALUES(producto),
    cantidad_und = VALUES(cantidad_und),
    cantidad_m3 = VALUES(cantidad_m3),
    ultima_actualizacion = CURRENT_TIMESTAMP
";

$stmt = $pdo->prepare($sql);

$insertados = 0;
$errores = 0;

foreach ($rows as $r) {
    try {
        $stmt->execute([
            ':fecha_tratamiento' => $r['fecha_tratamiento'] ?? null,
            ':estacion'          => $r['estacion'] ?? '',
            ':lote'              => $r['lote'] ?? '',
            ':codigo_pallet'     => $r['codigo_pallet'] ?? '',
            ':codigo'            => $r['codigo'] ?? '',
            ':producto'          => $r['producto'] ?? '',
            ':cantidad_und'      => $r['cantidad_und'] ?? 0,
            ':cantidad_m3'       => $r['cantidad_m3'] ?? 0,
        ]);
        $insertados++;
    } catch (Exception $e) {
        $errores++;
        file_put_contents(__DIR__.'/sync_horno_error.log', 
            date('c')." ERROR INSERT: ".$e->getMessage()." | Datos: ".json_encode($r).PHP_EOL, 
            FILE_APPEND
        );
    }
}

file_put_contents(__DIR__.'/sync_horno_ok.log', 
    date('c')." Recibidos: ".count($rows)." | Insertados: $insertados | Errores: $errores".PHP_EOL, 
    FILE_APPEND
);

echo "OK - Insertados: $insertados / Errores: $errores";
