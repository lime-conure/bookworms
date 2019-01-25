'use strict'

const db = require('../server/db')
const {
  User,
  Author,
  Book,
  Club,
  UserBook,
  UserClub,
  BookAuthor,
  Poll,
  Option,
  Vote
} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({
      firstName: 'Brynn',
      lastName: 'Shepherd',
      email: 'brynn.shepherd@email.com',
      password: '123'
    }),
    User.create({
      firstName: 'Sabira',
      lastName: 'Davletshina',
      email: 'sabira.davletshina@gmail.com',
      password: '123'
    })
  ])

  const clubs = await Promise.all([
    Club.create({
      name: 'Lime Conure',
      inviteLink: 'https://github.com/lime-conure/bookworms'
    })
  ])

  const authors = await Promise.all([
    Author.create({
      name: 'Amor Towles',
      bio:
        'Born and raised in the Boston area, Amor Towles graduated from Yale College and received an MA in English from Stanford University. Having worked as an investment professional in Manhattan for over twenty years, he now devotes himself fulltime to writing. His first novel, Rules of Civility, published in 2011, was a New York Times bestseller in both hardcover and paperback and was ranked by the Wall Street Journal as one of the best books of 2011. The book was optioned by Lionsgate to be made into a feature film and its French translation received the 2012 Prix Fitzgerald. His second novel, A Gentleman in Moscow, published in 2016, was also a New York Times bestseller and was ranked as one of the best books of 2016 by the Chicago Tribune, the Miami Herald, the Philadelphia Inquirer, the St. Louis Dispatch, and NPR. Both novels have been translated into over fifteen languages.'
    }),
    Author.create({
      name: 'Emily St. John Mandel',
      bio:
        'Emily St. John Mandel was born and raised on the west coast of British Columbia, Canada. She studied contemporary dance at the School of Toronto Dance Theatre and lived briefly in Montreal before relocating to New York.'
    }),
    Author.create({
      name: 'Yuval Noah Harari',
      bio:
        'Professor Harari was born in Haifa, Israel, to Lebanese parents in 1976. He received his Ph.D. from the University of Oxford in 2002, and is now a lecturer at the Department of History, the Hebrew University of Jerusalem.'
    })
  ])

  const books = await Promise.all([
    Book.create({
      goodReadsId: 29430012,
      title: 'A Gentleman in Moscow',
      description:
        'When, in 1922, he is deemed an unrepentant aristocrat by a Bolshevik tribunal, the count is sentenced to house arrest in the Metropol, a grand hotel across the street from the Kremlin. Rostov, an indomitable man of erudition and wit, has never worked a day in his life, and must now live in an attic room while some of the most tumultuous decades in Russian history are unfolding outside the hotel’s doors. Unexpectedly, his reduced circumstances provide him a doorway into a much larger world of emotional discovery.',
      pubDate: 'June 9 2016',
      pageNum: 502,
      amazonUrl: 'https://www.amazon.com/gp/product/B01COJUEZ0',
      rating: 436
    }),
    Book.create({
      goodReadsId: 20170404,
      title: 'Station Eleven',
      description:
        "An audacious, darkly glittering novel set in the eerie days of civilization's collapse, Station Eleven tells the spellbinding story of a Hollywood star, his would-be savior, and a nomadic group of actors roaming the scattered outposts of the Great Lakes region, risking everything for art and humanity.",
      pubDate: 'September 9 2014',
      pageNum: 336,
      amazonUrl: 'https://www.amazon.com/gp/product/0385353308',
      rating: 403
    }),
    Book.create({
      goodReadsId: 23692271,
      title: 'Sapiens: A Brief History of Humankind',
      description:
        '100,000 years ago, at least six human species inhabited the earth. Today there is just one. Us. Homo sapiens. How did our species succeed in the battle for dominance? Why did our foraging ancestors come together to create cities and kingdoms? How did we come to believe in gods, nations and human rights; to trust money, books and laws; and to be enslaved by bureaucracy, timetables and consumerism? And what will our world be like in the millennia to come?',
      pubDate: '2011',
      pageNum: 443,
      amazonUrl:
        'https://www.amazon.com/Sapiens-Humankind-Yuval-Noah-Harari/dp/0062316117',
      rating: 445
    })
  ])

  // associate both users with club 2
  await Promise.all([
    UserClub.create({
      userId: 1,
      clubId: 1
    }),
    UserClub.create({
      userId: 2,
      clubId: 1
    })
  ])

  // associate book 1 with author 1 and book 2 with author 2
  await Promise.all([
    BookAuthor.create({
      authorId: 1,
      bookId: 1
    }),
    BookAuthor.create({
      authorId: 2,
      bookId: 2
    }),
    BookAuthor.create({
      authorId: 3,
      bookId: 3
    })
  ])

  // associate user 1 with both books
  await Promise.all([
    UserBook.create({
      userId: 1,
      bookId: 1
    }),
    UserBook.create({
      userId: 1,
      bookId: 2
    })
  ])

  // make a poll for our club
  const polls = await Promise.all([
    Poll.create({
      title: 'February 2019 Meeting',
      notes:
        'A poll to decide our next book and meeting time for club Lime Conure',
      dueDate: new Date(),
      clubId: 1
    })
  ])

  // make poll options
  const options = await Promise.all([
    Option.create({
      type: 'book',
      bookName: 'A Gentleman in Moscow',
      bookId: 1,
      pollId: 1
    }),
    Option.create({
      type: 'book',
      bookName: 'Station Eleven',
      bookId: 2,
      pollId: 1
    }),
    Option.create({
      type: 'book',
      bookName: 'Sapiens',
      bookId: 3,
      pollId: 1
    }),
    Option.create({
      type: 'location',
      location: 'Sweetgreen',
      pollId: 1
    }),
    Option.create({
      type: 'location',
      location: 'Killarney Rose',
      pollId: 1
    }),
    Option.create({
      type: 'location',
      location: 'Grace Hopper Campus',
      pollId: 1
    })
  ])

  // add votes for both users
  const votes = await Promise.all([
    Vote.create({
      userId: 1,
      optionId: 1
    }),
    Vote.create({
      userId: 2,
      optionId: 2
    })
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded ${books.length} books`)
  console.log(`seeded ${clubs.length} club`)
  console.log(`seeded ${authors.length} authors`)
  console.log(`seeded ${polls.length} poll`)
  console.log(`seeded ${options.length} options`)
  console.log(`seeded ${votes.length} votes`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
