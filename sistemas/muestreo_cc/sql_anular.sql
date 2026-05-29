-- Script para agregar campo anulado a sig_registrocc
-- Ejecutar en la base de datos campoand_campoandino

ALTER TABLE sig_registrocc
ADD COLUMN anulado TINYINT(1) NOT NULL DEFAULT 0
COMMENT '0=activo, 1=anulado' 
AFTER fecha_actualizacion;

-- Crear índice para filtrar rápidamente registros no anulados
ALTER TABLE sig_registrocc
ADD INDEX idx_anulado (anulado);
