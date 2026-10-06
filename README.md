# 🚀 Práctica Final: Despliegue de CV Personal Multicontenedor

Sistema web para visualización de CV personal desarrollado con arquitectura de microservicios e infraestructura como código utilizando **Docker**, **Docker Compose**, **React**, **Node.js (Express)** y **MySQL 8.0**.

---

## 🏛️ Arquitectura del Sistema

```
                         [ Navegador Web (Host) ]
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           │ HTTP :3000                                        │ HTTP :4000
           ▼                                                   ▼
┌───────────────────────┐                           ┌───────────────────────┐
│   Frontend (Nginx)    │                           │   Backend (Node.js)   │
│   via-frontend:v1     │                           │   via-backend:v1      │
│   Puerto: 3000        │                           │   Puerto: 4000        │
└──────────┬────────────┘                           └───────────┬───────────┘
           │                                                    │
           │             Red Docker: cv_network                 │
           └────────────────────────┬───────────────────────────┘
                                    │
                                    ▼
                         ┌───────────────────────┐
                         │   Database (MySQL)    │
                         │   mysql:8.0           │
                         │   Puerto: 3306        │
                         └──────────┬────────────┘
                                    │
                                    ▼ [Montaje de Volumen]
                         ┌───────────────────────┐
                         │  Volumen Persistente  │
                         │      mysql_data       │
                         └───────────────────────┘
```

---

## 📋 Requisitos Previos

- **Docker Desktop** (versión 20+ con Docker Compose v2)
- **Git**
- Cuenta activa en **Docker Hub** (para publicación)
- Cliente SQL como **DBeaver** (opcional para inspección directa)

---

## ⚡ Inicio Rápido (Un Solo Comando)

Para iniciar toda la aplicación automáticamente:

```bash
docker compose up -d --build
```

Al ejecutar este comando:
1. Se compilan las imágenes del frontend (`via-frontend:v1`) y backend (`via-backend:v1`).
2. Se inicia el contenedor de MySQL y se ejecuta automáticamente `database/init.sql` para crear las tablas `persona` y `formacion` e insertar los registros iniciales.
3. Se inicia el backend Node.js en el puerto `4000` y establece conexión con la base de datos.
4. Se inicia el frontend React montado sobre Nginx 1.27 Alpine en el puerto `3000`.

---

## 🌐 Enlaces de Acceso

| Servicio | URL | Descripción |
| :--- | :--- | :--- |
| **Frontend Web** | [http://localhost:3000](http://localhost:3000) | Aplicación React con interfaz de usuario moderna |
| **API Endpoint CV** | [http://localhost:4000/cv](http://localhost:4000/cv) | Endpoint JSON consumido por el frontend |
| **Health Check** | [http://localhost:4000/health](http://localhost:4000/health) | Estado del servidor y conexión a MySQL |

---

## 📦 Publicación en Docker Hub

Para etiquetar y subir las imágenes a tu cuenta de Docker Hub con el formato obligatorio `apellido-frontend:v1` y `apellido-backend:v1`:

```powershell
# 1. Iniciar sesión en Docker Hub
docker login

# 2. Reemplaza 'TU_USUARIO' por tu nombre de usuario de Docker Hub (ej: marcoviaweb)
$USUARIO = "tu_usuario"

# 3. Etiquetar las imágenes construidas
docker tag via-frontend:v1 ${USUARIO}/via-frontend:v1
docker tag via-backend:v1 ${USUARIO}/via-backend:v1

# 4. Subir las imágenes
docker push ${USUARIO}/via-frontend:v1
docker push ${USUARIO}/via-backend:v1
```

O ejecuta el script automatizado:
```powershell
.\publish-dockerhub.ps1 -DockerUser "tu_usuario"
```

---

## 🛠️ Comandos de Administración y Verificación

### 1. Ver el estado de los contenedores:
```bash
docker compose ps
```

### 2. Ver logs en tiempo real:
```bash
docker compose logs -f
```

### 3. Verificar el volumen de persistencia:
```bash
docker volume ls
```

### 4. Verificar la red de Docker:
```bash
docker network inspect practica-final_cv_network
```

### 5. Detener todos los servicios:
```bash
docker compose down
```

### 6. Detener y borrar volúmenes (limpieza total):
```bash
docker compose down -v
```

---

## 🗄️ Estructura de la Base de Datos

### Tabla `persona`
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INT (PK, AutoIncrement) | Identificador único |
| `nombre` | VARCHAR(100) | Nombres |
| `apellido` | VARCHAR(100) | Apellidos |
| `ciudad` | VARCHAR(100) | Ciudad de residencia |
| `foto` | VARCHAR(255) | URL de fotografía de perfil |

### Tabla `formacion`
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INT (PK, AutoIncrement) | Identificador único |
| `titulo` | VARCHAR(150) | Grado / Título obtenido |
| `institucion` | VARCHAR(150) | Casa de estudios |
| `anio` | VARCHAR(50) | Periodo o año de titulación |
| `persona_id` | INT (FK) | Relación a `persona.id` |
