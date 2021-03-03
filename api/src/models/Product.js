const { DataTypes,Sequelize } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    price:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    stock: {
     type:  DataTypes.INTEGER,
     allowNull: false
    },
    img:{
      type: DataTypes.STRING(1000),
      allowNull:false,
    },
    video:{
      type:DataTypes.STRING(),
      allowNull:true,
    },
    createdAt:{
      type: DataTypes.DATE,
      defaultValue:Sequelize.fn('NOW'),
      allowNull:true
    },
    updatedAt:{
      type: DataTypes.DATE,
      allowNull:true
    }
  });
};
