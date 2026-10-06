# Etapa 1: Construcción de la aplicación React con Node.js
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor web ultraligero con Nginx 1.27 Alpine especificado
FROM nginx:1.27-alpine

# Copiar configuración personalizada de Nginx para escuchar en puerto 3000
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos compilados desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 3000 especificado para el frontend
EXPOSE 3000

# Iniciar Nginx en primer plano dentro del contenedor
CMD ["nginx", "-g", "daemon off;"]
