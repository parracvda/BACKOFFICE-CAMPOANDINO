<?php
// ====================================================================
// SCRIPT PULL - SERVIDOR FÍSICO (192.168.2.244)
// Consulta el hosting y descarga datos nuevos para insertarlos localmente
// Ejecutar mediante CRON cada 5 minutos
// ====================================================================

// ============================
// CONFIGURACIÓN
// ============================
$token = 'TOKEN_SUPER_SEGURO_LARGO';
$endpoint = 'https://campoandino-apps.com/sync_horno_export.php';
$stateFile = __DIR__ . '/last_sync_horno_pull.txt';

// ============================
// LEER ÚLTIMA FECHA SINCRONIZADA
// ============================
$lastSync = file_exists($stateFile) 
    ? trim(file_get_contents($stateFile)) 
    : '2026-01-01 00:00:00';

// ============================
// CONSULTAR HOSTING VÍA GET
// ============================
$url = $endpoint . '?token=' . urlencode($token) . '&last_sync=' . urlencode($lastSync);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 60,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_FOLLOWLOCATION => true
]);

$response = curl_exec($ch);
$err = curl_error($ch);
$info = curl_getinfo($ch);
curl_close($ch);

// Log respuesta HTTP
file_put_contents(
    __DIR__ . '/sync_horno_pull_response.log',
    date('c') . " HTTP: " . ($info['http_code'] ?? 'NA') . " ERR: " . $err . PHP_EOL,
    FILE_APPEND
);

if ($err) {
    file_put_contents(
        __DIR__ . '/sync_horno_pull_error.log',
        date('c') . " CURL ERROR: " . $err . PHP_EOL,
        FILE_APPEND
    );
    exit;
}

// ============================
// PARSEAR JSON
// ============================
$data = json_decode($response, true);

if (!$data || !isset($data['rows'])) {
    file_put_contents(
        __DIR__ . '/sync_horno_pull_error.log',
        date('c') . " JSON parse error o no hay 'rows': " . substr($response, 0, 500) . PHP_EOL,
        FILE_APPEND
    );
    exit;
}

$rows = $data['rows'];

if (empty($rows)) {
    file_put_contents(
        __DIR__ . '/sync_horno_pull_ok.log',
        date('c') . " Sin datos nuevos" . PHP_EOL,
        FILE_APPEND
    );
    exit;
}

// ============================
// CONEXIÓN MYSQL SERVIDOR FÍSICO
// ============================
$dbHost = 'localhost';
$dbName = 'campoand_campoandino_v2';
$dbUser = 'jparra';
$dbPass = 'parracvda_x';

