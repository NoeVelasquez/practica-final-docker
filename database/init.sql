-- Base de datos para la Práctica Final de Docker
-- Creación y selección de la base de datos
CREATE DATABASE IF NOT EXISTS cv_db;
USE cv_db;

-- 1. Tabla: persona
CREATE TABLE IF NOT EXISTS persona (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    foto VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla: formacion
CREATE TABLE IF NOT EXISTS formacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    institucion VARCHAR(150) NOT NULL,
    anio VARCHAR(50) NOT NULL,
    persona_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (persona_id) REFERENCES persona(id) ON DELETE CASCADE
);

-- Inserción de datos iniciales requeridos
INSERT INTO persona (id, nombre, apellido, ciudad, foto) 
VALUES (
    1, 
    'Marco', 
    'Via', 
    'La Paz, Bolivia', 
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
) ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

INSERT INTO formacion (titulo, institucion, anio, persona_id) 
VALUES 
(
    'Licenciatura en Ingeniería de Sistemas', 
    'Universidad Mayor de San Andrés', 
    '2018 - 2023', 
    1
),
(
    'Diplomado en DevOps, Docker & Cloud Architecture', 
    'Universidad Simón I. Patiño (USIP)', 
    '2024', 
    1
),
(
    'Especialización en Desarrollo Web Full Stack & Microservicios', 
    'Tech Institute Internacional', 
    '2024 - 2025', 
    1
);
