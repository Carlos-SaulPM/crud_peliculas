const express = require("express");
const path = require("path");
const { peliculaRepository } = require("../repositories");
const { peliculaModel } = require("../models");
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
}


//LISTOS
//Obtener peliculas
router.get("/", async (req, res, next) => {
  let { pagina = 1, limite = 10, estado = "todos" } = req.query;
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
  let offset = Number((pagina - 1) * limite);

  const configuracion = {
    limite,
    offset,
  };

  let respuesta = null;
  if (estado === "visto") {
    respuesta = await peliculaRepository.obtenerPeliculasVistas(configuracion);
  } else {
    respuesta = await peliculaRepository.obtenerPeliculas(configuracion);
  }
  if (!respuesta.success) return next(respuesta.error);

  return res.render("index", { peliculas: respuesta.result });
});

//AGREGAR - VISTA
router.get("/pelicula/agregar", (req, res) => { 
  res.render("pelicula/manipularPelicula", {
    titulo: "Agregar Pelicula",
    infoVista: { actionForm: "/pelicula/guardar", nombreBoton: "Guardar" },
    pelicula: null
  });
});

//GUARDAR
router.post("/pelicula/guardar", async (req, res, next) => {
  console.log(req.body);
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
  const { name: nombreImagen, mimetype } = portadaPelicula;
  let rutaImagenAlmacen = path.join(RUTA_ALMACEN, nombreImagen);
  await moverArchivo(portadaPelicula, rutaImagenAlmacen);
  let rutaImagenURL = `/almacen/${nombreImagen}`;
  //Se registra en el repositorio
  const resultado = await peliculaRepository.subirPelicula(
    peliculaModel.peliculaParaGuardar(
      titulo,
      sinopsis,
      rutaImagenURL,
      mimetype,
      url_trailer
    )
  );

  if (!resultado.success) {
    resultado.error.status = 409;
    return next(resultado.error);
  }

  res.redirect("/");
});


//OBTENER - VISTA
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
  res.render("pelicula/vistaPelicula", { pelicula });
});

router.get("/pelicula/modificar/:id", async (req,res,next) => {
  const id_pelicula = Number(req.params.id);
  const result = await peliculaRepository.obtenerPelicula(new peliculaModel(id_pelicula));
  if (!result.success) return next(result.error);
  res.render("pelicula/manipularPelicula", {
    titulo: "Modificar Pelicula",
    infoVista: { actionForm: "/pelicula/modificar", nombreBoton: "Modificar" },
    pelicula: result.peliculaDb.toJSON(),
  });
})


//FIN_LISTOS




//Modificar pelicula
router.post("/pelicula/modificar", async (req, res, next) => {
  const { titulo, sinopsis, id_trailer, url_trailer, id_imagen } = req.body;
  const id_pelicula = Number(req.params.id);

  if (
    !titulo ||
    !sinopsis ||
    !url_trailer ||
    !req.files.portada_pelicula ||
    !id_pelicula ||
    Array.isArray(req.files.portada_pelicula)
  ) {
    const error = new Error(
      Array.isArray(req.files.portada_pelicula)
        ? "Solo se permite una imagen"
        : "Faltaron datos para procesar su solicitud"
    );
    error.status = 400;
    if (!req.files.portada_pelicula) {
      error.message = "No subio la portada de la pelicula";
    }
    return next(error);
  }
  const portadaPelicula = req.files.portada_pelicula;
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
