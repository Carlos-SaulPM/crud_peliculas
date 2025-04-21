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
  let status = error.status || 400;
 res.render("error", {
   error: {
     titulo: "Ocurrio un error",
     mensaje: error.message,
     codigo: status,
   },
 });
  
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`http://localhost:${PORT}`);
});
