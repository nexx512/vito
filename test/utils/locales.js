should = require('should')
Locales = require('../../utils/locales')

describe('A Locales object', () => {

  it('should translate to german', () => {
    locales = new Locales()
    locales.translate('de', 'overview').should.equal("Übersicht")
  })

})
