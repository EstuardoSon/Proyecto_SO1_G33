const { getConnection } = require("./database");
const connection = getConnection();
var PROTO_PATH = "./demo.proto";

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

function pruebaCaso(call, callback) {
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

main();
