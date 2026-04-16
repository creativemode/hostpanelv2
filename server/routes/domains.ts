import express from 'express';
import { all, run, get } from '../database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    let domains;
    if (req.user?.role === 'admin') {
      domains = await all('SELECT * FROM domains');
    } else {
      domains = await all('SELECT * FROM domains WHERE user_id = ?', [req.user?.id]);
    }
    res.json(domains);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  const { domain_name, path } = req.body;
  try {
    await run(
      'INSERT INTO domains (domain_name, path, user_id) VALUES (?, ?, ?)',
      [domain_name, path || `/var/www/${domain_name}`, req.user?.id]
    );
    res.status(201).json({ message: 'Domain added' });
  } catch (err) {
    res.status(400).json({ error: 'Domain already exists' });
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM domains WHERE id = ? AND (user_id = ? OR ? = "admin")', [id, req.user?.id, req.user?.role]);
    res.json({ message: 'Domain deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete domain' });
  }
});

export default router;
