FROM node:20

WORKDIR /app

# Instalar Expo CLI globalmente
RUN npm install -g expo-cli @expo/ngrok

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puertos
EXPOSE 8081 19000 19001 19002

# Comando por defecto
CMD ["npm", "start"]