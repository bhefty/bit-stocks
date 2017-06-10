const express = require('express')
const path = require('path')
const http = require('http')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const PORT = process.env.PORT || 5000

app.use(express.static(path.resolve(__dirname, '../react-ui/build')))
app.use(bodyParser.urlencoded({ extended: false }))

io.on('connection', socket => {
  console.log('user connected')

  // Listen for which company to fetch stock data
  socket.on('add company', companySymbol => {
    console.log('company symbol: ' + companySymbol)
    io.emit('company stock', {
      name: '3M',
      symbol: 'MMM',
      value: 'ALoT'
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
