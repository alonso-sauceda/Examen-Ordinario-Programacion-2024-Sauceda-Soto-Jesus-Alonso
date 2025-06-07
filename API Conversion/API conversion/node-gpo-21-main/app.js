const express = require('express');
const fs = require('fs'); // para utilizar el sistema de archivos
const app = express();
const puerto = 3000;
const clientesPath = './clientes.json'; // ruta del archivo JSON de clientes
const monedasPath = './monedas.json'; // NUEVA ruta del archivo JSON de monedas

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Middleware para procesar JSON

// crear el servidor web
app.listen(puerto, () => {
    console.log('Servidor web iniciado.');
});

// --- rutas existentes para clientes ---
app.get('/clientes', (req, res) => {
    fs.readFile(clientesPath, (err, data) => { // leer el archivo
        if (err) {
            res.sendStatus(500);
        } else {
            const clientes = JSON.parse(data); // convertir el texto a JSON
            res.send(clientes);
        }
    });
});

app.post('/clientes', (req, res) => {
    const contenido = req.body; // obtener los datos del cuerpo de la solicitud
    fs.readFile(clientesPath, (err, data) => { // leer el archivo
        if (err) {
            res.sendStatus(500);
        } else {
            const clientes = JSON.parse(data); // convertir el texto a JSON
            clientes.push(contenido); // agregamos contenido al json

            fs.writeFile(clientesPath, JSON.stringify(clientes, null, 2), (err) => { // guardar el nuevo archivo
                if (err) {
                    res.sendStatus(500);
                }
                res.status(201).send(clientes); // Enviar respuesta con estado 201 Created
            });
        }
    });
});

// --- NUEVAS FUNCIONALIDADES PARA MONEDAS ---

// GET: Obtener todas las monedas
app.get('/monedas', (req, res) => {
    fs.readFile(monedasPath, (err, data) => {
        if (err) {
            // Si el archivo no existe, asumir que es la primera vez y devolver un array vacío
            if (err.code === 'ENOENT') {
                return res.status(200).send([]);
            }
            res.sendStatus(500);
        } else {
            const monedas = JSON.parse(data);
            res.send(monedas);
        }
    });
});

// POST: Agregar una nueva moneda
app.post('/monedas', (req, res) => {
    const nuevaMoneda = req.body;

    // Validar que la nueva moneda tenga los campos necesarios y un código único
    if (!nuevaMoneda.codigo || !nuevaMoneda.nombre || typeof nuevaMoneda.tasa_a_mxn === 'undefined') {
        return res.status(400).json({ error: 'Faltan campos obligatorios: codigo, nombre, tasa_a_mxn.' });
    }

    fs.readFile(monedasPath, (err, data) => {
        let monedas = [];
        if (!err && data.length > 0) {
            monedas = JSON.parse(data);
        }

        // Verificar si la moneda ya existe (por código)
        const existe = monedas.some(m => m.codigo === nuevaMoneda.codigo);
        if (existe) {
            return res.status(409).json({ error: `La moneda con código ${nuevaMoneda.codigo} ya existe.` });
        }

        monedas.push(nuevaMoneda);

        fs.writeFile(monedasPath, JSON.stringify(monedas, null, 2), (err) => {
            if (err) {
                res.sendStatus(500);
            }
            res.status(201).json({ message: 'Moneda agregada exitosamente', moneda: nuevaMoneda });
        });
    });
});

// PUT: Editar una moneda existente por su código
app.put('/monedas/:codigo', (req, res) => {
    const codigoAActualizar = req.params.codigo;
    const datosActualizados = req.body;

    fs.readFile(monedasPath, (err, data) => {
        if (err) {
            res.sendStatus(500);
            return;
        }

        let monedas = JSON.parse(data);
        const index = monedas.findIndex(m => m.codigo === codigoAActualizar);

        if (index === -1) {
            return res.status(404).json({ error: `Moneda con código ${codigoAActualizar} no encontrada.` });
        }

        // Actualizar solo los campos proporcionados, manteniendo los demás
        monedas[index] = { ...monedas[index], ...datosActualizados };

        fs.writeFile(monedasPath, JSON.stringify(monedas, null, 2), (err) => {
            if (err) {
                res.sendStatus(500);
            }
            res.json({ message: 'Moneda actualizada exitosamente', moneda: monedas[index] });
        });
    });
});

// Opcional: DELETE para eliminar una moneda
app.delete('/monedas/:codigo', (req, res) => {
    const codigoAEliminar = req.params.codigo;

    fs.readFile(monedasPath, (err, data) => {
        if (err) {
            res.sendStatus(500);
            return;
        }

        let monedas = JSON.parse(data);
        const longitudAntes = monedas.length;
        monedas = monedas.filter(m => m.codigo !== codigoAEliminar);

        if (monedas.length === longitudAntes) {
            return res.status(404).json({ error: `Moneda con código ${codigoAEliminar} no encontrada.` });
        }

        fs.writeFile(monedasPath, JSON.stringify(monedas, null, 2), (err) => {
            if (err) {
                res.sendStatus(500);
            }
            res.json({ message: `Moneda con código ${codigoAEliminar} eliminada exitosamente.` });
        });
    });
});
