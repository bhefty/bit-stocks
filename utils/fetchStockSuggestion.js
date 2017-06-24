const fetch = require('isomorphic-fetch')

const fetchStockSuggestion = async (symbol) => {
  try {
    const res = await fetch(`http://d.yimg.com/aq/autoc?query=${symbol}&region=US&lang=en-US`)
    if (res.status >= 400) {
      throw new Error('Bad response from server')
    }
    const result = await res.json()
    const suggestion = result.ResultSet.Result[0].symbol
    return suggestion
  } catch (e) {
    return { error: 'Requested symbol could not be found.' }
  }
}

module.exports = fetchStockSuggestion
