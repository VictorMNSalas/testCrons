const data = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ztest3251@gmail.com",
    pass: "xbvb ilnz yvfo zxhg",
  },
};

let count = 0;
let date = new Date();
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const express = require("express");

const transporter = nodemailer.createTransport(data);

const app = express();
app.use(express.json()); // Para leer el cuerpo de las solicitudes en JSON

// Lista para almacenar los crons creados dinámicamente
const cronJobs = [];

// Función para enviar el correo
const enviarCorreo = (cronId) => {
  try {
    const mailOptions = {
      from: "ztest3251@gmail.com",
      to: "tabletalcatel169@gmail.com",
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
    <h1>Recordatorio número ${count} - ID del Cron: ${cronId}</h1>
    <p>${date}</p>
    <p>Este recordatorio se programó para esta fecha y hora con Node.js, Nodemailer y cron.</p>
    <div class="footer">
      <p>Creado por Victor</p>
    </div>
  </div>
</body>
</html>
`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error al enviar correo:", error);
      } else {
        console.log("Correo enviado:", info.response);
      }
    });
  } catch (error) {
    console.error("Error: ", error);
  }
};

// Programa la tarea para ejecutarse cada 14 minutos
cron.schedule("*/14 * * * *", () => {
  console.log("Enviando correo...");
  count = count + 1;
  enviarCorreo("main");
});

// Endpoint para crear nuevos crons dinámicamente
app.post("/crear-cron", (req, res) => {
  const { email, interval, desc, name } = req.body;

  if (!email || !interval || !desc || !name) {
    return res.status(400).json({ message: "Email e intervalo son requeridos" });
  }

  // Crear una nueva tarea cron dinámica
  const newCron = cron.schedule(interval, () => {
    console.log(`Enviando correo a ${email}...`);
    count = count + 1;

    // Modifica el mailOptions para enviar a diferentes destinatarios
    const mailOptions = {
      from: "ztest3251@gmail.com",
      to: email,
      subject: `Recordatorio dinámico`,
      html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recordatorio</title>
</head>
<body>
  <h1>Recordatorio dinámico</h1>
  <p>Este correo se envía a ${email} con una tarea cron programada.</p>
  <p>ID del cron: ${cronJobs.length}</p>
</body>
</html>
`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error al enviar correo dinámico:", error);
      } else {
        console.log("Correo dinámico enviado:", info.response);
      }
    });
  });

  // Almacenar el nuevo cron en la lista
  cronJobs.push({
    id: cronJobs.length,
    name,
    interval,
    description: desc,
    email,
    cron: newCron
  });


  res.json({
    message: "Cron creado exitosamente",
    cron_details: {
      id: cronJobs.length - 1,
      name, interval,
      description: desc,
      email
    }
  });
});

// Endpoint para listar crons
app.get("/listar-crons", (req, res) => {

  const list = cronJobs.map(({ cron, ...data }) => data);


  console.table(list)
  res.json({ crons: list });
});

// Inicia el servidor
app.get("/", (req, res) => {
  res.send("Servidor ejecutando cron para enviar correos cada 14 minutos");
});

// Endpoint para eliminar un cron dinámico por su ID
app.delete("/eliminar-cron/:id", (req, res) => {
  const cronId = parseInt(req.params.id, 10);

  if (isNaN(cronId) || cronId < 0 || cronId >= cronJobs.length) {
    return res.status(400).json({ message: "ID de cron inválido" });
  }


  // Detener el cron
  cronJobs[cronId].cron.stop();

  // Opcional: Eliminar el cron de la lista
  cronJobs.splice(cronId, 1);
  console.log(`Cron con ID ${cronId} eliminado`)
  res.json({ message: `Cron con ID ${cronId} eliminado` });
});


app.listen(3000, () => {
  console.log("Servidor en el puerto 3000");
});
