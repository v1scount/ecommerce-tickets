const server = require('express').Router();
const { Product , Categories, Reviews,conn, User} = require('../db.js');
const Sequelize = require('sequelize');
const cors = require('cors');
const multer = require('multer');//midleware para manejar el archivod de imagen
const fs = require("fs");
const {promisify} = require("util");
const pipeline = promisify(require("stream").pipeline);
const passport = require('passport');

server.use(cors());
 
// Obtener todos los productos con su categoría 

server.get('/', (req, res, next) => {
	Product.findAll({
		include: {
			all: true
		}})
		.then(products => {
			res.send(products);
		})
		.catch(next);
});

// Agregar producto

const upload = multer();
//ruta para guardar producto con sus categorias
server.post("/",upload.single("file"),passport.authenticate("jwt",{session:false}),async (req, res,next)=>{
	console.log(req.user)
	if(req.user.isAdmin && req.user.isAdmin === true || req.user.isAdmin==='true' ){
		
		//procesar los  datos recibidos del formulario que hacen parte del body
		var { name, description, price,stock, genre,video } = req.body;
		const genreArray=genre.split`,`.map(x=>+x) //convirtiendo el string de generos en un array
		if(!Number.isInteger(genreArray[0])) next(new Error("Género invalido"));//validar que vengan enteros de id de generos

		//Procesar archivo de imagen recibido
		const {file} = req;	
		
		if (file.detectedFileExtension != ".jpg" && file.detectedFileExtension != ".png") next(new Error("Invalid file type"));
		const fileName = 'productoimg' + '_' + Date.now() + file.detectedFileExtension;
		var img = `http://localhost:3001/img/${fileName}`;//definiendo la url de la imagen que se va a guardar en la base de datos
		//guardar archivo de imagen en el servidor 
		await pipeline(file.stream,fs.createWriteStream(`${__dirname}/../upload/img/${fileName}`)).catch(e=>{console.log(e)});

		
		// si todo salio bien entonces guardar producto en base de datos
		Product.create({
			name,
			description,
			price,
			stock,
			img,
			video
		}).then(product=>{
				product.addCategories(genreArray);
				res.status(200).json(product)
		})
		.catch(e=>{
			res.status(400).json(e)
		}) 
	}else{
		res.status(401).json({msg:"Unauthorized"});
	}

});


//actualizar un producto
server.put('/:id', upload.single("file"),passport.authenticate("jwt",{session:false}),async (req, res, next) => {
	
	if(req.user.isAdmin && req.user.isAdmin === true || req.user.isAdmin==='true' ){
		//procesar los  datos recibidos del formualrio que hacen parte del body
		var { name, description, price,stock, genre } = req.body;
		const genreArray=genre.split`,`.map(x=>+x) //convirtiendo el string de generos en un array
		if(!Number.isInteger(genreArray[0])) next(new Error("Género invalido"));//validar que vengan numeros de id de generos
		const { id } = req.params;//recueprando el id de la url
		

		//Encontrar las categorias que tiene el producto actualmente en la base de datos
		const productCat= await Product.findOne({
			include:{ model:Categories},
			where:{id:id},
		})

		//Procesar archivo de imagen recibido
		const {file} = req;	
		
		if(file){

			if (file.detectedFileExtension != ".jpg" && file.detectedFileExtension != ".png") next(new Error("Invalid file type"));
			//conseguir imagen anterior  que esta en la base de datos
			var fileNameAntiguo = productCat.img;
			var ultimoSlash = fileNameAntiguo.lastIndexOf("/"); 
			fileNameAntiguo=fileNameAntiguo.substring(ultimoSlash+1);
			//borrar la imagen antigua del servidor 
			if(fileNameAntiguo !== 'producto-sin-foto.jpg')
			await pipeline(fs.unlink(`${__dirname}/../upload/img/${fileNameAntiguo}`,function(){console.log('')})).catch(e=>{console.log(e)});
			
			const fileName = 'productoimg' + '_' + Date.now() + file.detectedFileExtension;//definiendo el nombde del archivo a guardar en el servidor
			var img = `http://localhost:3001/img/${fileName}`;//definiendo la url de la imagen que se va a guardar en la base de datos
			//guardar el nuevo archivo de imagen en el servidor 
			await pipeline(file.stream,fs.createWriteStream(`${__dirname}/../upload/img/${fileName}`)).catch(e=>{console.log(e)});
		}

		try {
			const t = await conn.transaction(async (t) => {
				const product = await Product.update(
					{
						name,
						description,
						price,
						stock,
						img,
					},
					{ returning: true, where: { id } },
					{transaction: t}
				)
				
				//guardar las categorias conseguidas de la base de datos en un array
				const categoriesDB=[];
				productCat.categories.map(c=>{
					categoriesDB.push(c.id)
				})
				
				const productAct = await Product.findByPk(id,{transaction: t})
				const removeCategories= productAct.removeCategories(categoriesDB);
				const addCategories= productAct.addCategories(genreArray);
		
				res.status(201).json(productAct);
		
			});
		} catch (error) {
			res.status(400).json(error);
		}
	}else{
		res.status(401).json({msg:"Unauthorized"});
	}
});

// Ruta para cargar categoria a un producto

