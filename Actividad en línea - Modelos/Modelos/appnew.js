const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require('sequelize');

const app = express();
const puerto = 3000;

const monedas = require('./modelos/monedas');

app.use(bodyParser.json());

app.listen(puerto, async () => {
    await require('./conexion').sync(); // sincroniza base de datos
    console.log(`Servidor iniciado en http://localhost:${puerto}`);
});

// GET todas las monedas
app.get('/monedas/', async (req, res) => {
    const data = await monedas.findAll();
    res.send(data);
});

// POST nueva moneda
app.post('/monedas/', async (req, res) => {
    const { origen, destino, valor } = req.body;

    if (!origen || !destino || typeof valor !== 'number') {
        return res.status(400).json({ mensaje: 'Datos inválidos' });
    }

    const nueva = await monedas.create({ origen, destino, valor });
    res.status(201).json({ mensaje: 'Moneda agregada', moneda: nueva });
});

// PUT editar moneda
app.put('/monedas/:id', async (req, res) => {
    const { id } = req.params;
    const { origen, destino, valor } = req.body;

    const moneda = await monedas.findByPk(id);
    if (!moneda) return res.status(404).json({ mensaje: 'No encontrada' });

    if (origen) moneda.origen = origen;
    if (destino) moneda.destino = destino;
    if (typeof valor === 'number') moneda.valor = valor;

    await moneda.save();
    res.json({ mensaje: 'Actualizada', moneda });
});

// POST convertir moneda
app.post('/convertir/', async (req, res) => {
    const { origen, destino, cantidad } = req.body;

    const data = await monedas.findOne({
        where: {
            [Op.and]: [{ origen }, { destino }]
        }
    });

    if (!data) return res.sendStatus(404);

    const resultado = cantidad * data.valor;

    res.send({ origen, destino, cantidad, resultado });
});
