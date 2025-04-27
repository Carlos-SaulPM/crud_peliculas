const { pool } = require("../config");
const { peliculaModel } = require("../models");
const PeliculaModel = require("../models/pelicula_model");

class PeliculaEntity {
  /**
   *
   * @param {PeliculaModel} pelicula
   * @returns {{success: Boolean, pelicula: PeliculaModel}}
   */

  static async subirPelicula(pelicula) {
    const query = "call sp_insertar_pelicula(?,?,?,?,?);";
    try {
      const [result] = await pool.query(query, [
        pelicula.getTitulo,
        pelicula.getSinopsis,
        pelicula.getUrlImagen,
        pelicula.getMimetype,
        pelicula.getUrlTrailer,
      ]);

      if (result.affectedRows <= 0) {
        throw new Error("No se pudo subir la pelicula");
      }
      return { success: true, result, pelicula };
    } catch (error) {
      console.error("Error en subirPelicula:", error);
      return { success: false, error };
    }
  }

  /**
   * @param {PeliculaModel} pelicula
   * @returns {{success: Boolean, peliculaDb: PeliculaModel}}
   */

  static async obtenerPelicula(pelicula) {
    try {
      let query = "call sp_obtener_pelicula(?);";
      const [result] = await pool.query(query, [pelicula.getIdPelicula]);
      if (!result[0].length) {
        throw new Error("No se encontro la pelicula");
      }
      let peliculaDb = result[0][0];
      peliculaDb = peliculaModel.peliculaParaObtener(
        pelicula.getIdPelicula,
        peliculaDb.titulo,
        peliculaDb.sinopsis,
        peliculaDb.id_imagen,
        peliculaDb.url_imagen,
        peliculaDb.getMimetype,
        peliculaDb.id_trailer,
        peliculaDb.url_trailer
      );
      return { success: true, peliculaDb };
    } catch (error) {
      console.error("Repository obtenerPelicula:", error);
      return { success: false, error };
    }
  }

  /**
   *
   * @param {PeliculaModel} pelicula
   * @returns {{success: Boolean, result: {status: String, cambios: [{key: String, valorViejo: String, valorNuevo: String}]}}}
   */
  //PENDIENTE
  static async modificarPelicula(pelicula) {
    let peliculaEncontrada = await this.obtenerPelicula(pelicula);
    if (!peliculaEncontrada.success) throw peliculaEncontrada.error;

    peliculaEncontrada = peliculaEncontrada.peliculaDb;
    let peliculaEncontradaJSON = peliculaEncontrada.toJSON();
    console.log("PELI encontrada:",peliculaEncontradaJSON);
    if (
      !peliculaEncontrada ||
      Object.values(peliculaEncontrada.toJSON()).length <= 1
    ) {
      const error = new Error(
        `La película con id ${pelicula.getIdPelicula} no se encuentra en la DB y no se puede modificar`
      );
      error.status(404);
      throw error;
    }
    let detallesDeCambio = []
    let peliculaJSON = pelicula.toJSON();
    for (const [key, value] of Object.entries(peliculaEncontradaJSON)) {
      // console.log("Llave",key);
      // console.log("PE",peliculaEncontradaJSON[key],"PM\n", pelicula[key]);
      if (peliculaEncontradaJSON[key] !== peliculaJSON[key] && peliculaJSON[key]!== null) {
        detallesDeCambio.push(key);
      }
    }
    // console.log("CAMBIOS: ", detallesDeCambio);
    let queryPelicula =
      "UPDATE pelicula SET titulo = ?, sinopsis = ? WHERE id_pelicula =?";
    let queryImagenPelicula = "";
    let queryTrailerPelicula = "";
    if (detallesDeCambio.includes("url_imagen")) {
      queryImagenPelicula = "UPDATE imagen_pelicula SET url_imagen = ?, mimetype=? WHERE id_imagen = ?"
      await pool.query(queryImagenPelicula, [pelicula.getUrlImagen, pelicula.getMimetype, pelicula.getIdImagen]);
    }

    if (detallesDeCambio.includes("url_trailer")) {
      queryTrailerPelicula =
        "UPDATE trailer_pelicula SET url_trailer = ?, fecha = CURRENT_TIMESTAMP WHERE id_trailer = ?";
      await pool.query(queryTrailerPelicula, [
        pelicula.getUrlTrailer,
        pelicula.getIdTrailer,
      ]);
    }
    await pool.query(queryPelicula, [pelicula.getTitulo, pelicula.getSinopsis, pelicula.getIdPelicula]);

    return {
      success: true,
      result: {
        status: "Película modificada correctamente",
        cambios: detallesDeCambio,
      },
    };
  }

