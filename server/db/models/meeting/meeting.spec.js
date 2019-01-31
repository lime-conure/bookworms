const {expect} = require('chai')
const db = require('../../index')
const Meeting = db.model('meeting')

describe('Club model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })
})

describe('Meeting fields', () => {
  describe('name is require', () => {
    function nameNeeded() {
      return Meeting.build({
        name: '',
        location: 'my house',
        date: '08/12/2019'
      })
    }
    it('throws error if name is empty', async () => {
      expect(await nameNeeded().validate).to.throw()
    })
  })
})

describe('location', () => {
  function locationNeeded() {
    return Meeting.build({
      name: 'birthday party',
      location: '',
      date: '08/12/2019'
    })
  }
  it('throws error if location is empty', async () => {
    expect(await locationNeeded().validate).to.throw()
  })
})

describe('date', () => {
  function dateNeeded() {
    return Meeting.build({
      name: 'birthday party',
      location: '123 Bleecker st',
      date: ''
    })
  }
  it('throws error if date is empty', async () => {
    expect(await dateNeeded().validate).to.throw()
  })
})
