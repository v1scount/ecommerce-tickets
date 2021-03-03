const server = require('express').Router();
const Stripe = require("stripe");
const cors = require("cors");
const { Order } = require('../db.js')

server.use(cors());

const stripe = new Stripe("sk_test_51I9eUyAGbg8RF4WLmHNJ7WIiy43MIDU4SNscprDsFHBG43M83woBhhFqzBitQ4qsVk84w6nsIALUXs4IUJ66WlXh00FzLq1GNV");

server.post('/api/checkout', async (req, res) => {
    const { id, amount, description, email } = req.body;

    try {
        const customer = await stripe.customers.create({
            email,
          });
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "ARS",
            description,
            customer: email,
            payment_method: id,
            confirm: true
        })
        console.log(payment)
        res.send({ message: payment })
    } catch (err) {
        console.log(err)
        res.json({ error: err.raw.message })
    }
})

module.exports = server;