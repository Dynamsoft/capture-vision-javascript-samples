# Use the official Node.js 18 image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install playright browsers
RUN npx playwright install --with-deps

# Install http-server globally
RUN npm install -g http-server

# Install openssl
RUN apt-get update && apt-get install -y openssl

# Generate SSL certificate and key
RUN openssl req -nodes -new -x509 -keyout server.key -out server.cert -subj "/CN=localhost"

# Copy the rest of the application code
COPY . .

# Run http-server with SSL
# RUN http-server -S -C server.cert -K server.key -p 8080

# Define the command to run the tests
CMD ["npm", "run", "test"]

