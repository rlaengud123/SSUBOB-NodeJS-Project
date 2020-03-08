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
-- Table structure for table `menu_img`
--

DROP TABLE IF EXISTS `menu_img`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_img` (
  `menu_img_id` int(11) NOT NULL AUTO_INCREMENT,
  `img_name` varchar(32) NOT NULL,
  `img_url` varchar(250) NOT NULL,
  `menu_id` int(11) NOT NULL,
  PRIMARY KEY (`menu_img_id`),
  KEY `menu_id` (`menu_id`),
  CONSTRAINT `menu_img_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_img`
--

LOCK TABLES `menu_img` WRITE;
/*!40000 ALTER TABLE `menu_img` DISABLE KEYS */;
INSERT INTO `menu_img` VALUES (1,'19081501_지지고 라이스_rice.jpg','https://ssubobnodejs.s3.ap-northeast-2.amazonaws.com/images/menu/19081501_%EC%A7%80%EC%A7%80%EA%B3%A0%20%EB%9D%BC%EC%9D%B4%EC%8A%A4_rice.jpg',1),(2,'19081501_도스마스_buritto.jpg','https://ssubobnodejs.s3.ap-northeast-2.amazonaws.com/images/menu/19081501_%EB%8F%84%EC%8A%A4%EB%A7%88%EC%8A%A4_buritto.jpg',2),(3,'19081501_떡볶이 1인분_hyunsun2.jpg','https://ssubobnodejs.s3.ap-northeast-2.amazonaws.com/images/menu/19081501_%EB%96%A1%EB%B3%B6%EC%9D%B4%201%EC%9D%B8%EB%B6%84_hyunsun2.jpg',3),(5,'19081600_지지고 누들_noodle.jpg','https://ssubobnodejs.s3.ap-northeast-2.amazonaws.com/images/menu/19081600_%EC%A7%80%EC%A7%80%EA%B3%A0%20%EB%88%84%EB%93%A4_noodle.jpg',8),(6,'19081600_지지고 라이스 세트_rice.jpg','https://ssubobnodejs.s3.ap-northeast-2.amazonaws.com/images/menu/19081600_%EC%A7%80%EC%A7%80%EA%B3%A0%20%EB%9D%BC%EC%9D%B4%EC%8A%A4%20%EC%84%B8%ED%8A%B8_rice.jpg',9),(7,'19081601_지지고 누들 세트_noodle.jpg','https://ssubobnodejs.s3.ap-northeast-2.amazonaws.com/images/menu/19081601_%EC%A7%80%EC%A7%80%EA%B3%A0%20%EB%88%84%EB%93%A4%20%EC%84%B8%ED%8A%B8_noodle.jpg',10);
/*!40000 ALTER TABLE `menu_img` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-16  2:38:57
