import React, { Component } from 'react'
import io from 'socket.io-client'
import RaisedButton from 'material-ui/RaisedButton'
import logo from './logo.svg'
import './App.css'
import Stock from './components/Stock'
import AddStock from './components/AddStock'

class App extends Component {
  constructor () {
    super()
    this.state = {
      series: [],
      companies: []
    }
    this.handleAddStock = this.handleAddStock.bind(this)
  }

  async componentDidMount () {
    this.socket = io('/')
    this.socket.emit('get initial data')
    this.socket.on('company stock', company => {
      this.setState({ series: [company, ...this.state.series] })
    })
  }

  handleAddStock = (value) => {
    this.socket.emit('add company', value)
  }

  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>Welcome to React</h2>
          <RaisedButton
            label='Clear persisted data'
            onClick={() => {
              this.socket.emit('clear data')
            }
          } />
        </div>
        <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Stock series={this.state.series} />

        <AddStock onSubmit={this.handleAddStock} />
      </div>
    )
  }
}

export default App
