const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const { createDatabase } = require("./db");
const repos = require("./repositories");
const { createServices } = require("./services");
const { createRoutes } = require("./routes");
const { createSensorService } = require("./services/sensores");

function createGranoksServer(options = {}) {
  const dbPath = options.dbPath || path.join(__dirname, "..", "granoks.db");
  const db = createDatabase(dbPath);
  const services = createServices(db, repos);

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { pingInterval: 10000, pingTimeout: 5000 });

  app.use(express.json({ limit: "50kb" }));
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.use(createRoutes({ db, repos, services, io }));

  io.on("connection", (socket) => {
    console.log("Cliente:", socket.id);
    socket.on("disconnect", () => console.log("Desconectado:", socket.id));
  });

  const sensorService = createSensorService(io);

  async function close() {
    sensorService.stop();
    io.close();
    await new Promise((resolve) => server.close(resolve));
    db.close();
  }

  return { app, server, io, db, listen: server.listen.bind(server), close };
}

module.exports = { createGranoksServer };
