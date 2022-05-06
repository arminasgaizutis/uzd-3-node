console.log('hi');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { dbConfig } = require('./config');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/test', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    res.json('Server is online');
    console.log('Success');
    await connection.end();
  } catch (e) {
    console.log(e);
  }
});

app.get('/products', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to DB');
    const sql = 'SELECT * FROM products';
    const [rows] = await connection.execute(sql);
    await connection.close();
    res.json(rows);
  } catch (error) {
    console.log('OOPS, something went wrong', error);
    res.status(500).send('Something went wrong there, buddy');
  }
});

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
