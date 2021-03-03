const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('lineOrder', {
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        timestamps: false
    })
}