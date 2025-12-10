import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// Load environment from repository root when running npm from the `backend` folder.
// This ensures `MONGO_URI` (in `../.env`) is available to mongoose.connect().
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Enable CORS for local frontend dev server
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  // Serve uploads (adjust path if you store uploads elsewhere in production)
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Serve frontend that was copied into `dist/public` during the build step
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));

  // Serve generated documentation if present in `dist/docs`
  const docsPath = path.join(__dirname, 'docs');
  app.use('/docs', express.static(docsPath));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(publicPath, 'index.html'))
  );
} else {
  const __dirname = path.resolve();
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  // In development serve frontend app (if running locally) and docs from repo root
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.use('/docs', express.static(path.join(__dirname, '../docs')));

  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
