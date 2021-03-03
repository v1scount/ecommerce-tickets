const server = require('express').Router();
const { Reviews } = require('../db.js');
const cors = require('cors');
server.use(cors());

// Ruta para obtener todos las reviews con usuarios y productos asociados

server.get('/', (req, res, next) => {
	Reviews.findAll({
		include: {
			all: true
		}})
		.then(reviews => {
			res.send(reviews);
		})
		.catch(next);
});

module.exports = server;