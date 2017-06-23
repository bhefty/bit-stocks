import React from 'react'
import PropTypes from 'prop-types'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'

import './Card.css'

const StockCard = props => {
  return (
    <div className='stock-grid-wrapper'>
      {props.series.map((company, idx) => {
        return (
          <div key={idx} className='stock-card' style={{ backgroundColor: company.color }}>
            <div className='stock-card-content'>
              <div className='stock-card-name'>{company.name.toUpperCase()}</div>
              <div className='stock-card-action'>
                <IconButton onTouchTap={() => props.deleteStock(company)}>
                  <CloseIcon color='#fff' />
                </IconButton>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

StockCard.propTypes = {
  series: PropTypes.array.isRequired,
  deleteStock: PropTypes.func.isRequired
}

export default StockCard
