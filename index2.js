const express = require("express");
const path = require("path");
const app = express();
const axios = require('axios');

//cors
const cors = require('cors')
app.use(cors())

// //env
// const { config } = require("../config/confi");

//Routes
// const routerApi = require("./routes");

// Middleware para parsear JSON
app.use(express.json());

// Sirve los archivos estáticos del directorio 'frontend/dist'
// app.use(express.static(path.join(__dirname, "../dist")));



// Manejar todas las rutas no API y servir el frontend
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../dist", "index.html"));
// });

app.get("/", async (req, res) => {
    try {
        console.log("entre al token zoho");
        const response = await axios.get('https://shop.interconnecta.dev/api/stores', {
            headers: {
                "Content-Type": "application/json",
                "Authtoken": 'f734df3d968cde70abbb1cf79d9dba'
            }
        });

        const responseData = response.data;
        console.log(responseData);
        res.status(200).send({resp: responseData});
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(400).send({error: error.message});
    }
});

// routerApi(app);

// Iniciar el servidor
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});