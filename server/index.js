require('dotenv').config()
const express = require('express')
const path = require('path')
const http = require('http')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')
const fetch = require('isomorphic-fetch')
const storage = require('node-persist')

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

// Initialize node-persist
storage.init()

io.on('connection', socket => {
  console.log('user connected')

  socket.on('test connection', msg => {
    io.emit('test connection', msg)
  })

  socket.on('clear data', () => {
    storage.clear()
  })

  socket.on('get initial data', () => {
    // Check if data has been persisted
    if (storage.length() > 0) {
      console.log('Data exists in storage')
      const storageValues = storage.values()
      storageValues.map(company => {
        console.log(`Fetching updated data for: ${company.name}`)
        fetchStockData(company.name).then(data => {
          const companyData = {
            name: company.name,
            data,
            tooltip: { valueDecimals: 2 },
            color: getRandomColor()
          }

          // Send initial stock data to front-end
          io.emit('company stock', companyData)
        })
      })
    }
  })

  // Listen for which company to fetch stock data
  socket.on('add company', companySymbol => {
    fetchStockData(companySymbol).then((data) => {
      // Create object with company information
      const companyData = {
        name: companySymbol,
        data,
        tooltip: { valueDecimals: 2 },
        color: getRandomColor()
      }

      // Send company stock data back to front-end
      io.emit('company stock', companyData)

      // Persist new company data to list
      storage.setItem(companyData.name, companyData)
    })
  })

  socket.on('get series data', () => {
    storage.getItem('seriesData').then(value => console.log('value is:', value))
  })
})

// All remaining requests return the React app so it can handle routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'))
})

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})

module.exports = server
