const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { getConnection } = require("./database");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET"],
  },
});

io.on("connection", (socket) => {
  console.log(`Usuario conectado`);

  const emitir = async () => {
    const connection = getConnection();
    const [result] = await connection.query(`call topDPresidente();`);
    const [result1] = await connection.query(`call cantVotosD();`);
    const [result2] = await connection.query(`call cantVotosM();`);
    const [result3] = await connection.query(`call totalVotos();`);
    const actual = new Date();

    socket.emit("consultar", {
      top: result[0],
      votosD: result1[0],
      votosM: result2[0],
      total: result3[0],
      fecha: actual
    });
  };

  setInterval(emitir, 1000);
});

server.listen(8000, () => {
  console.log("Server is running");
});
