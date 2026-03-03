<?php
// ============================
// CONFIGURACIÓN DE SEGURIDAD
// ============================
$TOKEN_VALIDO = 'TOKEN_SUPER_SEGURO_LARGO';

// ============================
// CONFIGURACIÓN MYSQL DESTINO
// ============================
$dbHost = '201.148.104.227';
$dbName = 'campoand_campoandino';
$dbUser = 'campoand_sistemas2';
$dbPass = 'parracodex.';

// ============================
// LEER JSON RECIBIDO
// ============================
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['token']) || $input['token'] !== $TOKEN_VALIDO) {
    http_response_code(403);
    exit('Token inválido');
}

$rows = $input['rows'] ?? [];
if (!$rows) {
    exit('Sin datos');
}

// ============================
// CONEXIÓN A MYSQL HOSTING
// ============================
try {
    $pdo = new PDO(
        "mysql:host=$dbHost;dbname=$dbName;charset=utf8",
        $dbUser,
        $dbPass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (Exception $e) {
    file_put_contents(__DIR__.'/sync_error.log', date('c')." ERROR DB: ".$e->getMessage().PHP_EOL, FILE_APPEND);
    exit;
}

// ============================
// INSERT + UPDATE
// ============================
$sql = "
INSERT INTO control_horno (
    fecha_proceso,
    estacion,
    numero_tratamiento,
    codigo,
    producto,
    cantidad
) VALUES (
    :fecha_proceso,
    :estacion,
    :numero_tratamiento,
    :codigo,
    :producto,
    :cantidad
)
ON DUPLICATE KEY UPDATE
producto = VALUES(producto),
cantidad = VALUES(cantidad)
";

$stmt = $pdo->prepare($sql);

foreach ($rows as $r) {
    $stmt->execute([
        ':fecha_proceso'      => $r['FECHA_PROCESO'],
        ':estacion'           => $r['ESTACION'],
        ':numero_tratamiento' => $r['NUMERO_TRATAMIENTO'],
        ':codigo'             => $r['CODIGO'],
        ':producto'           => $r['PRODUCTO'],
        ':cantidad'           => $r['CANTIDAD'],
    ]);
}

file_put_contents(__DIR__.'/sync_ok.log', date('c')." Recibidos: ".count($rows).PHP_EOL, FILE_APPEND);

echo "OK";
