import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'
import io from 'socket.io-client'
import logo from './logo.svg'
import './App.css'
import Stock from './components/Stock'

function getRandomColor () {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

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