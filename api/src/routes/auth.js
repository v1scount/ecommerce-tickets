const server = require('express').Router();
const { User } = require('../db.js');
const cors = require('cors')
const passport = require('passport');
const jwt = require('jsonwebtoken');
server.use(cors());
server.use(passport.initialize())
server.use(passport.session())
require('../passport-config')(passport);

//login
server.post('/', (req, res, next) => {

	passport.authenticate("local", { session: false }, (err, user, info) => {
		if (err) throw err;
		if (!user) res.status(400).json({ msg: 'Email o Password incorrecto' })
		else {
			req.login(user, { session: false }, err => {
				if (err) throw err;
				//crear y asignar un token
				const body = { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin, givenName: user.givenName, familyName: user.familyName, photoURL: user.photoURL }
				const token = jwt.sign({ user: body }, process.env.TOKEN_SECRET);
				res.header('auth-token', token).json({ token });
			});
		}
	})(req, res, next);
});


//Login con facebook
server.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
server.get('/auth/facebook/login_fb',
	passport.authenticate('facebook', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));

// Ruta para actualizar el rol de un usuario, para hacerlo administrador o sacarle ese rol
 
server.put('/auth/promote/:id', /* passport.authenticate("jwt", { session: false }), */(req, res) => {
	const { isAdmin } = req.body;
	User.update({ isAdmin },
		{ returning: true, where: { id: req.params.id } })
		.then(userPromoted => {
			res.send(userPromoted)
		})
})


server.get('/auth/google',
passport.authenticate('google', { scope: ['profile','email'] }));


server.get('/auth/google/login', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000/login');
  });


module.exports = server