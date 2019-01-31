const {expect} = require('chai')
const db = require('../../index')
const Option = db.model('option')

describe('Option model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('Option fields', () => {
    describe('type is required', () => {
      function typeRequired() {
        return Option.build({
          type: '',
          bookName: 'The girl on the train'
        })
      }
      it('throws error if type is empty', async () => {
        expect(await typeRequired().validate).to.throw()
      })
    })
  })
})
