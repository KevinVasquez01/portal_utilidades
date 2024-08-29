##Dockerizar API NODE JS

FROM node:14
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD npm start


## Dockerizar API C#
##FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
##WORKDIR /app
##EXPOSE 44391
##ENV ASPNETCORE_URLS=http://+:44391
##ENV ASPNETCORE_URLS=http://+:80 DOTNET_RUNNING_IN_CONTAINER=true

##FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
##WORKDIR /src
##COPY ["UtilidadesAPI/UtilidadesAPI.csproj", "UtilidadesAPI/"]
##COPY ["UtilidadesDB_DataAccess/UtilidadesDB_DataAccess.csproj", "UtilidadesDB_DataAccess/"]
##RUN dotnet restore "./UtilidadesAPI/UtilidadesAPI.csproj"
##COPY . .
##WORKDIR "/src/UtilidadesAPI"
##RUN dotnet build "./UtilidadesAPI.csproj" -c Release -o /app/build

##FROM build AS publish
##RUN dotnet publish "./UtilidadesAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

##FROM base AS final
##WORKDIR /app
##COPY --from=publish /app/publish .
##COPY ["/swagger/v1/swagger.json", "/app/swagger.json"]  # Copiar archivo de configuración Swagger
##ENTRYPOINT ["dotnet", "UtilidadesAPI.dll"]


## Ejecución de comandos para docker

## docker build --no-cache --progress=plain -t utilidadesapi:1.1.1.1 .
## docker run -d -it --name api-container -p 90:44391/tcp utilidadesapi:1.1.1.1

##Subir Imagen a Docker Hub

## docker login
## docker tag utilidadesapi:1.1.1.1 kevinvasquez2001/api-utilidades:latest
## docker push kevinvasquez2001/api-utilidades:latest


##Ejecutar Imagen de Docker Hub en EC2

## ssh -i C:\Users\kevin.vasquez\.ssh\key-jb.pem ec2-user@3.23.46.170
## docker pull kevinvasquez2001/api-utilidades:latest
## docker run -d --name api-container -p 90:44391 kevinvasquez2001/api-utilidades:latest



