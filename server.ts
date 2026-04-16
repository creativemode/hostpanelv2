import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { setupDatabase } from './server/database';

// Routes
import authRoutes from './server/routes/auth';
import dashboardRoutes from './server/routes/dashboard';
import domainRoutes from './server/routes/domains';
import dnsRoutes from './server/routes/dns';
import emailRoutes from './server/routes/email';
import fileRoutes from './server/routes/files';
import phpRoutes from './server/routes/php';
import installerRoutes from './server/routes/installer';
import userRoutes from './server/routes/users';
import databaseRoutes from './server/routes/databases';
import backupRoutes from './server/routes/backups';

const __filename = import.meta.url ? fileURLToPath(import.meta.url) : '';
const __dirname = __filename ? path.dirname(__filename) : process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database
  await setupDatabase();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/domains', domainRoutes);
  app.use('/api/dns', dnsRoutes);
  app.use('/api/email', emailRoutes);
  app.use('/api/files', fileRoutes);
  app.use('/api/php', phpRoutes);
  app.use('/api/installer', installerRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/databases', databaseRoutes);
  app.use('/api/backups', backupRoutes);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
