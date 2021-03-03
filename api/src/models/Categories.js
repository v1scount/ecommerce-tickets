const { DataTypes,Sequelize } = require('sequelize');
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('categories', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
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
