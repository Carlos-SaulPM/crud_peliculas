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
      if (err) {
        err.status(400);
        err.message = "Ocurrio un error al almacenar el archivo";
        return reject(err);
      }
      resolve();
    });
  });
};

//Guardar pelicula
router.post("/pelicula/guardar", async (req, res, next) => {
  //body
  const { titulo, sinopsis, url_trailer } = req.body;
  if (
    !titulo ||
    !sinopsis ||
    !url_trailer ||
    !req.files.portadaPelicula ||
    Array.isArray(req.files.portadaPelicula)
  ) {
    const error = new Error(
      Array.isArray(req.files.portadaPelicula)
        ? "Solo se permite una imagen"
        : "Faltaron datos para procesar su solicitud"
    );
    error.status = 400;
    if (!req.files.portadaPelicula) {
      error.message = "No subió la portada de la película";
    }
    return next(error);
  }
  //Portada de la pelicula
  const portadaPelicula = req.files.portadaPelicula;
  const { name: nombreImagen, mimetype } = portadaPelicula;
  let rutaImagenAlmacen = path.join(RUTA_ALMACEN, nombreImagen);

  await moverArchivo(portadaPelicula, rutaImagenAlmacen);

  //Repositorio
  const resultado = await peliculaRepository.subirPelicula(
    peliculaModel.peliculaParaGuardar(
      titulo,
      sinopsis,
      rutaImagenAlmacen,
      mimetype,
      url_trailer
    )
  );

  if (!resultado.success) {
    resultado.error.status = 409;
    return next(resultado.error);
  }

  res.status(201).json({ mensaje: "Película guardada correctamente" });
});

//Modificar pelicula
router.post("/pelicula/modificar/:id", async (req, res, next) => {
  const { titulo, sinopsis, id_trailer, url_trailer, id_imagen } = req.body;
  const id_pelicula = Number(req.params.id);

  if (
    !titulo ||
    !sinopsis ||
    !url_trailer ||
    !req.files.portadaPelicula ||
    !id_pelicula ||
    Array.isArray(req.files.portadaPelicula)
  ) {
    const error = new Error(
      Array.isArray(req.files.portadaPelicula)
        ? "Solo se permite una imagen"
        : "Faltaron datos para procesar su solicitud"
    );
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
      mimetype,
      Number(id_trailer),
      url_trailer
    )
  );

  if (!resultado.success) return next(resultado.error);

  await moverArchivo(portadaPelicula, rutaImagenAlmacen)
    .then(() => {
      res
        .status(200)
        .json({ mensaje: "Datos actualizados", resultado: resultado.result });
    })
    .catch((error) => next(error));
});

//Obtener pelicula
router.get("/pelicula/:id", async (req, res, next) => {
  const id_pelicula = Number(req.params.id);
  const respuesta = await peliculaRepository.obtenerPelicula(
    new peliculaModel(id_pelicula)
  );
  if (!respuesta.success) {
    respuesta.error.status = 404;
    return next(respuesta.error);
  }
  res.status(200).json({ pelicula: respuesta.peliculaDb });
});

//Obtener peliculas
router.get("/peliculas", async (req, res, next) => {
  let pagina = 1;
  let limite = 10;
  let offset = Number((pagina - 1) * limite);
  const configuracion = {
    limite,
    offset,
  };
  const respuesta = await peliculaRepository.obtenerPeliculas(configuracion);
  if (!respuesta.success) next(respuesta.error);

  res.status(200).json({ peliculas: respuesta.result });
});

//Eliminar pelicula
router.get("/pelicula/eliminar/:id", async (req, res, next) => {
  const id_pelicula = Number(req.params.id);
  const result = await peliculaRepository.eliminarPelicula(
    new peliculaModel(id_pelicula)
  );
  if (!result.success) return next(result.error);

  res.status(200).json({ result });
});
module.exports = router;
