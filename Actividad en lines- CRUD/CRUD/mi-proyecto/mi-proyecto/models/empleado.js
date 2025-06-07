const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Empleado', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    sueldo: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  });
};
