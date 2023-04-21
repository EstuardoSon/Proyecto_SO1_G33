import { useEffect, useState } from "react";
import "./App.css";
import GraficaPie from "./Components/GraficaPie";
import io from "socket.io-client";

const socket = io.connect(process.env.REACT_APP_API);

function App() {
  const colores = (count) => {
    var arr = [];
    for (var i = 0; i < count; i++) {
      var letters = "0123456789ABCDEF".split("");
      let color = "#";
      for (var x = 0; x < 6; x++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      arr.push(color);
    }
    return arr;
  };

  const [dataTop, setTop] = useState({
    labels: ["vacio"],
    datasets: [
      {
        label: "Total",
        data: [100],
        backgroundColor: ["black"],
      },
    ],
  });

  const [votosM, setVotosM] = useState({
    labels: ["vacio"],
    datasets: [
      {
        label: "Total",
        data: [100],
        backgroundColor: ["black"],
      },
    ],
  });

  const [votosD, setVotosD] = useState({
    labels: ["vacio"],
    datasets: [
      {
        label: "Total",
        data: [100],
        backgroundColor: ["black"],
      },
    ],
  });

  const [fecha, setFecha] = useState("00-00-0000");

  useEffect(() => {
    socket.on("consultar", (data) => {
      const total = data.total[0].cantVotos;
      setFecha(data.fecha)

      let label = [];
      let array = [];

      for (let value of data.top) {
        label.push(value.Departamento);
        array.push(value.cantVotos);
      }

      setTop({
        labels: label,
        datasets: [
          {
            label: "Total",
            data: array,
            backgroundColor: colores(array.length),
          },
        ],
      });

      label = [];
      array = [];
      for (let value of data.votosD) {
        label.push(value.Departamento + ", " + value.Partido);
        array.push(value.cantVotos / total * 100);
      }

      setVotosD({
        labels: label,
        datasets: [
          {
            label: "% Total ",
            data: array,
            backgroundColor: colores(array.length),
          },
        ],
      });

      label = [];
      array = [];

      for (let value of data.votosM) {
        label.push(value.Municipio + ", " + value.Partido);
        array.push(value.cantVotos / total *100);
      }

      setVotosM({
        labels: label,
        datasets: [
          {
            label: "% Total ",
            data: array,
            backgroundColor: colores(array.length),
          },
        ],
      });
    });
  }, [socket]);

  return (
    <div className="App">
      <div className="row">
        <div className="col-md-2">
          <p>{fecha}</p>
        </div>
        <div className="col-md-8">
          <div className="row">
            <GraficaPie
              nombre="Top 3 de departamentos con mayores votos para presidente"
              dataPie={dataTop}
            />
            <GraficaPie
              nombre="Porcentaje de votos por partido segun Municipio"
              dataPie={votosM}
            />
            <GraficaPie
              nombre="Porcentaje de votos por partido segun Departamento"
              dataPie={votosD}
            />
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
    </div>
  );
}

export default App;
