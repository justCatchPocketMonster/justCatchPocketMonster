# Utilisez une image de base Node.js
FROM node:18

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le package.json et le package-lock.json dans le conteneur
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez tout le reste du code source dans le conteneur
COPY . .

# Port sur lequel l'application écoutera à l'intérieur du conteneur
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
