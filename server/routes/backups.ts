import express from 'express';
import { run, all, get } from '../database';
import { authenticate } from '../middleware/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = (import.meta.url && import.meta.url.startsWith('file:')) ? fileURLToPath(import.meta.url) : '';
const __dirname = __filename ? path.dirname(__filename) : process.cwd();

const router = express.Router();
const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Get all backups
router.get('/', authenticate, async (req: any, res) => {
  try {
    let backups;
    if (req.user.role === 'admin') {
      backups = await all('SELECT b.*, u.username as owner, d.name as db_name FROM backups b JOIN users u ON b.user_id = u.id LEFT JOIN databases d ON b.db_id = d.id ORDER BY b.created_at DESC');
    } else {
      backups = await all('SELECT b.*, d.name as db_name FROM backups b LEFT JOIN databases d ON b.db_id = d.id WHERE b.user_id = ? ORDER BY b.created_at DESC', [req.user.id]);
    }
    res.json(backups);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Create backup
router.post('/', authenticate, async (req: any, res) => {
  const { db_id, type } = req.body; // type: 'database' or 'full'
  try {
    let filename = '';
    let dbName = 'full_system';
    
    if (db_id) {
       const dbRow = await get('SELECT name FROM databases WHERE id = ?', [db_id]);
       if (!dbRow) return res.status(404).json({ message: 'Database not found' });
       dbName = dbRow.name;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    filename = `backup_${dbName}_${timestamp}.sql`;
    const filePath = path.join(BACKUP_DIR, filename);

    // Simulate backup creation (writing a dummy SQL file)
    const dummyContent = `-- HostPanel Backup\n-- Date: ${new Date().toISOString()}\n-- Database: ${dbName}\n\nCREATE TABLE test (id INT);`;
    fs.writeFileSync(filePath, dummyContent);

    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024).toFixed(2) + ' KB';

    await run(
      'INSERT INTO backups (filename, size, type, db_id, user_id) VALUES (?, ?, ?, ?, ?)',
      [filename, size, type || 'database', db_id || null, req.user.id]
    );

    res.status(201).json({ message: 'Backup created successfully', filename });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Restore backup
router.post('/restore/:id', authenticate, async (req: any, res) => {
  try {
    const backup = await get('SELECT * FROM backups WHERE id = ?', [req.params.id]);
    if (!backup) return res.status(404).json({ message: 'Backup not found' });

    if (req.user.role !== 'admin' && backup.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const filePath = path.join(BACKUP_DIR, backup.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Backup file missing on disk' });
    }

    // Simulate restore logic
    console.log(`Restoring from ${backup.filename}...`);
    
    res.json({ message: `Restore from ${backup.filename} completed successfully` });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Delete backup
router.delete('/:id', authenticate, async (req: any, res) => {
  try {
    const backup = await get('SELECT * FROM backups WHERE id = ?', [req.params.id]);
    if (!backup) return res.status(404).json({ message: 'Backup not found' });

    if (req.user.role !== 'admin' && backup.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const filePath = path.join(BACKUP_DIR, backup.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await run('DELETE FROM backups WHERE id = ?', [req.params.id]);
    res.json({ message: 'Backup deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
