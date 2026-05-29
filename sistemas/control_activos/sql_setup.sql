-- ============================================================
-- SQL Setup: Módulo Control de Activos - Cadena de Suministros
-- Base de datos: campoand_campoandino
-- ============================================================

-- 1. CATEGORÍAS DE ACTIVOS
CREATE TABLE IF NOT EXISTS `activos_categoria` (
    `id_categoria` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_categoria`),
    UNIQUE KEY `uk_categoria_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar categorías por defecto
INSERT INTO `activos_categoria` (`nombre`, `descripcion`) VALUES
('VEHICULOS', 'Camiones, camionetas, montacargas y stockas')
ON DUPLICATE KEY UPDATE `nombre` = VALUES(`nombre`);

-- 2. MAESTRO DE ACTIVOS
CREATE TABLE IF NOT EXISTS `activos_maestro` (
    `id_activo` INT NOT NULL AUTO_INCREMENT,
    `id_categoria` INT NOT NULL,
    `codigo_patrimonial` VARCHAR(50) DEFAULT NULL,
    `tipo_activo` ENUM('CAMION', 'CAMIONETA', 'MONTACARGAS', 'STOCKA') NOT NULL DEFAULT 'CAMION',
    `altura_elevacion` DECIMAL(5,2) DEFAULT NULL COMMENT 'Altura máxima de elevación en metros (montacargas, stocka)',
    `longitud_unas` DECIMAL(5,2) DEFAULT NULL COMMENT 'Longitud de uñas en metros (montacargas, stocka)',
    `soat_codigo` VARCHAR(50) DEFAULT NULL COMMENT 'Código/número de póliza SOAT',
    `soat_vencimiento` DATE DEFAULT NULL COMMENT 'Fecha de vencimiento del SOAT',
    `revision_tecnica_codigo` VARCHAR(50) DEFAULT NULL COMMENT 'Código/número de certificado de revisión técnica',
    `revision_tecnica_vencimiento` DATE DEFAULT NULL COMMENT 'Fecha de vencimiento de revisión técnica',
    `fecha_adquisicion` DATE DEFAULT NULL COMMENT 'Fecha de adquisición del activo',
    `marca` VARCHAR(100) DEFAULT NULL,
    `modelo` VARCHAR(100) DEFAULT NULL,
    `numero_serie` VARCHAR(100) DEFAULT NULL,
    `anio_fabricacion` INT(4) DEFAULT NULL,
    `color` VARCHAR(50) DEFAULT NULL,
    `placa` VARCHAR(20) DEFAULT NULL,
    `kilometraje_actual` INT DEFAULT 0 COMMENT 'Kilometraje actual del vehículo',
    `capacidad_carga` VARCHAR(50) DEFAULT NULL,
    `combustible` VARCHAR(50) DEFAULT NULL,
    `dimensiones` VARCHAR(100) DEFAULT NULL,
    `peso_bruto` DECIMAL(10,2) DEFAULT NULL,
    `ubicacion_fisica` VARCHAR(150) DEFAULT NULL,
    `estado_activo` ENUM('OPERATIVO', 'EN MANTENIMIENTO', 'INOPERATIVO', 'DE BAJA') NOT NULL DEFAULT 'OPERATIVO',
    `valor_libros` DECIMAL(12,2) DEFAULT NULL COMMENT 'Valor en libros (USD)',
    `foto_url` VARCHAR(255) DEFAULT NULL,
    `observaciones` TEXT DEFAULT NULL,
    `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `usuario_registro` INT DEFAULT NULL,
    PRIMARY KEY (`id_activo`),
    KEY `idx_categoria` (`id_categoria`),
    KEY `idx_estado` (`estado_activo`),
    KEY `idx_tipo` (`tipo_activo`),
    CONSTRAINT `fk_activo_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `activos_categoria`(`id_categoria`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. OPERADORES
CREATE TABLE IF NOT EXISTS `activos_operadores` (
    `id_operador` INT NOT NULL AUTO_INCREMENT,
    `nombre_completo` VARCHAR(200) NOT NULL,
    `documento` VARCHAR(20) DEFAULT NULL,
    `licencia` VARCHAR(50) DEFAULT NULL,
    `telefono` VARCHAR(20) DEFAULT NULL,
    `correo` VARCHAR(100) DEFAULT NULL,
    `activo` TINYINT(1) NOT NULL DEFAULT 1,
    `observaciones` TEXT DEFAULT NULL,
    `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_operador`),
    KEY `idx_activo` (`activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. CHECKLIST DIARIO (cabecera)
CREATE TABLE IF NOT EXISTS `activos_checklist_diario` (
    `id_checklist` INT NOT NULL AUTO_INCREMENT,
    `id_activo` INT NOT NULL,
    `id_operador` INT NOT NULL,
    `fecha_checklist` DATE NOT NULL,
    `hora_checklist` VARCHAR(5) DEFAULT NULL,
    `kilometraje` VARCHAR(50) DEFAULT NULL,
    `estado_general` ENUM('BUENO', 'REGULAR', 'MALO') DEFAULT NULL,
    `observaciones` TEXT DEFAULT NULL,
    `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `usuario_registro` INT DEFAULT NULL,
    PRIMARY KEY (`id_checklist`),
    KEY `idx_activo_fecha` (`id_activo`, `fecha_checklist`),
    KEY `idx_operador` (`id_operador`),
    CONSTRAINT `fk_checklist_activo` FOREIGN KEY (`id_activo`) REFERENCES `activos_maestro`(`id_activo`) ON UPDATE CASCADE,
    CONSTRAINT `fk_checklist_operador` FOREIGN KEY (`id_operador`) REFERENCES `activos_operadores`(`id_operador`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. CHECKLIST DIARIO (detalle - ítems revisados)
CREATE TABLE IF NOT EXISTS `activos_checklist_detalle` (
    `id_detalle` INT NOT NULL AUTO_INCREMENT,
    `id_checklist` INT NOT NULL,
    `id_item` INT DEFAULT NULL,
    `resultado` ENUM('BUENO', 'CORREGIR', 'MAL_ESTADO') NOT NULL DEFAULT 'BUENO',
    `comentario` TEXT DEFAULT NULL,
    PRIMARY KEY (`id_detalle`),
    KEY `idx_checklist` (`id_checklist`),
    CONSTRAINT `fk_detalle_checklist` FOREIGN KEY (`id_checklist`) REFERENCES `activos_checklist_diario`(`id_checklist`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. MANTENIMIENTO
CREATE TABLE IF NOT EXISTS `activos_mantenimiento` (
    `id_mantenimiento` INT NOT NULL AUTO_INCREMENT,
    `id_activo` INT NOT NULL,
    `tipo_mantenimiento` ENUM('PREVENTIVO', 'CORRECTIVO') NOT NULL,
    `fecha_programada` DATE DEFAULT NULL,
    `fecha_ejecucion` DATE DEFAULT NULL,
    `proveedor` VARCHAR(150) DEFAULT NULL,
    `costo` DECIMAL(10,2) DEFAULT NULL,
    `descripcion` TEXT DEFAULT NULL,
    `observaciones` TEXT DEFAULT NULL,
    `estado` ENUM('PROGRAMADO', 'EN EJECUCION', 'COMPLETADO', 'CANCELADO') NOT NULL DEFAULT 'PROGRAMADO',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `usuario_registro` INT DEFAULT NULL,
    PRIMARY KEY (`id_mantenimiento`),
    KEY `idx_activo` (`id_activo`),
    KEY `idx_estado_mant` (`estado`),
    KEY `idx_fecha_programada` (`fecha_programada`),
    CONSTRAINT `fk_mantenimiento_activo` FOREIGN KEY (`id_activo`) REFERENCES `activos_maestro`(`id_activo`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. FOTOS DE CHECKLIST (evidencia fotográfica por item)
CREATE TABLE IF NOT EXISTS `activos_checklist_fotos` (
    `id_foto` INT NOT NULL AUTO_INCREMENT,
    `id_checklist` INT NOT NULL,
    `id_item` INT NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_foto`),
    KEY `idx_foto_checklist` (`id_checklist`),
    KEY `idx_foto_item` (`id_item`),
    CONSTRAINT `fk_foto_checklist` FOREIGN KEY (`id_checklist`) REFERENCES `activos_checklist_diario`(`id_checklist`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. ALERTAS DE MANTENIMIENTO
CREATE TABLE IF NOT EXISTS `activos_mantenimiento_alertas` (
    `id_alerta` INT NOT NULL AUTO_INCREMENT,
    `id_activo` INT NOT NULL,
    `tipo_alerta` VARCHAR(100) NOT NULL,
    `periodicidad_dias` INT DEFAULT NULL,
    `periodicidad_km` INT DEFAULT NULL,
    `ultima_ejecucion` DATE DEFAULT NULL,
    `proxima_alerta` DATE DEFAULT NULL,
    `activo` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_alerta`),
    KEY `idx_activo_alerta` (`id_activo`),
    KEY `idx_proxima` (`proxima_alerta`),
    CONSTRAINT `fk_alerta_activo` FOREIGN KEY (`id_activo`) REFERENCES `activos_maestro`(`id_activo`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
