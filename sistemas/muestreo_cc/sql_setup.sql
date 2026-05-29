-- ============================================================
--  Módulo : Muestreo Control de Calidad
--  Script : Creación de tablas
--  Fecha  : 2026-04-14
-- ============================================================

-- ── 0a. Almacenes ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `sig_cc_almacen` (
  `id`        INT          NOT NULL AUTO_INCREMENT,
  `nombre`    VARCHAR(60)  NOT NULL,
  `activo`    TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_almacen_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Catálogo de almacenes del módulo MCC';

INSERT IGNORE INTO `sig_cc_almacen` (`nombre`) VALUES
  ('PRODUCTOS TERMINADOS'),
  ('PRODUCTOS EN PROCESO');

-- ── 0b. Tipos de producto ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS `sig_cc_tipoproducto` (
  `id`        INT          NOT NULL AUTO_INCREMENT,
  `nombre`    VARCHAR(60)  NOT NULL,
  `activo`    TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tipo_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Catálogo de tipos de producto del módulo MCC';

INSERT IGNORE INTO `sig_cc_tipoproducto` (`nombre`) VALUES
  ('CAJA'),
  ('PARIHUELA'),
  ('TAPA');

-- ── 0. Turnos ────────────────────────────────────────────────
--    Cada fila define un turno con rango horario.
--    hora_inicio / hora_fin en formato TIME (24h).
--    El turno NOCHE cruza medianoche: hora_fin < hora_inicio.
--    Ejemplo:
--      MAÑANA  07:00 – 15:44
--      NOCHE   15:45 – 00:14
CREATE TABLE IF NOT EXISTS `sig_turno` (
  `id`           TINYINT   NOT NULL AUTO_INCREMENT,
  `nombre`       VARCHAR(20)  NOT NULL COMMENT 'MAÑANA | NOCHE',
  `hora_inicio`  TIME         NOT NULL COMMENT 'Inicio en formato 24h',
  `hora_fin`     TIME         NOT NULL COMMENT 'Fin en formato 24h (puede ser < hora_inicio si cruza medianoche)',
  `activo`       TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_turno_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Definición de turnos con rango horario';

INSERT IGNORE INTO `sig_turno` (`id`, `nombre`, `hora_inicio`, `hora_fin`) VALUES
  (1, 'MAÑANA', '07:00:00', '15:44:59'),
  (2, 'NOCHE',  '15:45:00', '00:14:59');


--    Un material pertenece a un almacén y opcionalmente a un
--    tipo de producto (NULL = aplica a cualquier tipo en ese almacén).
CREATE TABLE IF NOT EXISTS `sig_cc_materiales` (
  `id`            INT           NOT NULL AUTO_INCREMENT,
  `nombre`        VARCHAR(150)  NOT NULL,
  `almacen`       VARCHAR(30)   NOT NULL
                    COMMENT 'PRODUCTOS TERMINADOS | PRODUCTOS EN PROCESO',
  `tipo_producto` VARCHAR(20)   NULL
                    COMMENT 'CAJA | PARIHUELA | TAPA – NULL = no aplica tipo',
  `activo`        TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_mat_almacen` (`almacen`),
  KEY `idx_mat_tipo`    (`tipo_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Catálogo de materiales por almacén y tipo de producto';

-- ── 2. Observaciones por material ───────────────────────────
CREATE TABLE IF NOT EXISTS `sig_cc_observaciones` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `id_material` INT           NOT NULL,
  `nombre`      VARCHAR(250)  NOT NULL,
  `activo`      TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_obs_material` (`id_material`),
  UNIQUE KEY `uq_obs_mat_nombre` (`id_material`, `nombre`),
  CONSTRAINT `fk_obs_material`
    FOREIGN KEY (`id_material`) REFERENCES `sig_cc_materiales` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Observaciones posibles por material';

-- ── 3. Tabla principal de registros ─────────────────────────
CREATE TABLE IF NOT EXISTS `sig_registrocc` (
  `id`                   INT            NOT NULL AUTO_INCREMENT,

  -- Clasificación
  `almacen`              VARCHAR(30)    NOT NULL
                           COMMENT 'PRODUCTOS TERMINADOS | PRODUCTOS EN PROCESO',

  -- Datos generales
  `fecha`                DATE           NOT NULL,
  `turno`                VARCHAR(10)    NOT NULL
                           COMMENT 'MAÑANA | NOCHE',
  `hora`                 TIME           NOT NULL
                           COMMENT 'Hora de registro en formato 24h',

  -- Identificación
  `id_maquina`           INT            NOT NULL,
  `maquina`              VARCHAR(100)   NOT NULL
                           COMMENT 'Nombre denormalizado para histórico',
  `id_descripcion`       INT            NOT NULL,
  `descripcion`          VARCHAR(200)   NOT NULL
                           COMMENT 'Nombre denormalizado para histórico',

  -- Responsable
  `id_usuario`           INT            NOT NULL
                           COMMENT 'FK → usuarios.IdUsuario',
  `responsable`          VARCHAR(150)   NOT NULL
                           COMMENT 'Nombres del usuario al momento del registro',

  -- Datos de registro
  `tipo_producto`        VARCHAR(60)    NULL
                           COMMENT 'CAJA | PARIHUELA | TAPA – solo para PRODUCTOS TERMINADOS',
  `cantidad_muestreada`  INT            NOT NULL DEFAULT 0,
  `observaciones`        ENUM('SI','NO') NOT NULL,
  `humedad_promedio`     DECIMAL(5,1)   NOT NULL DEFAULT 0.0,
  `cantidad_observada`   INT            NOT NULL DEFAULT 0,

  -- Auditoría
  `fecha_registro`       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion`  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_fecha`        (`fecha`),
  KEY `idx_almacen`      (`almacen`),
  KEY `idx_turno`        (`turno`),
  KEY `idx_maquina`      (`id_maquina`),
  KEY `idx_descripcion`  (`id_descripcion`),
  KEY `idx_usuario`      (`id_usuario`),

  CONSTRAINT `fk_registrocc_usuario`
    FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`IdUsuario`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Registros de muestreo de control de calidad';

-- ── 4. Detalle: observaciones marcadas por registro ──────────
--    Cada fila = un checkbox marcado al guardar un registro.
CREATE TABLE IF NOT EXISTS `sig_registrocc_observaciones` (
  `id`              INT           NOT NULL AUTO_INCREMENT,
  `id_registro`     INT           NOT NULL,
  `id_material`     INT           NOT NULL,
  `nombre_material` VARCHAR(150)  NOT NULL  COMMENT 'Denormalizado',
  `id_observacion`  INT           NOT NULL,
  `nombre_obs`      VARCHAR(250)  NOT NULL  COMMENT 'Denormalizado',
  `cantidad`        INT           NOT NULL DEFAULT 0 COMMENT 'Cantidad observada para esta observación',
  PRIMARY KEY (`id`),
  KEY `idx_regobs_registro`    (`id_registro`),
  KEY `idx_regobs_material`    (`id_material`),
  KEY `idx_regobs_observacion` (`id_observacion`),
  CONSTRAINT `fk_regobs_registro`
    FOREIGN KEY (`id_registro`)    REFERENCES `sig_registrocc`       (`id`),
  CONSTRAINT `fk_regobs_observacion`
    FOREIGN KEY (`id_observacion`) REFERENCES `sig_cc_observaciones`  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Observaciones marcadas en cada registro de muestreo';


-- ============================================================
--  Migración 2026-04-16: porcentajes + comentarios
-- ============================================================

-- Porcentaje general (cant_observada / cant_muestreada * 100)
ALTER TABLE `sig_registrocc`
  ADD COLUMN IF NOT EXISTS `porcentaje_general`    DECIMAL(5,2) NOT NULL DEFAULT 0.00
    COMMENT '% general: cantidad_observada / cantidad_muestreada * 100'
    AFTER `cantidad_observada`,
  ADD COLUMN IF NOT EXISTS `comentarios`            TEXT         NULL
    COMMENT 'Comentarios libres del inspector'
    AFTER `porcentaje_general`,
  ADD COLUMN IF NOT EXISTS `acciones_preventivas`   TEXT         NULL
    COMMENT 'Acciones preventivas propuestas'
    AFTER `comentarios`;

-- Porcentaje individual por observación (cantidad_obs / cant_muestreada * 100)
ALTER TABLE `sig_registrocc_observaciones`
  ADD COLUMN IF NOT EXISTS `porcentaje` DECIMAL(5,2) NOT NULL DEFAULT 0.00
    COMMENT '% individual: cantidad / cantidad_muestreada del registro * 100'
    AFTER `cantidad`;

-- ============================================================
--  Migración 2026-04-17: tipo_producto → VARCHAR
--  (la tabla pudo haberse creado con INT en versiones anteriores)
-- ============================================================
ALTER TABLE `sig_registrocc`
  MODIFY COLUMN `tipo_producto` VARCHAR(60) NULL
    COMMENT 'CAJA | PARIHUELA | TAPA – solo para PRODUCTOS TERMINADOS';

-- ============================================================
--  Tabla: sig_cc_productos
--  Catálogo de productos sincronizado desde ERP (SQL Server)
-- ============================================================
CREATE TABLE IF NOT EXISTS `sig_cc_productos` (
  `id`           INT          NOT NULL AUTO_INCREMENT,
  `codigo`       VARCHAR(60)  NOT NULL  COMMENT 'Código del producto en el ERP',
  `nombre`       VARCHAR(255) NOT NULL  COMMENT 'Descripción del producto',
  `activo`       TINYINT(1)   NOT NULL DEFAULT 1,
  `sync_at`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP
                   COMMENT 'Última vez que se sincronizó desde el ERP',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cc_prod_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Catálogo de productos MCC – sincronizado desde ERP Nisira';
