// Importar módulos necesarios
const express = require('express'); // Framework Express
const fs = require('fs'); // Módulo para manejar archivos
const app = express(); // Inicializar la app
const PORT = 3000; // Definir puerto

// Middleware para procesar JSON
app.use(express.json());

// Endpoint POST /alumno para guardar datos en un archivo JSON
app.post('/alumno', (req, res) => {
    const { cuenta, nombre, promedio, grado, grupo } = req.body;

    // Validar que todos los campos sean enviados
    if (!cuenta || !nombre || promedio === undefined || !grado || !grupo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevoAlumno = { cuenta, nombre, promedio, grado, grupo };
    const archivo = 'alumnos.json';
    
    let alumnos = [];
    if (fs.existsSync(archivo)) {
        const data = fs.readFileSync(archivo, 'utf-8');
        alumnos = data ? JSON.parse(data) : [];
    }
    
    alumnos.push(nuevoAlumno);
    fs.writeFileSync(archivo, JSON.stringify(alumnos, null, 2));

    res.status(201).json({ mensaje: 'Alumno guardado correctamente', alumno: nuevoAlumno });
});

// Iniciar el servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

node app.js

curl -X POST http://localhost:3000/alumno -H "Content-Type: application/json" -d '{"cuenta": "12345", "nombre": "Juan Pérez", "promedio": 9.5, "grado": "10", "grupo": "A"}'

[
    {
      "cuenta": "12345",
      "nombre": "Juan Pérez",
      "promedio": 9.5,
      "grado": "10",
      "grupo": "A"
    }
  ]
