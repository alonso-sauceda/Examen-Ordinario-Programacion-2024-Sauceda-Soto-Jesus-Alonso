concertControllerapp.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./database/conciertos.sqlite');

router.post('/', (req, res) => {
  const { localidad, fecha, estudiante } = req.body;

  db.get(
    'SELECT precio, descuento FROM conciertos WHERE localidad = ? AND fecha = ?',
    [localidad, fecha],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'Error en la base de datos' });
      if (!row) return res.status(404).json({ error: 'Concierto no encontrado' });

      let precioFinal = row.precio;

      if (estudiante === true || estudiante === 'true') {
        precioFinal = precioFinal * (1 - row.descuento);
      }

      res.json({
        localidad,
        fecha,
        estudiante,
        precio_original: row.precio,
        descuento_aplicado: estudiante ? row.descuento : 0,
        total: precioFinal.toFixed(2)
      });
    }
  );
});

module.exports = router;

