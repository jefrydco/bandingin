import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
// import mongoose from "mongoose";

import products from "./routes/products";
import bukalapak from "./routes/bukalapak";

const app = express();
// mongoose.connect(
//   "mongodb://admin:admin@mongo:27017/bandingin?authSource=admin",
//   {
//     useNewUrlParser: true
//   }
// );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(products);
app.use(bukalapak);

export default {
  path: "/api",
  handler: app
};
