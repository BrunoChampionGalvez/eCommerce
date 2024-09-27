# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app (compile TypeScript to JavaScript)
RUN npm run build

# Expose the app on port 3000
EXPOSE 8000

# Start the app in production mode
CMD ["npm", "run", "start:prod"]