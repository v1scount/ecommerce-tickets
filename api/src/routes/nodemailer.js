const nodemailer = require('nodemailer');
const server = require('express').Router();

server.post('/send-emailCheckout', (req, res) => {
    const { email, products, price, username } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ecommercetickets@gmail.com',
            pass: 'Henryfy2021'
        }
    });
    
    const mailOptions = {
        from: 'ecommercetickets@gmail.com',
        to: email,
        subject: `Compra de ${username} en Henryfy`,
        text: `Su compra por ${products} por un total de ${price} fue exitosa, horas antes del evento se le enviara un mail con el link al stream`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            res.status(500).send(error.message);
            console.log(error);
        } else {
            console.log('Email enviado.');
            res.status(200).json(req.body)
        }
    })
});

module.exports = server;