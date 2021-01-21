-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 21, 2021 at 05:55 PM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.10

SET SQL_MODE
= "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT
= 0;
START TRANSACTION;
SET time_zone
= "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin`
(
  `id` int
(11) NOT NULL,
  `email` varchar
(50) NOT NULL,
  `password` varchar
(256) NOT NULL,
  `fullname` varchar
(50) NOT NULL,
  `image` varchar
(50) NOT NULL,
  `role` varchar
(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `admin` (`id`, `email`, `password`, `fullname`, `image`, `role`) VALUES (6, 'admin@mail.com', '$2a$12$vVy69Mw4G1aA.TAPEWhbIeET4.Xe2y78rJjh7mHHRzpGC5Hake95W', 'admin', 'admin.png', 'Administrator'),
(7, 'john@mail.com', '$2a$12$KNFnAwGNP22oOC2JcKVxr.6K1G99Kuld4v1CmVc9YjKcMe8Mk8Fru', 'john doe', 'john doe.png', 'Standard');

-- --------------------------------------------------------

--
-- Table structure for table `tiket`
--

CREATE TABLE `tiket`
(
  `id` int
(11) NOT NULL,
  `no_internet` varchar
(50) NOT NULL,
  `sn` varchar
(50) NOT NULL,
  `status` varchar
(10) NOT NULL,
  `alamat` varchar
(50) NOT NULL,
  `created_at` varchar
(50) NOT NULL,
  `updated_at` varchar
(50) NOT NULL,
  `keterangan` varchar
(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `tiket` (`id`, `no_internet`, `sn`, `status`, `alamat`, `created_at`, `updated_at`, `keterangan`) VALUES (3, '1231s121', '343dee3', 'NOK', 'Bekasi TImur, Jawa Barat', '2021-01-21, 22:26', '2021-01-21, 22:59', 'lorem ipsum dolor sit amet'), (4, '12sd2312a', '12sasw2', 'Done', 'Tambun selatan', '2021-01-21, 22:50', '2021-01-21, 22:59', 'lorem ipsum dolor sit amet');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
ADD PRIMARY KEY
(`id`);

--
-- Indexes for table `tiket`
--
ALTER TABLE `tiket`
ADD PRIMARY KEY
(`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int
(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tiket`
--
ALTER TABLE `tiket`
  MODIFY `id` int
(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
