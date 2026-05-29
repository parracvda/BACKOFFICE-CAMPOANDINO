<?php
/**
 * Script de configuración inicial para entorno local
 * Ejecutar una sola vez para preparar la base de datos
 * 
 * Ejecutar con: php setup_local.php
 */

echo "\n========================================\n";
echo "CONFIGURACIÓN INICIAL - ENTORNO LOCAL\n";
echo "========================================\n\n";

// Incluir conexión
require_once __DIR__ . '/../../shared/conexion.php';

echo "→ Verificando conexión a MySQL...\n";
if ($conn->connect_error) {
    echo "✗ Error: " . $conn->connect_error . "\n\n";
    exit(1);
}
echo "✓ Conexión exitosa a base de datos: " . $conn->query("SELECT DATABASE()")->fetch_row()[0] . "\n\n";

// Verificar si las tablas ya existen
$check = $conn->query("SHOW TABLES LIKE 'erp_ordenes_venta'");
if ($check && $check->num_rows > 0) {
    echo "⚠ La tabla 'erp_ordenes_venta' ya existe\n";
    echo "\n¿Deseas:\n";
    echo "1. Recrear tablas (se perderán datos existentes)\n";
    echo "2. Solo insertar datos de prueba adicionales\n";
    echo "3. Cancelar\n\n";
    echo "Opción [1/2/3]: ";
    
    $handle = fopen("php://stdin", "r");
    $opcion = trim(fgets($handle));
    fclose($handle);
    
    if ($opcion == '1') {
        echo "\n→ Eliminando tablas existentes...\n";
        $conn->query("DROP TABLE IF EXISTS erp_ordenes_venta_detalle");
        $conn->query("DROP TABLE IF EXISTS erp_ordenes_venta");
        echo "✓ Tablas eliminadas\n\n";
    } elseif ($opcion == '3') {
        echo "\nConfiguración cancelada.\n\n";
        exit(0);
    }
    // Si opción es 2, continúa sin eliminar
}

