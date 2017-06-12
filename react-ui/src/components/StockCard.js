import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader } from 'material-ui/Card'

const StockCard = props => {
  return (
    <Card>
      <CardHeader
        title={props.name}
        subtitle='Temporary subtitle'
      />
    </Card>
  )
}

StockCard.propTypes = {
  name: PropTypes.string.isRequired
}

export default StockCard
