const express = require('express')
const path = require('path')
const http = require('http')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')
const storage = require('node-persist')
const fetchStockData = require('../utils/fetchStockData')
const getRandomColor = require('../utils/getRandomColor')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const PORT = process.env.PORT || 5000

app.use(express.static(path.resolve(__dirname, '../react-ui/build')))
app.use(bodyParser.urlencoded({ extended: false }))

// Initialize node-persist
if (process.env.NODE_ENV !== 'test') {
  storage.init()
} else {
  storage.init({ dir: 'tests/node-persist-test/' })
}

io.on('connection', socket => {
  if (process.env.NODE_ENV !== 'test') console.log('user connected')

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
        // Get updated stock data for company
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
    } else {
      console.log('No data exists in storage')
      io.emit('get initial data', { message: 'There was was no existing data' })
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
