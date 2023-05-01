# API
La api consiste en una aplicacion en nodeJS que utiliza websocket para el envio de informacion en tiempo real que se obtiene de una base de datos MySQL y su visualizacion en una web creada en React.

## Archivos

### database.js
En este archivo se encuentra una funcion que se utiliza para conectar con la base de datos de MySQL.

```JS
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD
});

const getConnection = () => {
    return connection.promise();
}

module.exports = {
    getConnection
}
```

Este archivo depende de las variables de entrono:
- HOST: Contiene la ip del servidor
- DATABASE: Contiene el nombre de la base de datos
- USER_NAME: Contiene el nombre de Usuario
- PASSWORD: Contiene la contrase;a del usuario

### index.js

En este archivo se ejecuta el servidor de la api la cual utiliza socket.io para una conexion en tiempo real:

```JS
#Creacion de condiciones iniciales del servidor
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

#Llamada a la conexion con la base de datos
const { getConnection } = require("./database");

#Ejecutar la aplicacion en el puerto 8080
app.use(cors());
app.set("port", 8080);

const server = http.createServer(app);

#Permitir acceso desde cualquier direccion
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET"],
  },
});

#Acciones al conectar con el servidor
io.on("connection", (socket) => {
  console.log(`Usuario conectado`);

  #Funcion para obtener las informacion de la base de datos
  const emitir = async () => {
    const connection = getConnection();
    const [result] = await connection.query(`call topDPresidente();`);
    const [result1] = await connection.query(`call cantVotosD();`);
    const [result2] = await connection.query(`call cantVotosM();`);
    const [result3] = await connection.query(`call totalVotos();`);
    const result4 = await connection.query(`select * from Voto;`);
    const actual = new Date();

    socket.emit("consultar", {
      top: result[0],
      votosD: result1[0],
      votosM: result2[0],
      total: result3[0],
      general: result4,
      fecha: actual
    });
  };

  # Funcion para ejecutar la funcion anterior cada 5 seg
  setInterval(emitir, 5000);
});

server.listen(app.get("port"), () => {
  console.log("Server is running 8080");
});

```

## Docker
Para el funcionamiento de esta aplicacion se creo la imagen de docker por medio del siguiente Dockerfile.

```DOCKERFILE
# Definir la imagen a utilizar
FROM node:18-alpine as api

# Establecer la carpeta donde se trabajara dentro del contenedor
WORKDIR /app

# Copiar los archivos e instalar dependencias
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# Exponer el puerto y ejecutar la aplicacion
EXPOSE 8080
COPY . ./
CMD [ "node", "index.js" ]
```