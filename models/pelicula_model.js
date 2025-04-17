class PeliculaModel {
  //Atributos privados
  #id_pelicula;
  #titulo;
  #sinopsis;
  #id_imagen;
  #url_imagen;
  #id_trailer;
  #url_trailer;

  /**
   *
   * @param {Number} id_pelicula
   * @param {String} titulo
   * @param {String} sinopsis
   * @param {Number} id_imagen
   * @param {String} url_imagen
   * @param {Number} id_trailer
   * @param {String} url_trailer
   */
  constructor(
    id_pelicula,
    titulo,
    sinopsis,
    id_imagen,
    url_imagen,
    id_trailer,
    url_trailer
  ) {
    if (
      typeof id_pelicula !== "number" ||
      typeof id_imagen !== "number" ||
      typeof id_trailer !== "number"
    )
      throw new Error("Parametros id no son numberos");
    this.#id_pelicula = id_pelicula;
    this.#titulo = titulo;
    this.#sinopsis = sinopsis;
    this.#id_imagen = id_imagen;
    this.#url_imagen = url_imagen;
    this.#id_trailer = id_trailer;
    this.#url_trailer = url_trailer;
  }

  /**
   *
   * @param {String} titulo
   * @param {String} sinopsis
   * @param {String} url_imagen
   * @param {String} url_trailer
   * @returns {PeliculaModel}
   */
  static peliculaParaGuardar(titulo, sinopsis, url_imagen, url_trailer) {
    return new PeliculaModel(
      null,
      titulo,
      sinopsis,
      null,
      url_imagen,
      null,
      url_trailer
    );
  }

  /**
   *
   * @param {Number} id_pelicula
   * @param {String} titulo
   * @param {String} sinopsis
   * @param {Number} id_imagen
   * @param {String} url_imagen
   * @param {Number} id_trailer
   * @param {String} url_trailer
   * @returns {PeliculaModel}
   */
  static peliculaParaObtener(
    id_pelicula,
    titulo,
    sinopsis,
    id_imagen,
    url_imagen,
    id_trailer,
    url_trailer
  ) {
    id_pelicula = this.#validarEntero(id_pelicula);
    id_imagen = this.#validarEntero(id_imagen);
    id_trailer = this.#validarEntero(id_trailer);
    return new PeliculaModel(
      id_pelicula,
      titulo,
      sinopsis,
      id_imagen,
      url_imagen,
      id_trailer,
      url_trailer
    );
  }

  toJSON() {
    return {
      id_pelicula: this.#id_pelicula,
      titulo: this.#titulo,
      sinopsis: this.#sinopsis,
      id_imagen: this.#id_imagen,
      url_imagen: this.#url_imagen,
      id_trailer: this.#id_trailer,
      url_trailer: this.#url_trailer,
    };
  }

  /**
   *
   * @param {Number} valor
   * @param {String} nombreCampo
   * @returns {Number}
   */
  static #validarEntero(valor, nombreCampo) {
    valor = Number(valor);
    if (typeof valor !== "number" || !Number.isInteger(valor) || valor < 0) {
      throw new Error(`${nombreCampo} debe ser un entero positivo.`);
    }
    return valor;
  }

  get getIdPelicula() {
    return this.#id_pelicula;
  }

  get getTitulo() {
    return this.#titulo;
  }

  get getSinopsis() {
    return this.#sinopsis;
  }

  get getIdImagen() {
    return this.#id_imagen;
  }

  get getUrlImagen() {
    return this.#url_imagen;
  }

  get getIdTrailer() {
    return this.#id_trailer;
  }

  get getUrlTrailer() {
    return this.#url_trailer;
  }
}

module.exports = PeliculaModel;