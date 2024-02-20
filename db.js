//db.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'backend_project',
  password: 'CoIrD857',
  port: 5432,
});

module.exports = pool;