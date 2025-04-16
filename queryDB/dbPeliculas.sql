SET NAMES 'UTF8MB4';
DROP DATABASE IF EXISTS dbPeliculas;
CREATE DATABASE IF NOT EXISTS dbPeliculas DEFAULT CHARACTER SET UTF8MB4;
USE dbPeliculas;
 
CREATE TABLE pelicula(
id_pelicula     INT NOT NULL AUTO_INCREMENT,
titulo          VARCHAR(100) NOT NULL,
sinopsis        VARCHAR(150) NOT NULL,
activo          BOOLEAN DEFAULT TRUE,
PRIMARY KEY(id_pelicula)
);

CREATE TABLE imagen_pelicula(
id_imagen     INT NOT NULL AUTO_INCREMENT,
id_pelicula   INT NOT NULL,
url_imagen    VARCHAR(150) NOT NULL,
fecha         DATE DEFAULT CURRENT_DATE(),
hora          TIME DEFAULT CURRENT_TIME(),
PRIMARY KEY(id_imagen),
CONSTRAINT fk_imagen_pelicula_pelicula FOREIGN KEY(id_pelicula) REFERENCES pelicula(id_pelicula)
)

CREATE TABLE trailer_pelicula(
id_trailer    INT NOT NULL AUTO_INCREMENT,
id_pelicula   INT NOT NULL,
url_trailer   VARCHAR(150) NOT NULL,
fecha         DATE DEFAULT CURRENT_DATE(),
hora          TIME DEFAULT CURRENT_TIME(),
PRIMARY KEY(id_trailer),
CONSTRAINT fk_trailer_pelicula_pelicula FOREIGN KEY(id_pelicula) REFERENCES pelicula(id_pelicula)
);

DELIMITER $$

CREATE PROCEDURE insertar_pelicula(
    IN p_titulo VARCHAR(100),
    IN p_sinopsis VARCHAR(150),
    IN p_url_imagen VARCHAR(150),
    IN p_url_trailer VARCHAR(150)
)
BEGIN
    DECLARE v_id_pelicula INT;
    DECLARE v_id_recurso_pelicula INT;

    INSERT INTO pelicula(titulo, sinopsis)
    VALUES(p_titulo, p_sinopsis);
    SET v_id_pelicula = LAST_INSERT_ID();

    INSERT INTO imagen_pelicula(id_pelicula, url_imagen)
    VALUES (v_id_pelicula, p_url_imagen);

    INSERT INTO trailer_pelicula(id_pelicula, url_trailer)
    VALUES(v_id_pelicula, p_url_trailer)
    
END $$


CREATE PROCEDURE obtener_vista_pelicula(
    IN p_id_pelicula INT
)
BEGIN
    SELECT 
        p.nombre,
        r.url_imagen,
        e.estado
    FROM pelicula p
    INNER JOIN recurso r ON p.id_recurso_pelicula = r.id_recurso_pelicula
    INNER JOIN estado e ON p.id_pelicula = e.id_pelicula
    WHERE p.id_pelicula = p_id_pelicula;
END $$


CREATE PROCEDURE obtener_pelicula(
    IN p_id_pelicula INT
)
BEGIN
    SELECT 
        p.nombre,
        p.descripcion,
        r.url_trailer,
        r.url_imagen,
        e.estado
    FROM pelicula p
    INNER JOIN recurso r ON p.id_recurso_pelicula = r.id_recurso_pelicula
    INNER JOIN estado e ON p.id_pelicula = e.id_pelicula
    WHERE p.id_pelicula = p_id_pelicula;
END $$

DELIMITER ;


