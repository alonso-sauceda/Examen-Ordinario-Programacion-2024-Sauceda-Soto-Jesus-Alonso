const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Articulo', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    existencia: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};
