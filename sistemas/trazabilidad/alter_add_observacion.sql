-- Agregar columna observacion a la tabla produccion_trazabilidad
ALTER TABLE produccion_trazabilidad ADD COLUMN observacion TEXT DEFAULT NULL COMMENT 'Observación (solo registro manual)' AFTER movimiento;
