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

const convertirYoutubeEmbed = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/
  );

  if (!match || !match[1]) return null;

  const videoId = match[1];
  return `https://www.youtube.com/embed/${videoId}`;
};

//Obtener peliculas
router.get("/peliculas", async (req, res, next) => {
  let {
    pagina = 1,
    limite = 10,
    estado = "todos",
    busqueda = null,
  } = req.query;
  pagina = Number(pagina);
  limite = Number(limite);
  if (
    (estado !== "todos" && estado !== "visto") ||
    Number.isNaN(pagina) ||
    Number.isNaN(limite)
  ) {
    const error = new Error("Parametros erroneos");
    error.status = 400;
    return next(error);
  }
  const offset = (pagina - 1) * limite;
  const configuracion = { limite, offset };

  const esBusqueda = busqueda !== null;
  if (esBusqueda) configuracion.busqueda = busqueda;

  const obtenerPeliculas = esBusqueda
    ? estado === "visto"
      ? peliculaRepository.buscarPeliculasVistas
      : peliculaRepository.buscarPeliculas
    : estado === "visto"
    ? peliculaRepository.obtenerPeliculasVistas
    : peliculaRepository.obtenerPeliculas;

  const contarPeliculas =
    estado === "visto"
      ? peliculaRepository.contarPeliculasVistas
      : peliculaRepository.contarPeliculas;

  let [respuesta, conteo] = await Promise.all([
    obtenerPeliculas(configuracion),
    contarPeliculas(),
  ]);

  if (!respuesta.success) return next(respuesta.error);
  if (!conteo.success) return next(conteo.error);

  conteo = esBusqueda ? respuesta.result.length : conteo.result;

  const totalPaginas = Math.ceil(conteo / limite);

  res.status(200).json({
    paginaActual: pagina,
    totalPaginas,
    estado,
    peliculas: respuesta.result,
  });
});

//Guardar pelicula
router.post("/pelicula/guardar", async (req, res, next) => {
  const { titulo, sinopsis, url_trailer } = req.body;
  //Verificando si los datos no son nulos
  if (
    !titulo ||
    !sinopsis ||
    !url_trailer ||
    !req.files.portada_pelicula ||
    Array.isArray(req.files.portada_pelicula) //Hace que solo acepte un archivo
  ) {
    const error = new Error(
      Array.isArray(req.files.portada_pelicula)
        ? "Solo se permite una imagen"
        : "Faltaron datos para procesar su solicitud"
    );
    error.status = 400;
    if (!req.files.portada_pelicula) {
      error.message = "No subió la portada de la película";
    }
    return next(error);
  }

  //Convierte el url de youtube en Embed, para poder insertar en el iframe.
  const embedUrl = convertirYoutubeEmbed(url_trailer);
  if (!embedUrl) {
    const error = new Error("El enlace del tráiler de YouTube no es válido");
    error.status = 400;
    return next(error);
  }

  //Almacena la portada de la pelicula.
  const portadaPelicula = req.files.portada_pelicula;
  const { name, mimetype } = portadaPelicula;
  let rutaImagenAlmacen = path.join(RUTA_ALMACEN, name);
  await moverArchivo(portadaPelicula, rutaImagenAlmacen);
  let rutaImagenURL = `/almacen/${name}`;
  //Se registra en el repositorio
  const resultado = await peliculaRepository.subirPelicula(
    peliculaModel.peliculaParaGuardar(
      titulo,
      sinopsis,
      rutaImagenURL,
      mimetype,
      embedUrl
    )
  );

  if (!resultado.success) {
    resultado.error.status = 409;
    return next(resultado.error);
  }

  res.status(201).json({
    mensaje: "Película guardada correctamente",
    pelicula: resultado.pelicula,
  });
});

//Modificar pelicula
router.post("/pelicula/modificar/:id", async (req, res, next) => {
  try {
    const id_pelicula = Number(req.params.id);
    const { titulo, sinopsis, id_trailer, url_trailer, id_imagen } = req.body;
    const archivoImagen = req.files?.portada_pelicula;
    if (!titulo || !sinopsis || !url_trailer || !id_pelicula) {
      const error = new Error("Faltaron datos para procesar su solicitud");
      error.status = 400;
      return next(error);
    }

    let rutaImagenURL = null;
    let mimetype = null;

    if (archivoImagen) {
      if (Array.isArray(archivoImagen)) {
        const error = new Error("Solo se permite una imagen");
        error.status = 400;
        return next(error);
      }

      const { name: nombreImagen, mimetype: tipo } = archivoImagen;
      const rutaAlmacen = path.join(RUTA_ALMACEN, nombreImagen);
      rutaImagenURL = `/almacen/${nombreImagen}`;
      mimetype = tipo;

      await moverArchivo(archivoImagen, rutaAlmacen);
    }

    const resultado = await peliculaRepository.modificarPelicula(
      new peliculaModel(
        Number(id_pelicula),
        titulo,
        sinopsis,
        Number(id_imagen),
        rutaImagenURL, // Puede ser null si no se actualiza imagen
        mimetype, // Puede ser null también
        Number(id_trailer),
        url_trailer
      )
    );

    if (!resultado.success) return next(resultado.error);

    res
      .status(200)
      .json({ mensaje: "Datos actualizados", cambios: resultado.result });
  } catch (error) {
    next(error);
  }
});

//Obtener pelicula
router.get("/pelicula/:id", async (req, res, next) => {
  const id_pelicula = Number(req.params.id);
  const respuesta = await peliculaRepository.obtenerPelicula(
    new peliculaModel(id_pelicula)
  );

  const peliculaVista = await peliculaRepository.peliculaVista(
    respuesta.peliculaDb
  );
  if (!respuesta.success || !peliculaVista.success) {
    const error = !respuesta.success ? respuesta.error : peliculaVista.error;
    error.status = 404;
    return next(error);
  }
  let pelicula = {
    ...respuesta.peliculaDb.toJSON(),
    estado_vista: peliculaVista.estado_vista,
  };
  res.status(200).json({ pelicula });
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
