const express = require("express");
const app = express();
const cors = require("cors");

const client = require("./cliente");

app.set("port", 3001);

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/Mysql", async (req, res) => {
  const voto = {
    sede: req.body.sede,
    municipio: req.body.municipio,
    departamento: req.body.departamento,
    papeleta: req.body.papeleta,
    partido: req.body.partido,
  };

  client.pruebaCaso(voto , function (err, response) {
    console.log("Greeting:", response.message);
    res.status(200).json({ message: response.message });
  });
});

app.get("/",async (req, res) => {
    res.status(200).json({ message: "Conectado" });
});

app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
