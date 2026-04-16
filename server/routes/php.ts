import express from 'express';
const router = express.Router();
router.get('/', (req, res) => res.json({ versions: ['8.1', '8.2', '8.3'], active: '8.2' }));
export default router;
