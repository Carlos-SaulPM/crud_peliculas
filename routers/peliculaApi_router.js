const express = require("express");
const path = require("path");
const { peliculaRepository } = require("../repositories");
const { peliculaModel } = require("../models");
const { error } = require("console");
const router = express.Router();

const RUTA_ALMACEN = path.join(__dirname, "../almacen");

const moverArchivo = (file, rutaDestino) => {
  return new Promise((resolve, reject) => {
    file.mv(rutaDestino, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

router.post("/pelicula/guardar", async (req, res, next) => {
  //body
  const { titulo, sinopsis, url_trailer } = req.body;
  if (!titulo || !sinopsis || !url_trailer || !req.files.portadaPelicula) {
    const error = new Error("Faltaron datos para procesar su solicitud");
    error.status = 400;
    if (!req.files.portadaPelicula) {
      error.message = "No subió la portada de la película";
    }
    return next(error);
  }
  //Portada de la pelicula
  const portadaPelicula = req.files.portadaPelicula;
  const { name: nombreImagen } = portadaPelicula;
  let rutaImagenAlmacen = path.join(RUTA_ALMACEN, nombreImagen);

  await moverArchivo(portadaPelicula, rutaImagenAlmacen);

  //Repositorio
  const resultado = await peliculaRepository.subirPelicula(
    peliculaModel.peliculaParaGuardar(
      titulo,
      sinopsis,
      rutaImagenAlmacen,
      url_trailer
    )
  );

  if (!resultado.success) {
    const error = new Error("No se pudo guardar la película");
    error.status = 409;
    error.message = resultado.error?.message || "Error desconocido en la DB";
    return next(error);
  }

  res.status(201).json({ mensaje: "Película guardada correctamente" });
});

router.post("/pelicula/modificar/:id", async (req, res, next) => {
  const { titulo, sinopsis, id_trailer, url_trailer, id_imagen } = req.body;
  const id_pelicula = Number(req.params.id);

  if (
    !titulo ||
    !sinopsis ||
    !url_trailer ||
    !req.files.portadaPelicula ||
    !id_pelicula
  ) {
    const error = new Error("Faltaron datos para procesar su solicitud");
    error.status = 400;
    if (!req.files.portadaPelicula) {
      error.message = "No subio la portada de la pelicula";
    }
    return next(error);
  }
  const portadaPelicula = req.files.portadaPelicula;
  const { name: nombreImagen, mimetype } = portadaPelicula;
  let rutaImagenAlmacen = path.join(RUTA_ALMACEN, nombreImagen);
  const resultado = await peliculaRepository.modificarPelicula(
    new peliculaModel(
      id_pelicula,
      titulo,
      sinopsis,
      Number(id_imagen),
      rutaImagenAlmacen,
      Number(id_trailer),
      url_trailer
    )
  );

  if (!resultado.success) {
    const error = new Error("No se pudo modificar la película");
    error.status = 400;
    error.message = resultado.error?.message || "Error desconocido en la DB";
    return next(error);
  }

  await portadaPelicula.mv(rutaImagenAlmacen, async (errorImage) => {
    if (errorImage) {
      let error = new Error(errorImage.message);
      error.mensaje = "Ocurrio un error al almacenar la pelicula";
      error.status = 200;
      return next(error);
    }
    res.status(200).json({ mensaje: "Datos actualizados" });
  });
});

router.get("/pelicula/:id", async (req, res, next) => {
  const id_pelicula = Number(req.params.id);
  const respuesta = await peliculaRepository.obtenerPelicula(
    new peliculaModel(id_pelicula)
  );
  if (!respuesta.success) {
    const error = new Error("No se pudo encontrar la película");
    error.status = 404;
    error.message = respuesta.error?.message || "Error desconocido en la DB";
    return next(error);
  }
  res.status(200).json({ pelicula: respuesta.peliculaDb });
});

router.get("/peliculas", async (req, res, next) => {
  let pagina = 1;
  let limite=10
  let offset = Number((pagina - 1) * limite);
  const configuracion = {
    limite,
    offset
  }
  const respuesta = await peliculaRepository.obtenerPeliculas(configuracion);
  if (!respuesta.success) next(respuesta.error);

  res.status(200).json({peliculas: respuesta.result})
});

module.exports = router;
