-- ============================================================
-- Script: sql_produccion_movimiento.sql
-- Tabla: produccion_movimiento
-- Descripción: Almacena los tipos de movimiento para el módulo
--              de Trazabilidad (registro manual)
-- ============================================================

CREATE TABLE IF NOT EXISTS produccion_movimiento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar movimiento por defecto
INSERT INTO produccion_movimiento (nombre, activo) VALUES ('INGRESO INTERNO', 1);
