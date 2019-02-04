// const {expect} = require('chai');
// const request = require('supertest');
// const db = require('../db');
// const app = require('../index');
// const Club = db.model('club')

// describe ('Club routes', () => {
//   beforeEach ( () => {
//     return db.sync({force:true})
//   })

// describe('/api/clubs', () => {
//   const user = {userId: 1, name: 'Bob'}
//   beforeEach( () => {
//     return Club.create({
//       name: 'my first club'
//     })

//   });

//   it('GET /api/clubs', async () => {
//     const res = await request(app)
//       .get('/api/clubs')
//       .set(user)
//       .expect(200)

//     expect(res.body).to.be.an('array');
//   });

// it.only('POST /api/clubs/create', async () => {
//   const data = {name: 'mi first club', userId:'1'};
//   const res = await request(app)
//     .post('/api/clubs/create')
//     .send(data)
//     .expect(200)
// })
// })
// });
