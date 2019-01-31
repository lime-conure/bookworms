const {expect} = require('chai')
const db = require('../../index')
const Thread = db.model('thread')

describe('Thread model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })
  describe('Thread fields', () => {
    describe('name', () => {
      function nameRequired() {
        return Thread.build({
          name: ''
        })
      }
      it('throws error if name is empty', async () => {
        expect(await nameRequired().validate).to.throw()
      })
    })
  })
})
