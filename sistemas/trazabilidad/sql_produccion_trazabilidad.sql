-- ============================================================
-- Script: sql_produccion_trazabilidad.sql
-- Tabla: produccion_trazabilidad
-- Descripción: Almacena los registros escaneados desde el
--              módulo de Trazabilidad (consultas.php)
-- ============================================================

CREATE TABLE IF NOT EXISTS produccion_trazabilidad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nuevo_lote VARCHAR(50) NOT NULL COMMENT 'Lote generado: CAM+ddmmaa+CodMaquina+Turno',
  fecha DATE NOT NULL,
  maquina_descripcion VARCHAR(255) NOT NULL,
  codigo_producto VARCHAR(100) NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  lote VARCHAR(100) NOT NULL,
  maquina_origen VARCHAR(255) NOT NULL,
  cantidad VARCHAR(50) NOT NULL,
  movimiento VARCHAR(255) NOT NULL,
  observacion TEXT DEFAULT NULL COMMENT 'Observación (solo registro manual)',
  concatenado TEXT NOT NULL,
  usuario_registro VARCHAR(100) NOT NULL,
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_fecha (fecha),
  INDEX idx_lote (lote),
  INDEX idx_codigo_producto (codigo_producto),
  INDEX idx_nuevo_lote (nuevo_lote)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
