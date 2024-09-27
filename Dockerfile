# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the app on port 3000
EXPOSE 3000

# Start the app
CMD [ "npm", "start" ]