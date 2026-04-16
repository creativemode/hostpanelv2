import express from 'express';
const router = express.Router();
router.get('/', (req, res) => res.json([
  { id: 'wordpress', name: 'WordPress' },
  { id: 'laravel', name: 'Laravel' }
]));
export default router;
