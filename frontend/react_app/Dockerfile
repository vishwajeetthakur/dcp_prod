# Sample Dockerfile for React
FROM node:16.20.2

WORKDIR /usr/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY . .

# Create a production build
RUN npm run build

# Install serve globally
RUN npm install -g serve

# CMD ["npm", "start"]

# Serve the built app on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]