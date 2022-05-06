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
    console.log('OOPS, something went wrong /GET', error);
    res.status(500).send('Something went wrong there, buddy');
  }
});

app.post('/products', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const sql = `
      INSERT INTO products (id, image_url, title, description, price) VALUES 
  (?, ?, ?, ?, ?)`;
    const idEl = req.body.id;
    const imageEl = req.body.image_url;
    const titleEl = req.body.title;
    const descriptionEl = req.body.description;
    const priceEl = req.body.price;
    const [rows, fields] = await connection.execute(sql, [
      idEl,
      imageEl,
      titleEl,
      descriptionEl,
      priceEl,
    ]);
    await connection.close();
    res.json({ rows, fields });
  } catch (error) {
    console.log('OOPS, something went wrong /POST', error);
    res.status(500).send('Something went wrong there, buddy');
  }
});

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
