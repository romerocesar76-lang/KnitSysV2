-- Fix foreign key constraint on tipos_contacto table
-- Drop the incorrect constraint and let tipos_contacto be independent

ALTER TABLE tipos_contacto DROP FOREIGN KEY tipos_contacto_id_tipo_contacto_foreign;

-- The tipos_contacto table should stand alone as a reference table
-- The contactos table should reference tipos_contacto if needed