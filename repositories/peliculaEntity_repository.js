const { pool } = require("../config");
const { peliculaModel } = require("../models");

class PeliculaEntity {
  /**
   *
   * @param {PeliculaModel} pelicula
   * @returns {{success: Boolean, result: QueryResult, pelicula: PeliculaModel}}
   */

  static async subirPelicula(pelicula) {
    const query = "call sp_insertar_pelicula(?,?,?,?);";
    try {
      const [result] = await pool.query(query, [
        pelicula.getTitulo,
        pelicula.getSinopsis,
        pelicula.getUrlImagen,
        pelicula.getUrlTrailer,
      ]);
      if (result.affectedRows <= 0) return { success: false };
      return { success: true, result, pelicula };
    } catch (error) {
      console.error("Error en subirPelicula:", error);
      return { success: false, error };
    }
  }

  /**
   * @param {PeliculaModel} pelicula
   * @returns {{success: Boolean, result:QueryResult, peliculaDb: PeliculaModel}}
   */

  static async obtenerPelicula(pelicula) {
    try {
      let query = "call sp_obtener_pelicula(?);";
      const [result] = await pool.query(query, [pelicula.getIdPelicula]);

      if (!result.length) {
        throw new Error("No se pudo obtener la pelicula");
      }
      let peliculaDb = result[0][0];

      peliculaDb = peliculaModel.peliculaParaObtener(
        pelicula.getIdPelicula,
        peliculaDb.titulo,
        peliculaDb.sinopsis,
        peliculaDb.id_imagen,
        peliculaDb.url_imagen,
        peliculaDb.id_trailer,
        peliculaDb.url_trailer
      );
      return { success: true, result, peliculaDb };
    } catch (error) {
      console.error("Error en obtenerPelicula:", error);
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
    if (!peliculaEncontrada.success) {
      peliculaEncontrada.error.status = 400;
      throw peliculaEncontrada.error;
    }

    peliculaEncontrada = peliculaEncontrada.peliculaDb;
    if (!peliculaEncontrada || Object.values(peliculaEncontrada.toJSON()).length <= 1)
      throw new Error(
        `La película con id ${pelicula.getIdPelicula} no se encuentra en la DB y no se puede modificar`
      );

    const valoresNuevos = pelicula.toJSON();
    const valoresViejos = peliculaEncontrada.toJSON();

    const propiedadesQuePuedenCambiar = [
      "titulo",
      "sinopsis",
      "url_imagen",
      "url_trailer",
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
        sql: `INSERT INTO imagen_pelicula (id_pelicula, url_imagen) VALUES (?, ?)`,
        params: [id, pelicula.getUrlImagen],
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
    let query = "Update pelicula SET activo = ? WHERE id_pelicula = ?";
    const [result] = pool.query(query, [false, pelicula.getIdPelicula]);
  }

  /**
   * 
   * @param {{offset: Number, pagina: Number}} configuracion 
   * @returns {{success: Boolean, result: []}}
   */
  static async obtenerPeliculas(configuracion) {
      console.log("CONFIGURACION: ", configuracion);
      let query = "CALL sp_obtener_peliculas(?,?)";
      const [[peliculas]] = await pool.query(query, [configuracion.limite, configuracion.offset]);
      if (!peliculas) {
        const error = new Error("No se pudo recuperar las peliculas")
        error.status = 404;
        return {
          success: false,
          error
        }
      }
      console.log(peliculas);
      return {
        success: true,
        result: peliculas
      }
      
    
  }
}

module.exports = PeliculaEntity;
