'use strict'

const db = require('../server/db')
const {
  User,
  Author,
  Book,
  Club,
  UserBook,
  UserClub,
  ClubBook,
  BookAuthor,
  Poll,
  Option,
  Vote,
  Meeting
} = require('../server/db/models')

// eslint-disable-next-line max-statements
async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const user = await User.create({
    firstName: 'Sabira',
    lastName: 'Davletshina',
    imageUrl: 'https://avatars1.githubusercontent.com/u/34147944?s=460&v=4',
    email: 'sabira@gmail.com',
    password: '123'
  })
  const jing = await User.create({
    firstName: 'Jing',
    lastName: 'Lu',
    imageUrl:
      'https://media.licdn.com/dms/image/C4E03AQF7pJHzVlq_CQ/profile-displayphoto-shrink_800_800/0?e=1554940800&v=beta&t=7J0A5QUaDvYkoLoLRW52nDqkPNB5GLwwnMzMeRVSDUQ',
    email: 'jing@gmail.com',
    password: '123'
  })
  const norka = await User.create({
    firstName: 'Norka',
    lastName: 'Avalos',
    imageUrl:
      'https://media.licdn.com/dms/image/C5603AQF17N4ov1UHfQ/profile-displayphoto-shrink_800_800/0?e=1554940800&v=beta&t=QTVsJiX1_27N-1vF8pF6TBCb4_H7QFQDTNpwLfTyiUQ',
    email: 'norka@gmail.com',
    password: '123'
  })
  const brynn = await User.create({
    firstName: 'Brynn',
    lastName: 'Shepherd',
    imageUrl: 'https://avatars3.githubusercontent.com/u/1870471?s=460&v=4',
    email: 'brynn@gmail.com',
    password: '123'
  })

  const club = await Club.create({
    name: 'Worms Unite!',
    inviteLink: `1/52049673`
  })

  await user.setClubs([club])
  await brynn.setClubs([club])
  await jing.setClubs([club])
  await norka.setClubs([club])

  // BOOK & AUTHOR 1
  const author1 = await Author.create({
    name: 'Tommy Orange',
    goodReadsId: 17205711,
    bio:
      'Tommy Orange is a recent graduate from the MFA program at the Institute of American Indian Arts. He is a 2014 MacDowell Fellow, and a 2016 Writing by Writers Fellow. He is an enrolled member of the Cheyenne and Arapaho Tribes of Oklahoma. He was born and raised in Oakland, California, and currently lives in Angels Camp, California.'
  })
  const book1 = await Book.create({
    goodReadsId: 36692478,
    title: 'There There',
    imageUrl: 'https://images.gr-assets.com/books/1512071034l/36692478.jpg',
    description:
      'There There is a relentlessly paced multigenerational story about violence and recovery, memory and identity, and the beauty and despair woven into the history of a nation and its people. It tells the story of twelve characters, each of whom have private reasons for traveling to the Big Oakland Powwow. Jacquie Red Feather is newly sober and trying to make it back to the family she left behind in shame. Dene Oxendene is pulling his life back together after his uncle’s death and has come to work at the powwow to honor his uncle’s memory. Opal Viola Victoria Bear Shield has come to watch her nephew Orvil, who has taught himself traditional Indian dance through YouTube videos and has come to the powwow to dance in public for the very first time. There will be glorious communion, and a spectacle of sacred tradition and pageantry. And there will be sacrifice, and heroism, and unspeakable loss.',
    pubDate: 'June 5 2018',
    rating: 406
  })
  await book1.setAuthors([author1])

  // BOOK & AUTHOR 2
  const author2 = await Author.create({
    name: 'Gretchen Rubin',
    goodReadsId: 21246,
    bio:
      'I am the author of New York Times bestsellers The Happiness Project, Happier at Home, and Better Than Before, and The Four Tendencies. My next book, Outer Order Inner Calm , will be published March 2019.'
  })
  const book2 = await Book.create({
    goodReadsId: 6398634,
    title: 'The Happiness Project',
    imageUrl: 'https://images.gr-assets.com/books/1256849491l/6398634.jpg',
    description: `Gretchen Rubin had an epiphany one rainy afternoon in the unlikeliest of places: a city bus. “The days are long, but the years are short,” she realized. “Time is passing, and I’m not focusing enough on the things that really matter.” In that moment, she decided to dedicate a year to her happiness project. In this lively and compelling account, Rubin chronicles her adventures during the twelve months she spent test-driving the wisdom of the ages, current scientific research, and lessons from popular culture about how to be happier. Among other things, she found that novelty and challenge are powerful sources of happiness; that money can help buy happiness, when spent wisely; that outer order contributes to inner calm; and that the very smallest of changes can make the biggest difference.`,
    pubDate: 'December 29 2009',
    rating: 360
  })
  await book2.setAuthors([author2])

  // BOOK & AUTHOR 3
  const author3 = await Author.create({
    name: 'Chloe Benjamin',
    goodReadsId: 15968276,
    bio: `Chloe Benjamin is the author of THE IMMORTALISTS, a New York Times Bestseller, #1 Indie Next Pick for January 2018, Barnes & Noble Discover Great New Writers Selection, #1 Library Reads pick, and Amazon Best Book of the Month.`
  })
  const book3 = await Book.create({
    goodReadsId: 30288282,
    title: 'The Immortalists',
    imageUrl: 'https://images.gr-assets.com/books/1493015963l/30288282.jpg',
    description: `If you knew the date of your death, how would you live your life? It's 1969 in New York City's Lower East Side, and word has spread of the arrival of a mystical woman, a traveling psychic who claims to be able to tell anyone the day they will die. The Gold children—four adolescents on the cusp of self-awareness—sneak out to hear their fortunes. The prophecies inform their next five decades. Golden-boy Simon escapes to the West Coast, searching for love in '80s San Francisco; dreamy Klara becomes a Las Vegas magician, obsessed with blurring reality and fantasy; eldest son Daniel seeks security as an army doctor post-9/11; and bookish Varya throws herself into longevity research, where she tests the boundary between science and immortality.`,
    pubDate: 'January 9 2018',
    rating: 373
  })
  await book3.setAuthors([author3])

  // BOOK & AUTHOR 4
  const book4 = await Book.create({
    goodReadsId: 29430012,
    title: 'A Gentleman in Moscow',
    imageUrl: 'https://images.gr-assets.com/books/1459524472m/29430012.jpg',
    description:
      'When, in 1922, he is deemed an unrepentant aristocrat by a Bolshevik tribunal, the count is sentenced to house arrest in the Metropol, a grand hotel across the street from the Kremlin. Rostov, an indomitable man of erudition and wit, has never worked a day in his life, and must now live in an attic room while some of the most tumultuous decades in Russian history are unfolding outside the hotel’s doors. Unexpectedly, his reduced circumstances provide him a doorway into a much larger world of emotional discovery.',
    pubDate: 'June 9 2016',
    rating: 436
  })
  const author4 = await Author.create({
    name: 'Amor Towles',
    goodReadsId: 4536964,
    bio:
      'Born and raised in the Boston area, Amor Towles graduated from Yale College and received an MA in English from Stanford University. Having worked as an investment professional in Manhattan for over twenty years, he now devotes himself fulltime to writing. His first novel, Rules of Civility, published in 2011, was a New York Times bestseller in both hardcover and paperback and was ranked by the Wall Street Journal as one of the best books of 2011. The book was optioned by Lionsgate to be made into a feature film and its French translation received the 2012 Prix Fitzgerald. His second novel, A Gentleman in Moscow, published in 2016, was also a New York Times bestseller and was ranked as one of the best books of 2016 by the Chicago Tribune, the Miami Herald, the Philadelphia Inquirer, the St. Louis Dispatch, and NPR. Both novels have been translated into over fifteen languages.'
  })
  await book4.setAuthors([author4])

  // BOOK & AUTHOR 5
  const book5 = await Book.create({
    goodReadsId: 20170404,
    title: 'Station Eleven',
    imageUrl: 'https://images.gr-assets.com/books/1451446835m/20170404.jpg',
    description:
      "An audacious, darkly glittering novel set in the eerie days of civilization's collapse, Station Eleven tells the spellbinding story of a Hollywood star, his would-be savior, and a nomadic group of actors roaming the scattered outposts of the Great Lakes region, risking everything for art and humanity.",
    pubDate: 'September 9 2014',
    rating: 403
  })
  const author5 = await Author.create({
    name: 'Emily St. John Mandel',
    goodReadsId: 2786093,
    bio:
      'Emily St. John Mandel was born and raised on the west coast of British Columbia, Canada. She studied contemporary dance at the School of Toronto Dance Theatre and lived briefly in Montreal before relocating to New York.'
  })
  await book5.setAuthors([author5])

  // BOOK & AUTHOR 6
  const author6 = await Author.create({
    name: 'Yuval Noah Harari',
    goodReadsId: 395812,
    bio:
      'Professor Harari was born in Haifa, Israel, to Lebanese parents in 1976. He received his Ph.D. from the University of Oxford in 2002, and is now a lecturer at the Department of History, the Hebrew University of Jerusalem.'
  })
  const book6 = await Book.create({
    goodReadsId: 23692271,
    title: 'Sapiens: A Brief History of Humankind',
    imageUrl: 'https://images.gr-assets.com/books/1420585954m/23692271.jpg',
    description:
      '100,000 years ago, at least six human species inhabited the earth. Today there is just one. Us. Homo sapiens. How did our species succeed in the battle for dominance? Why did our foraging ancestors come together to create cities and kingdoms? How did we come to believe in gods, nations and human rights; to trust money, books and laws; and to be enslaved by bureaucracy, timetables and consumerism? And what will our world be like in the millennia to come?',
    pubDate: '2011',
    rating: 445
  })
  await book6.setAuthors([author6])

  // BOOK & AUTHOR 7
  const author7 = await Author.create({
    name: 'Jesmyn Ward',
    goodReadsId: 1676417,
    bio: `Jesmyn Ward is the author of Where the Line Bleeds, Salvage the Bones, and Men We Reaped. She is a former Stegner Fellow (Stanford University) and Grisham Writer in Residence at the University of Mississippi. She is an associate professor of Creative Writing at Tulane University.`
  })
  const book7 = await Book.create({
    goodReadsId: 32920226,
    title: 'Sing, Unburied, Sing',
    imageUrl: 'https://images.gr-assets.com/books/1499340866l/32920226.jpg',
    description:
      'Jesmyn Ward’s first novel since her National Book Award–winning Salvage the Bones, this singular American writer brings the archetypal road novel into rural twenty-first-century America. An intimate portrait of a family and an epic tale of hope and struggle, Sing, Unburied, Sing journeys through Mississippi’s past and present, examining the ugly truths at the heart of the American story and the power—and limitations—of family bonds.',
    pubDate: 'September 5 2017',
    rating: 404
  })
  await book7.setAuthors([author7])

  // BOOK & AUTHOR 8
  const author8 = await Author.create({
    name: 'Haruki Murakami',
    goodReadsId: 3354,
    bio: `Since childhood, Murakami has been heavily influenced by Western culture, particularly Western music and literature. He grew up reading a range of works by American writers, such as Kurt Vonnegut and Richard Brautigan, and he is often distinguished from other Japanese writers by his Western influences.`
  })
  const book8 = await Book.create({
    goodReadsId: 38820047,
    title: 'Killing Commendatore',
    imageUrl: 'https://images.gr-assets.com/books/1527854255l/38820047.jpg',
    description:
      'In Killing Commendatore, a thirty-something portrait painter in Tokyo is abandoned by his wife and finds himself holed up in the mountain home of a famous artist, Tomohiko Amada. When he discovers a previously unseen painting in the attic, he unintentionally opens a circle of mysterious circumstances. To close it, he must complete a journey that involves a mysterious ringing bell, a two-foot-high physical manifestation of an Idea, a dapper businessman who lives across the valley, a precocious thirteen-year-old girl, a Nazi assassination attempt during World War II in Vienna, a pit in the woods behind the artist’s home, and an underworld haunted by Double Metaphors. A tour de force of love and loneliness, war and art—as well as a loving homage to The Great Gatsby—Killing Commendatore is a stunning work of imagination from one of our greatest writers.',
    pubDate: 'September 5 2017',
    rating: 392
  })
  await book8.setAuthors([author8])

  // BOOK & AUTHOR 7
  const author9 = await Author.create({
    name: 'Kamila Shamsie',
    goodReadsId: 168076,
    bio: `Kamila Shamsie was born in 1973 in Karachi, where she grew up. She has a BA in Creative Writing from Hamilton College in Clinton, NY and an MFA from the University of Massachusetts, Amherst. While at the University of Massachusetts she wrote In The City By The Sea , published by Granta Books UK in 1998. This first novel was shortlisted for the John Llewelyn Rhys Award in the UK, and Shamsie received the Prime Minister’s Award for Literature in Pakistan in 1999. Her 2000 novel Salt and Saffron led to Shamsie’s selection as one of Orange’s “21 Writers of the 21st Century.” With her third novel, Kartography , Shamsie was again shortlisted for the John Llewelyn Rhys award in the UK. Both Kartography and her next novel, Broken Verses , won the Patras Bokhari Award from the Academy of Letters in Pakistan. Burnt Shadows, Shamsie’s fifth novel, has been longlisted for the Orange Prize for Fiction. Her books have been translated into a number of languages.`
  })
  const book9 = await Book.create({
    goodReadsId: 33621427,
    title: 'Home Fire',
    imageUrl: 'https://images.gr-assets.com/books/1534180768l/33621427.jpg',
    description:
      'Isma is free. After years of watching out for her younger siblings in the wake of their mother’s death, she’s accepted an invitation from a mentor in America that allows her to resume a dream long deferred. But she can’t stop worrying about Aneeka, her beautiful, headstrong sister back in London, or their brother, Parvaiz, who’s disappeared in pursuit of his own dream, to prove himself to the dark legacy of the jihadist father he never knew. When he resurfaces half a globe away, Isma’s worst fears are confirmed.',
    pubDate: 'September 5 2017',
    rating: 409
  })
  await book9.setAuthors([author9])

  // BOOK & AUTHOR 10
  const author10 = await Author.create({
    name: 'George Saunders',
    goodReadsId: 8885,
    bio: `George Saunders was born December 2, 1958 and raised on the south side of Chicago. In 1981 he received a B.S. in Geophysical Engineering from Colorado School of Mines in Golden, Colorado. He worked at Radian International, an environmental engineering firm in Rochester, NY as a technical writer and geophysical engineer from 1989 to 1996. He has also worked in Sumatra on an oil exploration geophysics crew, as a doorman in Beverly Hills, a roofer in Chicago, a convenience store clerk, a guitarist in a Texas country-and-western band, and a knuckle-puller in a West Texas slaughterhouse. `
  })
  const book10 = await Book.create({
    goodReadsId: 29906980,
    title: 'Lincoln in the Bardo',
    imageUrl: 'https://images.gr-assets.com/books/1492130850l/29906980.jpg',
    description:
      'n his long-awaited first novel, American master George Saunders delivers his most original, transcendent, and moving work yet. Unfolding in a graveyard over the course of a single night, narrated by a dazzling chorus of voices, Lincoln in the Bardo is a literary experience unlike any other—for no one but Saunders could conceive it.',
    pubDate: 'September 5 2017',
    rating: 378
  })
  await book10.setAuthors([author10])

  // BOOK & AUTHOR 11
  const author11 = await Author.create({
    name: 'Yaa Gyasi',
    goodReadsId: 14493315,
    bio: `Yaa Gyasi was born in Ghana and raised in Huntsville, Alabama. She is a graduate of the Iowa Writers’ Workshop where she held a Dean’s Graduate Research Fellowship. Her short stories have appeared in African American Review and Callaloo. Her debut novel, is Homegoing (Knopf, June 2016).`
  })
  const book11 = await Book.create({
    goodReadsId: 27071490,
    title: 'Homegoing',
    imageUrl: 'https://images.gr-assets.com/books/1448108591l/27071490.jpg',
    description:
      'A novel of breathtaking sweep and emotional power that traces three hundred years in Ghana and along the way also becomes a truly great American novel. Extraordinary for its exquisite language, its implacable sorrow, its soaring beauty, and for its monumental portrait of the forces that shape families and nations, Homegoing heralds the arrival of a major new voice in contemporary fiction.',
    rating: 442
  })
  await book11.setAuthors([author11])

  // BOOK & AUTHOR 12
  const author12 = await Author.create({
    name: 'Carlo Rovelli',
    goodReadsId: 108952,
    bio: `Carlo Rovelli is an Italian theoretical physicist and writer who has worked in Italy and the USA, and currently works in France. His work is mainly in the field of quantum gravity, where he is among the founders of the loop quantum gravity theory. He has also worked in the history and philosophy of science. He collaborates regularly with several Italian newspapers, in particular the cultural supplements of Il Sole 24 Ore and La Repubblica.`
  })
  const book12 = await Book.create({
    goodReadsId: 41150906,
    title: 'The Order of Time',
    imageUrl: 'https://images.gr-assets.com/books/1534824772l/41150906.jpg',
    description: `Time is a mystery that does not cease to puzzle us. Philosophers, artists and poets have long explored its meaning while scientists have found that its structure is different from the simple intuition we have of it. From Boltzmann to quantum theory, from Einstein to loop quantum gravity, our understanding of time has been undergoing radical transformations. Time flows at a different speed in different places, the past and the future differ far less than we might think, and the very notion of the present evaporates in the vast universe.
        `,
    rating: 409
  })
  await book12.setAuthors([author12])

  await Promise.all([
    ClubBook.create({
      clubId: 1,
      bookId: 1,
      startTime: new Date('12-20-2018'),
      endTime: new Date('1-02-2019'),
      type: 'past'
    }),
    ClubBook.create({
      type: 'past',
      startTime: '2018-04-01 14:55:19.718-05',
      endTime: '2018-06-03 14:55:19.718-05',
      clubId: 1,
      bookId: 2
    }),
    ClubBook.create({
      type: 'past',
      startTime: '2018-06-01 14:55:19.718-05',
      endTime: '2018-07-03 11:55:19.718-05',
      clubId: 1,
      bookId: 3
    }),
    ClubBook.create({
      type: 'past',
      startTime: '2018-06-01 14:55:19.718-05',
      endTime: '2018-07-20 18:55:19.718-05',
      clubId: 1,
      bookId: 4
    }),
    ClubBook.create({
      type: 'past',
      startTime: '2018-08-03 02:55:19.718-05',
      endTime: '2018-11-20 16:55:19.718-05',
      clubId: 1,
      bookId: 5
    }),
    ClubBook.create({
      type: 'past',
      startTime: '2018-08-03 16:55:19.718-05',
      endTime: '2019-02-05 16:55:19.718-05',
      clubId: 1,
      bookId: 6
    }),
    ClubBook.create({
      type: 'past',
      startTime: '2018-08-05 16:55:19.718-05',
      endTime: '2019-02-03 16:55:19.718-05',
      clubId: 1,
      bookId: 7
    }),
    ClubBook.create({
      type: 'past',
      startTime: '2018-02-01 12:55:19.718-05',
      endTime: '2018-02-07 12:55:19.718-05',
      clubId: 1,
      bookId: 8
    }),
    ClubBook.create({
      type: 'now',
      startTime: '2019-02-03 16:55:19.718-05',
      endTime: null,
      clubId: 1,
      bookId: 9
    }),
    ClubBook.create({
      type: 'now',
      startTime: '2019-02-03 16:55:19.718-05',
      endTime: null,
      clubId: 1,
      bookId: 10
    }),
    ClubBook.create({
      clubId: 1,
      bookId: 11,
      type: 'future'
    })
  ])

  await UserBook.create({
    userId: 1,
    bookId: 5,
    endTime: new Date('06-29-2015'),
    type: 'past'
  })
  await UserBook.create({
    userId: 1,
    bookId: 6,
    startTime: new Date('07-14-2017'),
    endTime: new Date('07-21-2017'),
    type: 'past'
  })
  await UserBook.create({
    userId: 1,
    bookId: 12,
    startTime: new Date('01-19-2019'),
    type: 'now'
  })

  // past poll
  await Poll.create({
    title: 'January 2019 Meeting',
    notes: 'A poll for figuring out our first meeting of 2019',
    dueDate: new Date('12-20-2018'),
    clubId: 1,
    creatorId: 1
  })

  // options for poll1 (past)
  await Promise.all([
    Option.create({
      type: 'book',
      bookName: 'There There',
      bookId: 1,
      pollId: 1
    }),
    Option.create({
      type: 'book',
      bookName: 'Sing, Unburied, Sing',
      bookId: 7,
      pollId: 1
    }),
    Option.create({
      type: 'book',
      bookName: 'A Gentleman in Moscow',
      bookId: 4,
      pollId: 1
    }),
    Option.create({
      type: 'location',
      location: 'Niu Noodle House',
      pollId: 1
    }),
    Option.create({
      type: 'location',
      location: 'Numero 28 Pizzeria',
      pollId: 1
    }),
    Option.create({
      type: 'time',
      dateTime: new Date('01-02-2019'),
      pollId: 1
    }),
    Option.create({
      type: 'time',
      dateTime: new Date('01-09-2019'),
      pollId: 1
    }),
    Option.create({
      type: 'time',
      dateTime: new Date('01-16-2019'),
      pollId: 1
    })
  ])

  // active poll
  await Poll.create({
    title: 'March 2019 Meeting',
    notes: 'A poll for figuring out our second meeting of 2019',
    dueDate: new Date('2-20-2019'),
    clubId: 1,
    creatorId: 1
  })

  // options for poll2 (active)
  await Promise.all([
    Option.create({
      type: 'book',
      bookName: 'The Happiness Project',
      bookId: 2,
      pollId: 2
    }),
    Option.create({
      type: 'book',
      bookName: 'Homegoing',
      bookId: 11,
      pollId: 2
    }),
    Option.create({
      type: 'location',
      location: 'Niu Noodle House',
      pollId: 2
    }),
    Option.create({
      type: 'location',
      location: 'Bosie Tea Parlor',
      pollId: 2
    }),
    Option.create({
      type: 'time',
      dateTime: new Date('03-03-2019'),
      pollId: 2
    }),
    Option.create({
      type: 'time',
      dateTime: new Date('03-16-2019'),
      pollId: 2
    })
  ])

  // past meeting
  await Meeting.create({
    name: 'November Meeting',
    location: 'Old Tbilisi Garden',
    date: new Date('11-14-2018'),
    bookId: 1,
    clubId: 1,
    creatorId: 1
  })

  // votes for poll1 (past)
  await Promise.all([
    Vote.create({
      userId: 1,
      optionId: 1
    }),
    Vote.create({
      userId: 1,
      optionId: 4
    }),
    Vote.create({
      userId: 1,
      optionId: 7
    })
  ])

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
