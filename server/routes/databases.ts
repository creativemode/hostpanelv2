import express from 'express';
import { run, all, get } from '../database';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get all databases
router.get('/', authenticate, async (req: any, res) => {
  try {
    let databases;
    if (req.user.role === 'admin') {
      databases = await all('SELECT d.*, u.username as owner FROM databases d JOIN users u ON d.user_id = u.id');
    } else {
      databases = await all('SELECT * FROM databases WHERE user_id = ?', [req.user.id]);
    }
    res.json(databases);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Create database
router.post('/', authenticate, async (req: any, res) => {
  const { name, db_user, db_pass } = req.body;
  try {
    await run(
      'INSERT INTO databases (name, db_user, db_pass, user_id) VALUES (?, ?, ?, ?)',
      [name, db_user, db_pass, req.user.id]
    );
    res.status(201).json({ message: 'Database created successfully' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Delete database
router.delete('/:id', authenticate, async (req: any, res) => {
  try {
    const db = await get('SELECT * FROM databases WHERE id = ?', [req.params.id]);
    if (!db) return res.status(404).json({ message: 'Database not found' });
    
    if (req.user.role !== 'admin' && db.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await run('DELETE FROM databases WHERE id = ?', [req.params.id]);
    res.json({ message: 'Database deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
