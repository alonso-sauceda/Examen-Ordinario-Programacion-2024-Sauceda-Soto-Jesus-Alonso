const express = require("express");
const app = express();
app.use(express.json());

const precios = {
    "A": 300,
    "B": 490,
    "C": 670,
    "D": 899
};

app.post("/calcular-precio", (req, res) => {
    const { seccion, cantidad, dia } = req.body;

    if (!precios[seccion] || cantidad < 1 || !["viernes", "sábado", "domingo"].includes(dia)) {
        return res.status(400).json({ error: "Datos inválidos" });
    }

    let precioBase = precios[seccion];

    if (dia === "domingo") {
        precioBase *= 0.84; // Descuento del 16%
    }
    
    let total = precioBase * cantidad;
    
    if (cantidad > 1) {
        total *= 0.95; // Descuento del 5%
    }

    res.json({ total: total.toFixed(2) });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

node index.js
npm install -g nodemon
nodemon index.js
http://localhost:3000/calcular-precio

{
    "seccion": "B",
    "cantidad": 2,
    "dia": "domingo"
}

