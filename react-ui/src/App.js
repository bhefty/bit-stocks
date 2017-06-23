import React, { Component } from 'react'
import io from 'socket.io-client'
import RaisedButton from 'material-ui/RaisedButton'
import logo from './logo.svg'
import './App.css'
import Stock from './components/Stock'
import AddStock from './components/AddStock'
import StockCard from './components/StockCard'

class App extends Component {
  constructor () {
    super()
    this.state = {
      series: [],
      companies: []
    }
    this.handleAddStock = this.handleAddStock.bind(this)
    this.handleRemoveStock = this.handleRemoveStock.bind(this)
  }

  async componentDidMount () {
    this.socket = io('/')
    this.socket.emit('get initial data')
    this.socket.on('remove company', response => {
      const seriesState = this.state.series
      const removeItem = seriesState.findIndex((stock) => stock.name === response.company.name)
      if (removeItem > -1) {
        seriesState.splice(removeItem, 1)
        this.setState({ series: seriesState })
      } else {
        console.error('Error occurred in finding the company to remove.')
      }
    })
    this.socket.on('company stock', company => {
      const seriesState = this.state.series
      // Check if data already exists in state before pushing to client
      if (seriesState.findIndex(stock => stock.name === company.name) === -1) {
        this.setState({ series: [company, ...this.state.series] })
      }
    })
  }

  handleAddStock = (value) => {
    this.socket.emit('add company', value)
  }

  handleRemoveStock = (company) => {
    this.socket.emit('remove company', company)
  }

  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>Welcome to Bit-Stocks</h2>
          <RaisedButton
            label='Clear persisted data'
            backgroundColor='red'
            labelColor='white'
            onClick={() => {
              this.socket.emit('clear data')
            }
          } />
        </div>
        <div className='container'>
          <div className='chart-container'>
            <Stock series={this.state.series} />
          </div>
          <AddStock onSubmit={this.handleAddStock} />
          {this.state.series.length > 0 &&
            <StockCard
              series={this.state.series}
              deleteStock={this.handleRemoveStock}
            />
          }
        </div>
      </div>
    )
  }
}

export default App
