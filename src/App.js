import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Stock from './components/Stock'

function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

class App extends Component {
  constructor() {
    super()
    this.state = {
      series: []
    }
    this.addStock = this.addStock.bind(this)
  }

  async componentDidMount() {
    const res = await fetch(`https://www.quandl.com/api/v3/datasets/WIKI/AAPL/data.json?api_key=oU7zMHe6Q6r4c3pyDEXj&start_date=2016-06-02&column_index=1`)
    const stock = await res.json()
    const stockData = stock.dataset_data.data.map(data => {
      return [Date.parse(data[0]), data[1]]
    }).reverse()
    const seriesState = this.state.series
    seriesState.push({
      name: 'AAPL',
      data: stockData,
      tooltop: { valueDecimals: 2 },
      color: getRandomColor()
    })
    this.setState({ series: seriesState })
  }

  addStock = async (symbol) => {
    const res = await fetch(`https://www.quandl.com/api/v3/datasets/WIKI/${symbol}/data.json?api_key=oU7zMHe6Q6r4c3pyDEXj&start_date=2016-06-02&column_index=1`)
    const stock = await res.json()
    const stockData = stock.dataset_data.data.map(data => {
      return [Date.parse(data[0]), data[1]]
    }).reverse()
    const seriesState = this.state.series
    seriesState.push({
      name: symbol,
      data: stockData,
      tooltop: { valueDecimals: 2 },
      color: getRandomColor()
    })
    this.setState({ series: seriesState })
  }
  
  
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Stock series={this.state.series}/>

        <button onClick={() => this.addStock('MSFT') }>Add MSFT</button>
        <button onClick={() => this.addStock('MMM') }>Add MMM</button>
        <button onClick={() => this.addStock('GOOGL') }>Add GOOGL</button>

      </div>
    );
  }
}

export default App;