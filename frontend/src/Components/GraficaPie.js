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
