/* eslint-env mocha */
const expect = require('chai').expect
const storage = require('node-persist')
const server = require('../../server')
const io = require('socket.io-client')

describe('Server', () => {
  describe('socket.io', () => {
    let sender
    let receiver
    beforeEach(done => {
      // setup test storage
      storage.init({ dir: 'tests/.node-persist-test/' })

      // start the io server
      server.listen(5000)

      // conntect two io clients
      sender = io('http://localhost:5000/')
      receiver = io('http://localhost:5000/')

      done()
    })

    afterEach(done => {
      // disconnect io clients after each test
      sender.disconnect()
      receiver.disconnect()

      // clear test storage
      storage.clear()

      done()
    })

    describe('Event: test connection', () => {
      it('Clients should receive a message when the `test connection` event is emitted', (done) => {
        const testMsg = 'Hello World'
        sender.emit('test connection', testMsg)
        receiver.on('test connection', msg => {
          expect(msg).to.equal(testMsg)
          done()
        })
      })
    })

    describe('Event: clear data', () => {
      it('should clear storage for persisted data', (done) => {
        storage.setItem('test-data', 'test-value').then(() => {
          sender.emit('clear data')
          receiver.on('clear data', msg => {
            expect(msg.message).to.equal('Data has been cleared')
            expect(storage.length()).to.equal(0)
            done()
          })
        })
      })
    })

    describe('Event: remove company', () => {
      it('should remove company from storage', (done) => {
        const companySymbol = 'MMM'
        storage.setItem(companySymbol, 'test data')
        sender.emit('remove company', companySymbol)
        receiver.on('remove company', msg => {
          expect(msg.message).to.equal(`${companySymbol} has been cleared`)
          expect(storage.length()).to.equal(0)
          done()
        })
      })
    })

    describe('Event: get initial data', () => {
      it('should emit stored data to the client if it exists', (done) => {
        const testData = {
          name: 'AAPL',
          data: [[1496793600000, 155.02], [1496880000000, 155.25], [1496966400000, 155.19]],
          tooltip: { valueDecimals: 2 },
          color: '#93758F'
        }
        storage.setItem('AAPL', testData)
        sender.emit('get initial data')
        receiver.on('company stock', initialData => {
          expect(initialData.name).to.eql(testData.name)
          done()
        })
      })

      it('should emit error message if no data exists', (done) => {
        const testMsg = 'There was was no existing data'
        sender.emit('get initial data')
        receiver.on('get initial data', msg => {
          expect(msg.message).to.equal(testMsg)
          done()
        })
      })
    })

    describe('Event: add company', () => {
      it('should emit company stock to client', (done) => {
        const companySymbol = 'MMM'
        sender.emit('add company', companySymbol)
        receiver.on('company stock', companyData => {
          expect(companyData.name).to.eql(companySymbol)
          expect(companyData.data).to.have.lengthOf.at.least(1)
          done()
        })
      })

      it('should store company stock in storage to persist data', (done) => {
        const testData = {
          name: 'AAPL',
          data: [[1496793600000, 155.02], [1496880000000, 155.25], [1496966400000, 155.19]],
          tooltip: { valueDecimals: 2 },
          color: '#93758F'
        }
        sender.emit('add company', testData.name)
        receiver.on('company stock', () => {
          storage.getItem(testData.name).then(val => {
            expect(val.name).to.eql('AAPL')
            expect(val.data).to.have.lengthOf.at.least(1)
            done()
          })
        })
      })
    })
  })
})
