require('dotenv').config()
const express = require('express')
const path = require('path')
const http = require('http')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')
const fetch = require('isomorphic-fetch')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const PORT = process.env.PORT || 5000
const API_URI = process.env.QUANDL_API_URI
const API_KEY = process.env.QUANDL_API_KEY

app.use(express.static(path.resolve(__dirname, '../react-ui/build')))
app.use(bodyParser.urlencoded({ extended: false }))

// TODO:
// move fetchStockData to util function
// constsruct full URI from a different function
const fetchStockData = async (symbol) => {
  const res = await fetch(`${API_URI}/${symbol}/data.json?api_key=${API_KEY}&start_date=2016-06-02&column_index=1`)
  const stock = await res.json()
  const stockData = stock.dataset_data.data.map(data => {
    return [Date.parse(data[0]), data[1]]
  }).reverse()
  return stockData
}

// break out into separate util function
const getRandomColor = () => {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

io.on('connection', socket => {
  console.log('user connected')

  // Listen for which company to fetch stock data
  socket.on('add company', companySymbol => {
    fetchStockData(companySymbol).then((data) => {
      console.log('data', data)
      io.emit('company stock', {
        name: companySymbol,
        data,
        tooltip: { valueDecimals: 2 },
        color: getRandomColor()
      })
    })
  })
})

// All remaining requests return the React app so it can handle routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'))
})

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})
