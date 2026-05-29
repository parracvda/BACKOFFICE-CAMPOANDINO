-- =====================================================================
-- SCRIPT SQL PARA AGREGAR CAMPOS DE AUDITORÍA A PLAN DE DESPACHO
-- =====================================================================
-- Base de datos: campoand_campoandino
-- Tabla: scm_plan_despacho
-- Fecha: 10 de marzo de 2026
-- =====================================================================

-- Agregar campos de auditoría al final de la tabla
ALTER TABLE scm_plan_despacho
  ADD COLUMN registro_usuario VARCHAR(100) NULL DEFAULT NULL COMMENT 'Usuario que creó el registro',
  ADD COLUMN registro_timestamp TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de creación del registro',
  ADD COLUMN modificacion_usuario VARCHAR(100) NULL DEFAULT NULL COMMENT 'Usuario que modificó por última vez',
  ADD COLUMN modificacion_timestamp TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha y hora de última modificación';

-- Crear índices para búsquedas por usuario y fecha
CREATE INDEX idx_registro_usuario ON scm_plan_despacho(registro_usuario);
CREATE INDEX idx_registro_timestamp ON scm_plan_despacho(registro_timestamp);

-- =====================================================================
-- CONSULTAS ÚTILES PARA AUDITORÍA
-- =====================================================================

-- Ver últimos registros con datos de auditoría
-- SELECT Id, DocDespacho, OrdenVenta, Cliente, registro_usuario, registro_timestamp 
-- FROM scm_plan_despacho 
-- ORDER BY Id DESC 
-- LIMIT 20;

-- Ver registros de un usuario específico
-- SELECT Id, DocDespacho, OrdenVenta, Cliente, registro_timestamp 
-- FROM scm_plan_despacho 
-- WHERE registro_usuario = 'nombre_usuario'
-- ORDER BY registro_timestamp DESC;

-- Ver registros creados en un rango de fechas
-- SELECT Id, DocDespacho, OrdenVenta, Cliente, registro_usuario, registro_timestamp 
-- FROM scm_plan_despacho 
-- WHERE registro_timestamp BETWEEN '2026-03-01' AND '2026-03-31'
-- ORDER BY registro_timestamp DESC;

-- Contar registros por usuario
-- SELECT registro_usuario, COUNT(*) as total_registros 
-- FROM scm_plan_despacho 
-- GROUP BY registro_usuario 
-- ORDER BY total_registros DESC;

-- =====================================================================
-- FIN DE SCRIPT
-- =====================================================================
