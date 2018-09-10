should = require('should')
Locales = require('../../../webapp/utils/locales')

describe('A Locales object', () => {

  it('should return the key if not found in language', () => {
    locales = new Locales()
    locales.translate('de', 'unavailablekey').should.equal("[unavailablekey]")
  })

  it('should translate to german', () => {
    locales = new Locales()
    locales.translate('de', 'overview').should.equal("Übersicht")
  })

})
