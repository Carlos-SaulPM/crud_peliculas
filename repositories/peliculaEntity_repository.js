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

  static async modificarPelicula(pelicula) {
    let peliculaEncontrada = await this.obtenerPelicula(pelicula);
    if (!peliculaEncontrada.success) throw peliculaEncontrada.error;

    peliculaEncontrada = peliculaEncontrada.peliculaDb;
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

    const valoresNuevos = pelicula.toJSON();
    const valoresViejos = peliculaEncontrada.toJSON();

    const propiedadesQuePuedenCambiar = [
      "titulo",
      "sinopsis",
      "url_imagen",
      "url_trailer",
      "mimetype",
    ];
    const propiedadesACambiar = [];
    const detallesDeCambio = [];

    for (const key of propiedadesQuePuedenCambiar) {
      if (
        valoresNuevos[key] !== undefined &&
        valoresNuevos[key] !== null &&
        valoresNuevos[key] !== valoresViejos[key]
      ) {
        propiedadesACambiar.push(key);
        detallesDeCambio.push({
          propiedad: key,
          viejo: valoresViejos[key],
          nuevo: valoresNuevos[key],
        });
      }
    }

    const queries = [];
    const id = pelicula.getIdPelicula;

    if (
      propiedadesACambiar.includes("titulo") ||
      propiedadesACambiar.includes("sinopsis")
    ) {
      const campos = [];
      const valores = [];

      if (propiedadesACambiar.includes("titulo")) {
        campos.push("titulo = ?");
        valores.push(pelicula.getTitulo);
      }

      if (propiedadesACambiar.includes("sinopsis")) {
        campos.push("sinopsis = ?");
        valores.push(pelicula.getSinopsis);
      }

      queries.push({
        sql: `UPDATE pelicula SET ${campos.join(", ")} WHERE id_pelicula = ?`,
        params: [...valores, id],
      });
    }

    if (propiedadesACambiar.includes("url_imagen")) {
      queries.push({
        sql: `INSERT INTO imagen_pelicula (id_pelicula, url_imagen, mimetype) VALUES (?, ?,?)`,
        params: [id, pelicula.getUrlImagen, pelicula.getMimetype],
      });
    }

    if (propiedadesACambiar.includes("url_trailer")) {
      queries.push({
        sql: `INSERT INTO trailer_pelicula (id_pelicula, url_trailer) VALUES (?, ?)`,
        params: [id, pelicula.getUrlTrailer],
      });
    }

    //Transaccion de queries, sirve para hacer un rollback
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const { sql, params } of queries) {
        await connection.query(sql, params);
      }

      await connection.commit();

      return {
        success: true,
        result: {
          status: "Película modificada correctamente",
          cambios: detallesDeCambio,
        },
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error en la modificación:", error);
      return { success: false, error };
    } finally {
      connection.release();
    }
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
        "SELECT id_estado_pelicula FROM estado_pelicula WHERE id_pelicula = ? AND activo = ?";
      const result = await pool.query(query, [pelicula.getIdPelicula, true]);
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
  static async buscarPeliculas(datos) {
    try {
      let query =
        "CALL sp_buscar_peliculas(?,?,?)";
      const result = await pool.query(query, [datos.busqueda, datos.limite, datos.offset]);
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
