# Script para compilar, etiquetar y publicar imágenes en Docker Hub
param(
    [string]$DockerUser = "marcoviaweb",
    [string]$Apellido = "via",
    [string]$Tag = "v1"
)

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "🚀 Publicador Automático de Imágenes a Docker Hub" -ForegroundColor Yellow
Write-Host "Usuario Docker Hub: $DockerUser" -ForegroundColor Green
Write-Host "Nombre Frontend   : ${DockerUser}/${Apellido}-frontend:${Tag}" -ForegroundColor Green
Write-Host "Nombre Backend    : ${DockerUser}/${Apellido}-backend:${Tag}" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Cyan

# 1. Login
Write-Host "`n🔑 Verificando inicio de sesión en Docker Hub..." -ForegroundColor Yellow
docker login

# 2. Build local
Write-Host "`n🔨 Construyendo imágenes con Docker Compose..." -ForegroundColor Yellow
docker compose build

# 3. Tag Frontend
Write-Host "`n🏷️ Etiquetando imagen de Frontend..." -ForegroundColor Yellow
docker tag "${Apellido}-frontend:${Tag}" "${DockerUser}/${Apellido}-frontend:${Tag}"

# 4. Tag Backend
Write-Host "`n🏷️ Etiquetando imagen de Backend..." -ForegroundColor Yellow
docker tag "${Apellido}-backend:${Tag}" "${DockerUser}/${Apellido}-backend:${Tag}"

# 5. Push Frontend
Write-Host "`n📤 Subiendo Frontend a Docker Hub..." -ForegroundColor Yellow
docker push "${DockerUser}/${Apellido}-frontend:${Tag}"

# 6. Push Backend
Write-Host "`n📤 Subiendo Backend a Docker Hub..." -ForegroundColor Yellow
docker push "${DockerUser}/${Apellido}-backend:${Tag}"

Write-Host "`n✅ ¡Imágenes publicadas exitosamente en Docker Hub!" -ForegroundColor Green
Write-Host "Repositorios disponibles en:" -ForegroundColor Cyan
Write-Host "- https://hub.docker.com/r/${DockerUser}/${Apellido}-frontend" -ForegroundColor White
Write-Host "- https://hub.docker.com/r/${DockerUser}/${Apellido}-backend" -ForegroundColor White
