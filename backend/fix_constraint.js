// Fix script for BD constraint
require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixConstraint() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      port: process.env.TIDB_PORT,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      ssl: process.env.TIDB_SSL === 'true' ? {} : false
    });

    console.log('Conectado a TiDB Cloud');

    // Check if constraint exists
    const [constraints] = await connection.query(
      `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
       WHERE TABLE_NAME = 'tipos_contacto' AND CONSTRAINT_NAME LIKE '%foreign%'`
    );

    console.log('Constraints encontrados:', constraints);

    if (constraints.length > 0) {
      for (const constraint of constraints) {
        console.log(`Eliminando constraint: ${constraint.CONSTRAINT_NAME}`);
        await connection.query(
          `ALTER TABLE tipos_contacto DROP FOREIGN KEY ${constraint.CONSTRAINT_NAME}`
        );
      }
      console.log('✅ Constraints eliminadas correctamente');
    } else {
      console.log('No hay constraints para eliminar');
    }

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixConstraint();