import express from 'express';
import dotenv from 'dotenv';
import pool from './Config/db.js';
import cors from 'cors';
import router from './Routes/routes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});

app.use(router);

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Database connected successfully:', res.rows[0]);
    }
  });