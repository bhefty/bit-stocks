import React, { Component } from 'react'
import PropTypes from 'prop-types'

class AddStock extends Component { 
  constructor (props) {
    super(props)
    this.state = { value: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()
    this.props.onSubmit(this.state.value)
    this.setState({ value: '' })
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type='text' placeholder='Stock code' value={this.state.value} onChange={this.handleChange} />
        <button type='submit'>Add</button>
      </form>
    )
  }
}

AddStock.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default AddStock
