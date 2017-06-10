import React from 'react'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'

const StockChart = (props) => (
  <div>
    <ReactHighstock
      config={{
        rangeSelector: {
          selected: 1
        },
        title: {
          text: 'Stock Prices'
        },
        series: props.series
      }}
        />
  </div>
)

export default StockChart
