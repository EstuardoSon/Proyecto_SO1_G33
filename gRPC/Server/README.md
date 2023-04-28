# GRPC SERVER
Grpc Client como su nombre lo indica es el cliente que se consume para recibir datos de un cliente y posteriormente ingresarlos a una base de datos MySQL, esta aplicacion esta trabajada en node.

## Archivos

### demo.proto
En este archivo se definen las solicitudes los casos de "endpoints" que enviara el cliente asi como el formato de las solicitudes enviadas.

```
# Definicion del archivo
syntax = "proto3";

option java_multiple_files = true;
option java_package = "io.grc.examples.demo";
option java_outer_classname = "DemoProto";
option objc_class_prefix = "HLW";

package demo;

# Establecer los casos o "endpoints" que utilizara el cliente

service Casos{
    rpc pruebaCaso (Voto) returns (Reply) {}
}

# Formato de solicitud o respuesta Voto
message Voto{
    int32 sede = 1;
    string municipio = 2;
    string departamento = 3;
    string papeleta = 4;
    string partido = 5;
}

# Formato de solicitud o respuesta Reply

message Reply{
    string message = 1;
}
```

### database.js
En este archivo se encuentra una funcion que se utiliza para conectar con la base de datos de MySQL.

```
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
En este archivo se define el puerto en el que se ejecutara el servidor, asi como el procesamiento de la informacion para su ingreso en la base de datos.

```
# Importar librerias
const { getConnection } = require("./database");
const connection = getConnection();

# Crear una variable con la direccion del archivo demo.proto
var PROTO_PATH = "./demo.proto";

# Rederizar el archivo demo.proto
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var demo_proto = grpc.loadPackageDefinition(packageDefinition).demo;

# Definir la funcion pruebaCaso
function pruebaCaso(call, callback) {

    # Realizar consultas a la base de datos
  connection.query(
    `insert into Voto values (?,?,?,?,?);`,
    [
      call.request.sede,
      call.request.municipio,
      call.request.departamento,
      call.request.papeleta,
      call.request.partido,
    ],
    (error, results) => {
      console.log("Entro");
      if (error) {
        callback(null, { message: "Error al insertar" });
      } else {
        callback(null, { message: "Voto ingresado" });
      }
    }
  );
}

# Definir funcion principal
function main() {
  var server = new grpc.Server();
  server.addService(demo_proto.Casos.service, { pruebaCaso: pruebaCaso });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log("grpc server on port 50051");
    }
  );
}

# Ejecutar la funcion principal
main();
```

## Docker
Para el funcionamiento de esta aplicacion se creo la imagen de docker por medio del siguiente Dockerfile.

```
# Definir la imagen a utilizar
FROM node:18

# Establecer la carpeta donde se trabajara dentro del contenedor
WORKDIR /app

# Copiar los archivos e instalar dependencias
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# Exponer el puerto y ejecutar la aplicacion
EXPOSE 50051
COPY . ./
CMD [ "node", "index.js" ]
```