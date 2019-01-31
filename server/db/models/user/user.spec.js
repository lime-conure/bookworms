/* global describe beforeEach it */

const {expect} = require('chai')
const db = require('../../index')
const User = db.model('user')

describe('User model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('User fields', () => {
    describe('email is require', () => {
      function emailRequired() {
        return User.build({
          firstName: 'Bob',
          lastName: 'Sponge',
          email: '',
          image:
            'https://www.google.com/search?q=spongebob&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjvl-zZxZjgAhXL1lkKHW9wBbIQ_AUIDigB&biw=1419&bih=746#imgrc=MRgvP73wILOCZM:',
          password: 'pineapple'
        })
      }
      it('throws error if email is empty', async () => {
        expect(await emailRequired().validate).to.throw()
      })
    })
    describe('email must exist', () => {
      function noEmail() {
        return User.build({
          firstName: 'Bob',
          lastName: 'Sponge',
          image:
            'https://www.google.com/search?q=spongebob&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjvl-zZxZjgAhXL1lkKHW9wBbIQ_AUIDigB&biw=1419&bih=746#imgrc=MRgvP73wILOCZM:',
          password: 'pineapple'
        })
      }
      it('throw error if email is missing', async () => {
        expect(await noEmail().validate).to.throw()
      })
    })
  })

  describe('firstName must not be empty', () => {
    function nameRequired() {
      return User.build({
        firstName: '',
        lastName: 'Sponge',
        email: 'underwaterbob@gmail.com',
        image:
          'https://www.google.com/search?q=spongebob&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjvl-zZxZjgAhXL1lkKHW9wBbIQ_AUIDigB&biw=1419&bih=746#imgrc=MRgvP73wILOCZM:',
        password: 'pineapple'
      })
    }
    it('throws error if name is empty', async () => {
      expect(await nameRequired().validate).to.throw()
    })
  })

  describe('firstName must exist', () => {
    function nameRequired() {
      return User.build({
        lastName: 'Sponge',
        email: 'underwaterbob@gmail.com',
        image:
          'https://www.google.com/search?q=spongebob&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjvl-zZxZjgAhXL1lkKHW9wBbIQ_AUIDigB&biw=1419&bih=746#imgrc=MRgvP73wILOCZM:',
        password: 'pineapple'
      })
    }
    it('throws error if name is missing', async () => {
      expect(await nameRequired().validate).to.throw()
    })
  })

  describe('password is require', () => {
    function passwordNeeded() {
      return User.build({
        firstName: 'Bob',
        lastName: 'Sponge',
        email: 'underwaterbob@gmail.com',
        image:
          'https://www.google.com/search?q=spongebob&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjvl-zZxZjgAhXL1lkKHW9wBbIQ_AUIDigB&biw=1419&bih=746#imgrc=MRgvP73wILOCZM:',
        password: ''
      })
    }
    it('throws error if password is empty', async () => {
      expect(await passwordNeeded().validate).to.throw()
    })
  })

  describe('password must exist', () => {
    function noEmail() {
      return User.build({
        firstName: 'Bob',
        lastName: 'Sponge',
        image:
          'https://www.google.com/search?q=spongebob&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjvl-zZxZjgAhXL1lkKHW9wBbIQ_AUIDigB&biw=1419&bih=746#imgrc=MRgvP73wILOCZM:',
        password: 'pineapple'
      })
    }
    it('throw error if email is missing', async () => {
      expect(await noEmail().validate).to.throw()
    })
  })

  describe('instanceMethods', () => {
    describe('correctPassword', () => {
      let cody

      beforeEach(async () => {
        cody = await User.create({
          firstName: 'Cody',
          email: 'cody@puppybook.com',
          password: 'bones'
        })
      })

      it('returns true if the password is correct', () => {
        expect(cody.correctPassword('bones')).to.be.equal(true)
      })

      it('returns false if the password is incorrect', () => {
        expect(cody.correctPassword('bonez')).to.be.equal(false)
      })
    }) // end describe('correctPassword')
  }) // end describe('instanceMethods') // end describe('User model')
})
