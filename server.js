import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import charactersRoutes from './routes/characters.js';
import usersRoutes from './routes/users.js';
import availabilitiesRoutes from './routes/availabilities.js';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
const port = 3001;

const dbURL = process.env.DB_URL || 'localhost';
mongoose.connect(`mongodb://${dbURL}/lysande`);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.error('⚡️[DB]: Database MongoDB is connected'));

/// //////// Middlewares //////////////////////
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use('/characters', charactersRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/availabilities', availabilitiesRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
