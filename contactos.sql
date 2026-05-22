-- Script SQL para KnitSys (esquema de Contactos y Empresas)
-- Charset y motor
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Tabla: tipos_contacto
CREATE TABLE IF NOT EXISTS tipos_contacto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  etiqueta VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: usuarios (básica para auditoría y roles)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(100) NOT NULL UNIQUE,
  nombre_mostrar VARCHAR(150),
  correo VARCHAR(255),
  rol ENUM('admin','manager','operator','viewer') NOT NULL DEFAULT 'operator',
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: empresas
CREATE TABLE IF NOT EXISTS empresas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  cuit_rut_nif VARCHAR(50),
  condicion_fiscal VARCHAR(100),
  actividad_economica VARCHAR(200),
  sitio_web VARCHAR(200),
  country_code CHAR(2),
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  borrado_en DATETIME NULL,
  creado_por INT NULL,
  actualizado_por INT NULL,
  CONSTRAINT fk_empresas_creado_por FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  CONSTRAINT fk_empresas_actualizado_por FOREIGN KEY (actualizado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_empresas_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: contactos
CREATE TABLE IF NOT EXISTS contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  nombre_mostrar VARCHAR(150),
  id_tipo_contacto INT NULL,
  resumen_notas TEXT,
  country_code CHAR(2),
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  borrado_en DATETIME NULL,
  creado_por INT NULL,
  actualizado_por INT NULL,
  CONSTRAINT fk_contactos_tipo_contacto FOREIGN KEY (id_tipo_contacto) REFERENCES tipos_contacto(id) ON DELETE SET NULL,
  CONSTRAINT fk_contactos_creado_por FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  CONSTRAINT fk_contactos_actualizado_por FOREIGN KEY (actualizado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_contactos_apellido (apellido),
  INDEX idx_contactos_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla intermedia: empresa_contacto (N:M)
CREATE TABLE IF NOT EXISTS empresa_contacto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_empresa INT NOT NULL,
  id_contacto INT NOT NULL,
  puesto VARCHAR(150),
  es_principal TINYINT(1) NOT NULL DEFAULT 0,
  notas TEXT,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  creado_por INT NULL,
  actualizado_por INT NULL,
  CONSTRAINT uq_empresa_contacto UNIQUE (id_empresa, id_contacto),
  CONSTRAINT fk_ec_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON DELETE CASCADE,
  CONSTRAINT fk_ec_contacto FOREIGN KEY (id_contacto) REFERENCES contactos(id) ON DELETE CASCADE,
  CONSTRAINT fk_ec_creado_por FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  CONSTRAINT fk_ec_actualizado_por FOREIGN KEY (actualizado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_ec_empresa (id_empresa),
  INDEX idx_ec_contacto (id_contacto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: contacto_correos
CREATE TABLE IF NOT EXISTS contacto_correos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_contacto INT NOT NULL,
  correo VARCHAR(255) NOT NULL,
  tipo VARCHAR(50),
  es_principal TINYINT(1) NOT NULL DEFAULT 0,
  verificado TINYINT(1) NOT NULL DEFAULT 0,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_correos_contacto FOREIGN KEY (id_contacto) REFERENCES contactos(id) ON DELETE CASCADE,
  INDEX idx_correos_correo (correo),
  INDEX idx_correos_contacto (id_contacto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: contacto_telefonos
CREATE TABLE IF NOT EXISTS contacto_telefonos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_contacto INT NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  country_code CHAR(2),
  tipo VARCHAR(50),
  es_principal TINYINT(1) NOT NULL DEFAULT 0,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_telefonos_contacto FOREIGN KEY (id_contacto) REFERENCES contactos(id) ON DELETE CASCADE,
  INDEX idx_telefonos_telefono (telefono),
  INDEX idx_telefonos_contacto (id_contacto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: direcciones (reutilizable para empresa o contacto)
CREATE TABLE IF NOT EXISTS direcciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entidad_tipo ENUM('empresa','contacto') NOT NULL,
  id_entidad INT NOT NULL,
  tipo_direccion VARCHAR(50), -- fiscal, envio, taller, sucursal
  calle VARCHAR(255),
  ciudad VARCHAR(100),
  provincia VARCHAR(100),
  codigo_postal VARCHAR(30),
  country_code CHAR(2),
  notas TEXT,
  es_principal TINYINT(1) NOT NULL DEFAULT 0,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_direcciones_entidad (entidad_tipo, id_entidad),
  INDEX idx_direcciones_ciudad (ciudad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: notas (vinculables a empresa o contacto)
CREATE TABLE IF NOT EXISTS notas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entidad_tipo ENUM('empresa','contacto','otro') NOT NULL,
  id_entidad INT NOT NULL,
  id_usuario INT NULL,
  contenido TEXT NOT NULL,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_notas_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_notas_entidad (entidad_tipo, id_entidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: adjuntos (archivos vinculados)
CREATE TABLE IF NOT EXISTS adjuntos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entidad_tipo ENUM('empresa','contacto','diseno','produccion','otro') NOT NULL,
  id_entidad INT NOT NULL,
  nombre_archivo VARCHAR(255) NOT NULL,
  ruta_archivo VARCHAR(500) NOT NULL,
  mime_type VARCHAR(100),
  tamano_bytes BIGINT,
  subido_por INT NULL,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_adjuntos_usuario FOREIGN KEY (subido_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_adjuntos_entidad (entidad_tipo, id_entidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
