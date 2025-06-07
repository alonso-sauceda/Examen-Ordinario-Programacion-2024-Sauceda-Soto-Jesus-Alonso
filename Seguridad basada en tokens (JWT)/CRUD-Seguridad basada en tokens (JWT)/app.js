const express = require('express');
const db = require('./models');
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken
const bcrypt = require('bcrypt');     // Importar bcrypt
const app = express();
const PORT = 3000;

// Middleware para procesar JSON en el cuerpo de las solicitudes
app.use(express.json());

// --- SECRETO JWT ---
// ¡IMPORTANTE!: En un entorno de producción, este secreto debe ser una variable de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretoquenadiemasconocera'; 

// Sincronizar modelos con la base de datos
db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Base de datos sincronizada correctamente.');
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });

// --- Rutas de Autenticación ---

// Ruta para Registrar un nuevo usuario
app.post('/registro', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Nombre de usuario y contraseña son obligatorios.' });
        }

        const usuarioExistente = await db.Usuario.findOne({ where: { username: username } });
        if (usuarioExistente) {
            return res.status(409).json({ error: 'El nombre de usuario ya existe.' }); // 409 Conflict
        }

        const nuevoUsuario = await db.Usuario.create({ username, password });
        // No devolver la contraseña hasheada en la respuesta
        res.status(201).json({ message: 'Usuario registrado exitosamente', userId: nuevoUsuario.id, username: nuevoUsuario.username });
    } catch (error) {
        console.error('Error en el registro de usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor al registrar usuario.' });
    }
});

// Ruta para Iniciar Sesión y Obtener Token JWT
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Nombre de usuario y contraseña son obligatorios.' });
        }

        const usuario = await db.Usuario.findOne({ where: { username: username } });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas.' }); // 401 Unauthorized
        }

        // Comparar la contraseña proporcionada con el hash almacenado
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: usuario.id, username: usuario.username },
            JWT_SECRET,
            { expiresIn: '1h' } // El token expira en 1 hora
        );

        res.json({ message: 'Autenticación exitosa', token: token });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.' });
    }
});

// --- Middleware de Autenticación JWT ---
const authenticateJWT = (req, res, next) => {
    // Obtener el token del encabezado Authorization (Bearer Token)
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // El formato es "Bearer TOKEN"

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                console.log("Error de verificación JWT:", err.message);
                return res.status(403).json({ error: 'Token inválido o expirado.' }); // 403 Forbidden
            }
            req.user = user; // Almacenar los datos del usuario decodificados en el objeto de solicitud
            next(); // Continuar a la siguiente función de middleware/ruta
        });
    } else {
        res.status(401).json({ error: 'Acceso no autorizado. Se requiere un token.' }); // 401 Unauthorized
    }
};


// --- Rutas CRUD para CLIENTES (PROTEGIDAS) ---
// Aplicar el middleware authenticateJWT a todas las rutas de clientes
app.get('/clientes', authenticateJWT, async (req, res) => {
    try {
        const clientes = await db.Cliente.findAll();
        res.json(clientes);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener clientes.' });
    }
});

app.get('/clientes/:id', authenticateJWT, async (req, res) => {
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

app.post('/clientes', authenticateJWT, async (req, res) => {
    try {
        const { nombre, correo } = req.body;
        if (!nombre || !correo) {
            return res.status(400).json({ error: 'Nombre y correo son campos obligatorios.' });
        }
        const nuevoCliente = await db.Cliente.create(req.body);
        res.status(201).json(nuevoCliente);
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(400).json({ error: error.message });
    }
});

app.put('/clientes/:id', authenticateJWT, async (req, res) => {
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

app.delete('/clientes/:id', authenticateJWT, async (req, res) => {
    try {
        const deletedRows = await db.Cliente.destroy({
            where: { id: req.params.id }
        });
        if (deletedRows) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Cliente no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar cliente.' });
    }
});

// --- Puedes seguir añadiendo las rutas CRUD protegidas para Proveedores, Articulos, Empleados ---
// Simplemente copia y pega la estructura de las rutas de Clientes y añade 'authenticateJWT'

/* EJEMPLO para PROVEEDORES
app.get('/proveedores', authenticateJWT, async (req, res) => { ... });
app.post('/proveedores', authenticateJWT, async (req, res) => { ... });
app.put('/proveedores/:id', authenticateJWT, async (req, res) => { ... });
app.delete('/proveedores/:id', authenticateJWT, async (req, res) => { ... });
*/


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor de la pizzería con seguridad JWT corriendo en http://localhost:${PORT}`);
});