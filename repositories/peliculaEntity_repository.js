const { pool } = require("../config");

class PeliculaEntity {
  /**
   *
   * @param {PeliculaModel} pelicula
   * @returns {{success: Boolean, result: QueryResult, pelicula: PeliculaModel}}
   */

  static async subirPelicula(pelicula) {
    let query = "call sp_insertar_pelicula(?,?,?,?);";
    const [result] = await pool.query(query, [
      pelicula.getTitulo,
      pelicula.getSinopsis,
      pelicula.getUrlImagen,
      pelicula.getUrlTrailer,
    ]);
    if (result.affectedRows <= 0) return { success: false };
    return { success: true, result, pelicula };
  }

  /**
   * @param {PeliculaModel} pelicula
   * @returns {{success: Boolean, result:QueryResult, pelicula: PeliculaModel}}
   */

  static async obtenerPelicula(pelicula) {
    let query = "call sp_obtener_pelicula(?);";
    const [result] = await pool.query(query, [pelicula.getIdPelicula]);

    if (!result.length) {
      return { success: false };
    }
    let peliculaDb = result[0];
    peliculaDb = PeliculaModel.peliculaParaObtener(
      pelicula.getIdPelicula,
      peliculaDb.titulo,
      peliculaDb.sinopsis,
      peliculaDb.id_imagen,
      peliculaDb.url_imagen,
      peliculaDb.id_trailer,
      peliculaDb.url_trailer
    );
    return { success: true, result, peliculaDb };
  }

  /**
   *
   * @param {PeliculaModel} pelicula
   * @returns {{success: Boolean, result: {status: String, cambios: [{key: String, valorViejo: String, valorNuevo: String}]}}}
   */

  static async modificarPelicula(pelicula) {
    const peliculaEncontrada = await this.obtenerPelicula(
      new PeliculaModel(pelicula.getIdPelicula)
    );
    if (!peliculaEncontrada || Object.values(peliculaEncontrada).length <= 1)
      throw new Error(
        `La película con id ${pelicula.getIdPelicula} no se encuentra en la DB y por ello no se puede modificar`
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
      throw error;
    } finally {
      connection.release();
    }
  }

  static async eliminarPelicula(pelicula) {
    let query = "Update pelicula SET activo = ? WHERE id_pelicula = ?";
    const [result] = pool.query(query, [false, pelicula.getIdPelicula]);
  }
}

module.exports = PeliculaEntity;