const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { getConnection } = require("./database");
const redis = require("redis");
const { promisify } = require("util");

app.use(cors());
app.set("port", 8080);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET"],
  },
});

const client = redis.createClient({
  host: 'redis',
  port: "6379",
});

const GETR = promisify(client.get).bind(client);

io.on("connection", (socket) => {
  console.log(`Usuario conectado`);

  const emitir = async () => {
    const connection = getConnection();
    const [result] = await connection.query(`call topDPresidente();`);
    const [result1] = await connection.query(`call cantVotosD();`);
    const [result2] = await connection.query(`call cantVotosM();`);
    const [result3] = await connection.query(`call totalVotos();`);
    const result4 = await connection.query(`select * from Voto;`);
    const actual = new Date();

    const lastfive = new Array(5);
    const v1 = await GETR("v1");
    if (v1 == null) {
      lastfive[0] = "";
      client.set("v1", "", (err, reply) => {
        if (err) console.log(err);
      });
    }
    else{
      lastfive[0] = v1;
    }

    const v2 = await GETR("v2");
    if (v2 == null) {
      lastfive[0] = "";
      client.set("v2", "", (err, reply) => {
        if (err) console.log(err);
      });
    }
    else{
      lastfive[1] = v2;
    }

    const v3 = await GETR("v3");
    if (v3 == null) {
      lastfive[2] = "";
      client.set("v3", "", (err, reply) => {
        if (err) console.log(err);
      });
    }
    else{
      lastfive[2] = v3;
    }

    const v4 = await GETR("v4");
    if (v4 == null) {
      lastfive[3] = "";
      client.set("v4", "", (err, reply) => {
        if (err) console.log(err);
      });
    }
    else{
      lastfive[3] = v4;
    }

    const v5 = await GETR("v5");
    if (v1 == null) {
      lastfive[4] = "";
      client.set("v5", "", (err, reply) => {
        if (err) console.log(err);
      });
    }
    else{
      lastfive[4] = v5;
    }

    for (let index = 0; index < lastfive.length; index++) {
      if (lastfive[index] != "") {
        const element = JSON.parse(lastfive[index]);
        lastfive[index] = element;
      } else {
        lastfive[index] =
          '{"sede":0,"municipio":"---","departamento":"---","papeleta":"---","partido":"---"}';
        const element = JSON.parse(lastfive[index]);
        lastfive[index] = element;
      }
    }

    const topredis = await obtenerCincoMayores();

    socket.emit("consultar", {
      top: result[0],
      votosD: result1[0],
      votosM: result2[0],
      total: result3[0],
      general: result4,
      fecha: actual,
      ultimos: lastfive,
      barras: topredis,
    });
  };

  setInterval(emitir, 5000);
});

server.listen(app.get("port"), () => {
  console.log("Server is running 8080");
});

async function obtenerCincoMayores() {
  try {
    const sedes = await GETR("sedes");
    if (sedes != null) {
      const sedesArray = sedes.split(",");
      var nuevostring = "";
      for (let i = 0; i < sedesArray.length; i++) {
        var tmp = await GETR(sedesArray[i]);

        if (i == 0) {
          nuevostring = sedesArray[i] + ", " + tmp;
        } else {
          nuevostring = nuevostring + "|" + sedesArray[i] + ", " + tmp;
        }
      }
      const data = nuevostring.split("|");
      //console.log(data);

      const sortedData = data
        .map((item) => {
          const [name, value] = item.split(", ");
          return { name, value: parseInt(value) };
        })
        .sort((a, b) => b.value - a.value);

      const top5 = sortedData.slice(0, 5);
      return top5;
    }else{
      client.set("sedes", "", (err, reply) => {
        if (err) console.log(err);
      });
      const top5 = sortedData.slice(0, 5);
      return top5;
    }

  } catch (error) {
    return "Vacio";
  }
}
