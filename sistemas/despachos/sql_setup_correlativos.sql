-- =====================================================================
-- SCRIPTS SQL PARA IMPLEMENTAR CORRELATIVO EN PLAN DE DESPACHO
-- =====================================================================
-- Base de datos: campoand_campoandino
-- Fecha: 10 de marzo de 2026
-- =====================================================================

-- 1. AGREGAR CAMPO DocDespacho A LA TABLA scm_plan_despacho
-- (Campo VARCHAR para almacenar el correlativo formateado, ej: DSP-0001)
-- =====================================================================

ALTER TABLE scm_plan_despacho 
ADD COLUMN DocDespacho VARCHAR(45) NULL DEFAULT NULL 
AFTER Id;

-- Crear índice para búsquedas rápidas por DocDespacho
CREATE INDEX idx_doc_despacho ON scm_plan_despacho(DocDespacho);


-- =====================================================================
-- 2. CREAR TABLA DE CONTROL DE CORRELATIVOS PARA DESPACHOS
-- =====================================================================
-- Esta tabla almacena el último número de correlativo usado
-- Permite reiniciar o ajustar el correlativo desde la BD si es necesario
-- =====================================================================

CREATE TABLE IF NOT EXISTS scm_correlativos_despacho (
  id INT(11) NOT NULL AUTO_INCREMENT,
  tipo VARCHAR(50) NOT NULL DEFAULT 'DESPACHO' COMMENT 'Tipo de documento (para futuras expansiones)',
  last_number INT(11) NOT NULL DEFAULT 0 COMMENT 'Último número de correlativo usado',
  prefijo VARCHAR(10) NOT NULL DEFAULT 'DSP' COMMENT 'Prefijo del correlativo (ej: DSP)',
  padding INT(11) NOT NULL DEFAULT 4 COMMENT 'Cantidad de dígitos con padding (ej: 4 = 0001)',
  activo TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Si está activo o no',
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Control de correlativos para documentos de despacho';


-- =====================================================================
-- 3. INSERTAR REGISTRO INICIAL DE CONTROL DE CORRELATIVO
-- =====================================================================
-- Inicia el correlativo en 0, el primer despacho será DSP-0001
-- Si quieres empezar desde otro número, cambia last_number
-- =====================================================================

INSERT INTO scm_correlativos_despacho (tipo, last_number, prefijo, padding, activo) 
VALUES ('DESPACHO', 0, 'DSP', 4, 1)
ON DUPLICATE KEY UPDATE 
  prefijo = VALUES(prefijo),
  padding = VALUES(padding),
  activo = VALUES(activo);


-- =====================================================================
-- CONSULTAS ÚTILES PARA ADMINISTRACIÓN
-- =====================================================================

-- Ver el estado actual del correlativo
-- SELECT * FROM scm_correlativos_despacho WHERE tipo = 'DESPACHO';

-- Resetear el correlativo a 0 (el siguiente será 0001)
-- UPDATE scm_correlativos_despacho SET last_number = 0 WHERE tipo = 'DESPACHO';

-- Cambiar el prefijo (ej: de DSP a DESP)
-- UPDATE scm_correlativos_despacho SET prefijo = 'DESP' WHERE tipo = 'DESPACHO';

-- Ver últimos despachos registrados con su correlativo
-- SELECT Id, DocDespacho, OrdenVenta, Cliente, Cantidad, FechaSugerida 
-- FROM scm_plan_despacho 
-- WHERE DocDespacho IS NOT NULL 
-- ORDER BY Id DESC 
-- LIMIT 20;

-- =====================================================================
-- FIN DE SCRIPT
-- =====================================================================
