require('dotenv').config()
const fetch = require('isomorphic-fetch')

const API_URI = process.env.QUANDL_API_URI
const API_KEY = process.env.QUANDL_API_KEY

const fetchStockData = async (symbol) => {
  const res = await fetch(`${API_URI}/${symbol}/data.json?api_key=${API_KEY}&start_date=2016-06-02&column_index=1`)
  const stock = await res.json()
  const stockData = stock.dataset_data.data.map(data => {
    return [Date.parse(data[0]), data[1]]
  }).reverse()
  return stockData
}

module.exports = fetchStockData