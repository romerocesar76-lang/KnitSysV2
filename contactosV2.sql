CREATE TABLE `tipos_contacto`(
    `id_tipo_contacto` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `etiqueta` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL
);
CREATE TABLE `usuarios`(
    `id_usuario` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `id_contacto` INT NOT NULL,
    `usuario` VARCHAR(100) NOT NULL,
    `rol` ENUM(
        'admin',
        'manager',
        'operator',
        'viewer'
    ) NOT NULL DEFAULT 'operator',
    `activo` TINYINT(1) NOT NULL DEFAULT 1,
    `creado_en` DATETIME NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `usuarios` ADD UNIQUE `usuarios_usuario_unique`(`usuario`);
CREATE TABLE `empresas`(
    `id_empresa` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `id_tipo_contacto` INT NOT NULL,
    `nombre` VARCHAR(200) NOT NULL,
    `cuit_rut_nif` VARCHAR(50) NULL,
    `condicion_fiscal` VARCHAR(100) NULL,
    `actividad_economica` VARCHAR(200) NULL,
    `sitio_web` VARCHAR(200) NULL,
    `creado_en` DATETIME NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `empresas` ADD INDEX `empresas_id_tipo_contacto_index`(`id_tipo_contacto`);
ALTER TABLE `empresas` ADD CONSTRAINT `empresas_id_tipo_contacto_foreign` FOREIGN KEY (`id_tipo_contacto`) REFERENCES `tipos_contacto`(`id_tipo_contacto`);
ALTER TABLE
    `empresas` ADD INDEX `empresas_nombre_index`(`nombre`);
CREATE TABLE `contactos`(
    `id_contacto` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `id_tipo_contacto` INT NOT NULL,
    `nombre` VARCHAR(100) NULL,
    `apellido` VARCHAR(100) NULL,
    `notas` TEXT NULL,
    `creado_en` DATETIME NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `contactos` ADD INDEX `contactos_id_tipo_contacto_index`(`id_tipo_contacto`);
ALTER TABLE `contactos` ADD CONSTRAINT `contactos_id_tipo_contacto_foreign` FOREIGN KEY (`id_tipo_contacto`) REFERENCES `tipos_contacto`(`id_tipo_contacto`);
ALTER TABLE
    `contactos` ADD INDEX `contactos_nombre_index`(`nombre`);
ALTER TABLE
    `contactos` ADD INDEX `contactos_apellido_index`(`apellido`);
CREATE TABLE `empresa_contacto`(
    `id_empresa_contacto` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `id_empresa` INT NOT NULL,
    `id_contacto` INT NOT NULL,
    `puesto` VARCHAR(150) NULL,
    `es_principal` TINYINT(1) NOT NULL,
    `notas` TEXT NULL
);
ALTER TABLE
    `empresa_contacto` ADD INDEX `empresa_contacto_id_empresa_index`(`id_empresa`);
ALTER TABLE
    `empresa_contacto` ADD INDEX `empresa_contacto_id_contacto_index`(`id_contacto`);
CREATE TABLE `correos`(
    `id_correo` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `id_contacto` INT NULL,
    `id_empresa` INT NULL,
    `correo` VARCHAR(255) NOT NULL,
    `tipo` VARCHAR(50) NULL,
    `es_principal` TINYINT(1) NOT NULL
);
ALTER TABLE
    `correos` ADD INDEX `correos_correo_index`(`correo`);
CREATE TABLE `telefonos`(
    `id_telefono` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `id_contacto` INT NULL,
    `id_empresa` INT NULL,
    `telefono` VARCHAR(50) NOT NULL,
    `country_code` CHAR(2) NULL,
    `tipo` VARCHAR(50) NULL,
    `es_principal` TINYINT(1) NOT NULL
);
ALTER TABLE
    `telefonos` ADD INDEX `telefonos_telefono_index`(`telefono`);
CREATE TABLE `direcciones`(
    `id_direccion` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `id_contacto` INT NULL,
    `id_empresa` INT NULL,
    `calle` VARCHAR(255) NULL,
    `ciudad` VARCHAR(100) NULL,
    `provincia` VARCHAR(100) NULL,
    `codigo_postal` VARCHAR(30) NULL,
    `notas` TEXT NULL,
    `es_principal` TINYINT(1) NOT NULL
);
ALTER TABLE
    `direcciones` ADD INDEX `direcciones_ciudad_index`(`ciudad`);
CREATE TABLE `adjuntos`(
    `id_adjunto` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `id_contacto` INT NULL,
    `id_empresa` INT NULL,
    `nombre_archivo` VARCHAR(255) NOT NULL,
    `ruta_archivo` VARCHAR(500) NOT NULL,
    `nota` VARCHAR(255) NOT NULL,
    `subido_por` INT NULL,
    `creado_en` DATETIME NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `telefonos` ADD CONSTRAINT `telefonos_id_contacto_foreign` FOREIGN KEY(`id_contacto`) REFERENCES `contactos`(`id_contacto`);
ALTER TABLE
    `correos` ADD CONSTRAINT `correos_id_contacto_foreign` FOREIGN KEY(`id_contacto`) REFERENCES `contactos`(`id_contacto`);
ALTER TABLE
    `empresa_contacto` ADD CONSTRAINT `empresa_contacto_id_empresa_foreign` FOREIGN KEY(`id_empresa`) REFERENCES `empresas`(`id_empresa`);
ALTER TABLE
    `adjuntos` ADD CONSTRAINT `adjuntos_id_empresa_foreign` FOREIGN KEY(`id_empresa`) REFERENCES `empresas`(`id_empresa`);
ALTER TABLE
    `telefonos` ADD CONSTRAINT `telefonos_id_empresa_foreign` FOREIGN KEY(`id_empresa`) REFERENCES `empresas`(`id_empresa`);
ALTER TABLE
    `correos` ADD CONSTRAINT `correos_id_empresa_foreign` FOREIGN KEY(`id_empresa`) REFERENCES `empresas`(`id_empresa`);
ALTER TABLE
    `empresa_contacto` ADD CONSTRAINT `empresa_contacto_id_contacto_foreign` FOREIGN KEY(`id_contacto`) REFERENCES `contactos`(`id_contacto`);
ALTER TABLE
    `adjuntos` ADD CONSTRAINT `adjuntos_id_contacto_foreign` FOREIGN KEY(`id_contacto`) REFERENCES `contactos`(`id_contacto`);
ALTER TABLE
    `direcciones` ADD CONSTRAINT `direcciones_id_empresa_foreign` FOREIGN KEY(`id_empresa`) REFERENCES `empresas`(`id_empresa`);
ALTER TABLE
    `usuarios` ADD CONSTRAINT `usuarios_id_contacto_foreign` FOREIGN KEY(`id_contacto`) REFERENCES `contactos`(`id_contacto`);
ALTER TABLE
    `direcciones` ADD CONSTRAINT `direcciones_id_contacto_foreign` FOREIGN KEY(`id_contacto`) REFERENCES `contactos`(`id_contacto`);

CREATE VIEW `vista_contactos` AS
SELECT
    c.id_contacto,
    c.nombre,
    c.apellido,
    c.creado_en,
    tc.etiqueta
FROM contactos c
LEFT JOIN tipos_contacto tc ON c.id_tipo_contacto = tc.id_tipo_contacto;

CREATE VIEW `vista_empresas` AS
SELECT
    e.id_empresa,
    e.nombre,
    e.actividad_economica,
    e.creado_en,
    tc.etiqueta
FROM empresas e
LEFT JOIN tipos_contacto tc ON e.id_tipo_contacto = tc.id_tipo_contacto;
