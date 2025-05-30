# Para desarrollo
FROM node:18-alpine AS development

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
