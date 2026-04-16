import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./hostpanel.db');

export const run = promisify(db.run.bind(db));
export const get = promisify(db.get.bind(db));
export const all = promisify(db.all.bind(db));

export async function setupDatabase() {
  // Users Table
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Domains Table
  await run(`
    CREATE TABLE IF NOT EXISTS domains (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      domain_name TEXT UNIQUE,
      path TEXT,
      php_version TEXT DEFAULT '8.2',
      user_id INTEGER,
      status TEXT DEFAULT 'active',
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // DNS Records Table
  await run(`
    CREATE TABLE IF NOT EXISTS dns_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      domain_id INTEGER,
      type TEXT, -- A, AAAA, CNAME, MX, TXT, NS
      name TEXT,
      content TEXT,
      ttl INTEGER DEFAULT 3600,
      priority INTEGER,
      FOREIGN KEY(domain_id) REFERENCES domains(id)
    )
  `);

  // Email Accounts Table
  await run(`
    CREATE TABLE IF NOT EXISTS email_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      quota INTEGER, -- in MB
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Managed Databases Table
  await run(`
    CREATE TABLE IF NOT EXISTS databases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      db_user TEXT,
      db_pass TEXT,
      size TEXT DEFAULT '0 MB',
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Backups Table
  await run(`
    CREATE TABLE IF NOT EXISTS backups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT UNIQUE,
      size TEXT,
      type TEXT DEFAULT 'database', -- 'database' or 'full'
      db_id INTEGER, -- Optional
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(db_id) REFERENCES databases(id)
    )
  `);

  // Admin User
  const adminExists = await get('SELECT id FROM users WHERE role = ?', ['admin']);
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@hostpanel.local', hashedPassword, 'admin']
    );
    console.log('Seed: Admin user created (admin / admin123)');
  }
}

export default db;
