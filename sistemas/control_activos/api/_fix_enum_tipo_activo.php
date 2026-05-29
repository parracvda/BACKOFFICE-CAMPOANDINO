<?php
session_start();
require_once __DIR__ . '/../../../shared/conexion.php';
header('Content-Type: text/plain; charset=utf-8');

echo "=== Corrigiendo ENUM tipo_activo ===\n\n";

// 1. Actualizar ENUM de la columna tipo_activo
$sql1 = "ALTER TABLE activos_maestro 
         MODIFY COLUMN tipo_activo 
         ENUM('CAMION', 'CAMIONETA', 'MONTACARGAS', 'STOCKA') 
         NOT NULL DEFAULT 'CAMION'";
if ($conn->query($sql1)) {
    echo "✓ ENUM tipo_activo actualizado: MONTACARGA → MONTACARGAS\n";
} else {
    echo "✗ Error ENUM: " . $conn->error . "\n";
}

// 2. Actualizar nombre de categoría a VEHICULOS (mayúsculas)
$sql2 = "UPDATE activos_categoria SET nombre = 'VEHICULOS' WHERE id_categoria = 1";
if ($conn->query($sql2)) {
    echo "✓ Categoría actualizada a VEHICULOS\n";
} else {
    echo "✗ Error categoría: " . $conn->error . "\n";
}

// 3. Verificar
$res = $conn->query("SHOW COLUMNS FROM activos_maestro WHERE Field = 'tipo_activo'");
$r = $res->fetch_assoc();
echo "\nColumna tipo_activo actual:\n";
echo "Type: " . $r['Type'] . "\n";

$res2 = $conn->query("SELECT * FROM activos_categoria ORDER BY id_categoria");
echo "\nCategorías:\n";
while ($r2 = $res2->fetch_assoc()) {
    echo "  {$r2['id_categoria']}: {$r2['nombre']}\n";
}

echo "\n✅ Listo. Ahora MONTACARGAS se guardará correctamente.\n";
