import React, { Component } from 'react';
import Chart from 'chart.js';
import annotation from 'chartjs-plugin-annotation';
import './lineChart.scss';
import isEqual from 'react-fast-compare';

class LineChart extends Component {
  componentDidMount() {
    this.createLineChart(this.props.dataSet);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.dataSet, this.props.dataSet)) {
      this.createLineChart(this.props.dataSet);
    }
  }

  createLineChart = propsData => {
    let values = propsData.pointStats.map(point => point.totalPoints);
    let labels = propsData.pointStats.map(point => point.labelName);
    let data = {
      labels: labels,
      values: values
    };

    let stepSize = null;
    let maxValue = Math.max(...values);

    maxValue =
      maxValue > propsData.targetPoints ? maxValue : propsData.targetPoints;

    let str = maxValue.toString();

    stepSize = parseInt(str[0] + new Array(str.length).join('0')) / 5;

    let targetPoints = propsData.targetPoints;
    let annotations = {
      annotations: [
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: targetPoints || '',
          borderColor: '#ff7b8b',
          borderWidth: 2,
          label: {
            enabled: false,
            content: 'Test label'
          }
        }
      ]
    };

    let options = {
      annotation: annotations,
      responsive: true,
      elements: {
        line: {
          tension: 0
        }
      },
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltips: {
        intersect: false
        // enabled: false
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              color: 'transparent'
            },
            scaleLabel: {
              display: false
            },

            ticks: {
              fontColor: this.props.color
            }
          }
        ],
        yAxes: [
          {
            id: 'y-axis-0',
            display: true,
            gridLines: {
              color: this.props.yAxesGridLinesColor,
              drawBorder: false
            },
            scaleLabel: {
              display: false
            },
            ticks: {
              fontColor: this.props.color,
              // max: 200,
              stepSize: stepSize,
              beginAtZero: true,
              min: 0,
              padding: 10
            }
          }
        ]
      }
    };

    let dataSets = [];

    let dataSet = {
      data: data.values,
      backgroundColor: this.props.backgroundColor,
      borderColor: 'rgba(61, 195, 255)',
      borderWidth: 1
    };
    dataSets.push(dataSet);

    // if (this.props.dataSet[1]) {
    //   let data = {
    //     data: this.props.dataSet[1].data,
    //     borderDash: [5, 5],
    //     backgroundColor: this.props.backgroundColor,
    //     borderColor: 'rgba(61, 195, 255)',
    //     borderWidth: 1
    //   };
    //   dataSets.push(data);
    // }

    var config = {
      type: 'line',
      plugins: [annotation],
      data: {
        labels: data.labels,
        datasets: dataSets
      },
      options: options
    };

    document.getElementById('line_chart').remove();
    let canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'line_chart');
    canvas.setAttribute('width', '800');
    canvas.setAttribute('height', '350');
    document.querySelector('#chart_container').appendChild(canvas);

    var lineChart = document.getElementById('line_chart').getContext('2d');

    window.myLine = new Chart(lineChart, config);
  };

  render() {
    return (
      <div id="chart_container">
        <canvas id="line_chart" width="800" height="350" />
      </div>
    );
  }
}

export default LineChart;
