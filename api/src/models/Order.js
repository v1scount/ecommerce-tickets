const { DataTypes,Sequelize } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('order', {
        state: {
            type: DataTypes.ENUM,
            values: ['carrito', 'creada', 'procesando', 'cancelada', 'completada']
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
    })
}