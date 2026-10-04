FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source
COPY . .

# Expose Express port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
