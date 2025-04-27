SET NAMES 'UTF8MB4';
DROP DATABASE IF EXISTS dbPeliculas;
CREATE DATABASE IF NOT EXISTS dbPeliculas DEFAULT CHARACTER SET UTF8MB4;

USE dbPeliculas;

CREATE TABLE pelicula (
    id_pelicula INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL UNIQUE,
    sinopsis VARCHAR(150) NOT NULL,
    visto BOOLEAN NOT NULL DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_pelicula)
);

CREATE TABLE imagen_pelicula (
    id_imagen INT NOT NULL AUTO_INCREMENT,
    id_pelicula INT NOT NULL,
    url_imagen VARCHAR(150) NOT NULL UNIQUE,
    mimetype VARCHAR(30) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_imagen),
    CONSTRAINT fk_imagen_pelicula_pelicula FOREIGN KEY (id_pelicula) REFERENCES pelicula(id_pelicula)
);

CREATE TABLE trailer_pelicula (
    id_trailer INT NOT NULL AUTO_INCREMENT,
    id_pelicula INT NOT NULL,
    url_trailer VARCHAR(150) NOT NULL UNIQUE,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_trailer),
    CONSTRAINT fk_trailer_pelicula_pelicula FOREIGN KEY (id_pelicula) REFERENCES pelicula (id_pelicula)
);

DELIMITER $$

CREATE PROCEDURE `sp_buscar_peliculas`(
  IN p_busqueda VARCHAR(100),
  IN p_limit INT,
  IN p_offset INT
)
BEGIN
  SELECT
    p.id_pelicula,
    p.titulo,
    p.sinopsis,
    ip.id_imagen,
    ip.url_imagen,
    ip.mimetype,
    tp.id_trailer,
    tp.url_trailer
  FROM pelicula p
  LEFT JOIN (
    SELECT ip1.*
    FROM imagen_pelicula ip1
    INNER JOIN (
      SELECT id_pelicula, MAX(fecha) AS max_fecha
      FROM imagen_pelicula
      GROUP BY id_pelicula
    ) ultima_ip ON ip1.id_pelicula = ultima_ip.id_pelicula
               AND ip1.fecha = ultima_ip.max_fecha
  ) ip ON p.id_pelicula = ip.id_pelicula
  LEFT JOIN (
    SELECT tp1.*
    FROM trailer_pelicula tp1
    INNER JOIN (
      SELECT id_pelicula, MAX(fecha) AS max_fecha
      FROM trailer_pelicula
      GROUP BY id_pelicula
    ) ultimo_tp ON tp1.id_pelicula = ultimo_tp.id_pelicula
                AND tp1.fecha = ultimo_tp.max_fecha
  ) tp ON p.id_pelicula = tp.id_pelicula
  WHERE (p.titulo LIKE CONCAT('%', p_busqueda, '%') 
     OR p.sinopsis LIKE CONCAT('%', p_busqueda, '%'))
    AND p.activo = TRUE
  ORDER BY p.titulo
  LIMIT p_limit OFFSET p_offset;
END $$

CREATE PROCEDURE `sp_buscar_peliculas_vistas`(
  IN p_busqueda VARCHAR(100),
  IN p_limit INT,
  IN p_offset INT
)
BEGIN
  SELECT
    p.id_pelicula,
    p.titulo,
    p.sinopsis,
    ip.id_imagen,
    ip.url_imagen,
    ip.mimetype,
    tp.id_trailer,
    tp.url_trailer
  FROM pelicula p
  LEFT JOIN (
    SELECT ip1.*
    FROM imagen_pelicula ip1
    INNER JOIN (
      SELECT id_pelicula, MAX(fecha) AS max_fecha
      FROM imagen_pelicula
      GROUP BY id_pelicula
    ) ultima_ip ON ip1.id_pelicula = ultima_ip.id_pelicula
               AND ip1.fecha = ultima_ip.max_fecha
  ) ip ON p.id_pelicula = ip.id_pelicula
  LEFT JOIN (
    SELECT tp1.*
    FROM trailer_pelicula tp1
    INNER JOIN (
      SELECT id_pelicula, MAX(fecha) AS max_fecha
      FROM trailer_pelicula
      GROUP BY id_pelicula
    ) ultimo_tp ON tp1.id_pelicula = ultimo_tp.id_pelicula
                AND tp1.fecha = ultimo_tp.max_fecha
  ) tp ON p.id_pelicula = tp.id_pelicula
  WHERE (p.titulo LIKE CONCAT('%', p_busqueda, '%') 
     OR p.sinopsis LIKE CONCAT('%', p_busqueda, '%'))
    AND p.visto = TRUE
    AND p.activo = TRUE
  ORDER BY p.titulo
  LIMIT p_limit OFFSET p_offset;
END$$

