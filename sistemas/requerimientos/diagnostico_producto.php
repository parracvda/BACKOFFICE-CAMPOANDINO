<?php
/**
 * Script de diagnóstico para verificar producto específico
 * Verifica si el código existe en el CSV y en la base de datos
 */

$token = 'SECRETO';

if (!isset($_GET['token']) || $_GET['token'] !== $token) {
    http_response_code(403);
    exit('No autorizado');
}

// Aumentar límites
ini_set('max_execution_time', 300);
ini_set('display_errors', 1);
error_reporting(E_ALL);

$codigoBuscado = isset($_GET['codigo']) ? trim($_GET['codigo']) : '303020060';

echo "<h2>🔍 Diagnóstico para código: $codigoBuscado</h2>";
echo "<hr>";

/* =========================
   CONFIGURACIÓN
========================= */

$csv_url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTBwjwp9Pg9NnCyn2KuQtSwF-zVEOZRdbOdDRQIZMutYMzPMbMLY9HHIx3FRwPzCqM26zwUX-_ouiJ7/pub?gid=1311358694&single=true&output=csv";

// Usar configuración centralizada
require_once __DIR__ . '/../../shared/conexion.php';

/* =========================
   PASO 1: BUSCAR EN CSV
========================= */

echo "<h3>PASO 1: Buscar en CSV de Google</h3>";

$context = stream_context_create([
    'http' => [
        'timeout' => 120,
        'user_agent' => 'Mozilla/5.0'
    ]
]);

$handle = fopen($csv_url, "r", false, $context);
if (!$handle) {
    die("❌ No se pudo abrir el CSV");
}

$linea = 0;
$encontrados = [];
$totalLineas = 0;
$columnasEsperadas = 0;

while (($data = fgetcsv($handle, 20000, ",")) !== false) {
    $linea++;
    $totalLineas++;
    
    // Guardar número de columnas de encabezado
    if ($linea == 1) {
        $columnasEsperadas = count($data);
        echo "<p>📋 Encabezados: <strong>$columnasEsperadas columnas</strong></p>";
        echo "<pre style='background:#f0f0f0;padding:10px;max-width:100%;overflow-x:auto;'>";
        foreach ($data as $idx => $col) {
            echo "[$idx] => " . htmlspecialchars($col) . "\n";
        }
        echo "</pre>";
        continue;
    }
    
    // Verificar si contiene el código buscado
    $numColumnas = count($data);
    if ($numColumnas >= 6) {
        $codigo = trim($data[5]); // Columna 5 = Codigo
        
        if ($codigo === $codigoBuscado) {
            $encontrados[] = [
                'linea' => $linea,
                'columnas' => $numColumnas,
                'data' => $data
            ];
        }
    }
}

fclose($handle);

echo "<p>📊 Total de líneas en CSV: <strong>$totalLineas</strong></p>";
echo "<p>🔍 Registros con código <strong>$codigoBuscado</strong>: <strong>" . count($encontrados) . "</strong></p>";

