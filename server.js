import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import charactersRouter from './routes/characters.js';

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
app.use('/characters', charactersRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