server.post("/:idProducto/category/:idCategoria",passport.authenticate("jwt",{session:false}), (req, res, next) => {
	if(req.user.isAdmin && req.user.isAdmin === true || req.user.isAdmin==='true' ){
		let { idProducto, idCategoria } = req.params;
		
		Product.findByPk(idProducto)
			.then(product => {
				if (!product) {
					return res
						.status(400) // este if no hace lo que espero que haga del todo bien pero todavía no la voy a borrar
						.json({ message: "No se encontraron categorías con ese id" });
				}
				product.addCategories([idCategoria])
					.then((products) => {
						if (!products) {
							return res
								.status(400)
								.json({ message: "No se encontraron productos con ese id." });
						}
						product.update({
							genre: Sequelize.fn('array_append', Sequelize.col('genre'), idCategoria)
						})	//array_append es una función de sequelize para concatenar arrays y col es para indicarle en que columna quiero agregar el dato
						res.status(201).json({ message: "Categoria agregada" });
					})
			})
	}else{
		res.status(401).json({msg:"Unauthorized"});
	}		
})


// Ruta para remover categoria a un producto 

server.delete("/:idProducto/category/:idCategoria", passport.authenticate("jwt",{session:false}),(req, res, next) => {
	if(req.user.isAdmin && req.user.isAdmin === true || req.user.isAdmin==='true' ){
		let { idProducto, idCategoria } = req.params;
		Product.findByPk(idProducto)
			.then((product) => {
				if (!product) {
					return res
						.status(400)
						.json({ message: "No se encontraron categorías con ese id" });
				} 
				product.removeCategories([idCategoria])
					.then((products) => {
						if (!products) {
							return res
								.status(400)
								.json({ message: "No se encontraron productos con ese id" });
						}
						product.update({
							genre: Sequelize.fn('array_remove', Sequelize.col('genre'), idCategoria)
						}) // remuevo del array genre el valor que le paso como idCategoría, siempre y cuando coincidan, el update me actualiza el array a ese valor y el array_remove, lo saca
						res.status(200).json({ message: "Categoria borrada" });
					})
			})
	}else{
		res.status(401).json({msg:"Unauthorized"});
	}	
})


// Ruta para "eliminar" productos

server.delete("/:id",passport.authenticate("jwt",{session:false}), async (req, res) => {
	if(req.user.isAdmin && req.user.isAdmin === true || req.user.isAdmin==='true' ){
		const {id}= req.params
		const product = await Product.findOne({
			where:{
				id:id
			}
		})
		
		if (!product) {
			res.json({ message: "El id especificado no existe o contiene errores." });
		} else {
			const productDelete = await product.destroy();

			//conseguir imagen anterior  que esta en la base de datos
			var fileNameAntiguo = product.img;
			var ultimoSlash = fileNameAntiguo.lastIndexOf("/"); 
			fileNameAntiguo=fileNameAntiguo.substring(ultimoSlash+1);
			//borrar la imagen del servidor
			if(fileNameAntiguo !== 'producto-sin-foto.jpg')
			await pipeline(fs.unlink(`${__dirname}/../upload/img/${fileNameAntiguo}`,function(){console.log('')})).catch(e=>{console.log(e)});
			return res.json({productDelete,msg:'Producto eliminado'});
		}
	}else{
		res.status(401).json({msg:"Unauthorized"});
	}
});

// Ruta para obtener detalles de un producto específico con reviews, lineOrder y sus categorías

server.get('/:id', (req, res) => {
	Product.findOne({
		where: {
			id: req.params.id
		},
		include: {
			all: true
		}
	})
		.then(products => {
			res.send(products)
		})
});

// Ruta para obtener todos los productos de X categoría

server.get("/category/:nombreCat", (req,res) => {
	const name = req.params.nombreCat;
	Product.findAll ({
		include: {
			model: Categories,
			where : {name}
		}
	})
	.then ((products => {
		if (!products[0]) { //Comprueba si el array esta vació
			return res.status(400).json({message : "No se encontraron productos"})
		}
		res.status(201).json(products)
	}))
})

// Ruta para obtener las reviews de un producto

server.post('/:id/review', (req, res) => {
	let { description, rating, userId } = req.body
	const productId = req.params.id;
	if(userId) {
	Reviews.create({
		description: description,
		rating: rating,
		userId
	})
		.then(newReview => {
			
			newReview.setProduct(productId);
			newReview.setUser(userId);
			res.status(201).send(newReview);
		})
		.catch(err => res.status(400).send(err));
	}
	else if(!userId){
		res.status(400).send('Tiene que existir el usuario para agregar una Review')
	}
});

// Ruta para modificar una review

server.put('/:id/review/:idReview', (req, res) => {
	const { id, idReview } = req.params;
	const { description, rating } = req.body;

	// Busca una review con ese id
	Reviews.findOne({ where: { id: idReview, productId: id }})
		.then(review => {
		// Si no existe
			if(!review) {
				res.send("No existe una review con ese id");
			} else {
				// Si existe
				review.update({
					description,
					rating
				}).then(reviewAct => {
					if(reviewAct) {
						res.status(200).json({ msj: `Review actualizada correctamente` })
					}
				}).catch(e => {
					res.status(400).json(e);
				})
			}
		}).catch(e => {
			res.status(400).json(e);
		})
});

// Ruta para eliminar una review

server.delete('/:id/review/:idReview', (req, res) => {
	const { id, idReview } = req.params;
	// Busca una review
	Reviews.findOne({ where: { id: idReview, productId: id} })
		.then(review => {
			// Corrobora si existe para destruirla
			if(!review) {
				res.status(200).json({ msg: "No existe dicha review" });
			} else {
				review.destroy().then(reviewDestroyed => {
					res.status(200).json({ msg: "Review eliminada correctamente"});
				})
			}
		})
});

// Ruta para obtener todas las reviews de un producto

server.get('/:id/reviews', (req, res) => {
	Reviews.findAll({
		where: {
			productId: req.params.id
		},
		include: {
				model: User
		}
	})
		.then(products => {
			res.send(products)
		})
});

module.exports = server;
