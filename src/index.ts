import server from "./server";
import colors from "colors";

// Activar server
const port = process.env.PORT || 4000;
server.listen(4000, () => {
    process.stdout.write("\x1Bc");
    console.log(colors.rainbow("--------------------------------------------"));
    console.log(colors.magenta.bold(`👻 Server activo en: http://localhost:${port}`));
    console.log(colors.rainbow("--------------------------------------------"));
});
