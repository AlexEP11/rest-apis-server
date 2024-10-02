import { exit } from "node:process";
import colors from "colors";
import db from "../config/db";

const clearDB = async () => {
    try {
        process.stdout.write("\x1Bc"); // Limpia la consola completamente
        await db.sync({ force: true }); // Force borra la BD
        console.log(colors.green("--------------------------------------------"));
        console.log(colors.green.bold("✅ Base De Datos eliminada"));
        console.log(colors.green("--------------------------------------------"));
        exit(0);
    } catch (error) {
        console.log(colors.yellow("--------------------------------------------"));
        console.log(colors.yellow.bold(`⚠️ Error al borrar la BD: ${error}`));
        console.log(colors.yellow("--------------------------------------------"));
        exit(1);
    }
};

// .argv es para ver la posicion de los comandos en package.json (pretest)
if (process.argv[2] === "--clear") {
    clearDB();
}
