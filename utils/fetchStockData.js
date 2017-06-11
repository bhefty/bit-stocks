require('dotenv').config()
const fetch = require('isomorphic-fetch')

const API_URI = process.env.QUANDL_API_URI
const API_KEY = process.env.QUANDL_API_KEY

const fetchStockData = async (symbol) => {
  try {
    const res = await fetch(`${API_URI}/${symbol}/data.json?api_key=${API_KEY}&start_date=2016-06-02&column_index=1`)
    if (res.status >= 400) {
      throw new Error('Bad response from server')
    }
    const stock = await res.json()
    const stockData = stock.dataset_data.data.map(data => {
      return [Date.parse(data[0]), data[1]]
    }).reverse()
    return stockData
  } catch (e) {
    return { message: 'You have submitted an incorrect company symbol.' }
  }
}

module.exports = fetchStockData
