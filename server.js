const { createGranoksServer } = require("./src/granoks");

const { server } = createGranoksServer();
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("Granoks-Hub corriendo en http://localhost:" + PORT));
