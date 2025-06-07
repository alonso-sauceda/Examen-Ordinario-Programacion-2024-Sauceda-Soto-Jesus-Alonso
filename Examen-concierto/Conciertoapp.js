const express = require('express');
const path = require('path');
const app = express();
const concertRouter = require('./concertController');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/concert', concertRouter);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
