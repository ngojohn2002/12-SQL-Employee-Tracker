// This file sets up a connection pool to the PostgreSQL database using the pg library and environment variables.

const { Pool } = require("pg");
require("dotenv").config();

// Create a new pool instance to manage database connections
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
