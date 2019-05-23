import React, { Component } from 'react';
import Chart from 'chart.js';
import './radarChart.scss';

class RadarChart extends Component {
  componentDidMount() {
    if (this.props.skills) {
      this.createRadarChart();
    }
  }

  componentDidUpdate() {
    if (this.props.skills) {
      this.createRadarChart();
    }
  }

  createRadarChart = () => {
    let labels = [];
    let values = [];

    labels = this.props.skills.map(function(obj) {
      let percentage = obj.percentage === 'N/A' ? 'N/A' : `${obj.percentage}%`;
      let label = `${obj.subject_id} - ${percentage}`;
      return label;
    });

    values = this.props.skills.map(function(obj) {
      return obj.percentage;
    });

    let data = {
      labels: labels,
      values: values
    };

    let options = {
      responsive: true,
      maintainAspectRatio: true,
      pointBorderColor: '#000',
      scale: {
        pointLabels: {
          fontSize: 12,
          fontColor: this.props.color || '#fff',
          fontFamily: 'OpenSans-Light'
        },
        gridLines: {
          color: '#7585a7',
          circular: true
        },
        angleLines: { color: '#50e3c2' },
        ticks: {
          beginAtZero: true,
          max: 100,
          display: false
        }
      }
    };

    let chartData = {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          borderWidth: 0,
          pointBackgroundColor: 'transparent',
          borderColor: 'transparent',
          pointBorderColor: 'transparent',
          backgroundColor: 'rgba(61, 195, 255, 0.9)'
        }
      ]
    };

    let radarChart = document.getElementById('radar_chart');

    Chart.defaults.global.legend.display = false;

    new Chart(radarChart, {
      type: 'radar',
      data: chartData,
      options: options
    });
  };

  render() {
    return <canvas id="radar_chart" />;
  }
}

export default RadarChart;
