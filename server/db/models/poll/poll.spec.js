const {expect} = require('chai')
const db = require('../../index')
const Poll = db.model('poll')

describe('Poll model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('Poll fields', () => {
    describe('title is required', () => {
      function titleRequired() {
        return Poll.build({
          title: '',
          dueDate: '29/03/2019',
          notes: 'To go to a book sale'
        })
      }
      it('throws error if title is empty', async () => {
        expect(await titleRequired().validate).to.throw()
      })
    })
  })
})
