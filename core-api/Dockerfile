FROM node:18-alpine

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

# Install dependencies and rebuild native modules
RUN npm install && npm rebuild bcrypt --build-from-source

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
