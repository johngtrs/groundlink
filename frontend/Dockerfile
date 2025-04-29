# frontend/Dockerfile
FROM node:20

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "run", "dev"]