  static async eliminarPelicula(pelicula) {
    let query = "UPDATE pelicula SET activo = ? WHERE id_pelicula = ?";
    try {
      const result = pool.query(query, [false, pelicula.getIdPelicula]);

      if (result.affectedRows <= 0) {
        const error = new Error("No se pudo eliminar la pelicula");
        error.status = 400;
        throw error;
      }
      return {
        success: true,
        result,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error,
      };
    }
  }

  /**
   *
   * @param {{offset: Number, pagina: Number}} configuracion
   * @returns {{success: Boolean, result: []}}
   */
  static async obtenerPeliculas(configuracion) {
    try {
      let query = "CALL sp_obtener_peliculas(?,?)";
      const [[peliculas]] = await pool.query(query, [
        configuracion.limite,
        configuracion.offset,
      ]);
      if (!peliculas) {
        const error = new Error("No se pudo recuperar las peliculas");
        error.status = 404;
        throw error;
      }
      return {
        success: true,
        result: peliculas,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error,
      };
    }
  }

  /**
   *
   * @param {{offset: Number, pagina: Number, estado: Boolean}} configuracion
   * @returns {{success: Boolean, result: []}}
   */
  static async obtenerPeliculasVistas(configuracion) {
    try {
      let query = "CALL sp_obtener_peliculas_vistas(?,?)";
      const [[peliculas]] = await pool.query(query, [
        configuracion.limite,
        configuracion.offset,
      ]);
      if (!peliculas) {
        const error = new Error("No se pudo recuperar las peliculas");
        error.status = 404;
        throw error;
      }
      return {
        success: true,
        result: peliculas,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error,
      };
    }
  }

  /**
   *
   * @param {PeliculaModel} pelicula
   * @returns {{success: Boolean, visto: Boolean}}
   */
  static async peliculaVista(pelicula) {
    try {
      let query =
        "SELECT id_pelicula FROM pelicula WHERE id_pelicula = ? AND visto=? AND activo = ?";
      const result = await pool.query(query, [pelicula.getIdPelicula, true, true]);
      if (!result[0]) {
        throw new Error(
          "Ocurrio un error al recuperar el estado de la pelicula en la base de datos"
        );
      }

      return {
        success: true,
        estado_vista: result[0].length <= 0 ? false : true,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error,
      };
    }
  }

  /**
   *
   * @param {{busqueda: String, limite: Number, offset: Number}} pelicula
   */
  static async buscarPeliculas(configuracion) {
    try {
      let query = "CALL sp_buscar_peliculas(?,?,?)";
      const [result] = await pool.query(query, [
        configuracion.busqueda,
        configuracion.limite,
        configuracion.offset,
      ]);
      if (!result[0]) {
        throw new Error(
          "Ocurrio un error buscar las peliculas en la base de datos"
        );
      }
      return {
        success: true,
        result: result[0],
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error,
      };
    }
  }

  static async buscarPeliculasVistas(configuracion) {
    try {
      let query = "CALL sp_buscar_peliculas_vistas(?,?,?)";
      const [result] = await pool.query(query, [
        configuracion.busqueda,
        configuracion.limite,
        configuracion.offset,
      ]);
      if (!result[0]) {
        throw new Error(
          "Ocurrio un error buscar las peliculas en la base de datos"
        );
      }
      console.log("BUSCAR PELICULAS VISTAS RP:", result);

      return {
        success: true,
        result: result[0],
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error,
      };
    }
  }

  static async contarPeliculas() {
    try {
      const [[[{ total }]]] = await pool.query("CALL sp_contar_peliculas()");
      return { success: true, result: total };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async contarPeliculasVistas() {
    try {
      const [[[{ total }]]] = await pool.query(
        "CALL sp_contar_peliculas_vistas()"
      );
      return { success: true, result: total };
    } catch (error) {
      return { success: false, error };
    }
  }
}

module.exports = PeliculaEntity;
