const {expect} = require('chai')
const db = require('../../index')
const Club = db.model('club')

describe('Club model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })
})

describe('Club fields', () => {
  describe('name is required', () => {
    function nameNeeded() {
      return Club.build({
        name: ''
      })
    }
    it('throws error if name is empty', async () => {
      expect(await nameNeeded().validate).to.throw()
    })
  })
})
