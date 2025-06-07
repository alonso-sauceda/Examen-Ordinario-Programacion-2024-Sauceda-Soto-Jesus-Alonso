const express = require('express');
const db = require('./models'); // Importa todos los modelos y la instancia de sequelize
const app = express();
const PORT = 3000;

// Middleware para procesar JSON en el cuerpo de las solicitudes
app.use(express.json());

// Sincronizar modelos con la base de datos
// `force: false` para no borrar y recrear tablas cada vez que iniciamos
// Cambiar a `force: true` solo si necesitas resetear la DB durante el desarrollo
db.sequelize.sync({ force: false }) 
    .then(() => {
        console.log('Base de datos sincronizada correctamente.');
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });

// --- Rutas CRUD para CLIENTES ---
// 1. GET ALL Clientes
app.get('/clientes', async (req, res) => {
    try {
        const clientes = await db.Cliente.findAll();
        res.json(clientes);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener clientes.' });
    }
});

// 2. GET Cliente by ID
app.get('/clientes/:id', async (req, res) => {
    try {
        const cliente = await db.Cliente.findByPk(req.params.id);
        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener cliente por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener cliente.' });
    }
});

// 3. POST Crear Cliente
app.post('/clientes', async (req, res) => {
    try {
        // Validar campos requeridos antes de crear
        const { nombre, correo } = req.body;
        if (!nombre || !correo) {
            return res.status(400).json({ error: 'Nombre y correo son campos obligatorios.' });
        }
        const nuevoCliente = await db.Cliente.create(req.body);
        res.status(201).json(nuevoCliente); // 201 Created
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(400).json({ error: error.message }); // 400 Bad Request por errores de validación de Sequelize
    }
});

// 4. PUT Actualizar Cliente
app.put('/clientes/:id', async (req, res) => {
    try {
        const [updatedRows] = await db.Cliente.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedRows) {
            const clienteActualizado = await db.Cliente.findByPk(req.params.id);
            res.json(clienteActualizado);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado o sin cambios.' });
        }
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(400).json({ error: error.message });
    }
});

// 5. DELETE Eliminar Cliente
app.delete('/clientes/:id', async (req, res) => {
    try {
        const deletedRows = await db.Cliente.destroy({
            where: { id: req.params.id }
        });
        if (deletedRows) {
            res.status(204).send(); // 204 No Content
        } else {
            res.status(404).json({ message: 'Cliente no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar cliente.' });
    }
});

// --- Rutas CRUD para PROVEEDORES ---
// 1. GET ALL Proveedores
app.get('/proveedores', async (req, res) => {
    try {
        const proveedores = await db.Proveedor.findAll();
        res.json(proveedores);
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener proveedores.' });
    }
});

// 2. GET Proveedor by ID
app.get('/proveedores/:id', async (req, res) => {
    try {
        const proveedor = await db.Proveedor.findByPk(req.params.id);
        if (proveedor) {
            res.json(proveedor);
        } else {
            res.status(404).json({ message: 'Proveedor no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener proveedor por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener proveedor.' });
    }
});

// 3. POST Crear Proveedor
app.post('/proveedores', async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'Nombre es un campo obligatorio.' });
        }
        const nuevoProveedor = await db.Proveedor.create(req.body);
        res.status(201).json(nuevoProveedor);
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        res.status(400).json({ error: error.message });
    }
});

// 4. PUT Actualizar Proveedor
app.put('/proveedores/:id', async (req, res) => {
    try {
        const [updatedRows] = await db.Proveedor.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedRows) {
            const proveedorActualizado = await db.Proveedor.findByPk(req.params.id);
            res.json(proveedorActualizado);
        } else {
            res.status(404).json({ message: 'Proveedor no encontrado o sin cambios.' });
        }
    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        res.status(400).json({ error: error.message });
    }
});

// 5. DELETE Eliminar Proveedor
app.delete('/proveedores/:id', async (req, res) => {
    try {
        const deletedRows = await db.Proveedor.destroy({
            where: { id: req.params.id }
        });
        if (deletedRows) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Proveedor no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar proveedor.' });
    }
});

