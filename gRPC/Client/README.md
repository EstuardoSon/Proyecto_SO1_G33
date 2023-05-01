# GRPC CLIENT
Grpc Client como su nombre lo indica es el cliente que se consume para enviar datos al grpc Server, esta aplicacion esta trabajada en node.

## Archivos

### demo.proto
En este archivo se definen las solicitudes los casos de "endpoints" que enviara el cliente asi como el formato de las solicitudes enviadas.

```JS
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

### cliente.js
En este archivo se establece la conexion con el servidor de grpc.

```JS
# Definir una variable con la direccion de demo.proto

var PROTO_PATH = "./demo.proto";

# Definir variables de configuracion del cliente

var parseArgs = require("minimist");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

# Renderizar el archivo proto

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var demo_proto = grpc.loadPackageDefinition(packageDefinition).demo;

# Realizar la conexion con el servidor

var argv = parseArgs(process.argv.slice(2), {
  string: "target",
});
var target;
if (argv.target) {
  target = argv.target;
} else {
  target = process.env.HOST+":50051";
}

# Crear un modulo que hace referencia al los casos de "endpoint" de demo.proto

var client = new demo_proto.Casos(target, grpc.credentials.createInsecure());

# Exportar el modulo anterior

module.exports =  client;
```

### index.js
En este archivo se ejecuta el cliente definiendo el puerto por el cual recivira las solicitudes.

```JS
# Importar librerias
const express = require("express");
const app = express();
const cors = require("cors");

# Hacer llamada al modulo client
const client = require("./cliente");

# Definir el puerto del cliente
app.set("port", 3001);

# Configurar servidor
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

# Definir endpoint Mysql
app.post("/Mysql", async (req, res) => {
  const voto = {
    sede: req.body.sede,
    municipio: req.body.municipio,
    departamento: req.body.departamento,
    papeleta: req.body.papeleta,
    partido: req.body.partido,
  };

  # Utilizar el caso pruebaCaso para enviar informacion
  client.pruebaCaso(voto , function (err, response) {
    console.log("Greeting:", response.message);
    res.status(200).json({ message: response.message });
  });
});

# Iniciar servidor
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
```

## Docker
Para el funcionamiento de esta aplicacion se creo la imagen de docker por medio del siguiente Dockerfile.

```DOCKERFILE
# Definir la imagen a utilizar
FROM node:18

# Establecer la carpeta donde se trabajara dentro del contenedor
WORKDIR /app

# Copiar los archivos e instalar dependencias
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# Exponer el puerto y ejecutar la aplicacion
EXPOSE 3001
COPY . ./
CMD [ "node", "index.js" ]
```