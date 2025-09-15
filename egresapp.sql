-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-09-2025 a las 18:31:08
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `egresapp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumno`
--

CREATE TABLE `alumno` (
  `id_alumno` int(11) NOT NULL,
  `Telefóno` int(11) NOT NULL,
  `Cedula` int(11) NOT NULL,
  `Mail` varchar(200) NOT NULL,
  `Nombre` varchar(200) NOT NULL,
  `Escolaridad` varchar(200) NOT NULL,
  `Apellido` varchar(200) NOT NULL,
  `Curso` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `Id_empresa` int(11) NOT NULL,
  `Nombre_empresa` varchar(200) NOT NULL,
  `Teléfono` int(11) NOT NULL,
  `Mail` varchar(200) NOT NULL,
  `Dirección` varchar(200) NOT NULL,
  `Enfoque` varchar(200) NOT NULL,
  `id_llamado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ex-alumno`
--

CREATE TABLE `ex-alumno` (
  `id_Ex-Alumno` int(11) NOT NULL,
  `Nombre` varchar(200) NOT NULL,
  `Apellido` varchar(200) NOT NULL,
  `Fecha_Egresado` date NOT NULL,
  `Título` varchar(200) NOT NULL,
  `Teléfono` int(11) NOT NULL,
  `Mail` varchar(200) NOT NULL,
  `Cedula` int(11) NOT NULL,
  `Currículum` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `llamado`
--

CREATE TABLE `llamado` (
  `id_llamado` int(11) NOT NULL,
  `Salario` int(11) NOT NULL,
  `Horario` text NOT NULL,
  `Tipo` varchar(200) NOT NULL,
  `Descripción` text NOT NULL,
  `Nombre_Oferta` varchar(10) NOT NULL,
  `id_empresa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `llamado`
--

INSERT INTO `llamado` (`id_llamado`, `Salario`, `Horario`, `Tipo`, `Descripción`, `Nombre_Oferta`, `id_empresa`) VALUES
(1, 3500, '8hrs', 'Trabajo', 'Desarrollador backend', 'Desarrolla', 0),
(2, 50000, '8hrs', 'Trabajo', 'Diseñador gráfico', 'Diseñador ', 0),
(3, 3001, '0000-00-00', 'Pasantia', 'Gerente de proyecto', 'Gerente de', 0),
(4, 3200, '0000-00-00', 'Trabajo', 'Desarrollador Frontend', 'Coso', 0),
(8, 4201, '0000-00-00', 'Trabajo', 'Ingeniero de Software Senior con experiencia en Java y Spring Boot. Requisitos: 5+ años de experiencia, inglés avanzado y disponibilidad para trabajo híbrido (3 días oficina/2 días remoto). Beneficios: seguro médico, bonos por desempeño y capacitaciones pagas.', 'Fabian', 0),
(11, 50000, '8hrs', 'trabajo', 'a', 'a', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `postulacion`
--

CREATE TABLE `postulacion` (
  `Fecha` varchar(450) NOT NULL,
  `Postulante` varchar(450) NOT NULL,
  `Oferta` varchar(450) NOT NULL,
  `id_postulacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alumno`
--
ALTER TABLE `alumno`
  ADD PRIMARY KEY (`id_alumno`);

--
-- Indices de la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`Id_empresa`),
  ADD KEY `Publica` (`id_llamado`);

--
-- Indices de la tabla `ex-alumno`
--
ALTER TABLE `ex-alumno`
  ADD PRIMARY KEY (`id_Ex-Alumno`);

--
-- Indices de la tabla `llamado`
--
ALTER TABLE `llamado`
  ADD PRIMARY KEY (`id_llamado`);

--
-- Indices de la tabla `postulacion`
--
ALTER TABLE `postulacion`
  ADD PRIMARY KEY (`id_postulacion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alumno`
--
ALTER TABLE `alumno`
  MODIFY `id_alumno` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `Id_empresa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ex-alumno`
--
ALTER TABLE `ex-alumno`
  MODIFY `id_Ex-Alumno` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `llamado`
--
ALTER TABLE `llamado`
  MODIFY `id_llamado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `postulacion`
--
ALTER TABLE `postulacion`
  MODIFY `id_postulacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD CONSTRAINT `Publica` FOREIGN KEY (`id_llamado`) REFERENCES `alumno` (`id_alumno`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
