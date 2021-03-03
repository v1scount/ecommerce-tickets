const server = require('express').Router();
const  { User } = require('../db.js');
const cors = require('cors')
const multer = require('multer')
const {promisify} = require("util");
const fs = require("fs");
const bcript =require("bcrypt")
const passport = require('passport');

server.use(cors());

const upload= multer()
server.post("/",upload.single('file'),async(req, res) => {
	const {username, givenName, familyName, email, password,securityQuestion, isAdmin,googleId } = req.body
	console.log(req.body)
	const hashPassword  =await bcript.hash(password,10)
	//Procesar archivo de imagen recibido
	const {file} = req;	
	if (file.detectedFileExtension != ".jpg" && file.detectedFileExtension != ".png") next(new Error("Invalid file type"));
	const fileName = 'userimg' + '_' + Date.now() + file.detectedFileExtension;
	var img = `http://localhost:3001/img-user/${fileName}`;//definiendo la url de la imagen que se va a guardar en la base de datos
	//guardar archivo de imagen en el servidor 
	const pipeline = promisify(require("stream").pipeline);
	await pipeline(file.stream,fs.createWriteStream(`${__dirname}/../upload/img-user/${fileName}`)).catch(e=>{console.log(e)});
	User.create({
        username,
        givenName,
        familyName,
        email,
        password:hashPassword,
		photoURL:img,
		securityQuestion,
		isAdmin,
		googleId
		
    })
		.then((newUser) => {
			
			res.send(newUser)
		}).catch((e) => {
            res.status(400)
            res.send(e)
		})
})

server.get('/', /* passport.authenticate("jwt",{session:false}), */(req, res,) => {
	
	/* if(req.user.isAdmin && req.user.isAdmin === true){ */
		return	User.findAll({
				include: 
				{all:true}
			})
			.then(users => {
				res.send(users);
			})
	/* }	

	res.status(401).json({msg:"Unauthorized"}); */
});
server.get('/:email', /* passport.authenticate("jwt",{session:false}), */(req, res,) => {
	const {email}= req.params
	return	User.findOne({
			where:{
				email
			}
		})
		.then(users => {
			res.send(users);
		})
})
server.delete("/:id", /* passport.authenticate("jwt",{session:false}), */ (req, res) => {
	/* if(req.user.isAdmin && req.user.isAdmin === true){ */
		const {id}= req.params
		User.findOne({
			where:{
				id:id
			}
		})
		.then((user) => {
			if (!user) {
			res.json({ message: "El id especificado no existe o contiene errores." });
			} else {
			user.destroy()
			return res.json({ message: "User Deleted" });
			}

		});
	/* }else{
		res.status(401).json({msg:"Unauthorized"});
	}	 */

});


server.put('/:id' /*,passport.authenticate("jwt",{session:false})*/, (req, res) => {
	const {id} = req.params;
	const { username, email, givenName, familyName, photoURL} = req.body;
	User.update(
		{
			username,
			email,
			givenName,
			familyName,
			photoURL
		},
		{ returning: true, where: { id }}
	).then(updatedUser => {
		res.status(201).json(updatedUser)
	}).catch(e => {
		res.status(400).json( { MjsError: "Llene los campos obligatorios"} )
	})
});


// Ruta para resetear la password

server.post('/:id/passwordReset', /* passport.authenticate("jwt",{session:false}), */ async(req, res) => {
	const { id } = req.params;
	const { password } = req.body;
	const hash = await bcript.hash(password, 10);

	User.findOne({ where: { id: id} })
		.then(user => {
			if(!user) {
				res.status(400).json({ msg: "No existe dicho usuario "});
			} else {
				user.update({ password: hash }).then(userUp => {
					res.status(200).json({ msg: "Contraseña actualizada correctametne "});
				}).catch(e => {
					res.json(e);
				})
			}
		})
});

// Ruta para editar la imagen de un usuario en particular
server.put('/:id/image', upload.single("file"),passport.authenticate("jwt",{session:false}),async (req, res, next) => {
	const id = req.params.id
	const {file} = req;	
	
	if (file.detectedFileExtension != ".jpg" && file.detectedFileExtension != ".png") next(new Error("Invalid file type"));
		const fileName = 'userimg' + '_' + Date.now() + file.detectedFileExtension;
		var img = `http://localhost:3001/img-user/${fileName}`;//definiendo la url de la imagen que se va a guardar en la base de datos
		//guardar archivo de imagen en el servidor 
		const pipeline = promisify(require("stream").pipeline);
		await pipeline(file.stream,fs.createWriteStream(`${__dirname}/../upload/img-user/${fileName}`)).catch(e=>{console.log(e)});
		
		User.update({
			photoURL:img,
		}, {where: {id}})
		.then(updatedUser => {
			console.log(img)
			res.status(201).json(img)
		})	
	})
	
server.get('/all', (req,res) => {
	User.findAll()
	.then(users => {
		res.send(users)
	})
})	

 
module.exports = server;
