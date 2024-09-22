
const data = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "ztest3251@gmail.com",
        pass: "xbvb ilnz yvfo zxhg",
    },
}

let count = 0
let date = new Date()
const cron = require('node-cron');
const nodemailer = require('nodemailer');

// Configura el transporte de nodemailer
const transporter = nodemailer.createTransport(data);



// Función para enviar el correo
const enviarCorreo = () => {
    const mailOptions = {
        from: 'ztest3251@gmail.com',
        to: 'tabletalcatel169@gmail.com',
        subject: `Recordatorio`,
        html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recordatorio</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 50px auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #4CAF50;
      text-align: center;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      color: #333;
      text-align: center;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    .footer a {
      color: #4CAF50;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Recordatorio número ${count}</h1>
    <p>${date}</p>
    <p>Este recordatorio se programó para esta fecha y hora con Node.js, Nodemailer y cron.</p>
    <div class="footer">
      <p>Creado por Victor</p>
    </div>
  </div>
</body>
</html>
`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });
};

// Programa la tarea para ejecutarse cada hora
cron.schedule('*/3 * * * * *', () => {
    console.log('Enviando correo...');
    count = count + 1
    enviarCorreo();
});

// Inicia el servidor (por ejemplo, usando Express)
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Servidor ejecutando cron para enviar correos cada hora segundos');
});

app.listen(3000, () => {
    console.log('Servidor en el puerto 3000');
});
