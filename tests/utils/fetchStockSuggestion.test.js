/* eslint-env mocha */
const expect = require('chai').expect
const nock = require('nock')
const fetchStockSuggestion = require('../../utils/fetchStockSuggestion')

describe('fetchStockSuggestion', () => {
  // Create high order function to handle async calls
  // http://staxmanade.com/2015/11/testing-asyncronous-code-with-mochajs-and-es7-async-await/
  let mochaAsync = (fn) => {
    return async () => {
      try {
        await fn()
      } catch (err) {
        throw new Error(err)
      }
    }
  }

  beforeEach(done => {
    const fetchResponse = {
      ResultSet: {
        Result: [
          { symbol: 'FB' },
          { symbol: 'FBM' },
          { symbol: 'FBCM' }
        ]
      }
    }

    const fetchError = { error: 'Requested symbol could not be found.' }

    nock('http://d.yimg.com')
      .get('/aq/autoc?query=facebook&region=US&lang=en-US')
      .reply(200, fetchResponse)

    nock('http://d.yimg.com')
      .get('/aq/autoc?query=jibberishjabberish&region=US&lang=en-US')
      .reply(404, fetchError)

    done()
  })

  it('should return suggestion for given company symbol', mochaAsync(async () => {
    const expectedSymbol = 'FB'
    const data = await fetchStockSuggestion('facebook')
    expect(data).to.equal(expectedSymbol)
  }))

  it('should return an error message if no suggestion is found', mochaAsync(async () => {
    const expectedReponse = { error: 'Requested symbol could not be found.' }
    const response = await fetchStockSuggestion('jibberishjabberish')
    expect(response.error).to.equal(expectedReponse.error)
  }))
})
