const server = require('express').Router();
const { Categories } = require('../db.js');
const passport = require('passport');
const cors = require('cors')
server.use(cors());

//agrego el get a categorías para probar la funcionalidad del put y el delete
server.get('/', (req, res, next) => {
    Categories.findAll()
        .then(categories => {
            res.send(categories);
        })
        .catch(next);
});

server.post("/", /* passport.authenticate("jwt",{session:false}), */(req, res) => {
    /* if(req.user.isAdmin && req.user.isAdmin === true || req.user.isAdmin==='true' ){ */
        const {name, description} = req.body
            Categories.create({
            name,
            description
            })
                .then((newCategorie)=>{
                    res.status(201)
                    res.send(newCategorie)
                })
   /*  }else{
		res.status(401).json({msg:"Unauthorized"});
	}   */          
})

//Ruta para obtener detalles de un ID específico
server.get('/:id', (req, res) => {
	Categories.findOne({
		where: {
			id: req.params.id
		}
	})
		.then(categories => {
			res.send(categories)
		})
});

server.put("/:id",passport.authenticate("jwt",{session:false}), (req,res) => {
    if(req.user.isAdmin && req.user.isAdmin === true || req.user.isAdmin==='true' ){
        const id = req.params.id;
        const name = req.body.name;
        const description = req.body.description;

        Categories.update ({
        name,
        description},
        {where: {id:id}}) 

        .then ((updateCategorie)=> {
            res.status(201)
            res.send("Categoria actualizada")
        })
    }else{
		res.status(401).json({msg:"Unauthorized"});
	}   
})

server.delete(`/:id`,passport.authenticate("jwt",{session:false}), (req, res) => {
    if(req.user.isAdmin && req.user.isAdmin === true || req.user.isAdmin==='true' ){
        Categories.destroy(
            {where: {id: req.params.id}
        })
            .then((deletedCategory) => {
                if (!deletedCategory) {
                    return res.status(404).send({ error: 'No user' });
                }
                res.status(200).send('Removed Successfully');
            });
    }else{
		res.status(401).json({msg:"Unauthorized"});
	}        
})
module.exports = server;