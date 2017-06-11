/* eslint-env mocha */
const expect = require('chai').expect
const getRandomColor = require('../../utils/getRandomColor')

describe('getRandomColor', () => {
  it('should return a string with a random hex color', () => {
    const result = getRandomColor()
    expect(result).to.be.a('string')
    expect(result).to.match(/^#[0-9A-F]{6}$/)
  })
})
