# STEP 1 build static website
FROM node:10.15.1-alpine as builder

# Create app directory
RUN mkdir /app
WORKDIR /app

# Copy project files into the docker image
COPY ./ /app

# Install app dependencies
# RUN npm install --registry http://scr.saal.ai:4873
RUN npm install --silent --production

# Building the app
RUN npm run build


# STEP 2
FROM nginx:1.14.2-alpine

# Copy nginx config file into the docker image
COPY ./server.config /etc/nginx/nginx.conf

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# From 'builder' copy website to default nginx public folder
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
