-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: ssubob
-- ------------------------------------------------------
-- Server version	8.0.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `recipe_table`
--

DROP TABLE IF EXISTS `recipe_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_table` (
  `recipe_table_id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_id` int(11) NOT NULL,
  `cus_id` int(11) NOT NULL,
  `option_category_id` int(11) NOT NULL,
  `option_id` int(11) NOT NULL,
  `temp_recipe_id` int(11) NOT NULL,
  PRIMARY KEY (`recipe_table_id`),
  KEY `menu_id` (`menu_id`),
  KEY `cus_id` (`cus_id`),
  KEY `option_category_id` (`option_category_id`),
  KEY `option_id` (`option_id`),
  KEY `temp_recipe_id` (`temp_recipe_id`),
  CONSTRAINT `recipe_table_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipe_table_ibfk_2` FOREIGN KEY (`cus_id`) REFERENCES `cus` (`cus_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipe_table_ibfk_3` FOREIGN KEY (`option_category_id`) REFERENCES `menu_option_category` (`option_category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipe_table_ibfk_4` FOREIGN KEY (`option_id`) REFERENCES `menu_option` (`option_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipe_table_ibfk_5` FOREIGN KEY (`temp_recipe_id`) REFERENCES `temp_recipe` (`temp_recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_table`
--

LOCK TABLES `recipe_table` WRITE;
/*!40000 ALTER TABLE `recipe_table` DISABLE KEYS */;
/*!40000 ALTER TABLE `recipe_table` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-27  2:50:27
