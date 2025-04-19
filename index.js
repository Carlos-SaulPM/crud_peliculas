const express = require("express");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT;

const path = require("path");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const fileUpload = require("express-fileupload");
const fs = require("fs");

const { peliculaApiRouter } = require("./routers");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(morgan("tiny"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(fileUpload());

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/api", peliculaApiRouter);

app.use((error, req, res, next) => {
  console.error("MIDDLEWARE ERROR:",error);
 res.status(error.status).json({
   error: {
     mensaje: error.message,
     status: error.status,
   },
 });
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
