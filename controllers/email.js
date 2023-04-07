const router = require('express').Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
        from: `${name} <${email}>`, // sender address
        to: '2023cakehouse@gmail.com', // list of receivers
        subject: 'Contact form message ✔', // Subject line
        text: message, // plain text body
    });
    res.json(nodemailer.getTestMessageUrl(info));
});

module.exports = router;
