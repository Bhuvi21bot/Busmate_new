import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// Create a connection pool that handles errors gracefully
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bus_booking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test connection and log status
pool.getConnection()
  .then((conn) => {
    console.log('✅ MySQL connection pool established');
    conn.release();
  })
  .catch((error) => {
    console.error('❌ MySQL connection failed:', error.message);
    console.error('⚠️  Please start MySQL server with one of these commands:');
    console.error('   - Linux: sudo service mysql start');
    console.error('   - macOS: brew services start mysql');
    console.error('   - Windows: net start MySQL80');
  });

export const db = drizzle(pool);