const {expect} = require('chai')
const db = require('../../index')
const Message = db.model('message')

describe('Message model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('Message fields', () => {
    describe('text is require', () => {
      function textNeeded() {
        return Message.build({
          text: '',
          main: true
        })
      }
      it('throws error if text is empty', async () => {
        expect(await textNeeded().validate).to.throw()
      })
    })
  })
})
