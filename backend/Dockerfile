# Imagen base oficial especificada en los requerimientos
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar manifiestos de dependencias para aprovechar la caché de capas de Docker
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --omit=dev

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto de la API especificado
EXPOSE 4000

# Comando para iniciar el servidor
CMD ["node", "server.js"]
