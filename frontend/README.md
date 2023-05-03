# FRONTEND
El frontend consta de una aplicacion dashboard creada en react que muestra la informacion que le es enviada por medio de una API, para su funcionamiento requiere de las librerias:
- Socket.io
- Chart.js

## Components

### App.js
Es el componente principal de la aplicacion en la cual se ejecutan componentes posteriores.

```JS
# Importacion de librerias
import { useEffect, useState } from "react";
import "./App.css";
import GraficaPie from "./Components/GraficaPie";
import GraficaBarras from "./Components/GraficaBarras";
import io from "socket.io-client";

# Conexion con la API
const socket = io.connect("http://35.222.138.58:8080");

function App() {
    # Funcion que retorna un color aleatorio en hexadecimal
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

    # Creacion de variables y funciones para el seteo de Estados
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

  const [sedes, setSedes] = useState({
    labels: ["vacio"],
    datasets: [
      {
        label: "Total",
        data: [100],
        backgroundColor: ["black"],
      },
    ],
  });

  const [tabla, setTabla] = useState([]);

  const [tabla2, setTabla2] = useState([]);

  const [fecha, setFecha] = useState("00-00-0000");

    # Funcion encargada de interpretar la informacion resivida de la conexion de Socket.io

  useEffect(() => {
    socket.on("consultar", (data) => {
      const total = data.total[0].cantVotos;
      setFecha(data.fecha);
      setTabla(data.general[0]);
      setTabla2(data.ultimos);

      # Recorrido de los valores que conformaran la grafica de Top de votaciones

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

      # Recorrido de los valores que conformaran la grafica de Votos por departamento
      
      label = [];
      array = [];
      for (let value of data.votosD) {
        label.push(value.Departamento + ", " + value.Partido);
        array.push((value.cantVotos / total) * 100);
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

      # Recorrido de los valores que conformaran la grafica de Votos por Municipio

      label = [];
      array = [];

      for (let value of data.votosM) {
        label.push(value.Municipio + ", " + value.Partido);
        array.push((value.cantVotos / total) * 100);
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

      label = [];
      array = [];
      for (let value of data.barras) {
        label.push(value.name);
        array.push(value.value);
      }

      setSedes({
        labels: label,
        datasets: [
          {
            label: "# votos",
            data: array,
            backgroundColor: colores(array.length),
          },
        ],
      });

    });
  }, [socket]);

  let n = 0;

  # Renderizado del componente

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
      <div></div>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <div
            className="row"
            style={{ maxHeight: "300px", overflowY: "scroll" }}
          >
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">No. Voto</th>
                  <th scope="col">Sede</th>
                  <th scope="col">Departamento</th>
                  <th scope="col">Municipio</th>
                  <th scope="col">Partido</th>
                  <th scope="col">Papeleta</th>
                </tr>
              </thead>
              <tbody>
                {tabla
                  ? tabla.map((voto) => (
                      <tr key={n} className="table-dark">
                        <td scope="row">{n++}</td>
                        <td scope="row">{voto.Sede}</td>
                        <td scope="row">{voto.Departamento}</td>
                        <td scope="row">{voto.Municipio}</td>
                        <td scope="row">{voto.Partido}</td>
                        <td scope="row">{voto.Papeleta}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
      <br></br>
      <div><p style={{ fontSize: "25px", fontWeight: "450"}}>Últimos 5 Votos</p></div>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <div
            className="row"
            style={{ maxHeight: "300px", overflowY: "scroll" }}
          >
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Sede</th>
                  <th scope="col">Departamento</th>
                  <th scope="col">Municipio</th>
                  <th scope="col">Partido</th>
                  <th scope="col">Papeleta</th>
                </tr>
              </thead>
              <tbody>
                {tabla2
                  ? tabla2.map((voto) => (
                      <tr key={n++} className="table-dark">
                        <td scope="row">{voto.sede}</td>
                        <td scope="row">{voto.departamento}</td>
                        <td scope="row">{voto.municipio}</td>
                        <td scope="row">{voto.partido}</td>
                        <td scope="row">{voto.papeleta}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <GraficaBarras
                nombre="5 sedes con mayores votos almacenados"
                dataBar={sedes}
          />
        </div>
        <div className="col-md-2"></div>
      </div>
    </div>
  );
}

export default App;

```

### GraficaPie.js
En este componete gracias a la librearia Chart.js se rederiza una grafica de PIE con la informacion que se le es trasladada por medio de props.

```JS
import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

class GraficaPie extends Component {
  state = {};
  render() {
    return (
      <div className="p-3 col-md-4">
        <h4>{this.props.nombre}</h4>
        <Doughnut data={this.props.dataPie} />
      </div>
    );
  }
}

export default GraficaPie;
```

### GraficaBarras.js
En este componete gracias a la librearia Chart.js se rederiza una grafica de Barras con la informacion que se le es trasladada por medio de props.
```JS
import React, { Component } from "react";
import { Bar } from "react-chartjs-2"

class GraficaBarras extends Component {
  state = {};
  render() {
    return (
      <div className="p-3 col-md-4">
        <h4>{this.props.nombre}</h4>
        <Bar data={this.props.dataBar} />
      </div>
    );
  }
}

export default GraficaBarras;
```

## Docker
Para el funcionamiento de esta aplicacion se creo la imagen de docker por medio del siguiente Dockerfile.

```DOCKERFILE
# Establecer la imagen inicial con la que se creara la aplicacion
FROM node:18-alpine as frontend

# Establecer la direccion de trabajo y la variable de entorno NODE_ENV
WORKDIR /app
ENV NODE_ENV=production

# Copiar los archivos e instalar dependencias
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

COPY . ./

RUN npm run build

# Establecer la imagen final con la cual se generara la aplicacion
FROM nginx:1.22.1 as runner

# Copiar archivos y modificar la configuracion de Nginx

COPY --from=frontend /app/build /usr/share/nginx/html
COPY --from=frontend /app/default.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80

EXPOSE 80
```