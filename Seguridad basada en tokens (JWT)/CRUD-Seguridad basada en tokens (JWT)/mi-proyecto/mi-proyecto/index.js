const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Cliente = require('./models/cliente')(sequelize);
const Proveedor = require('./models/proveedor')(sequelize);
const Articulo = require('./models/articulo')(sequelize);
const Empleado = require('./models/empleado')(sequelize);

sequelize.sync({ force: false })
  .then(() => console.log('¡Modelos listos y sincronizados!'))
  .catch(console.error);
  