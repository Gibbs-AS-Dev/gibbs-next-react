// lib/db.js
import mysql from 'mysql2';

const connection = mysql.createPool({
  host: 'localhost',  // e.g., localhost or a remote MySQL server
  user: 'root',        // MySQL username (e.g., 'root')
  password: 'Welcome@123',    // MySQL password
  database: 'wordpress',   // WordPress database name
});

export default connection;
