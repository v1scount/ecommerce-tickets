const server = require('express').Router();
const { Product } = require('../db.js');
const cors = require('cors')
const {Op} = require("sequelize");
server.use(cors());

server.get('/?', (req, res) => {

    const name = req.query.name;
    Product.findAll({
        where: {
            name:{ [Op.iLike]: `%${name}%`}
        }
    })
        .then((products) => {
            return res.send(products);
        })
})

module.exports = server;