CREATE PROCEDURE `sp_contar_peliculas`()
BEGIN
  SELECT COUNT(*) AS total
  FROM pelicula
  WHERE activo = TRUE;
END$$

CREATE PROCEDURE `sp_contar_peliculas_vistas`()
BEGIN
  SELECT COUNT(*) AS total
  FROM pelicula p
  WHERE p.activo = TRUE AND p.visto = TRUE;
END$$

-- LISTO
CREATE PROCEDURE `sp_insertar_pelicula`(
    IN p_titulo VARCHAR(100),
    IN p_sinopsis VARCHAR(150),
    IN p_url_imagen VARCHAR(150),
    IN p_mimetype VARCHAR(30),
    IN p_url_trailer VARCHAR(150)
)
BEGIN
    DECLARE v_id_pelicula INT;

    INSERT INTO pelicula(titulo, sinopsis)
    VALUES(p_titulo, p_sinopsis);
    SET v_id_pelicula = LAST_INSERT_ID();

    INSERT INTO imagen_pelicula(id_pelicula, url_imagen, mimetype)
    VALUES (v_id_pelicula, p_url_imagen, p_mimetype);

    INSERT INTO trailer_pelicula(id_pelicula, url_trailer)
    VALUES(v_id_pelicula, p_url_trailer);
END$$
-- LISTO
CREATE PROCEDURE `sp_obtener_pelicula`(
    IN p_id_pelicula INT
)
BEGIN
    SELECT 
        p.titulo,
        p.sinopsis,
        ip.id_imagen,
        ip.url_imagen,
        ip.mimetype,
        tp.id_trailer,
        tp.url_trailer
    FROM pelicula p
    INNER JOIN imagen_pelicula ip ON p.id_pelicula = ip.id_pelicula
    INNER JOIN trailer_pelicula tp ON p.id_pelicula = tp.id_pelicula
    WHERE p.id_pelicula = p_id_pelicula AND p.activo = TRUE
    LIMIT 1;
END$$

CREATE PROCEDURE `sp_obtener_peliculas`(
  IN p_limit INT,
  IN p_offset INT
)
BEGIN
  SELECT
    p.id_pelicula,
    p.titulo,
    p.sinopsis,
    ip.id_imagen,
    ip.url_imagen,
    ip.mimetype,
    tp.id_trailer,
    tp.url_trailer
  FROM pelicula p
  LEFT JOIN (
    SELECT ip1.*
    FROM imagen_pelicula ip1
    INNER JOIN (
      SELECT id_pelicula, MAX(fecha) AS max_fecha
      FROM imagen_pelicula
      GROUP BY id_pelicula
    ) ultima_ip ON ip1.id_pelicula = ultima_ip.id_pelicula
               AND ip1.fecha = ultima_ip.max_fecha
  ) ip ON p.id_pelicula = ip.id_pelicula
  LEFT JOIN (
    SELECT tp1.*
    FROM trailer_pelicula tp1
    INNER JOIN (
      SELECT id_pelicula, MAX(fecha) AS max_fecha
      FROM trailer_pelicula
      GROUP BY id_pelicula
    ) ultimo_tp ON tp1.id_pelicula = ultimo_tp.id_pelicula
                AND tp1.fecha = ultimo_tp.max_fecha
  ) tp ON p.id_pelicula = tp.id_pelicula
  WHERE p.activo = TRUE
  LIMIT p_limit OFFSET p_offset;
END$$

CREATE PROCEDURE `sp_obtener_peliculas_vistas`(
    IN p_limit  INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        p.id_pelicula, 
        p.titulo, 
        p.sinopsis, 
        ip.id_imagen, 
        ip.url_imagen, 
        ip.mimetype, 
        tp.id_trailer, 
        tp.url_trailer
    FROM pelicula p
    LEFT JOIN (
        SELECT ip1.*
        FROM imagen_pelicula ip1
        INNER JOIN (
            SELECT id_pelicula, MAX(fecha) AS max_fecha
            FROM imagen_pelicula
            GROUP BY id_pelicula
        ) ultima_ip ON ip1.id_pelicula = ultima_ip.id_pelicula
                  AND ip1.fecha = ultima_ip.max_fecha
    ) ip ON p.id_pelicula = ip.id_pelicula
    LEFT JOIN (
        SELECT tp1.*
        FROM trailer_pelicula tp1
        INNER JOIN (
            SELECT id_pelicula, MAX(fecha) AS max_fecha
            FROM trailer_pelicula
            GROUP BY id_pelicula
        ) ultimo_tp ON tp1.id_pelicula = ultimo_tp.id_pelicula
                   AND tp1.fecha = ultimo_tp.max_fecha
    ) tp ON p.id_pelicula = tp.id_pelicula
    WHERE p.activo = TRUE
      AND p.visto = TRUE
    LIMIT p_limit OFFSET p_offset;
END

$$