// Crear tabla principal de órdenes de venta
echo "→ Creando tabla 'erp_ordenes_venta'...\n";
$sql = "CREATE TABLE IF NOT EXISTS erp_ordenes_venta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orden_venta VARCHAR(50) NOT NULL UNIQUE COMMENT 'Número de orden de venta del ERP',
  cliente VARCHAR(255) DEFAULT NULL COMMENT 'Nombre del cliente',
  ruc_cliente VARCHAR(20) DEFAULT NULL COMMENT 'RUC del cliente',
  fecha_orden DATE DEFAULT NULL COMMENT 'Fecha de la orden',
  condicion_venta VARCHAR(100) DEFAULT NULL COMMENT 'Condición de venta (contado, crédito, etc)',
  estado VARCHAR(50) DEFAULT NULL COMMENT 'Estado de la orden (pendiente, aprobada, cerrada)',
  origen VARCHAR(100) DEFAULT NULL COMMENT 'Origen/Almacén origen',
  destino VARCHAR(255) DEFAULT NULL COMMENT 'Destino/Dirección entrega',
  moneda VARCHAR(10) DEFAULT 'PEN' COMMENT 'Moneda (PEN, USD)',
  total DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Monto total de la orden',
  observaciones TEXT DEFAULT NULL COMMENT 'Observaciones de la orden',
  fecha_sincronizacion DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de última sincronización',
  activo TINYINT(1) DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
  INDEX idx_orden_venta (orden_venta),
  INDEX idx_activo (activo),
  INDEX idx_fecha_orden (fecha_orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Órdenes de venta sincronizadas desde ERP Nisira'";

if ($conn->query($sql)) {
    echo "✓ Tabla 'erp_ordenes_venta' creada\n";
} else {
    echo "✓ Tabla 'erp_ordenes_venta' ya existe\n";
}

// Crear tabla de detalle
echo "→ Creando tabla 'erp_ordenes_venta_detalle'...\n";
$sql = "CREATE TABLE IF NOT EXISTS erp_ordenes_venta_detalle (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orden_venta VARCHAR(50) NOT NULL COMMENT 'Número de orden de venta',
  linea INT NOT NULL COMMENT 'Número de línea',
  codigo_producto VARCHAR(50) DEFAULT NULL COMMENT 'Código del producto',
  descripcion_producto VARCHAR(255) DEFAULT NULL COMMENT 'Descripción del producto',
  cantidad DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Cantidad',
  unidad_medida VARCHAR(20) DEFAULT NULL COMMENT 'Unidad de medida',
  precio_unitario DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Precio unitario',
  subtotal DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Subtotal de la línea',
  fecha_sincronizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_orden_venta (orden_venta),
  FOREIGN KEY (orden_venta) REFERENCES erp_ordenes_venta(orden_venta) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Detalle de líneas de órdenes de venta'";

if ($conn->query($sql)) {
    echo "✓ Tabla 'erp_ordenes_venta_detalle' creada\n\n";
} else {
    echo "✓ Tabla 'erp_ordenes_venta_detalle' ya existe\n\n";
}

// Insertar datos de prueba
echo "→ Insertando datos de prueba...\n";

$ordenes = [
    ['OV-2026-0001', 'Comercial ABC S.A.C.', '20123456789', '2026-03-15', 'Crédito 30 días', 'Pendiente', 'Almacén Central', 'Lima - Av. Principal 123', 'PEN', 15000.00, 'Orden urgente - Cliente preferencial'],
    ['OV-2026-0002', 'Distribuidora XYZ E.I.R.L.', '20987654321', '2026-03-16', 'Contado', 'Aprobada', 'Almacén Central', 'Arequipa - Calle Comercio 456', 'PEN', 8500.00, 'Entrega programada para el 20/03'],
    ['OV-2026-0003', 'Importaciones Global S.A.', '20456789123', '2026-03-17', 'Crédito 60 días', 'Pendiente', 'Almacén Norte', 'Trujillo - Jr. Independencia 789', 'USD', 12000.00, 'Requiere embalaje especial'],
    ['OV-2026-0004', 'Corporación Andina SAC', '20111222333', '2026-03-14', 'Crédito 45 días', 'Aprobada', 'Almacén Central', 'Cusco - Av. El Sol 321', 'PEN', 22500.00, 'Orden de exportación'],
    ['OV-2026-0005', 'Comercial del Sur EIRL', '20444555666', '2026-03-13', 'Contado', 'En Proceso', 'Almacén Sur', 'Tacna - Av. Bolognesi 654', 'PEN', 5800.00, null],
];

$stmt = $conn->prepare("
    INSERT IGNORE INTO erp_ordenes_venta 
    (orden_venta, cliente, ruc_cliente, fecha_orden, condicion_venta, estado, origen, destino, moneda, total, observaciones) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$insertados = 0;
foreach ($ordenes as $orden) {
    $stmt->bind_param(
        'sssssssssds',
        $orden[0], $orden[1], $orden[2], $orden[3], $orden[4],
        $orden[5], $orden[6], $orden[7], $orden[8], $orden[9], $orden[10]
    );
    
    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo "  ✓ {$orden[0]} - {$orden[1]}\n";
        $insertados++;
    }
}

$stmt->close();

echo "\n✓ Insertadas {$insertados} órdenes de prueba\n";

// Mostrar resumen
echo "\n→ Resumen de datos:\n";
$result = $conn->query("SELECT COUNT(*) as total, SUM(total) as monto_total FROM erp_ordenes_venta WHERE activo=1");
$row = $result->fetch_assoc();
echo "  • Total órdenes activas: {$row['total']}\n";
echo "  • Monto total: " . number_format($row['monto_total'], 2) . "\n";

echo "\n========================================\n";
echo "✅ CONFIGURACIÓN COMPLETADA\n";
echo "========================================\n\n";

echo "Próximos pasos:\n";
echo "1. Abre en navegador: http://localhost/BACKOFFICE/sistemas/despachos/registro.php\n";
echo "2. Verifica que el campo 'Orden de Venta' sea un SELECT con las órdenes\n";
echo "3. Prueba la API: http://localhost/BACKOFFICE/sistemas/despachos/api/obtener_ordenes_venta.php\n";
echo "\n";
echo "Para producción (Ubuntu Server):\n";
echo "1. Ejecuta el script SQL en el servidor remoto\n";
echo "2. Configura las credenciales del ERP en sync_erp_ordenes_venta.php\n";
echo "3. Ejecuta: php test_conexion_erp.php (con VPN activa)\n";
echo "4. Si todo OK, configura el cron job\n";
echo "\nVer: RESUMEN_IMPLEMENTACION.md para guía completa\n\n";

$conn->close();
