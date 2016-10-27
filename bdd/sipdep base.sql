-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: localhost    Database: sipdep
-- ------------------------------------------------------
-- Server version	5.7.15-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alumno`
--

DROP TABLE IF EXISTS `alumno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alumno` (
  `Clave_unica` int(11) NOT NULL,
  `Facultad` varchar(45) NOT NULL,
  `Carrera` varchar(45) NOT NULL,
  `Intentos_Ingreso` int(11) NOT NULL,
  `Semestre` int(11) NOT NULL,
  PRIMARY KEY (`Clave_unica`),
  KEY `Nombre_Facultad_fk_idx` (`Facultad`),
  KEY `Nombre_Carrera_fk_idx` (`Carrera`),
  CONSTRAINT `Nombre_Carrera_fk` FOREIGN KEY (`Carrera`) REFERENCES `facultad_carrera` (`NombreCarrera`) ON UPDATE CASCADE,
  CONSTRAINT `Nombre_Facultad_fk` FOREIGN KEY (`Facultad`) REFERENCES `facultad` (`Nombre`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumno`
--

LOCK TABLES `alumno` WRITE;
/*!40000 ALTER TABLE `alumno` DISABLE KEYS */;
INSERT INTO `alumno` VALUES (164990,'Facultad de Ingeniería','Ing. en Informática',1,9),(214873,'Facultad de Ingeniería','Ing. en Informática',1,8);
/*!40000 ALTER TABLE `alumno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aplicador`
--

DROP TABLE IF EXISTS `aplicador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aplicador` (
  `NombreUsuario` varchar(45) NOT NULL,
  `Nombre` varchar(45) NOT NULL,
  `Apellidos` varchar(45) NOT NULL,
  `Telefono` varchar(16) NOT NULL,
  `Correo` varchar(45) NOT NULL,
  `Privilegios` varchar(45) NOT NULL,
  `Password` varchar(64) NOT NULL,
  `Eliminado` varchar(2) NOT NULL,
  PRIMARY KEY (`NombreUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aplicador`
--

LOCK TABLES `aplicador` WRITE;
/*!40000 ALTER TABLE `aplicador` DISABLE KEYS */;
INSERT INTO `aplicador` VALUES ('asael.garcia','Jesús Asael','Hernández García','4442887671','azzaeelhg@gmail.com','administrativos','69d7e71afcad212da008722d2a5b68979cf4d1e4b5bf198c60e62a6735fbbd2f','No'),('guillermo.aldair','Guillermo Aldair','Hernandez García','8098918','guillermo@gmail.com','generales','e6c9947c4f71c0d5cd3918a8525216e2c55c0db5f8bf8d182ab077dff2991131','No'),('jesus.galvan','Jesús','Galvan','11111111','jfranciscogm@hotmail.com','administrativos','f4d23041a3798b4d208ffbd5a7180b3662cb6ec8518178fc57ca0fca7509b7dd','No'),('seritania.perez','Seritania','Perez','111111','rusvanzath@hotmail.com','generales','77c2e01aa18ee86baf2f2d17d4ce3c5f5919bd9efa9c1c1084c707bde4525f58','No');
/*!40000 ALTER TABLE `aplicador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facultad`
--

DROP TABLE IF EXISTS `facultad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `facultad` (
  `Nombre` varchar(60) NOT NULL,
  `Eliminado` varchar(2) NOT NULL,
  PRIMARY KEY (`Nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facultad`
--

LOCK TABLES `facultad` WRITE;
/*!40000 ALTER TABLE `facultad` DISABLE KEYS */;
INSERT INTO `facultad` VALUES ('Facultad de Agronomía y Veterinaria','No'),('Facultad de Ciencias de la Comunicación','No'),('Facultad de Ciencias de la Información','No'),('Facultad de Ciencias Químicas','No'),('Facultad de Ciencias Sociales y Humanidades','No'),('Facultad de Contaduría y Administración','No'),('Facultad de Derecho “Abogado Ponciano Arriaga Leija”','No'),('Facultad de Economía','No'),('Facultad de Enfermería','No'),('Facultad de Estomatología','No'),('Facultad de Ingeniería','No'),('Facultad de Medicina','No'),('Facultad de Psicología','No'),('Facultad del Hábitat','No');
/*!40000 ALTER TABLE `facultad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facultad_carrera`
--

DROP TABLE IF EXISTS `facultad_carrera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `facultad_carrera` (
  `Nombre_Facultad` varchar(60) NOT NULL,
  `NombreCarrera` varchar(60) NOT NULL,
  `Eliminado` varchar(2) NOT NULL,
  PRIMARY KEY (`NombreCarrera`),
  KEY `Nombre_Facultad_idx` (`Nombre_Facultad`),
  CONSTRAINT `Nombre_Facultad` FOREIGN KEY (`Nombre_Facultad`) REFERENCES `facultad` (`Nombre`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facultad_carrera`
--

LOCK TABLES `facultad_carrera` WRITE;
/*!40000 ALTER TABLE `facultad_carrera` DISABLE KEYS */;
INSERT INTO `facultad_carrera` VALUES ('Facultad del Hábitat','Arquitectura','No'),('Facultad de Agronomía y Veterinaria','Ing. Agroecólogo','No'),('Facultad de Ingeniería','Ing. Agroindustrial','No'),('Facultad de Agronomía y Veterinaria','Ing. Agronómica en Fitotecnia','No'),('Facultad de Agronomía y Veterinaria','Ing. Agronómica en Producción en Invernaderos','No'),('Facultad de Agronomía y Veterinaria','Ing. Agronómica en Recursos Forestales','No'),('Facultad de Agronomía y Veterinaria','Ing. Agronómica en Zootecnia','No'),('Facultad de Ingeniería','Ing. Ambiental','No'),('Facultad de Ingeniería','Ing. Civil','No'),('Facultad de Ciencias Químicas','Ing. de Bioprocesos','No'),('Facultad de Ciencias Químicas','Ing. en Alimentos','No'),('Facultad de Ingeniería','Ing. en Computación','No'),('Facultad de Ingeniería','Ing. en Electricidad y Automatización','No'),('Facultad de Ingeniería','Ing. en Geología','No'),('Facultad de Ingeniería','Ing. en Informática','No'),('Facultad de Ingeniería','Ing. en Mecatrónica','No'),('Facultad de Ingeniería','Ing. en Topografía y Construcción','No'),('Facultad de Ingeniería','Ing. Geoinformática','No'),('Facultad de Ingeniería','Ing. Mecánica','No'),('Facultad de Ingeniería','Ing. Mecánica Administrativa','No'),('Facultad de Ingeniería','Ing. Mecánica Eléctrica','No'),('Facultad de Ingeniería','Ing. Metalúrgica y de Materiales','No'),('Facultad de Ciencias Químicas','Ing. Químico','No'),('Facultad de Contaduría y Administración','Lic. en Administración','No'),('Facultad de Contaduría y Administración','Lic. en Administración Pública','No'),('Facultad de Contaduría y Administración','Lic. en Agronegocios','No'),('Facultad de Ciencias Sociales y Humanidades','Lic. en Antropología','No'),('Facultad de Ciencias Sociales y Humanidades','Lic. en Arqueología','No'),('Facultad de Medicina','Lic. en Ciencias Ambientales y Salud','No'),('Facultad de Ciencias de la Comunicación','Lic. en Ciencias de la Comunicación','No'),('Facultad de Economía','Lic. en Comercio y Negocios Internacionales','No'),('Facultad del Hábitat','Lic. en Conservación y Restauración','No'),('Facultad de Contaduría y Administración','Lic. en Contaduría Pública','No'),('Facultad de Derecho “Abogado Ponciano Arriaga Leija”','Lic. en Criminología','No'),('Facultad de Derecho “Abogado Ponciano Arriaga Leija”','Lic. en Derecho','No'),('Facultad del Hábitat','Lic. en Diseño Gráco','No'),('Facultad del Hábitat','Lic. en Diseño Industrial','No'),('Facultad del Hábitat','Lic. en Diseño Urbano y del Paisaje','No'),('Facultad de Economía','Lic. en Economía','No'),('Facultad del Hábitat','Lic. en Edicación y Administración de Obras','No'),('Facultad de Enfermería','Lic. en Enfermería','No'),('Facultad de Ciencias Sociales y Humanidades','Lic. en Filosofía','No'),('Facultad de Ciencias Sociales y Humanidades','Lic. en Geografía','No'),('Facultad de Ciencias de la Información','Lic. en Gestión de la Información','No'),('Facultad de Ciencias de la Información','Lic. en Gestión Documental y Archivística','No'),('Facultad de Ciencias Sociales y Humanidades','Lic. en Historia','No'),('Facultad de Ciencias Sociales y Humanidades','Lic. en Lengua y Literaturas Hispanoamericanas','No'),('Facultad de Contaduría y Administración','Lic. en Mercadotecnia Estratégica','No'),('Facultad de Enfermería','Lic. en Nutrición','No'),('Facultad de Psicología','Lic. en Psicología','No'),('Facultad de Psicología','Lic. en Psicopedagogía','No'),('Facultad de Ciencias Químicas','Lic. en Química','No'),('Facultad de Agronomía y Veterinaria','Medicina Veterinaria y Zootecnia','No'),('Facultad de Medicina','Médico Cirujano','No'),('Facultad de Estomatología','Médico Estomatólogo','No'),('Facultad de Ciencias Químicas','Químico Farmacobiólogo','No');
/*!40000 ALTER TABLE `facultad_carrera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grupo`
--

DROP TABLE IF EXISTS `grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grupo` (
  `idGrupo` int(11) NOT NULL,
  `Descripcion` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`idGrupo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupo`
--

LOCK TABLES `grupo` WRITE;
/*!40000 ALTER TABLE `grupo` DISABLE KEYS */;
/*!40000 ALTER TABLE `grupo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modulo`
--

DROP TABLE IF EXISTS `modulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `modulo` (
  `IdModulo` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(40) DEFAULT NULL,
  `preg_ini` varchar(10) DEFAULT NULL,
  `preg_fin` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`IdModulo`),
  KEY `preg_ini` (`preg_ini`),
  KEY `preg_fin` (`preg_fin`),
  CONSTRAINT `modulo_ibfk_1` FOREIGN KEY (`preg_ini`) REFERENCES `pregunta` (`IdPregunta`),
  CONSTRAINT `modulo_ibfk_2` FOREIGN KEY (`preg_fin`) REFERENCES `pregunta` (`IdPregunta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modulo`
--

LOCK TABLES `modulo` WRITE;
/*!40000 ALTER TABLE `modulo` DISABLE KEYS */;
/*!40000 ALTER TABLE `modulo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pregunta`
--

DROP TABLE IF EXISTS `pregunta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pregunta` (
  `IdPregunta` varchar(10) NOT NULL,
  `Nombre_Test` varchar(100) DEFAULT NULL,
  `Numero` int(11) DEFAULT NULL,
  `Pregunta` varchar(100) DEFAULT NULL,
  `SigPregunta_V` varchar(10) DEFAULT NULL,
  `SigPregunta_F` varchar(10) DEFAULT NULL,
  `Modulo` int(11) DEFAULT NULL,
  `Condicion` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`IdPregunta`),
  KEY `Nombre_Test` (`Nombre_Test`),
  KEY `SigPregunta_V` (`SigPregunta_V`),
  KEY `SigPregunta_F` (`SigPregunta_F`),
  CONSTRAINT `Nombre_Test` FOREIGN KEY (`Nombre_Test`) REFERENCES `test` (`Nombre`),
  CONSTRAINT `SigPregunta_F` FOREIGN KEY (`SigPregunta_F`) REFERENCES `pregunta` (`IdPregunta`),
  CONSTRAINT `SigPregunta_V` FOREIGN KEY (`SigPregunta_V`) REFERENCES `pregunta` (`IdPregunta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pregunta`
--

LOCK TABLES `pregunta` WRITE;
/*!40000 ALTER TABLE `pregunta` DISABLE KEYS */;
/*!40000 ALTER TABLE `pregunta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pregunta_test`
--

DROP TABLE IF EXISTS `pregunta_test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pregunta_test` (
  `Nombre_Test` varchar(100) NOT NULL,
  `Numero` int(11) NOT NULL,
  `Pregunta` varchar(350) NOT NULL,
  PRIMARY KEY (`Nombre_Test`,`Numero`),
  CONSTRAINT `pregunta_test_test_fk` FOREIGN KEY (`Nombre_Test`) REFERENCES `test` (`Nombre`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pregunta_test`
--

LOCK TABLES `pregunta_test` WRITE;
/*!40000 ALTER TABLE `pregunta_test` DISABLE KEYS */;
INSERT INTO `pregunta_test` VALUES ('AUDIT',1,'1. ¿Con qué frecuencia consume alguna bebida alcohólica?'),('AUDIT',2,'2. ¿Cuántas consumiciones de bebidas alcohólicas suele realizar en un día  de consumo normal? '),('AUDIT',3,'3. ¿Con qué frecuencia toma 6 o más bebidas alcohólicas en una sola ocasión  de consumo?\r\n'),('AUDIT',4,'4. ¿Con qué frecuencia en el curso del último año ha sido incapaz de parar  de beber una vez había empezado?'),('AUDIT',5,'5. ¿Con qué frecuencia en el curso del último año no pudo hacer lo que  se esperaba de usted porque había bebido?'),('AUDIT',6,'6. ¿Con qué frecuencia en el curso del último año ha necesitado beber en  ayunas para recuperarse después de haber bebido mucho el día anterior?'),('AUDIT',7,'7. ¿Con qué frecuencia en el curso del último año ha tenido remordimientos  o sentimientos de culpa después de haber bebido?'),('AUDIT',8,'8. ¿Con qué frecuencia en el curso del último año no ha podido recordar  lo que sucedió la noche anterior porque había estado bebiendo?'),('AUDIT',9,'9. ¿Usted o alguna otra persona han resultado heridos porque usted  había bebido?'),('AUDIT',10,'10. ¿Algún familiar, amigo, médico o profesional sanitario ha mostrado preocupación por su consumo de bebidas alcohólicas o le ha sugerido  que deje de beber?'),('Cuestionario autoaplicable de Orientación sexual de Almonte-Herskovic',1,'¿Qué Identificación Sexual  tiene?'),('Cuestionario autoaplicable de Orientación sexual de Almonte-Herskovic',2,'Autorreporte atracción sexual en adolescentes'),('Cuestionario autoaplicable de Orientación sexual de Almonte-Herskovic',3,' ¿Has tenido fantasías sexuales?'),('Cuestionario autoaplicable de Orientación sexual de Almonte-Herskovic',4,'¿Te has enamorado?'),('Cuestionario autoaplicable de Orientación sexual de Almonte-Herskovic',5,'Ver pornografía Mujeres Hombres'),('Cuestionario sobre consumo de sustancias',1,'1. ¿Cuáles sustancias ha consumido en el último año (12 meses anteriores a esta encuesta)?'),('Cuestionario sobre consumo de sustancias',2,'2. Escriba en la línea la cantidad de tiempo (en años) que lleva consumiendo las sustancias que eligió en la pregunta 1.'),('Cuestionario sobre consumo de sustancias',3,'3. Si usted eligió en la pregunta 1 la opción de alcohol mencione si su consumo en el último año fue:'),('Cuestionario sobre consumo de sustancias',4,'4. Si usted eligió en la pregunta 1 la opción de tabaco mencione si su consumo en el último año fue:'),('Cuestionario sobre consumo de sustancias',5,'5. Si usted eligió en la pregunta 1 la opción de marihuana mencione si su consumo en el último año fue:'),('Cuestionario sobre consumo de sustancias',6,'6. Si usted eligió en la pregunta 1 la opción de medicamentos SIN PRESCRIPCIÓN MÉDICA mencione si su consumo en el último año fue:'),('Cuestionario sobre consumo de sustancias',7,'7. Si usted eligió en la pregunta 1 la opción de otras sustancias mencione si su consumo en el último año fue:'),('Cuestionario sobre consumo de sustancias',8,'8. ¿Su padre, madre o hermanos has presentado alguno de los siguientes problemas? (puede elegir más de una opción)'),('Cuestionario sobre consumo de sustancias',9,'9. Si usted ha consumido marihuana, medicamentos sin prescripción médica o tro tipo de sustancias (cocaína, crack, speed, cristal, heroína, cemento, resistol, thinner, poppers, peyote, LSD), SIN TOMAR EN CUENTA EL ALCOHOL O TABACO, señale si ha presentado alguno de los siguientes síntomas en los últimos 12 meses, puede señalar más de uno'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',0,'0. ¿Tiene usted un trabajo u ocupación remunerada?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',1,'1. ¿En qué medida le interesa su trabajo?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',2,'2. ¿En qué medida le interesan las tareas domésticas u otras ocupaciones no remuneradas?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',3,'3. Cuando participa en el trabajo o en la actividad que constituye su ocupación principal (tareas domésticas, estudios, etc.)'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',4,'4. ¿Le interesan los hobbies/actividades de ocio?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',5,'5. La calidad de su tiempo libre es:'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',6,'6. ¿Con qué frecuencia busca usted el contacto con miembros de su familia (cónyuge, hijos, padre, etc.)?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',7,'7. En su familia, las relaciones son:'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',8,'8. Aparte de su familia, se relaciona usted con:'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',9,'9. ¿Intenta usted establecer relaciones con otros?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',10,'10. ¿Cómo calificaría en general sus relaciones con otras personas?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',11,'11. ¿Qué valor le da usted a sus relaciones con los demás?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',12,'12. ¿Con qué frecuencia buscan contacto con usted las personas de su círculo social?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',13,'13. ¿Respeta usted las normas sociales, las buenas maneras, las normas de educación, etc.?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',14,'14. ¿En qué medida está usted involucrado en la vida de la comunidad (asociaciones,comunidades de vecinos, clubes, iglesia, etc.)?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',15,'15. ¿Le gusta buscar información sobre cosas, situaciones y personas, para mejorar la comprensión que tiene usted de ellas?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',16,'16. ¿Está usted interesado en la información científica, técnica o cultural?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',17,'17. ¿Con qué frecuencia le resulta difícil expresar sus opiniones a la gente?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',18,'18. ¿Con qué frecuencia se siente rechazado, excluido de su círculo?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',19,'19. ¿Hasta qué punto considera usted que es importante su aspecto físico?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',20,'20. ¿En qué medida tiene usted dificultades para manejar sus recursos e ingresos?'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',21,'21. ¿Se siente capaz de organizar su entorno según sus deseos y necesidades?'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',1,'Me siento triste y deprimido'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',2,'Por las mañanas me siento mejor que por las tardes'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',3,'Frecuentemente tengo ganas de llorar y a veces lloro'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',4,'Me cuesta mucho dormir o duermo mal por la noche'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',5,'Ahora tengo tanto apetito como antes'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',6,'Todavía me siento atraído por el sexo opuesto'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',7,'Creo que estoy adelgazando'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',8,'Estoy estreñido'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',9,'Tengo palpitaciones'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',10,'Me canso por cualquier cosa'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',11,'Mi cabeza está tan despejada como antes'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',12,'Hago las cosas con la misma facilidad que antes'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',13,'Me siento agitado e intranquilo y no puedo estar quieto'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',14,'Tengo esperanza y confianza en el futuro'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',15,'Me siento más irritable que habitualmente'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',16,'Encuentro fácil tomar decisiones'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',17,'Me creo útil y necesario para la gente'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',18,'Encuentro agradable vivir, mi vida es plena'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',19,'Creo que sería mejor para los demás si me muriera'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',20,'Me gustan las mismas cosas que habitualmente me agradaban'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',1,'1. ¿Con qué frecuencia tiene dificultad para acabar con los detalles finales de un proyecto después de haber hecho  las partes difíciles?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',2,'2. ¿Con qué frecuencia tiene dificultad para ordenar las cosas  cuando está realizando una tarea que requiere organización?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',3,'3. ¿Con qué frecuencia tiene dificultad para recordar sus citas  u obligaciones?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',4,'4. Cuando tiene una actividad que requiere que usted piense  mucho, ¿con qué frecuencia la evita o la deja para después?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',5,'5. ¿Con qué frecuencia mueve o agita sus manos o sus pies  cuando tiene que permanecer sentado(a) por mucho tiempo?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',6,'6. ¿Con qué frecuencia se siente usted demasiado activo(a)  y como que tiene que hacer cosas, como si tuviera un motor?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',7,'7. ¿Con qué frecuencia comete errores por falta de cuidado  cuando está trabajando en un proyecto aburrido o difícil?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',8,'8. ¿Con qué frecuencia tiene dificultad para mantener la atención cuando está haciendo trabajos aburridos  o repetitivos?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',9,'9. ¿Con qué frecuencia tiene dificultad para concentrarse en lo que la gente le dice, aun cuando estén hablando con usted  directamente?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',10,'10. ¿Con qué frecuencia pierde o tiene dificultad para encontrar  cosas en la casa o en el trabajo?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',11,'11. ¿Con qué frecuencia se distrae por ruidos o actividades  a su alrededor?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',12,'12. ¿Con qué frecuencia se levanta de su asiento en reuniones o en otras situaciones en las que se supone debe permanecer  sentado?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',13,'13. ¿Con qué frecuencia se siente inquieto o nervioso?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',14,'14. ¿Con qué frecuencia tiene dificultades para relajarse cuando tiene tiempo para usted mismo?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',15,'15. ¿Con qué frecuencia siente que habla demasiado cuando  está en reuniones sociales?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',16,'16. Cuando estás en una conversación, ¿con qué frecuencia se descubre a sí mismo terminando las frases de la gente que  está hablando, antes de que ellos terminen?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',17,'17. ¿Con qué frecuencia tiene dificultad para esperar su turno  en situaciones en que debe hacerlo?'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)',18,'18. ¿Con qué frecuencia interrumpe a otros cuando están  ocupados?'),('Escala de Riesgo Suicida de Plutchik',1,'1. ¿Toma de forma habitual algún medicamento como aspirinas o pastillas para dormir?'),('Escala de Riesgo Suicida de Plutchik',2,'2. ¿Tiene dificultades para conciliar el sueño?'),('Escala de Riesgo Suicida de Plutchik',3,'3. ¿A veces nota que podría perder el control sobre sí mismo/a?'),('Escala de Riesgo Suicida de Plutchik',4,'4. ¿Tiene poco interés en relacionarse con la gente?'),('Escala de Riesgo Suicida de Plutchik',5,'5. ¿Ve su futuro con más pesimismo que optimismo?'),('Escala de Riesgo Suicida de Plutchik',6,'6. ¿Se ha sentido alguna vez inútil o inservible?'),('Escala de Riesgo Suicida de Plutchik',7,'7. ¿Ve su futuro sin ninguna esperanza?'),('Escala de Riesgo Suicida de Plutchik',8,'8. ¿Se ha sentido alguna vez tan fracasado/a que sólo quería meterse en la cama y abandonarlo todo?'),('Escala de Riesgo Suicida de Plutchik',9,'9. ¿Está deprimido/a ahora?'),('Escala de Riesgo Suicida de Plutchik',10,'10. ¿Está usted separado/a, divorciado/a o viudo/a?'),('Escala de Riesgo Suicida de Plutchik',11,'11. ¿Sabe si alguien de su familia ha intentado suicidarse alguna vez?'),('Escala de Riesgo Suicida de Plutchik',12,'12. ¿Alguna vez se ha sentido tan enfadado/a que habría sido capaz de matar a alguien?'),('Escala de Riesgo Suicida de Plutchik',13,'13. ¿Ha pensado alguna vez en suicidarse?'),('Escala de Riesgo Suicida de Plutchik',14,'14. ¿Le ha comentado a alguien, en alguna ocasión, que quería suicidarse?'),('Escala de Riesgo Suicida de Plutchik',15,'15. ¿Ha intentado alguna vez quitarse la vida?'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',1,'1. Me siento calmado'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',2,'2. Me siento seguro'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',3,'3. Estoy tenso'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',4,'4. Estoy contrariado'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',5,'5. Me siento cómodo (estoy a gusto)'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',6,'6. Me siento alterado'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',7,'7. Estoy preocupado ahora por posibles desgracias futuras'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',8,'8. Me siento descansado'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',9,'9. Me siento angustiado'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',10,'10. Me siento confortable'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',11,'11. Tengo confianza en mí mismo'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',12,'12. Me siento nervioso'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',13,'13. Estoy desasosegado'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',14,'14. Me siento muy «atado» (como oprimido)'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',15,'15. Estoy relajado'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',16,'16. Me siento satisfecho'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',17,'17. Estoy preocupado'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',18,'18. Me siento aturdido y sobreexcitado'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',19,'19. Me siento alegre'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',20,'20. En este momento me siento bien'),('MASLACH BURNOUT INVENTORY (MBI)',1,'1. Debido a mi trabajo me siento emocionalmente agotado.'),('MASLACH BURNOUT INVENTORY (MBI)',2,'2. Al final de la jornada me siento agotado.'),('MASLACH BURNOUT INVENTORY (MBI)',3,'3. Me encuentro cansado cuando me levanto por las mañanas y tengo que enfrentarme a otro día de trabajo.'),('MASLACH BURNOUT INVENTORY (MBI)',4,'4. Puedo entender con facilidad lo que piensan mis pacientes.'),('MASLACH BURNOUT INVENTORY (MBI)',5,'5. Creo que trato a algunos pacientes como si fueran objetos.'),('MASLACH BURNOUT INVENTORY (MBI)',6,'6. Trabajar con pacientes todos los días es una tensión para mí.'),('MASLACH BURNOUT INVENTORY (MBI)',7,'7. Me enfrento muy bien con los problemas que me presentan mis pacientes.'),('MASLACH BURNOUT INVENTORY (MBI)',8,'8. Me siento “quemado” por el trabajo.'),('MASLACH BURNOUT INVENTORY (MBI)',9,'9. Siento que mediante mi trabajo estoy influyendo positivamente en la vida de otros.'),('MASLACH BURNOUT INVENTORY (MBI)',10,'10. Creo que tengo un comportamiento más insensible con la gente desde que hago este trabajo.'),('MASLACH BURNOUT INVENTORY (MBI)',11,'11. Me preocupa que este trabajo me esté endureciendo emocionalmente.'),('MASLACH BURNOUT INVENTORY (MBI)',12,'12. Me encuentro con mucha vitalidad.'),('MASLACH BURNOUT INVENTORY (MBI)',13,'13. Me siento frustrado por mi trabajo.'),('MASLACH BURNOUT INVENTORY (MBI)',14,'14. Siento que estoy haciendo un trabajo demasiado duro.'),('MASLACH BURNOUT INVENTORY (MBI)',15,'15. Realmente no me importa lo que les ocurrirá a algunos de los pacientes a los que tengo que atender.'),('MASLACH BURNOUT INVENTORY (MBI)',16,'16. Trabajar en contacto directo con los pacientes me produce bastante estrés.'),('MASLACH BURNOUT INVENTORY (MBI)',17,'17. Tengo facilidad para crear una atmósfera relajada a mis pacientes.'),('MASLACH BURNOUT INVENTORY (MBI)',18,'18. Me encuentro animado después de trabajar junto con los pacientes.'),('MASLACH BURNOUT INVENTORY (MBI)',19,'19. He realizado muchas cosas que merecen la pena en este trabajo.'),('MASLACH BURNOUT INVENTORY (MBI)',20,'20. En el trabajo siento que estoy al límite de mis posibilidades.'),('MASLACH BURNOUT INVENTORY (MBI)',21,'21. Siento que se tratar de forma adecuada los problemas emocionales en el trabajo.'),('MASLACH BURNOUT INVENTORY (MBI)',22,'22. Siento que los pacientes me culpan de algunos de sus problemas.'),('Test de Fagerstrom de Dependencia de Nicotina',1,'1. ¿Cuántos cigarrillos fuma al día?'),('Test de Fagerstrom de Dependencia de Nicotina',2,'2. ¿Qué cantidad de nicotina contienen sus cigarrillos?'),('Test de Fagerstrom de Dependencia de Nicotina',3,'3. ¿Inhala el humo?'),('Test de Fagerstrom de Dependencia de Nicotina',4,'4. ¿Fuma más frecuentemente por la mañana que por la tarde?'),('Test de Fagerstrom de Dependencia de Nicotina',5,'5. Tiempo transcurrido desde que se levanta hasta que fuma el primer cigarrillo:'),('Test de Fagerstrom de Dependencia de Nicotina',6,'6. ¿Qué cigarrillo le produce mayor satisfacción o le costaría más suprimir?'),('Test de Fagerstrom de Dependencia de Nicotina',7,'7. ¿Fuma cuando está enfermo?'),('Test de Fagerstrom de Dependencia de Nicotina',8,'8. ¿Fuma en lugares prohibidos (hospitales, cine, metro)?');
/*!40000 ALTER TABLE `pregunta_test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `respuesta`
--

DROP TABLE IF EXISTS `respuesta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `respuesta` (
  `IdRespuesta` int(11) NOT NULL AUTO_INCREMENT,
  `IdPregunta` varchar(10) DEFAULT NULL,
  `respuestaBool` tinyint(1) DEFAULT NULL,
  `NombreUsuario` varchar(45) DEFAULT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`IdRespuesta`),
  KEY `IdPregunta` (`IdPregunta`),
  KEY `NombreUsuario` (`NombreUsuario`),
  CONSTRAINT `IdPregunta` FOREIGN KEY (`IdPregunta`) REFERENCES `pregunta` (`IdPregunta`),
  CONSTRAINT `NombreUsuario` FOREIGN KEY (`NombreUsuario`) REFERENCES `usuario` (`NombreUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respuesta`
--

LOCK TABLES `respuesta` WRITE;
/*!40000 ALTER TABLE `respuesta` DISABLE KEYS */;
/*!40000 ALTER TABLE `respuesta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `respuesta_pregunta`
--

DROP TABLE IF EXISTS `respuesta_pregunta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `respuesta_pregunta` (
  `Nombre_Test` varchar(100) NOT NULL,
  `Numero_Pregunta` int(11) NOT NULL,
  `Numero_Respuesta` int(11) NOT NULL,
  `Respuesta` varchar(150) NOT NULL,
  `Puntuacion` varchar(2) NOT NULL,
  PRIMARY KEY (`Nombre_Test`,`Numero_Pregunta`,`Numero_Respuesta`),
  KEY `Numero_Pregunta_idx` (`Numero_Pregunta`),
  KEY `Numero_Preg_rp_fk_idx` (`Numero_Pregunta`),
  KEY `Numero_Preg_idx` (`Numero_Pregunta`),
  KEY `Npregunta_idx` (`Numero_Pregunta`),
  CONSTRAINT `respuesta_pregunta_test_fk` FOREIGN KEY (`Nombre_Test`) REFERENCES `test` (`Nombre`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respuesta_pregunta`
--

LOCK TABLES `respuesta_pregunta` WRITE;
/*!40000 ALTER TABLE `respuesta_pregunta` DISABLE KEYS */;
INSERT INTO `respuesta_pregunta` VALUES ('AUDIT',1,1,'Nunca','0'),('AUDIT',1,2,'Una o menos veces al mes','1'),('AUDIT',1,3,'De 2 a 4 veces al mes','2'),('AUDIT',1,4,'De 2 a 3 veces a la semana','3'),('AUDIT',1,5,'Cuatro o más veces a la semana','4'),('AUDIT',2,1,'1 o 2','0'),('AUDIT',2,2,'3 o 4','1'),('AUDIT',2,3,'5 o 6','2'),('AUDIT',2,4,'De 7 a 9','3'),('AUDIT',2,5,'10 o más','4'),('AUDIT',3,1,'Nunca','0'),('AUDIT',3,2,'Menos de una vez al mes','1'),('AUDIT',3,3,'Mensualmente','2'),('AUDIT',3,4,'Semanalmente','3'),('AUDIT',3,5,'A diario o casi a diario','5'),('AUDIT',4,1,'Nunca','0'),('AUDIT',4,2,'Menos de una vez al mes','1'),('AUDIT',4,3,'Mensualmente','2'),('AUDIT',4,4,'Semanalmente','3'),('AUDIT',4,5,'A diario o casi a diario','5'),('AUDIT',5,1,'Nunca','0'),('AUDIT',5,2,'Menos de una vez al mes','1'),('AUDIT',5,3,'Mensualmente','2'),('AUDIT',5,4,'Semanalmente','3'),('AUDIT',5,5,'A diario o casi a diario','5'),('AUDIT',6,1,'Nunca','0'),('AUDIT',6,2,'Menos de una vez al mes','1'),('AUDIT',6,3,'Mensualmente','2'),('AUDIT',6,4,'Semanalmente','3'),('AUDIT',6,5,'A diario o casi a diario','5'),('AUDIT',7,1,'Nunca','0'),('AUDIT',7,2,'Menos de una vez al mes','1'),('AUDIT',7,3,'Mensualmente','2'),('AUDIT',7,4,'Semanalmente','3'),('AUDIT',7,5,'A diario o casi a diario','5'),('AUDIT',8,1,'Nunca','0'),('AUDIT',8,2,'Menos de una vez al mes','1'),('AUDIT',8,3,'Mensualmente','2'),('AUDIT',8,4,'Semanalmente','3'),('AUDIT',8,5,'A diario o casi a diario','5'),('AUDIT',9,1,'Nunca','0'),('AUDIT',9,2,'Sí, pero no en el curso del último año','2'),('AUDIT',9,3,'Sí, el último año','4'),('AUDIT',10,1,'Nunca','0'),('AUDIT',10,2,'Sí, pero no en el curso del último año','2'),('AUDIT',10,3,'Sí, el último año','4'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',0,1,'A. SÍ','A'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',0,2,'B. NO','B'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',1,1,'A. Mucho','A'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',1,2,'B. Moderadamente','B'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',1,3,'C. Un poco','C'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',1,4,'D. Nada en absoluto','D'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',2,1,'A. Mucho','A'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',2,2,'B. Moderadamente','B'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',2,3,'C. Un poco','C'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',2,4,'D. Nada en absoluto','D'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',3,1,'A. Disfruta mucho','A'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',3,2,'B. Disfruta bastante','B'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',3,3,'C.  Disfruta tan sólo un poco','C'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',3,4,'D. No disfruta en absoluto','D'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',4,1,'A. Mucho','A'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',4,2,'B. Moderadamente','B'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',4,3,'C. Un poco','C'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',4,4,'D. Nada en absoluto','D'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',5,1,'A. Muy buena','A'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',5,2,'B. Buena','B'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',5,3,'C. Aceptable','C'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',5,4,'D. Insatisfactoria','D'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',15,1,'A. Mucho','A'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',15,2,'B. Moderadamente','B'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',16,1,'A. Mucho','A'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)',16,2,'B. Moderadamente','B');
/*!40000 ALTER TABLE `respuesta_pregunta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resultado`
--

DROP TABLE IF EXISTS `resultado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resultado` (
  `Folio` int(11) NOT NULL AUTO_INCREMENT,
  `Respuestas` varchar(2000) NOT NULL,
  `Puntuaciones` varchar(100) NOT NULL,
  `Puntuacion_Total` varchar(100) NOT NULL,
  `Diagnostico` varchar(150) NOT NULL,
  PRIMARY KEY (`Folio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resultado`
--

LOCK TABLES `resultado` WRITE;
/*!40000 ALTER TABLE `resultado` DISABLE KEYS */;
/*!40000 ALTER TABLE `resultado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resultado_grupo`
--

DROP TABLE IF EXISTS `resultado_grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resultado_grupo` (
  `Folio_Resultado` int(11) NOT NULL,
  `idGrupo` int(11) NOT NULL,
  KEY `idGrupo_idx` (`idGrupo`),
  CONSTRAINT `idGrupo_ResultadoGrupo` FOREIGN KEY (`idGrupo`) REFERENCES `grupo` (`idGrupo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resultado_grupo`
--

LOCK TABLES `resultado_grupo` WRITE;
/*!40000 ALTER TABLE `resultado_grupo` DISABLE KEYS */;
/*!40000 ALTER TABLE `resultado_grupo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud_test`
--

DROP TABLE IF EXISTS `solicitud_test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `solicitud_test` (
  `Nombre_Usuario` varchar(45) NOT NULL,
  `Nombre_Aplicador` varchar(45) NOT NULL,
  `Nombre_Test` varchar(100) NOT NULL,
  `Fecha` date NOT NULL,
  `Aceptada` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`Nombre_Usuario`,`Nombre_Aplicador`,`Nombre_Test`),
  KEY `Nombre_Usuario_Solicitud_idx` (`Nombre_Usuario`),
  KEY `Nombre_Aplicador_Solicitud_idx` (`Nombre_Aplicador`),
  KEY `solicitud_test_test_fk_idx` (`Nombre_Test`),
  CONSTRAINT `NombreAplicador_Sol` FOREIGN KEY (`Nombre_Aplicador`) REFERENCES `aplicador` (`NombreUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `NombreUsuario_Sol` FOREIGN KEY (`Nombre_Usuario`) REFERENCES `usuario` (`NombreUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `solicitud_test_test_fk` FOREIGN KEY (`Nombre_Test`) REFERENCES `test` (`Nombre`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud_test`
--

LOCK TABLES `solicitud_test` WRITE;
/*!40000 ALTER TABLE `solicitud_test` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitud_test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test` (
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` varchar(450) NOT NULL,
  `Eliminado` varchar(2) NOT NULL,
  PRIMARY KEY (`Nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
INSERT INTO `test` VALUES ('AUDIT','','No'),('Cuestionario autoaplicable de Orientación sexual de Almonte-Herskovic','','No'),('Cuestionario sobre consumo de sustancias','','No'),('Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)','','No'),('Escala Autoaplicada para la Medida de la Depresión de Zung y Conde','','No'),('Escala de Cribado de TDAH en Adultos (ASRS-V1.1)','','No'),('Escala de Riesgo Suicida de Plutchik','','No'),('Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)','','No'),('MASLACH BURNOUT INVENTORY (MBI)','','No'),('Test de Fagerstrom de Dependencia de Nicotina','','No');
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_grupo`
--

DROP TABLE IF EXISTS `test_grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test_grupo` (
  `Nombre_Test` varchar(100) NOT NULL,
  `idGrupo` int(11) NOT NULL,
  KEY `idGrupo_idx` (`idGrupo`),
  KEY `test_grupo_test_fk_idx` (`Nombre_Test`),
  CONSTRAINT `idGrupo_TestGrupo` FOREIGN KEY (`idGrupo`) REFERENCES `grupo` (`idGrupo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `test_grupo_test_fk` FOREIGN KEY (`Nombre_Test`) REFERENCES `test` (`Nombre`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_grupo`
--

LOCK TABLES `test_grupo` WRITE;
/*!40000 ALTER TABLE `test_grupo` DISABLE KEYS */;
/*!40000 ALTER TABLE `test_grupo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_usuario`
--

DROP TABLE IF EXISTS `test_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test_usuario` (
  `Nombre_Aplicador` varchar(45) NOT NULL,
  `Nombre_Usuario` varchar(45) NOT NULL,
  `Nombre_Test` varchar(100) NOT NULL,
  `Fecha` date NOT NULL,
  `Contestado` varchar(2) NOT NULL,
  `FechaContestado` date DEFAULT NULL,
  `Folio` int(11) DEFAULT NULL,
  PRIMARY KEY (`Nombre_Aplicador`,`Nombre_Usuario`,`Nombre_Test`,`Fecha`),
  KEY `Clave_Aplicador_idx` (`Nombre_Aplicador`),
  KEY `idUsuario_idx` (`Nombre_Usuario`),
  KEY `Folio_fk_idx` (`Folio`),
  KEY `FolioFk_tu_idx` (`Folio`),
  KEY `test_usuario_test_fk_idx` (`Nombre_Test`),
  CONSTRAINT `FolioFk_tu` FOREIGN KEY (`Folio`) REFERENCES `resultado` (`Folio`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `idUsuario_fk` FOREIGN KEY (`Nombre_Usuario`) REFERENCES `usuario` (`NombreUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `test_usuario_test_fk` FOREIGN KEY (`Nombre_Test`) REFERENCES `test` (`Nombre`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_usuario`
--

LOCK TABLES `test_usuario` WRITE;
/*!40000 ALTER TABLE `test_usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `test_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `NombreUsuario` varchar(45) NOT NULL,
  `Nombre` varchar(45) NOT NULL,
  `Apellidos` varchar(45) NOT NULL,
  `Correo` varchar(45) NOT NULL,
  `Sexo` varchar(6) NOT NULL,
  `FechaNacimiento` date NOT NULL,
  `Password` varchar(64) NOT NULL,
  `TienePareja` varchar(2) DEFAULT NULL,
  `TieneHijos` varchar(2) DEFAULT NULL,
  `ViveCon` varchar(45) DEFAULT NULL,
  `DependeDe` varchar(45) DEFAULT NULL,
  `ActividadFisica` varchar(2) DEFAULT NULL,
  `PosicionHijo` varchar(7) DEFAULT NULL,
  `PadreMedico` varchar(2) DEFAULT NULL,
  `EscolPaterna` varchar(45) DEFAULT NULL,
  `EscolMaterna` varchar(45) DEFAULT NULL,
  `EsAlumno` varchar(2) DEFAULT NULL,
  `CveUnica` int(11) DEFAULT NULL,
  PRIMARY KEY (`NombreUsuario`),
  KEY `Clave_unica_idx` (`CveUnica`),
  CONSTRAINT `Clave_unica` FOREIGN KEY (`CveUnica`) REFERENCES `alumno` (`Clave_unica`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES ('aaron.rios','Aaron','Rios','canario117aron@hotmail.com','Hombre','1993-03-29','953966adf495ef5f91b597e47190ed18d6992ec32884fe538b88d1976036de8f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('alvaro.alvarez','Alvaro','Alvarez Castañon','arcirius@gmail.com','Hombre','1989-02-03','effcb95dedafe40984c15c9e34851eaaeb8e3486f6bee48c68167fa424f38598','Si','No','Familia o pareja','Padre y/o madre','No','Primero','No','Estudió prepataroria o nivel técnico','Estudió prepataroria o nivel técnico','Si',164990),('asael.hernandez','Asael','Hernandez García','azzaeelhg@gmail.com','Hombre','1994-09-28','263b9ec50d0ae382c2469d61d1824bb932d46a1ecb86b09477942afdf39fb6ec','Si','No','Familia o pareja','Padre y/o madre','Si','Otro','No','Estudió prepataroria o nivel técnico','Estudió prepataroria o nivel técnico','Si',214873),('guillermo.hernandez','Guillermo Aldair','Hernandez García','guillermo@gmail.com','Hombre','1994-01-01','96615c9201433021b2ff16f87c8c47d414c1ccbb9af37d86f29fab2b0e2004e8',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_grupo`
--

DROP TABLE IF EXISTS `usuario_grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario_grupo` (
  `idUsuario` varchar(45) NOT NULL,
  `idGrupo` int(11) NOT NULL,
  KEY `idUsuario_idx` (`idUsuario`),
  KEY `idGrupo_idx` (`idGrupo`),
  CONSTRAINT `idGrupo_Grupo` FOREIGN KEY (`idGrupo`) REFERENCES `grupo` (`idGrupo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `idUsuario_Grupo` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`NombreUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_grupo`
--

LOCK TABLES `usuario_grupo` WRITE;
/*!40000 ALTER TABLE `usuario_grupo` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_grupo` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-10-27  0:35:23