// --- Rutas CRUD para ARTICULOS ---
// 1. GET ALL Articulos
app.get('/articulos', async (req, res) => {
    try {
        const articulos = await db.Articulo.findAll();
        res.json(articulos);
    } catch (error) {
        console.error('Error al obtener artículos:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener artículos.' });
    }
});

// 2. GET Articulo by ID
app.get('/articulos/:id', async (req, res) => {
    try {
        const articulo = await db.Articulo.findByPk(req.params.id);
        if (articulo) {
            res.json(articulo);
        } else {
            res.status(404).json({ message: 'Artículo no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener artículo por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener artículo.' });
    }
});

// 3. POST Crear Articulo
app.post('/articulos', async (req, res) => {
    try {
        const { descripcion, precio, existencia } = req.body;
        if (!descripcion || precio === undefined || existencia === undefined) {
            return res.status(400).json({ error: 'Descripción, precio y existencia son campos obligatorios.' });
        }
        const nuevoArticulo = await db.Articulo.create(req.body);
        res.status(201).json(nuevoArticulo);
    } catch (error) {
        console.error('Error al crear artículo:', error);
        res.status(400).json({ error: error.message });
    }
});

// 4. PUT Actualizar Articulo
app.put('/articulos/:id', async (req, res) => {
    try {
        const [updatedRows] = await db.Articulo.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedRows) {
            const articuloActualizado = await db.Articulo.findByPk(req.params.id);
            res.json(articuloActualizado);
        } else {
            res.status(404).json({ message: 'Artículo no encontrado o sin cambios.' });
        }
    } catch (error) {
        console.error('Error al actualizar artículo:', error);
        res.status(400).json({ error: error.message });
    }
});

// 5. DELETE Eliminar Articulo
app.delete('/articulos/:id', async (req, res) => {
    try {
        const deletedRows = await db.Articulo.destroy({
            where: { id: req.params.id }
        });
        if (deletedRows) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Artículo no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar artículo:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar artículo.' });
    }
});

// --- Rutas CRUD para EMPLEADOS ---
// 1. GET ALL Empleados
app.get('/empleados', async (req, res) => {
    try {
        const empleados = await db.Empleado.findAll();
        res.json(empleados);
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener empleados.' });
    }
});

// 2. GET Empleado by ID
app.get('/empleados/:id', async (req, res) => {
    try {
        const empleado = await db.Empleado.findByPk(req.params.id);
        if (empleado) {
            res.json(empleado);
        } else {
            res.status(404).json({ message: 'Empleado no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener empleado por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener empleado.' });
    }
});

// 3. POST Crear Empleado
app.post('/empleados', async (req, res) => {
    try {
        const { nombre, sueldo } = req.body;
        if (!nombre || sueldo === undefined) {
            return res.status(400).json({ error: 'Nombre y sueldo son campos obligatorios.' });
        }
        const nuevoEmpleado = await db.Empleado.create(req.body);
        res.status(201).json(nuevoEmpleado);
    } catch (error) {
        console.error('Error al crear empleado:', error);
        res.status(400).json({ error: error.message });
    }
});

// 4. PUT Actualizar Empleado
app.put('/empleados/:id', async (req, res) => {
    try {
        const [updatedRows] = await db.Empleado.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedRows) {
            const empleadoActualizado = await db.Empleado.findByPk(req.params.id);
            res.json(empleadoActualizado);
        } else {
            res.status(404).json({ message: 'Empleado no encontrado o sin cambios.' });
        }
    } catch (error) {
        console.error('Error al actualizar empleado:', error);
        res.status(400).json({ error: error.message });
    }
});

// 5. DELETE Eliminar Empleado
app.delete('/empleados/:id', async (req, res) => {
    try {
        const deletedRows = await db.Empleado.destroy({
            where: { id: req.params.id }
        });
        if (deletedRows) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Empleado no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar empleado.' });
    }
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor de la pizzería con CRUDs completos corriendo en http://localhost:${PORT}`);
});