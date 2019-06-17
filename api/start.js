const express = require("express");
const consola = require("consola");

const app = express();
const api = require("./").handler;

const host = process.env.HOST || "localhost";
const port = process.env.PORT_API || 3001;

// Listen the server
app.use("/api", api);
app.listen(port, host);
consola.ready({
  message: `API listening on http://${host}:${port}`,
  badge: true
});