if (count($encontrados) > 0) {
    echo "<div style='background:#d4edda;border:1px solid #c3e6cb;padding:15px;margin:10px 0;border-radius:5px;'>";
    echo "<h4 style='margin-top:0;color:#155724;'>✅ Código ENCONTRADO en CSV</h4>";
    
    foreach ($encontrados as $item) {
        echo "<div style='background:white;padding:10px;margin:10px 0;border:1px solid #ddd;border-radius:3px;'>";
        echo "<strong>Línea " . $item['linea'] . " (" . $item['columnas'] . " columnas)</strong><br>";
        echo "<pre style='background:#f8f9fa;padding:8px;margin:5px 0;font-size:11px;max-width:100%;overflow-x:auto;'>";
        
        $campos = [
            'Operacion', 'FechaRegistro', 'QR', 'Lote', 'FechaProduccion',
            'Codigo', 'Producto', 'Cantidad', 'Destino', 'Trazabilidad',
            'Movimiento', 'Observacion', 'Requerimiento', 'MaquinaArea', 'TipoOperacion',
            'Ubicacion', 'Zona', 'CantidadReal', 'Usuario', 'Llave'
        ];
        
        for ($i = 0; $i < min(20, count($item['data'])); $i++) {
            $valor = htmlspecialchars($item['data'][$i]);
            $campo = isset($campos[$i]) ? $campos[$i] : "Columna_$i";
            echo "[$i] $campo = '$valor'\n";
        }
        echo "</pre>";
        echo "</div>";
    }
    echo "</div>";
} else {
    echo "<div style='background:#f8d7da;border:1px solid #f5c6cb;padding:15px;margin:10px 0;border-radius:5px;'>";
    echo "<h4 style='margin-top:0;color:#721c24;'>❌ Código NO encontrado en CSV</h4>";
    echo "<p>El código <strong>$codigoBuscado</strong> no existe en el CSV de Google Sheets.</p>";
    echo "<p>Verifica:</p>";
    echo "<ul>";
    echo "<li>Que el código sea correcto</li>";
    echo "<li>Que la hoja de Google Sheets tenga los datos actualizados</li>";
    echo "<li>Que el gid (1311358694) sea el correcto en la URL</li>";
    echo "</ul>";
    echo "</div>";
}

/* =========================
   PASO 2: BUSCAR EN DB
========================= */

echo "<hr>";
echo "<h3>PASO 2: Buscar en Base de Datos</h3>";

// La conexión $conn ya está disponible desde conexion.php
if (!isset($conn) || $conn->connect_error) {
    die("❌ Error DB: No se pudo establecer conexión");
}

$result = $conn->query("SELECT * FROM stock_materiales WHERE Codigo = '$codigoBuscado'");

if ($result && $result->num_rows > 0) {
    echo "<div style='background:#d4edda;border:1px solid #c3e6cb;padding:15px;margin:10px 0;border-radius:5px;'>";
    echo "<h4 style='margin-top:0;color:#155724;'>✅ Código ENCONTRADO en DB (" . $result->num_rows . " registros)</h4>";
    
    while ($row = $result->fetch_assoc()) {
        echo "<div style='background:white;padding:10px;margin:10px 0;border:1px solid #ddd;border-radius:3px;'>";
        echo "<pre style='background:#f8f9fa;padding:8px;margin:0;font-size:11px;max-width:100%;overflow-x:auto;'>";
        foreach ($row as $key => $val) {
            echo htmlspecialchars($key) . " = " . htmlspecialchars($val) . "\n";
        }
        echo "</pre>";
        echo "</div>";
    }
    echo "</div>";
} else {
    echo "<div style='background:#f8d7da;border:1px solid #f5c6cb;padding:15px;margin:10px 0;border-radius:5px;'>";
    echo "<h4 style='margin-top:0;color:#721c24;'>❌ Código NO encontrado en DB</h4>";
    echo "<p>El código <strong>$codigoBuscado</strong> no existe en la tabla stock_materiales.</p>";
    echo "</div>";
}

// Estadísticas generales
$totalDB = $conn->query("SELECT COUNT(*) as total FROM stock_materiales")->fetch_assoc()['total'];
$codigos_unicos = $conn->query("SELECT COUNT(DISTINCT Codigo) as total FROM stock_materiales")->fetch_assoc()['total'];

echo "<hr>";
echo "<h3>📊 Estadísticas Generales</h3>";
echo "<p>Total registros en stock_materiales: <strong>$totalDB</strong></p>";
echo "<p>Códigos únicos: <strong>$codigos_unicos</strong></p>";

$conn->close();

echo "<hr>";
echo "<h3>🛠️ Próximos pasos</h3>";
echo "<p>Usa el script mejorado <code>sync_stock_materiales_mejorado.php</code> para sincronizar con mejor logging.</p>";
echo "<p><a href='sync_stock_materiales_mejorado.php?token=$token'>▶️ Ejecutar sincronización mejorada</a></p>";
?>
