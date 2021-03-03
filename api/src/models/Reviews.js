const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('reviews', {
        description: { // algunos usuarios pueden querer dar una calificación sin dar una descripción ni escribir nada, por eso no tiene allowNull
            type: DataTypes.TEXT,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
};