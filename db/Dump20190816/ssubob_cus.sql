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
-- Table structure for table `cus`
--

DROP TABLE IF EXISTS `cus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cus` (
  `cus_id` int(11) NOT NULL AUTO_INCREMENT,
  `cus_name` varchar(32) NOT NULL,
  `cus_ph` varchar(12) NOT NULL,
  `cus_email` varchar(255) NOT NULL,
  `cus_pwd` varchar(255) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `admin_id` int(11) NOT NULL,
  PRIMARY KEY (`cus_id`),
  UNIQUE KEY `cus_email` (`cus_email`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `cus_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cus`
--

LOCK TABLES `cus` WRITE;
/*!40000 ALTER TABLE `cus` DISABLE KEYS */;
INSERT INTO `cus` VALUES (1,'김두형','01058970403','enguddkdlel@naver.com','060e2aa5399bd6d89764e1981a2f05b973e254814814d4d7657d27abbe144e918a2e7a26dc1f08f632daa36958af56c060d2ed1a5d7a0a68c1dc1dac6cb42e5d','836177769436','2019-08-10 19:48:50',1),(2,'test','test','test','94540d9eee6dba255ab6d5f49adce480074543fb20650d84ba25d688e5b13f335fad621182fd830cd04eb6d258a48c160698ecd4aa9f513f6f9cef8420c286b9','111354470706','2019-08-10 19:49:07',2);
/*!40000 ALTER TABLE `cus` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-16  2:38:55
