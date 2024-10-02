import express from "express";
import router from "./router";
import db from "./config/db";
import colors from "colors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";

// Conectar a la BD
(async function conectarBD() {
    try {
        await db.authenticate();
        db.sync();
        console.log(colors.blue("--------------------------------------------"));
        console.log(colors.blue.bold("🐘 Conexión exitosa a la Base De Datos"));
        console.log(colors.blue("--------------------------------------------"));
    } catch (error) {
        console.log(colors.red("--------------------------------------------"));
        console.log(colors.red.bold(`💀 Error al conectar a la BD: ${error}`));
        console.log(colors.red("--------------------------------------------"));
    }
})(); // Mandarla a llamar imediatamente

const server = express(); // Instancia de express
server.use(express.json()); // Leer datos de formularios (activar req.body)

// Permitir CORS
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (origin === process.env.FRONTEND_URL || process.env.BACKEND_URL) {
            callback(null, true);
        } else {
            callback(new Error("Error de CORS"), false);
        }
    },
};
server.use(cors(corsOptions));

// Uso de morgan para ver los logs de las consultas en consola
server.use(morgan("dev"));

// Rutas de "router" para products
server.use("/api/products", router);

// Ruta para la documentacion
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Exportacion del servidor
export default server;
