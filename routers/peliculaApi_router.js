const express = require("express");
const { peliculaRepository } = require("../repositories");
const { peliculaModel } = require("../models");
const router = express.Router();

router.post("/pelicula/guardar", async (req, res, next) => {
  peliculaRepository.subirPelicula(
    peliculaModel.peliculaParaGuardar(req.body.titulo, req.body.sinopsis)
  );
});

module.exports = router;
