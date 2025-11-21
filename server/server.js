import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router as indexRouter } from './src/routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000' , 'https://former-rust.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes  
app.use('/', indexRouter);
    
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});   
