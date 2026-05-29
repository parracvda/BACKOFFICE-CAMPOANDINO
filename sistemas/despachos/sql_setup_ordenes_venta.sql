-- Script de creación de tabla para sincronización de Órdenes de Venta desde ERP Nisira
-- Ejecutar este script en la base de datos MySQL

CREATE TABLE IF NOT EXISTS erp_ordenes_venta (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Órdenes de venta sincronizadas desde ERP Nisira';

-- Tabla para detalle de líneas de cada orden (opcional, si necesitas productos)
CREATE TABLE IF NOT EXISTS erp_ordenes_venta_detalle (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Detalle de líneas de órdenes de venta';

-- Insertar datos de prueba (eliminar después de probar)
INSERT INTO erp_ordenes_venta (orden_venta, cliente, ruc_cliente, fecha_orden, condicion_venta, estado, origen, destino, moneda, total) VALUES
('OV-2026-0001', 'Comercial ABC S.A.C.', '20123456789', '2026-03-15', 'Crédito 30 días', 'Pendiente', 'Almacén Central', 'Lima - Av. Principal 123', 'PEN', 15000.00),
('OV-2026-0002', 'Distribuidora XYZ E.I.R.L.', '20987654321', '2026-03-16', 'Contado', 'Aprobada', 'Almacén Central', 'Arequipa - Calle Comercio 456', 'PEN', 8500.00),
('OV-2026-0003', 'Importaciones Global S.A.', '20456789123', '2026-03-17', 'Crédito 60 días', 'Pendiente', 'Almacén Norte', 'Trujillo - Jr. Independencia 789', 'USD', 12000.00);
