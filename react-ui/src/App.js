import React, { Component } from 'react'
import io from 'socket.io-client'
import logo from './logo.svg'
import './App.css'
import Stock from './components/Stock'

class App extends Component {
  constructor () {
    super()
    this.state = {
      series: [],
      companies: []
    }
  }

  async componentDidMount () {
    this.socket = io('/')
    this.socket.emit('get initial data')
    this.socket.on('company stock', company => {
      this.setState({ series: [company, ...this.state.series] })
    })
  }

  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>Welcome to React</h2>
          <button onClick={() => {
            this.socket.emit('clear data')
          }}>Clear persisted data</button>
        </div>
        <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Stock series={this.state.series} />

        <button onClick={() => {
          const companySymbol = 'MMM'
          this.socket.emit('add company', companySymbol)
        }}>Add 3M</button>

        <button onClick={() => {
          const companySymbol = 'MSFT'
          this.socket.emit('add company', companySymbol)
        }}>Add Microsoft</button>

        <button onClick={() => {
          const companySymbol = 'GOOGL'
          this.socket.emit('add company', companySymbol)
        }}>Add Google</button>

        <button onClick={() => {
          const companySymbol = 'AAPL'
          this.socket.emit('add company', companySymbol)
        }}>Add Apple</button>
      </div>
    )
  }
}

export default App
