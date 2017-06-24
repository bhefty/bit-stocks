import React, { Component } from 'react'
import io from 'socket.io-client'
import FlatButton from 'material-ui/FlatButton'
import './App.css'
import Stock from './components/Stock'
import AddStock from './components/AddStock'
import StockCard from './components/StockCard'
import ErrorSymbol from './components/ErrorSymbol'

class App extends Component {
  constructor () {
    super()
    this.state = {
      series: [],
      companies: [],
      openDialog: false
    }
    this.handleAddStock = this.handleAddStock.bind(this)
    this.handleRemoveStock = this.handleRemoveStock.bind(this)
    this.handleCloseDialog = this.handleCloseDialog.bind(this)
    this.handleOpenDialog = this.handleOpenDialog.bind(this)
  }

  async componentDidMount () {
    this.socket = io('/')

    // Fetch initial data from storage
    this.socket.emit('get initial data')

    // Listen for company being deleted
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

    // Listen for all data being deleted
    this.socket.on('clear data', () => {
      this.setState({ series: [] })
    })

    // Listen for new company being added
    this.socket.on('company stock', company => {
      // Only add company if correct symbol was given
      if (!company.data.message) {
        const seriesState = this.state.series
        // Check if data already exists in state before pushing to client
        if (seriesState.findIndex(stock => stock.name === company.name) === -1) {
          this.setState({ series: [company, ...this.state.series] })
        }
      } else {
        this.handleOpenDialog()
      }
    })
  }

  handleAddStock = (value) => {
    this.socket.emit('add company', value)
  }

  handleRemoveStock = (company) => {
    this.socket.emit('remove company', company)
  }

  handleOpenDialog = () => {
    this.setState({ openDialog: true })
  }

  handleCloseDialog = () => {
    this.setState({ openDialog: false })
  }

  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <h1>Welcome to Bit-Stocks</h1>
        </div>
        <div className='container'>
          <div className='chart-container'>
            <Stock series={this.state.series} />
          </div>
          <AddStock onSubmit={this.handleAddStock} />
          {this.state.series.length > 0 &&
            <div>
              <StockCard
                series={this.state.series}
                deleteStock={this.handleRemoveStock}
              />
              <hr />
              <FlatButton
                label='Remove All'
                secondary
                onClick={() => {
                  this.socket.emit('clear data')
                }}
              />
            </div>
          }
        </div>
        {this.state.openDialog &&
          <ErrorSymbol open={this.state.openDialog} closeDialog={this.handleCloseDialog} />
        }
      </div>
    )
  }
}

export default App
