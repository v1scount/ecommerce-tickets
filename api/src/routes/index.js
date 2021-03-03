const { Router } = require('express');
// import all routers;
const productRouter = require('./product.js');
const categoriesRouter = require('./routesAddCategories');
const searchRouter = require('./search.js');
const userRouter = require("./user.js");
const orderRouter = require("./order.js");
const reviewsRouter = require("./reviews.js")
const auth = require('./auth.js')
const paymentRouter = require('./payment.js')
const emailRouter = require('./nodemailer.js');
/* const google = require('./google') */
const router = Router();

// load each router on a route
// i.e: router.use('/auth', authRouter);
// router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/categories', categoriesRouter);
router.use('/search', searchRouter);
router.use('/orders', orderRouter);
router.use('/user', userRouter);
router.use('/login', auth);
router.use('/reviews', reviewsRouter);
router.use('/payment', paymentRouter);
router.use('/email', emailRouter);

module.exports = router;
