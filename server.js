const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Railway izaduha DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// HOME PAGE
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.render('index', { products: result.rows });
  } catch (err) {
    res.send('Database ntirakomeye. Tuzayikora kuri Railway.');
  }
});

// KONGeramo igicuruzwa
app.post('/add', async (req, res) => {
  const { name, price, stock } = req.body;
  await pool.query('INSERT INTO products(name, price, stock) VALUES($1, $2, $3)', [name, price, stock]);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`OBIZZSTOCK V10 ikora kuri port ${PORT}`);
});
