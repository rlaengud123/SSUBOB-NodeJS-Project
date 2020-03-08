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
-- Table structure for table `shop_img`
--

DROP TABLE IF EXISTS `shop_img`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_img` (
  `shop_img_id` int(11) NOT NULL AUTO_INCREMENT,
  `img_name` varchar(32) NOT NULL,
  `img_url` varchar(250) NOT NULL,
  `shop_id` int(11) NOT NULL,
  PRIMARY KEY (`shop_img_id`),
  KEY `shop_id` (`shop_id`),
  CONSTRAINT `shop_img_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`shop_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_img`
--

LOCK TABLES `shop_img` WRITE;
/*!40000 ALTER TABLE `shop_img` DISABLE KEYS */;
INSERT INTO `shop_img` VALUES (1,'19081501_지지고_images.jpg','https://ssubobnodejs.s3.ap-northeast-2.amazonaws.com/images/shop/19081501_%EC%A7%80%EC%A7%80%EA%B3%A0_images.jpg',1),(2,'19081501_도스마스_dosmas.jpg','https://ssubobnodejs.s3.ap-northeast-2.amazonaws.com/images/shop/19081501_%EB%8F%84%EC%8A%A4%EB%A7%88%EC%8A%A4_dosmas.jpg',2),(3,'19081501_현선이네_hyunsun.jpg','https://ssubobnodejs.s3.ap-northeast-2.amazonaws.com/images/shop/19081501_%ED%98%84%EC%84%A0%EC%9D%B4%EB%84%A4_hyunsun.jpg',3);
/*!40000 ALTER TABLE `shop_img` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-26 21:31:03
