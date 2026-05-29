<?php
/**
 * Comparador CSV vs DB
 * Identifica todos los códigos que están en el CSV pero no en la DB
 */

$token = 'SECRETO';

if (!isset($_GET['token']) || $_GET['token'] !== $token) {
    http_response_code(403);
    exit('No autorizado');
}

ini_set('max_execution_time', 600);
ini_set('memory_limit', '512M');
ini_set('display_errors', 1);
error_reporting(E_ALL);

/* =========================
   CONFIGURACIÓN
========================= */

$csv_url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTBwjwp9Pg9NnCyn2KuQtSwF-zVEOZRdbOdDRQIZMutYMzPMbMLY9HHIx3FRwPzCqM26zwUX-_ouiJ7/pub?gid=1311358694&single=true&output=csv";

// Usar configuración centralizada
require_once __DIR__ . '/../../shared/conexion.php';

echo "<h2>📊 Comparación CSV vs Base de Datos</h2>";
echo "<p><small>Este proceso puede tomar varios minutos...</small></p>";
echo "<hr>";
flush();

/* =========================
   LEER CSV
========================= */

echo "<h3>PASO 1: Leyendo CSV...</h3>";

$context = stream_context_create([
    'http' => ['timeout' => 120, 'user_agent' => 'Mozilla/5.0']
]);

$handle = fopen($csv_url, "r", false, $context);
if (!$handle) {
    die("❌ No se pudo abrir el CSV");
}

$codigosCSV = [];
$linea = 0;
$lineasProblematicas = [];

while (($data = fgetcsv($handle, 20000, ",")) !== false) {
    $linea++;
    
    if ($linea == 1) continue; // Encabezados
    
    // Validar columnas
    if (count($data) < 20) {
        $lineasProblematicas[] = [
            'linea' => $linea,
            'columnas' => count($data),
            'codigo' => isset($data[5]) ? trim($data[5]) : 'N/A'
        ];
        continue;
    }
    
    $codigo = trim($data[5]);
    $producto = trim($data[6]);
    
    if (!empty($codigo)) {
        if (!isset($codigosCSV[$codigo])) {
            $codigosCSV[$codigo] = [
                'producto' => $producto,
                'registros' => 0
            ];
        }
        $codigosCSV[$codigo]['registros']++;
    }
}

fclose($handle);

echo "<p>✅ CSV procesado: <strong>$linea</strong> líneas</p>";
echo "<p>📦 Códigos únicos en CSV: <strong>" . count($codigosCSV) . "</strong></p>";
echo "<p>⚠️ Líneas problemáticas (menos de 20 columnas): <strong>" . count($lineasProblematicas) . "</strong></p>";

if (count($lineasProblematicas) > 0 && count($lineasProblematicas) <= 20) {
    echo "<details style='margin:10px 0;'>";
    echo "<summary style='cursor:pointer;background:#fff3cd;padding:8px;border:1px solid #ffc107;border-radius:3px;'>Ver líneas problemáticas</summary>";
    echo "<div style='background:#fffbf0;border:1px solid #ffc107;padding:10px;margin:5px 0;'>";
    foreach ($lineasProblematicas as $lp) {
        echo "Línea {$lp['linea']}: {$lp['columnas']} columnas - Código: {$lp['codigo']}<br>";
    }
    echo "</div></details>";
}

flush();

/* =========================
   LEER DB
========================= */

echo "<hr>";
echo "<h3>PASO 2: Leyendo Base de Datos...</h3>";

// La conexión $conn ya está disponible desde conexion.php
if (!isset($conn) || $conn->connect_error) {
    die("❌ Error DB: No se pudo establecer conexión");
}

$codigosDB = [];
$result = $conn->query("SELECT Codigo, Producto, COUNT(*) as registros FROM stock_materiales GROUP BY Codigo, Producto");

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $codigo = trim($row['Codigo']);
        if (!empty($codigo)) {
            if (!isset($codigosDB[$codigo])) {
                $codigosDB[$codigo] = [
                    'producto' => $row['Producto'],
                    'registros' => 0
                ];
            }
            $codigosDB[$codigo]['registros'] += intval($row['registros']);
        }
    }
}

echo "<p>✅ DB procesada</p>";
echo "<p>📦 Códigos únicos en DB: <strong>" . count($codigosDB) . "</strong></p>";

$conn->close();
flush();

/* =========================
   COMPARACIÓN
========================= */

echo "<hr>";
echo "<h3>PASO 3: Comparando...</h3>";

$faltantesEnDB = [];
$faltantesEnCSV = [];

// Buscar códigos que están en CSV pero no en DB
foreach ($codigosCSV as $codigo => $info) {
    if (!isset($codigosDB[$codigo])) {
        $faltantesEnDB[] = [
            'codigo' => $codigo,
            'producto' => $info['producto'],
            'registros_csv' => $info['registros']
        ];
    }
}

// Buscar códigos que están en DB pero no en CSV
foreach ($codigosDB as $codigo => $info) {
    if (!isset($codigosCSV[$codigo])) {
        $faltantesEnCSV[] = [
            'codigo' => $codigo,
            'producto' => $info['producto'],
            'registros_db' => $info['registros']
        ];
    }
}

