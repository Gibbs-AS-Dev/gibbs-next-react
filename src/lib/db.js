import mysql from "mysql2";

const connection = mysql.createPool({
  host: process.env.NEXT_DBHOST, 
  user: process.env.NEXT_DBUSER,
  password: process.env.NEXT_DBPASSWORD,
  database: process.env.NEXT_DBNAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


export default connection;
