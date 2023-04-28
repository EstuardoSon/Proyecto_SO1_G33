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
