import express from 'express';
const router = express.Router();
router.get('/stats', (req, res) => res.json({ domains: 0, databases: 0, emails: 0, load: '0.1' }));
export default router;
