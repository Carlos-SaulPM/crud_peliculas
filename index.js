const express = require("express");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT;

const path = require("path");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const fileUpload = require("express-fileupload");

const { peliculaApiRouter, peliculaRouter } = require("./routers");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(morgan("tiny"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(fileUpload());

app.use("/almacen", express.static(path.join(__dirname, "./almacen")))
app.use("/api", peliculaApiRouter);
app.use("/", peliculaRouter);

app.use((error, req, res, next) => {
 res.status(error.status || 400).json({
   error: {
     mensaje: error.message,
     status: error.status,
   },
 });
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
