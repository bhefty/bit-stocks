import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader } from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import './Card.css'

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
    this.props.onSubmit(this.state.value.toUpperCase())
    this.setState({ value: '' })
  }

  render () {
    return (
      <Card className='card'>
        <CardHeader
          title='Track a new company'
          subtitle='Please enter a valid company symbol'
        />
        <form onSubmit={this.handleSubmit}>
          <TextField hintText='Stock code' value={this.state.value} onChange={this.handleChange} />
          <RaisedButton type='submit' label='Add' backgroundColor='#a4c639' labelColor='#fff' />
        </form>
      </Card>
    )
  }
}

AddStock.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default AddStock
