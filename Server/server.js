import express from 'express';
import cors from 'cors';
import pool from './src/Middlewares/db.js';
import dotenv from 'dotenv';
import router from './src/Routes/route.js';
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors({origin: '*'})); // Enable CORS for all routes

// route
app.use(router)

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});


// Connect to the database
// pool.connect()
//   .then(() => {
//     console.log('DB connected :)');
//   })
//   .catch((err) => {
//     console.error('Error connecting to the database:', err);
//   });
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0].now);
  }
});