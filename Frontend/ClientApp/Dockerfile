# Stage 1: Build
FROM node:16-alpine AS build
# Directorio donde se mantendran los archivos de la app
WORKDIR /usr/src/app
# Copiar el package.json y el package-lock en nuestro WORKDIR
COPY package*.json ./
# Instalar dependencias
RUN npm install --force
# Copiar todos los archivos
COPY . .
# Construir la aplicacion lista para produccion, puede no incluir el # flag --prod
RUN npm run build --prod

# Stage 2
FROM nginx:1.17.1-alpine

# Copiar desde la "Etapa" build el contenido de la carpeta build/
# dentro del directorio indicado en nginx
COPY --from=build /usr/src/app/dist/project /usr/share/nginx/html
# Copiar desde la "Etapa" build el contenido de la carpeta la 
# configuracion de nginx dentro del directorio indicado en nginx
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

## Ejecución de comandos para docker
## docker build --no-cache --progress=plain -t clientapp:1.1.1.1 .
## docker run -d --name pu-container -it -p 80:80/tcp clientapp:1.1.1.1
## http://localhost:80/

##Subir Imagen a Docker Hub

## docker login
## docker tag clientapp:1.1.1.1 kevinvasquez2001/portal-utilidades:latest
## docker push kevinvasquez2001/portal-utilidades:latest

##Ejecutar Imagen de Docker Hub en EC2

## ssh -i C:\Users\kevin.vasquez\.ssh\key-jb.pem ec2-user@3.23.46.170
## docker pull kevinvasquez2001/portal-utilidades:latest
## docker run -d --name pu-container -p 80:80 kevinvasquez2001/portal-utilidades:latest