/* =========================
   RESULTADOS
========================= */

echo "<h3>🔴 Códigos en CSV pero NO en DB: <strong>" . count($faltantesEnDB) . "</strong></h3>";

if (count($faltantesEnDB) > 0) {
    echo "<div style='background:#f8d7da;border:1px solid #f5c6cb;padding:15px;margin:10px 0;border-radius:5px;max-height:400px;overflow-y:auto;'>";
    echo "<p><strong>Estos productos deberían estar pero NO están en la base de datos:</strong></p>";
    echo "<table style='width:100%;border-collapse:collapse;background:white;'>";
    echo "<tr style='background:#dc3545;color:white;'>";
    echo "<th style='padding:8px;border:1px solid #ddd;'>Código</th>";
    echo "<th style='padding:8px;border:1px solid #ddd;'>Producto</th>";
    echo "<th style='padding:8px;border:1px solid #ddd;'>Registros en CSV</th>";
    echo "</tr>";
    
    // Mostrar máximo 100 para no sobrecargar
    $mostrar = array_slice($faltantesEnDB, 0, 100);
    foreach ($mostrar as $item) {
        $codigo = htmlspecialchars($item['codigo']);
        $producto = htmlspecialchars($item['producto']);
        $registros = $item['registros_csv'];
        
        echo "<tr>";
        echo "<td style='padding:8px;border:1px solid #ddd;'><strong>$codigo</strong></td>";
        echo "<td style='padding:8px;border:1px solid #ddd;'>$producto</td>";
        echo "<td style='padding:8px;border:1px solid #ddd;text-align:center;'>$registros</td>";
        echo "</tr>";
    }
    
    if (count($faltantesEnDB) > 100) {
        echo "<tr><td colspan='3' style='padding:8px;text-align:center;background:#fff3cd;'>... y " . (count($faltantesEnDB) - 100) . " más</td></tr>";
    }
    
    echo "</table>";
    echo "</div>";
    
    // Exportar lista completa a archivo
    $exportFile = __DIR__ . '/productos_faltantes_' . date('Ymd_His') . '.txt';
    $contenido = "PRODUCTOS FALTANTES EN DB - " . date('Y-m-d H:i:s') . "\n";
    $contenido .= "Total: " . count($faltantesEnDB) . "\n\n";
    $contenido .= "CODIGO\tPRODUCTO\tREGISTROS_CSV\n";
    foreach ($faltantesEnDB as $item) {
        $contenido .= $item['codigo'] . "\t" . $item['producto'] . "\t" . $item['registros_csv'] . "\n";
    }
    file_put_contents($exportFile, $contenido);
    
    echo "<p>📄 Lista completa exportada a: <code>" . basename($exportFile) . "</code></p>";
    
} else {
    echo "<div style='background:#d4edda;border:1px solid #c3e6cb;padding:15px;margin:10px 0;border-radius:5px;'>";
    echo "<p>✅ Todos los códigos del CSV están en la DB</p>";
    echo "</div>";
}

echo "<hr>";

echo "<h3>🔵 Códigos en DB pero NO en CSV: <strong>" . count($faltantesEnCSV) . "</strong></h3>";

if (count($faltantesEnCSV) > 0) {
    echo "<div style='background:#d1ecf1;border:1px solid #bee5eb;padding:15px;margin:10px 0;border-radius:5px;'>";
    echo "<p>Estos son datos antiguos que ya no están en el CSV (se borrarán en próxima sync):</p>";
    echo "<p><small>Mostrando primeros 20...</small></p>";
    echo "<ul style='max-height:200px;overflow-y:auto;'>";
    $mostrar = array_slice($faltantesEnCSV, 0, 20);
    foreach ($mostrar as $item) {
        echo "<li>" . htmlspecialchars($item['codigo']) . " - " . htmlspecialchars($item['producto']) . "</li>";
    }
    if (count($faltantesEnCSV) > 20) {
        echo "<li><em>... y " . (count($faltantesEnCSV) - 20) . " más</em></li>";
    }
    echo "</ul>";
    echo "</div>";
}

echo "<hr>";
echo "<h3>✅ Resumen Final</h3>";
echo "<ul>";
echo "<li>Códigos únicos en CSV: <strong>" . count($codigosCSV) . "</strong></li>";
echo "<li>Códigos únicos en DB: <strong>" . count($codigosDB) . "</strong></li>";
echo "<li>Faltantes en DB: <strong style='color:red;'>" . count($faltantesEnDB) . "</strong></li>";
echo "<li>Faltantes en CSV (antiguos): <strong style='color:blue;'>" . count($faltantesEnCSV) . "</strong></li>";
echo "</ul>";

if (count($faltantesEnDB) > 0) {
    echo "<div style='background:#fff3cd;border:1px solid #ffc107;padding:15px;margin:10px 0;border-radius:5px;'>";
    echo "<h4 style='margin-top:0;'>⚠️ Acción Recomendada</h4>";
    echo "<p>Ejecuta el script mejorado de sincronización para revisar los errores específicos:</p>";
    echo "<p><a href='sync_stock_materiales_mejorado.php?token=$token' style='background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;'>▶️ Ejecutar Sincronización Mejorada</a></p>";
    echo "</div>";
}

?>
