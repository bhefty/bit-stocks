import React from 'react'
import PropTypes from 'prop-types'
import { GridList, GridTile } from 'material-ui/GridList'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import './Card.css'

const StockCard = props => {
  return (
    <div className='grid-wrapper'>
      <GridList className='cards-container' cols={5} cellHeight={100}>
        {props.series.map((company, idx) => {
          return <GridTile style={{ backgroundColor: company.color }} key={idx} title={company.name.toUpperCase()} actionIcon={<IconButton><CloseIcon color='white' /></IconButton>} />
        })}
      </GridList>
    </div>
  )
}

StockCard.propTypes = {
  name: PropTypes.string.isRequired
}

export default StockCard
