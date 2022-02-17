-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        8.0.27 - MySQL Community Server - GPL
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- 导出 g 的数据库结构
CREATE DATABASE IF NOT EXISTS `g` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `g`;

-- 导出  表 g.result 结构
CREATE TABLE IF NOT EXISTS `result` (
  `id` int NOT NULL AUTO_INCREMENT,
  `round` int NOT NULL DEFAULT '0' COMMENT '轮数',
  `date` date DEFAULT NULL,
  `captain1_uid` int DEFAULT NULL,
  `captain2_uid` int DEFAULT NULL,
  `result` int DEFAULT NULL COMMENT '1为captain1_uid赢，2为captain2_uid， 3为平',
  `score` varchar(50) DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `round` (`round`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb3;

-- 正在导出表  g.result 的数据：~3 rows (大约)
/*!40000 ALTER TABLE `result` DISABLE KEYS */;
INSERT INTO `result` (`id`, `round`, `date`, `captain1_uid`, `captain2_uid`, `result`, `score`, `remark`, `createdAt`, `updatedAt`) VALUES
	(22, 1, '2022-02-16', 7, 9, 1, '2:1', NULL, '2022-02-14', '2022-02-14'),
	(23, 2, '2022-02-19', 12, 11, 1, '2:1', NULL, '2022-02-14', '2022-02-14'),
	(24, 13, '2022-02-02', 8, 9, 1, '1', NULL, '2022-02-15', '2022-02-15'),
	(25, 3, '2022-02-15', 9, 7, 1, '1', NULL, '2022-02-17', '2022-02-17'),
	(26, 56, '2022-02-02', 9, NULL, 1, NULL, NULL, '2022-02-17', '2022-02-17'),
	(27, 32, '2022-02-04', NULL, NULL, 1, NULL, NULL, '2022-02-17', '2022-02-17'),
	(28, 321, NULL, NULL, NULL, NULL, NULL, NULL, '2022-02-17', '2022-02-17');
/*!40000 ALTER TABLE `result` ENABLE KEYS */;

-- 导出  表 g.team 结构
CREATE TABLE IF NOT EXISTS `team` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int DEFAULT NULL,
  `captain_uid` int DEFAULT NULL,
  `team` int DEFAULT NULL,
  `result` int DEFAULT NULL COMMENT '1为赢，2为输， 3为平',
  `result_id` int DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb3;

-- 正在导出表  g.team 的数据：~17 rows (大约)
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
INSERT INTO `team` (`id`, `uid`, `captain_uid`, `team`, `result`, `result_id`, `createdAt`, `updatedAt`) VALUES
	(33, 2, 7, 1, 1, 22, '2022-02-14', '2022-02-14'),
	(34, 6, 7, 1, 1, 22, '2022-02-14', '2022-02-14'),
	(35, 7, 7, 1, 1, 22, '2022-02-14', '2022-02-14'),
	(36, 3, 9, 1, 2, 22, '2022-02-14', '2022-02-14'),
	(37, 4, 9, 1, 2, 22, '2022-02-14', '2022-02-14'),
	(38, 9, 9, 1, 2, 22, '2022-02-14', '2022-02-14'),
	(39, 5, 12, 2, 1, 23, '2022-02-14', '2022-02-14'),
	(40, 6, 12, 2, 1, 23, '2022-02-14', '2022-02-14'),
	(41, 12, 12, 2, 1, 23, '2022-02-14', '2022-02-14'),
	(42, 2, 11, 2, 2, 23, '2022-02-14', '2022-02-14'),
	(43, 3, 11, 2, 2, 23, '2022-02-14', '2022-02-14'),
	(44, 4, 11, 1, 2, 23, '2022-02-14', '2022-02-14'),
	(45, 11, 11, 1, 2, 23, '2022-02-14', '2022-02-14'),
	(46, 5, 8, 1, 1, 24, '2022-02-15', '2022-02-15'),
	(47, 8, 8, 1, 1, 24, '2022-02-15', '2022-02-15'),
	(48, 2, 9, 2, 2, 24, '2022-02-15', '2022-02-15'),
	(49, 9, 9, 2, 2, 24, '2022-02-15', '2022-02-15'),
	(50, 9, 9, 2, 1, 25, '2022-02-17', '2022-02-17'),
	(51, 7, 7, 2, 2, 25, '2022-02-17', '2022-02-17'),
	(52, 9, 9, 2, 1, 26, '2022-02-17', '2022-02-17'),
	(53, NULL, NULL, NULL, 2, 26, '2022-02-17', '2022-02-17'),
	(54, NULL, NULL, NULL, 1, 27, '2022-02-17', '2022-02-17'),
	(55, NULL, NULL, NULL, 2, 27, '2022-02-17', '2022-02-17');
/*!40000 ALTER TABLE `team` ENABLE KEYS */;

-- 导出  表 g.user 结构
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `number` int DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3;

-- 正在导出表  g.user 的数据：~19 rows (大约)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `name`, `number`, `createdAt`, `updatedAt`) VALUES
	(2, 'lyf', 50, '2022-01-11', '2022-01-11'),
	(3, 'long', 7, '2022-01-11', '2022-01-11'),
	(4, 'ak', 10, '2022-01-11', '2022-01-11'),
	(5, 'jason', 5, '2022-01-11', '2022-01-11'),
	(6, '檀', 17, '2022-01-11', '2022-01-11'),
	(7, 'toto', 1, '2022-01-11', '2022-01-11'),
	(8, 'longlong', 11, '2022-01-11', '2022-01-11'),
	(9, 'joker', 3, '2022-01-11', '2022-02-04'),
	(10, 'kevin', 12, '2022-02-04', '2022-02-04'),
	(11, 'sherman', 9, NULL, NULL),
	(12, '鸡毛菜', 8, NULL, NULL),
	(13, '1', 2, '2022-02-12', '2022-02-12'),
	(14, '321', 32, '2022-02-12', '2022-02-12'),
	(15, '312', 999, '2022-02-12', '2022-02-12'),
	(17, '32131321', 13, '2022-02-12', '2022-02-12'),
	(18, '3214314', 996, '2022-02-12', '2022-02-12'),
	(19, '31231', 54, '2022-02-12', '2022-02-12'),
	(20, '32132143', 444, '2022-02-12', '2022-02-12'),
	(21, '41342', 432, '2022-02-12', '2022-02-12');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
