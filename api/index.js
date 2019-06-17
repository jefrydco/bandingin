const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
// const mongoose = require("mongoose");

// const products = require("./routes/products");
const bukalapak = require("./routes/bukalapak");
const tokopedia = require("./routes/tokopedia");

const handleCors = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Authorization, X-Requested-With, Content-Type, Content-Length, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  if (req.method === "OPTIONS") {
    return res.end();
  }
  return next();
};

const app = express();
// mongoose.connect(
//   "mongodb://admin:admin@mongo:27017/bandingin?authSource=admin",
//   {
//     useNewUrlParser: true
//   }
// );

app.use(cors());
app.use(handleCors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined"));
// app.use(products);
app.use(bukalapak);
app.use(tokopedia);

module.exports = {
  path: "/api",
  handler: app
};