try {
    $pdo = new PDO(
        "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4",
        $dbUser,
        $dbPass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (Exception $e) {
    file_put_contents(
        __DIR__ . '/sync_horno_pull_error.log',
        date('c') . " ERROR DB: " . $e->getMessage() . PHP_EOL,
        FILE_APPEND
    );
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

// Track máxima fecha procesada (para avanzar last_sync de forma segura)
$maxFecha = null;

foreach ($rows as $r) {
    try {
        // Sanitizar y convertir campos numéricos para evitar errores de tipo
        $fecha = null;
        if (!empty($r['fecha_tratamiento'])) {
            // Intentar parsear YYYY-MM-DD
            $d = DateTime::createFromFormat('Y-m-d', $r['fecha_tratamiento']);
            if ($d && $d->format('Y-m-d') === $r['fecha_tratamiento']) {
                $fecha = $r['fecha_tratamiento'];
            } else {
                // intentar con formatos alternativos
                $d2 = strtotime($r['fecha_tratamiento']);
                if ($d2 !== false) {
                    $fecha = date('Y-m-d', $d2);
                }
            }
        }

        // actualizar maxFecha
        if ($fecha) {
            if ($maxFecha === null || $fecha > $maxFecha) {
                $maxFecha = $fecha;
            }
        }

        $cantidad_und = null;
        if (isset($r['cantidad_und']) && $r['cantidad_und'] !== '' && is_numeric($r['cantidad_und'])) {
            $cantidad_und = (float) $r['cantidad_und'];
        }

        $cantidad_m3 = null;
        if (isset($r['cantidad_m3']) && $r['cantidad_m3'] !== '' && is_numeric($r['cantidad_m3'])) {
            $cantidad_m3 = (float) $r['cantidad_m3'];
        }

        $params = [
            ':fecha_tratamiento' => $fecha,
            ':estacion'          => $r['estacion'] ?? '',
            ':lote'              => $r['lote'] ?? '',
            ':codigo_pallet'     => $r['codigo_pallet'] ?? '',
            ':codigo'            => $r['codigo'] ?? '',
            ':producto'          => $r['producto'] ?? '',
            ':cantidad_und'      => $cantidad_und,
            ':cantidad_m3'       => $cantidad_m3,
        ];

        // Bind values explicitly to allow NULL for numeric fields
        foreach ($params as $k => $v) {
            if ($v === null) {
                $stmt->bindValue($k, null, PDO::PARAM_NULL);
            } else {
                $stmt->bindValue($k, $v);
            }
        }

        // LIMPIAR REGISTROS OBSOLETOS: Eliminar registros previos del mismo pallet con diferente lote
        $codigoPallet = trim($r['codigo_pallet'] ?? '');
        if ($codigoPallet !== '' && !empty($r['lote'])) {
            try {
                $deleteOld = $pdo->prepare("
                    DELETE FROM control_horno_v2 
                    WHERE codigo_pallet = :codigo_pallet 
                      AND lote != :lote
                ");
                $deleteOld->execute([
                    ':codigo_pallet' => $codigoPallet,
                    ':lote' => $r['lote']
                ]);
            } catch (Exception $eDelete) {
                // Log pero no detener el proceso
                file_put_contents(
                    __DIR__ . '/sync_horno_pull_error.log',
                    date('c') . " ERROR DELETE OLD: " . $eDelete->getMessage() . " | Pallet: " . $codigoPallet . PHP_EOL,
                    FILE_APPEND
                );
            }
        }

        $stmt->execute();
        $insertados++;

        // ============================
        // ACTUALIZAR produccion_pallet
        // ============================
        $codigoPallet = trim($r['codigo_pallet'] ?? '');
        if ($codigoPallet !== '') {
            try {
                // Verificar si hay duplicados en control_horno_v2 con el mismo codigo_pallet
                $checkDuplicates = $pdo->prepare("SELECT COUNT(*) as total FROM control_horno_v2 WHERE codigo_pallet = :codigo_pallet");
                $checkDuplicates->execute([':codigo_pallet' => $codigoPallet]);
                $duplicateCount = $checkDuplicates->fetch(PDO::FETCH_ASSOC)['total'];

                // Determinar el valor a insertar
                $numeroTratamiento = ($duplicateCount > 1) ? 'cpduplicado' : ($r['lote'] ?? '');

                if ($numeroTratamiento !== '') {
                    // Actualizar produccion_pallet SIEMPRE con el valor más reciente
                    $updatePallet = $pdo->prepare("
                        UPDATE produccion_pallet 
                        SET numero_tratamiento = :numero_tratamiento 
                        WHERE idpallet = :idpallet
                    ");
                    $updatePallet->execute([
                        ':numero_tratamiento' => $numeroTratamiento,
                        ':idpallet' => $codigoPallet
                    ]);
                }
            } catch (Exception $eUpdate) {
                // Log error de actualización sin detener el proceso
                file_put_contents(
                    __DIR__ . '/sync_horno_pull_error.log',
                    date('c') . " ERROR UPDATE produccion_pallet: " . $eUpdate->getMessage() . " | Pallet: " . $codigoPallet . PHP_EOL,
                    FILE_APPEND
                );
            }
        }

    } catch (PDOException $e) {
        // Si es error de clave duplicada, intentar UPDATE del registro existente
        if ($e->getCode() == 23000) { // Duplicate entry
            try {
                // Actualizar registro existente cambiando también el lote
                $updateSql = "
                    UPDATE control_horno_v2 
                    SET lote = :lote,
                        producto = :producto,
                        cantidad_und = :cantidad_und,
                        cantidad_m3 = :cantidad_m3,
                        ultima_actualizacion = CURRENT_TIMESTAMP
                    WHERE fecha_tratamiento = :fecha_tratamiento 
                      AND estacion = :estacion 
                      AND codigo_pallet = :codigo_pallet 
                      AND codigo = :codigo
                ";
                $updateStmt = $pdo->prepare($updateSql);
                foreach ($params as $k => $v) {
                    if ($v === null) {
                        $updateStmt->bindValue($k, null, PDO::PARAM_NULL);
                    } else {
                        $updateStmt->bindValue($k, $v);
                    }
                }
                $updateStmt->execute();
                $insertados++;

                // Actualizar produccion_pallet también
                $codigoPallet = trim($r['codigo_pallet'] ?? '');
                if ($codigoPallet !== '') {
                    try {
                        $checkDuplicates = $pdo->prepare("SELECT COUNT(*) as total FROM control_horno_v2 WHERE codigo_pallet = :codigo_pallet");
                        $checkDuplicates->execute([':codigo_pallet' => $codigoPallet]);
                        $duplicateCount = $checkDuplicates->fetch(PDO::FETCH_ASSOC)['total'];
                        $numeroTratamiento = ($duplicateCount > 1) ? 'cpduplicado' : ($r['lote'] ?? '');

                        if ($numeroTratamiento !== '') {
                            // Actualizar SIEMPRE con el valor más reciente
                            $updatePallet = $pdo->prepare("
                                UPDATE produccion_pallet 
                                SET numero_tratamiento = :numero_tratamiento 
                                WHERE idpallet = :idpallet
                            ");
                            $updatePallet->execute([
                                ':numero_tratamiento' => $numeroTratamiento,
                                ':idpallet' => $codigoPallet
                            ]);
                        }
                    } catch (Exception $eUpdate) {
                        file_put_contents(
                            __DIR__ . '/sync_horno_pull_error.log',
                            date('c') . " ERROR UPDATE produccion_pallet: " . $eUpdate->getMessage() . " | Pallet: " . $codigoPallet . PHP_EOL,
                            FILE_APPEND
                        );
                    }
                }
            } catch (Exception $eUpdate) {
                $errores++;
                file_put_contents(
                    __DIR__ . '/sync_horno_pull_error.log',
                    date('c') . " ERROR UPDATE: " . $eUpdate->getMessage() . " | Datos: " . json_encode($r) . PHP_EOL,
                    FILE_APPEND
                );
            }
        } else {
            $errores++;
            file_put_contents(
                __DIR__ . '/sync_horno_pull_error.log',
                date('c') . " ERROR INSERT: " . $e->getMessage() . " | Datos: " . json_encode($r) . PHP_EOL,
                FILE_APPEND
            );
        }
    }
}

// ============================
// GUARDAR NUEVA FECHA SINCRONIZADA
// ============================
if ($maxFecha) {
    file_put_contents($stateFile, $maxFecha);
}

// ============================
// LOG EXITOSO
// ============================
file_put_contents(
    __DIR__ . '/sync_horno_pull_ok.log',
    date('c') . " Recibidos: " . count($rows) . " | Insertados: $insertados | Errores: $errores" . PHP_EOL,
    FILE_APPEND
);

echo "OK - Insertados: $insertados / Errores: $errores";
