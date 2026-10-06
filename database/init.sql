-- Configuración explícita de codificación UTF-8 para soporte de tildes y caracteres especiales
SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS cv_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cv_db;

-- 1. Tabla: persona
CREATE TABLE IF NOT EXISTS persona (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    foto VARCHAR(500) NOT NULL,
    profesion VARCHAR(200) DEFAULT 'Ingeniera de Sistemas | Especialista en Calidad de Software & Tecnologías aplicadas al Aprendizaje',
    email VARCHAR(150) DEFAULT 'veravelasqueznoemirosio@gmail.com',
    telefono VARCHAR(50) DEFAULT '+591 78836023',
    linkedin VARCHAR(255) DEFAULT 'https://www.linkedin.com/in/noemi-rosio-vera-velasquez-30351a263',
    github VARCHAR(255) DEFAULT 'https://github.com/NoeVelasquez',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla: formacion
CREATE TABLE IF NOT EXISTS formacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    institucion VARCHAR(200) NOT NULL,
    anio VARCHAR(100) NOT NULL,
    persona_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (persona_id) REFERENCES persona(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserción de datos con caracteres correctamente codificados en UTF-8 y foto oficial
INSERT INTO persona (id, nombre, apellido, ciudad, foto, profesion, email, telefono, linkedin, github) 
VALUES (
    1, 
    'Noemi Rosio', 
    'Vera Velasquez', 
    'La Paz, Bolivia', 
    '/profile.jpg',
    'Ingeniera de Sistemas | Especialista en Calidad de Software & Tecnologías aplicadas al Aprendizaje',
    'veravelasqueznoemirosio@gmail.com',
    '+591 78836023',
    'https://www.linkedin.com/in/noemi-rosio-vera-velasquez-30351a263',
    'https://github.com/NoeVelasquez'
) ON DUPLICATE KEY UPDATE 
    nombre=VALUES(nombre), 
    apellido=VALUES(apellido), 
    ciudad=VALUES(ciudad), 
    foto=VALUES(foto),
    profesion=VALUES(profesion);

INSERT INTO formacion (titulo, institucion, anio, persona_id) 
VALUES 
(
    'Ingeniería de Sistemas', 
    'Universidad Salesiana de Bolivia', 
    'Graduada en 2022', 
    1
),
(
    'Diplomado en Educación Superior por Competencias y Tecnologías para el Aprendizaje y el Conocimiento (TAC)', 
    'Universidad Salesiana de Bolivia', 
    '2023', 
    1
),
(
    'Diplomado en Educación Superior', 
    'Universidad de Los Andes', 
    '2023', 
    1
),
(
    'Diplomado en Desarrollo Full Stack', 
    'Universidad Simón I. Patiño (USIP)', 
    'En curso (2026 – Actualidad)', 
    1
);
