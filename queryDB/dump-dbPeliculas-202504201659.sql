/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.21-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: dbPeliculas
-- ------------------------------------------------------
-- Server version	10.6.21-MariaDB-ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

SET NAMES 'UTF8MB4';
DROP DATABASE IF EXISTS dbPeliculas;
CREATE DATABASE IF NOT EXISTS dbPeliculas DEFAULT CHARACTER SET UTF8MB4;

USE dbPeliculas;

--
-- Table structure for table `estado_pelicula`
--

DROP TABLE IF EXISTS `estado_pelicula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_pelicula` (
  `id_estado_pelicula` int(11) NOT NULL AUTO_INCREMENT,
  `id_pelicula` int(11) NOT NULL,
  `activo` bit(1) DEFAULT b'1',
  `fechaHora` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_estado_pelicula`),
  KEY `fk_estado_pelicula_pelicula` (`id_pelicula`),
  CONSTRAINT `fk_estado_pelicula_pelicula` FOREIGN KEY (`id_pelicula`) REFERENCES `pelicula` (`id_pelicula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_pelicula`
--

LOCK TABLES `estado_pelicula` WRITE;
/*!40000 ALTER TABLE `estado_pelicula` DISABLE KEYS */;
/*!40000 ALTER TABLE `estado_pelicula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagen_pelicula`
--

DROP TABLE IF EXISTS `imagen_pelicula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagen_pelicula` (
  `id_imagen` int(11) NOT NULL AUTO_INCREMENT,
  `id_pelicula` int(11) NOT NULL,
  `url_imagen` varchar(150) NOT NULL,
  `mimetype` varchar(30) NOT NULL,
  `fecha` date DEFAULT curdate(),
  `hora` time DEFAULT curtime(),
  PRIMARY KEY (`id_imagen`),
  UNIQUE KEY `url_imagen` (`url_imagen`),
  KEY `fk_imagen_pelicula_pelicula` (`id_pelicula`),
  CONSTRAINT `fk_imagen_pelicula_pelicula` FOREIGN KEY (`id_pelicula`) REFERENCES `pelicula` (`id_pelicula`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagen_pelicula`
--

LOCK TABLES `imagen_pelicula` WRITE;
/*!40000 ALTER TABLE `imagen_pelicula` DISABLE KEYS */;
INSERT INTO `imagen_pelicula` VALUES (1,1,'/almacen/MV5BNThkYWE3OGItNzAyNC00N2U4LThjY2QtMGQwYjZhYTI1MzMwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg','image/jpeg','2025-04-20','15:22:09'),(2,2,'/almacen/image.jpg','image/jpeg','2025-04-20','15:22:53'),(3,3,'/almacen/the-conjuring-poster.jpg','image/jpeg','2025-04-20','15:23:48'),(4,4,'/almacen/the_pope_s_exorcist-660382735-large.jpg','image/jpeg','2025-04-20','15:28:36'),(5,5,'/almacen/avengers1.jpeg','image/jpeg','2025-04-20','15:31:31'),(6,6,'/almacen/snh_online_6072x9000_hero_03_opt.jpg','image/jpeg','2025-04-20','15:33:05'),(7,7,'/almacen/El_hobbit_1.webp','image/webp','2025-04-20','15:34:01'),(8,8,'/almacen/oppenheimer-OPR_Tsr1Sheet3_Look2_RGB_3_rgb.jpg','image/jpeg','2025-04-20','15:35:04'),(9,11,'/almacen/01.jpg','image/jpeg','2025-04-20','15:39:46'),(10,12,'/almacen/MV5BZDU0Yjk5MTctZDI3OS00YmM4LWIxOTMtYTU2NjYyYzdkMWJlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg','image/jpeg','2025-04-20','15:44:12'),(11,13,'/almacen/MV5BOTQzYzEwNWMtOTAwYy00YWYwLWE1NTEtZTkxOGQxZTM0M2VhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg','image/jpeg','2025-04-20','15:48:48'),(12,14,'/almacen/Resident_Evil_2002.jpg','image/jpeg','2025-04-20','15:51:51'),(13,15,'/almacen/221261.jpg','image/jpeg','2025-04-20','15:52:59'),(14,16,'/almacen/fast-y-furious-5.jpg','image/jpeg','2025-04-20','16:00:17'),(15,17,'/almacen/h4picpzCFtsHneRNZoObI6h6gRl.jpg','image/jpeg','2025-04-20','16:06:55'),(16,18,'/almacen/DragonBallSuperBroly.webp','image/webp','2025-04-20','16:10:20'),(17,19,'/almacen/Fast_Furious_7_A_todo_gas_7-300996801-large.jpg','image/jpeg','2025-04-20','16:11:05'),(18,20,'/almacen/Cars3.jpg','image/jpeg','2025-04-20','16:12:46'),(19,21,'/almacen/MV5BMTQ2NTMxODEyNV5BMl5BanBnXkFtZTcwMDgxMjA0MQ@@._V1_.jpg','image/jpeg','2025-04-20','16:14:51'),(20,22,'/almacen/Las_Locuras_Del_Emperador.webp','image/webp','2025-04-20','16:15:13'),(21,23,'/almacen/Batman_vs_Superman_Poster_Final.webp','image/webp','2025-04-20','16:17:07'),(22,24,'/almacen/Fast_Furious_8-874029893-large.jpg','image/jpeg','2025-04-20','16:17:21'),(23,25,'/almacen/m6qgYCDw54uND17gPMCd0DNXteZ-scaled.jpg','image/jpeg','2025-04-20','16:20:03'),(24,26,'/almacen/81cwbLBVDbL.jpg','image/jpeg','2025-04-20','16:21:40'),(25,27,'/almacen/1.jpg','image/jpeg','2025-04-20','16:24:03'),(26,28,'/almacen/302px-Pirates_of_the_Caribbean-_The_Curse_of_the_Black_Pearl_Theatrical_Poster-1-.jpg','image/jpeg','2025-04-20','16:31:54'),(27,29,'/almacen/megalodon-2-la-trinchera.jpg','image/jpeg','2025-04-20','16:33:56'),(28,30,'/almacen/jumanji_welcome_to_the_jungle-411245547-large.jpg','image/jpeg','2025-04-20','16:39:41'),(29,31,'/almacen/614Tjm3n16L._AC_UF894,1000_QL80_.jpg','image/jpeg','2025-04-20','16:41:57'),(30,32,'/almacen/kung_fu_panda_four_ver3_xlg.jpg','image/jpeg','2025-04-20','16:46:10'),(31,33,'/almacen/MV5BYTY0YjQ5Y2EtNDJiYi00ZjMwLWFmMTYtNzc2YzZkZWQzZjU4XkEyXkFqcGc@._V1_.jpg','image/jpeg','2025-04-20','16:50:10');
/*!40000 ALTER TABLE `imagen_pelicula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pelicula`
--

DROP TABLE IF EXISTS `pelicula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pelicula` (
  `id_pelicula` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) NOT NULL,
  `sinopsis` varchar(300) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id_pelicula`),
  UNIQUE KEY `titulo` (`titulo`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pelicula`
--

LOCK TABLES `pelicula` WRITE;
/*!40000 ALTER TABLE `pelicula` DISABLE KEYS */;
INSERT INTO `pelicula` VALUES (1,' The Conjuring 3: The Devil Made Me Do It','Los investigadores de fenómenos paranormales Ed y Lorraine Warren se enfrentan a un nuevo caso: el de un hombre acusado de un terrible asesinato, que asegura haber sido poseído por un demonio.',1),(2,' The Conjuring 2','Ed y Lorraine Warren, renombrados demonólogos e investigadores de lo paranormal, se enfrentan de nuevo a las fuerzas infernales.',1),(3,'The Conjuring','Ed y Lorrain Warren, reputados investigadores de fenómenos paranormales, se enfrentan a una entidad demoníaca al intentar ayudar a una familia que está siendo aterrorizada por una presencia oscura en su aislada granja.',1),(4,'The Pope\'s Exorcist ','Gabriele Amorth, el jefe de exorcistas del Vaticano, descubre una conspiración que se remonta a cientos de años atrás mientras investiga la aterradora posesión de un niño pequeño.',1),(5,'Avengers','Cuando un enemigo inesperado surge como una gran amenaza para la seguridad mundial, Nick Fury, director de la Agencia SHIELD, decide reclutar a un equipo para salvar al mundo de un desastre casi seguro. ',1),(6,'Spider-Man: No Way Home','Tras descubrirse la identidad secreta de Peter Parker como Spider-Man. Peter le pide ayuda al Doctor Strange para recuperar su vida, pero algo sale mal y provoca una fractura en el multiverso.',1),(7,'El Hobbit: Un Viaje Inesperado','El hobbit Bilbo Bolsón vive una vida tranquila hasta que el mago Gandalf aparece y le encomienda una misión: unirse a un grupo de enanos para recuperar un tesoro que les pertenece. El tesoro está guardado por un dragón en el reino de Erebor, que antes pertenecía a los enanos. ',1),(8,'Oppenheimer','Durante la Segunda Guerra Mundial, el teniente general Leslie Groves designa al físico J. Robert Oppenheimer para un grupo de trabajo que está desarrollando el Proyecto Manhattan, cuyo objetivo consiste en fabricar la primera bomba atómica.',1),(11,'The Super Mario Bros.','Dos hermanos plomeros, Mario y Luigi, caen por las alcantarillas y llegan a un mundo subterráneo mágico en el que deben enfrentarse al malvado Bowser para rescatar a la princesa Peach, quien ha sido forzada a aceptar casarse con él.',1),(12,'Fast and furious ','El oficial Brian O\'Conner debe decidir dónde queda su lealtad cuando se enamora del mundo de las carreras callejeras, donde trabaja como agente encubierto con la misión de desaparecerlas.',1),(13,'2Fast 2Furious','El expolicía Brian O\'Conner recluta a Roman Pearce, un amigo de la infancia, y juntos regresan al mundo de las carreras para transportar dinero sucio del turbio comerciante de importaciones y exportaciones Carter Verone, cuyo negocio tiene sede en Miami.',1),(14,'RESIDENT EVIL 2002','En un centro clandestino de investigación genética, se produce un brote vírico. Para contener la fuga,se sella toda la instalación y, en principio, se cree que mueren todos los empleados, pero en realidad se convierten en feroces zombis.',1),(15,'Fast & Furious 4','El fugitivo Dominic Toretto y el agente Brian O\'Conner reavivan su enemistad, aunque las circunstancias los obliga a unir fuerzas contra un enemigo común: deben encontrar al asesino de Vince.',1),(16,'Fast and Furious 5in Control ','En Río de Janeiro, Dominic Toretto y Brian O\'Conner reúnen a su pandilla de corredores callejeros para llevar a cabo un atraco, mientras están en la mira de un poderoso narcotraficante brasileño y un peligroso agente federal.',1),(17,'Fast & Furious 6','Desde que el robo de Dom y Brian en Río los dejó a ellos y a su equipo con mucho dinero, ellos se dispersan por todo el mundo; sin embargo, ellos tienen que vivir como fugitivos, incapaces de regresar con sus familias. ',1),(18,'DRAGONBALL SUPER BROLY','La paz ha regresado una vez más a la Tierra tras el Torneo de Poder. Al descubrir que en los diferentes universos hay seres increíblemente poderosos que aún no ha visto, Goku tiene intención de seguir entrenando para hacerse aún más fuerte.',1),(19,'Fast & Furious 7','Un agente del gobierno que habla sin problemas le ofrece ayuda a Dominic Toretto y su banda para eliminar a un enemigo peligroso; a cambio, pide rescatar a un pirata informático secuestrado.',1),(20,'CARS 3','Eclipsado por los coches jóvenes, el veterano Rayo McQueen se ha visto expulsado del deporte que tanto ama. Sin embargo, no se rendirá tan fácilmente. Con la ayuda de sus amigos, Rayo aprende trucos nuevos para vencer al arrogante Jackson Storm.',1),(21,'Fast and furious Tokyo Drift','Sean Boswell siempre se ha sentido como un intruso, pero él se define a sí mismo a través de sus victorias como corredor callejero de autos',1),(22,'Las Locuras del Emperador','El arrogante y egoísta emperador Cuzco es traicionado y convertido en llama por la ambiciosa Yzma y su guardaespaldas Kronk. El emperador se verá abocado a confiar en un llano y simpático campesino llamado Pacha, para encontrarse a sí mismo',1),(23,'BATMAN VS SUPERMAN: EL ORIGEN DE LA JUSTICIA ','Mientras el mundo debate qué tipo de héroe necesita, las hazañas de Superman tienen peligrosas consecuencias. En plena guerra entre el vigilante de Gotham y el defensor de Metrópolis, una nueva amenaza pone a la humanidad en grave peligro.',1),(24,'Fast & Furious 8','Con Dom y Letty de luna de miel, Brian y Mia retirados y el resto de la pandilla viviendo en paz, parece que todo está tranquilo. Sin embargo, una misteriosa mujer seducirá a Dom para adentrarlo en el mundo del crimen y traicionar a la pandilla.',1),(25,'Fast & Furious 9','Dom Toretto vive una vida tranquila junto a Letty y su hijo, pero el peligro siempre regresa a su vida. En esta ocasión, el equipo se enfrenta a un complot mundial orquestado por el asesino más temible del mundo: el hermano de Dom.',1),(26,'Fast & Furious 10','Dom Toretto y sus familias se enfrentan al peor enemigo imaginable, uno llegado desde el pasado con sed de venganza, dispuesto a cualquier cosa con tal de destruir todo aquello que Dom ama.',1),(27,'Megalodón','Un tiburón prehistórico de 25 metros de longitud amenaza a los tripulantes de un submarino hundido en la fosa más profunda del océano Pacífico y al grupo enviado para rescatarlos. Si no lo detienen, el tiburón causará estragos.',1),(28,'Pirates of the Caribbean: The Curse of the Black Pearl','El capitán Barbossa le roba el barco al pirata Jack Sparrow y secuestra a Elizabeth, amiga de Will Turner. Barbossa y su tripulación son víctimas de un conjuro que los condena a vivir eternamente y a transformarse cada noche en esqueletos vivientes.',1),(29,'Meagalodón 2','Jonas Taylor lidera un equipo de investigación en las profundidades del océano. Acorralados por colosales tiburones prehistóricos y despiadados bandidos, los científicos intentan sobrevivir a toda costa',1),(30,'Jumanji','Cuatro adolescentes encuentran un viejo videojuego que los absorbe y los transporta a una selva peligrosa, donde se convierten en personajes adultos y tienen que ir superando pruebas terribles para terminar el juego y regresar al mundo real.',1),(31,'Deadpool & Wolverine ','Deadpool viaja en el tiempo con la intención de reclutar a Wolverine en la batalla contra un enemigo común: Paradox.',1),(32,'kung fu panda 4','Po está entrenando a un nuevo guerrero que ocupe su lugar para que él pueda convertirse en líder espiritual del Valle de la Paz. Sin embargo, la irrupción de una malvada hechicera que puede cambiar de apariencia.',1),(33,'Flash un choque de mundos','Flash viaja a través del tiempo para evitar el asesinato de su madre, pero, sin saberlo, provoca una serie de cambios que originan la creación de un multiverso.',1);
/*!40000 ALTER TABLE `pelicula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trailer_pelicula`
--

DROP TABLE IF EXISTS `trailer_pelicula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `trailer_pelicula` (
  `id_trailer` int(11) NOT NULL AUTO_INCREMENT,
  `id_pelicula` int(11) NOT NULL,
  `url_trailer` varchar(150) NOT NULL,
  `fecha` date DEFAULT curdate(),
  `hora` time DEFAULT curtime(),
  PRIMARY KEY (`id_trailer`),
  UNIQUE KEY `url_trailer` (`url_trailer`),
  KEY `fk_trailer_pelicula_pelicula` (`id_pelicula`),
  CONSTRAINT `fk_trailer_pelicula_pelicula` FOREIGN KEY (`id_pelicula`) REFERENCES `pelicula` (`id_pelicula`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trailer_pelicula`
--

LOCK TABLES `trailer_pelicula` WRITE;
/*!40000 ALTER TABLE `trailer_pelicula` DISABLE KEYS */;
INSERT INTO `trailer_pelicula` VALUES (1,1,'https://www.youtube.com/embed/S8nlMJfE6pc','2025-04-20','15:22:09'),(2,2,'https://www.youtube.com/embed/fFS929KKVAQ','2025-04-20','15:22:53'),(3,3,'https://www.youtube.com/embed/_zU1gLWGnpg','2025-04-20','15:23:48'),(4,4,'https://www.youtube.com/embed/a-Cx7IE04sA','2025-04-20','15:28:36'),(5,5,'https://www.youtube.com/embed/yNXfOOL8824','2025-04-20','15:31:31'),(6,6,'https://www.youtube.com/embed/JfVOs4VSpmA','2025-04-20','15:33:05'),(7,7,'https://www.youtube.com/embed/sI8OQRXhcZE','2025-04-20','15:34:01'),(8,8,'https://www.youtube.com/embed/uYPbbksJxIg','2025-04-20','15:35:04'),(9,11,'https://www.youtube.com/embed/TnGl01FkMMo','2025-04-20','15:39:46'),(10,12,'https://www.youtube.com/embed/2TAOizOnNPo','2025-04-20','15:44:12'),(11,13,'https://www.youtube.com/embed/F_VIM03DXWI','2025-04-20','15:48:48'),(12,14,'https://www.youtube.com/embed/HhBAIDHvRTc','2025-04-20','15:51:51'),(13,15,'https://www.youtube.com/embed/k98tBkRsGl4','2025-04-20','15:52:59'),(14,16,'https://www.youtube.com/embed/vcn2GOuZCKI','2025-04-20','16:00:17'),(15,17,'https://www.youtube.com/embed/oc_P11PNvRs','2025-04-20','16:06:55'),(16,18,'https://www.youtube.com/embed/dl3w10VVQj8','2025-04-20','16:10:20'),(17,19,'https://www.youtube.com/embed/Skpu5HaVkOc','2025-04-20','16:11:05'),(18,20,'https://www.youtube.com/embed/E4K7JgPJ8-s','2025-04-20','16:12:46'),(19,21,'https://www.youtube.com/embed/p8HQ2JLlc4E','2025-04-20','16:14:51'),(20,22,'https://www.youtube.com/embed/Bkh3heh_uHE','2025-04-20','16:15:13'),(21,23,'https://www.youtube.com/embed/NMWAWljzj8M','2025-04-20','16:17:07'),(22,24,'https://www.youtube.com/embed/uisBaTkQAEs','2025-04-20','16:17:21'),(23,25,'https://www.youtube.com/embed/FUK2kdPsBws','2025-04-20','16:20:03'),(24,26,'https://www.youtube.com/embed/32RAq6JzY-w','2025-04-20','16:21:40'),(25,27,'https://www.youtube.com/embed/udm5jUA-2bs','2025-04-20','16:24:03'),(26,28,'https://www.youtube.com/embed/tnx35Z4nWWc','2025-04-20','16:31:54'),(27,29,'https://www.youtube.com/embed/7wuK5PhzcNY','2025-04-20','16:33:56'),(28,30,'https://www.youtube.com/embed/leIrosWRbYQ','2025-04-20','16:39:41'),(29,31,'https://www.youtube.com/embed/73_1biulkYk','2025-04-20','16:41:57'),(30,32,'https://www.youtube.com/embed/tYMDHo9xy1I','2025-04-20','16:46:10'),(31,33,'https://www.youtube.com/embed/8dFTgXriXWg','2025-04-20','16:50:10');
/*!40000 ALTER TABLE `trailer_pelicula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'dbPeliculas'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_contar_peliculas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_contar_peliculas`()
BEGIN
  SELECT COUNT(*) AS total
  FROM pelicula
  WHERE activo = TRUE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_contar_peliculas_vistas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_contar_peliculas_vistas`()
BEGIN
  SELECT COUNT(DISTINCT p.id_pelicula) AS total
  FROM pelicula p
  INNER JOIN estado_pelicula ep ON p.id_pelicula = ep.id_pelicula
  WHERE p.activo = TRUE AND ep.activo = TRUE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insertar_pelicula` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insertar_pelicula`(
    IN p_titulo VARCHAR(200),
    IN p_sinopsis VARCHAR(300),
    IN p_url_imagen VARCHAR(150),
    IN p_mimetype VARCHAR(30),
    IN p_url_trailer VARCHAR(150)
)
BEGIN DECLARE v_id_pelicula INT;

INSERT INTO
    pelicula (titulo, sinopsis)
VALUES (p_titulo, p_sinopsis);

SET v_id_pelicula = LAST_INSERT_ID();

INSERT INTO
    imagen_pelicula (
        id_pelicula,
        url_imagen,
        mimetype
    )
VALUES (
        v_id_pelicula,
        p_url_imagen,
        p_mimetype
    );

INSERT INTO
    trailer_pelicula (id_pelicula, url_trailer)
VALUES (v_id_pelicula, p_url_trailer);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_obtener_pelicula` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_pelicula`(
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
    WHERE p.id_pelicula = p_id_pelicula AND p.activo = TRUE LIMIT 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_obtener_peliculas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_peliculas`(
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
  INNER JOIN (
    SELECT ip1.*
    FROM imagen_pelicula ip1
    INNER JOIN (
      SELECT id_pelicula, MAX(CONCAT(fecha, ' ', hora)) AS max_fecha
      FROM imagen_pelicula
      GROUP BY id_pelicula
    ) ultima_ip ON ip1.id_pelicula = ultima_ip.id_pelicula
               AND CONCAT(ip1.fecha, ' ', ip1.hora) = ultima_ip.max_fecha
  ) ip ON p.id_pelicula = ip.id_pelicula
  INNER JOIN (
    SELECT tp1.*
    FROM trailer_pelicula tp1
    INNER JOIN (
      SELECT id_pelicula, MAX(CONCAT(fecha, ' ', hora)) AS max_fecha
      FROM trailer_pelicula
      GROUP BY id_pelicula
    ) ultimo_tp ON tp1.id_pelicula = ultimo_tp.id_pelicula
                AND CONCAT(tp1.fecha, ' ', tp1.hora) = ultimo_tp.max_fecha
  ) tp ON p.id_pelicula = tp.id_pelicula
  WHERE p.activo = TRUE
  LIMIT p_limit OFFSET p_offset;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_obtener_peliculas_vistas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_peliculas_vistas`(
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
    INNER JOIN (
        SELECT ip1.*
        FROM imagen_pelicula ip1
        INNER JOIN (
            SELECT id_pelicula, MAX(CONCAT(fecha, ' ', hora)) AS max_fecha
            FROM imagen_pelicula
            GROUP BY id_pelicula
        ) ultima_ip ON ip1.id_pelicula = ultima_ip.id_pelicula
                  AND CONCAT(ip1.fecha, ' ', ip1.hora) = ultima_ip.max_fecha
    ) ip ON p.id_pelicula = ip.id_pelicula
    INNER JOIN (
        SELECT tp1.*
        FROM trailer_pelicula tp1
        INNER JOIN (
            SELECT id_pelicula, MAX(CONCAT(fecha, ' ', hora)) AS max_fecha
            FROM trailer_pelicula
            GROUP BY id_pelicula
        ) ultimo_tp ON tp1.id_pelicula = ultimo_tp.id_pelicula
                   AND CONCAT(tp1.fecha, ' ', tp1.hora) = ultimo_tp.max_fecha
    ) tp ON p.id_pelicula = tp.id_pelicula
    INNER JOIN estado_pelicula ep ON p.id_pelicula = ep.id_pelicula
    WHERE p.activo = TRUE
      AND ep.activo = TRUE
    LIMIT p_limit OFFSET p_offset;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-20 16:59:49
