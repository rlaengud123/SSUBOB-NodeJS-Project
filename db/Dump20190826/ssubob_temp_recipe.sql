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
-- Table structure for table `temp_recipe`
--

DROP TABLE IF EXISTS `temp_recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `temp_recipe` (
  `temp_recipe_id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_id` int(11) NOT NULL,
  `recipe_table` varchar(500) NOT NULL,
  `recipe_price` int(11) NOT NULL,
  `cus_id` int(11) NOT NULL,
  `salt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`temp_recipe_id`),
  KEY `cus_id` (`cus_id`),
  KEY `menu_id` (`menu_id`),
  CONSTRAINT `temp_recipe_ibfk_1` FOREIGN KEY (`cus_id`) REFERENCES `cus` (`cus_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `temp_recipe_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temp_recipe`
--

LOCK TABLES `temp_recipe` WRITE;
/*!40000 ALTER TABLE `temp_recipe` DISABLE KEYS */;
INSERT INTO `temp_recipe` VALUES (1,2,'<table><tr><td>주문메뉴</td><td>도스마스</td></tr><tr><td>기본토핑</td><td>돼지고기, 추가금액 없음</td></tr><tr><td>음료수</td><td>콜라, 추가금액 없음</td></tr><tr><td>가격</td><td>6000</td></tr>',6000,2,'170334139502'),(2,2,'<table><tr><td>주문메뉴</td><td>도스마스</td></tr><tr><td>기본토핑</td><td>돼지고기, 추가금액 없음</td></tr><tr><td>음료수</td><td>콜라, 추가금액 없음</td></tr><tr><td>추가토핑1</td><td>소세지, 추가금액 +1000원</td></tr><tr><td>추가토핑2</td><td>치즈, 추가금액 +1000원</td></tr><tr><td>가격</td><td>6000</td></tr>',6000,2,'959387986262'),(4,2,'<table><tr><td>주문메뉴</td><td>도스마스</td></tr><tr><td>기본토핑</td><td>돼지고기, 추가금액 없음</td></tr><tr><td>음료수</td><td>콜라, 추가금액 없음</td></tr><tr><td>추가토핑1</td><td>소세지, 추가금액 +1000원</td></tr><tr><td>추가토핑2</td><td>치즈, 추가금액 +1000원</td></tr><tr><td>가격</td><td>6000</td></tr>',6000,2,'340556497621'),(5,2,'<table><tr><td>주문메뉴</td><td>도스마스</td></tr><tr><td>기본토핑</td><td>돼지고기, 추가금액 없음</td></tr><tr><td>음료수</td><td>콜라, 추가금액 없음</td></tr><tr><td>추가토핑1</td><td>소세지, 추가금액 +1000원</td></tr><tr><td>추가토핑2</td><td>치즈, 추가금액 +1000원</td></tr><tr><td>가격</td><td>6000</td></tr><tr> <td> 테이크아웃 시간 </td> <td> 10시 20분 </td> </tr> <tr> <td> 요청사항 </td> <td>  </td></tr></table>',6000,2,'495333857769'),(6,2,'<table><tr><td>주문메뉴</td><td>도스마스</td></tr><tr><td>기본토핑</td><td>돼지고기, 추가금액 없음</td></tr><tr><td>음료수</td><td>콜라, 추가금액 없음</td></tr><tr><td>추가토핑1</td><td>소세지, 추가금액 +1000원</td></tr><tr><td>추가토핑2</td><td>치즈, 추가금액 +1000원</td></tr><tr><td>가격</td><td>6000</td></tr>',6000,2,'512319690064'),(7,2,'<table><tr><td>주문메뉴</td><td>도스마스</td></tr><tr><td>기본토핑</td><td>돼지고기, 추가금액 없음</td></tr><tr><td>음료수</td><td>콜라, 추가금액 없음</td></tr><tr><td>추가토핑1</td><td>소세지, 추가금액 +1000원</td></tr><tr><td>추가토핑2</td><td>치즈, 추가금액 +1000원</td></tr><tr><td>가격</td><td>6000</td></tr>',6000,2,'286805480042'),(9,2,'<table><tr><td>주문메뉴</td><td>도스마스</td></tr><tr><td>기본토핑</td><td>돼지고기, 추가금액 없음</td></tr><tr><td>음료수</td><td>콜라, 추가금액 없음</td></tr><tr><td>가격</td><td>6000</td></tr>',6000,2,'1492414631415'),(10,2,'<table><tr><td>주문메뉴</td><td>도스마스</td></tr><tr><td>기본토핑</td><td>돼지고기, 추가금액 없음</td></tr><tr><td>음료수</td><td>콜라, 추가금액 없음</td></tr><tr><td>가격</td><td>6000</td></tr>',6000,2,'587741055908'),(11,2,'<table><tr><td>주문메뉴</td><td>도스마스</td></tr><tr><td>기본토핑</td><td>돼지고기, 추가금액 없음</td></tr><tr><td>음료수</td><td>콜라, 추가금액 없음</td></tr><tr><td>가격</td><td>6000</td></tr>',6000,2,'1241407234857');
/*!40000 ALTER TABLE `temp_recipe` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-26 21:31:07
