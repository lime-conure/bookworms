import axios from 'axios'
/**
 * ACTION TYPES
 */
const GET_CLUB_BOOKS = 'GET_CLUB_BOOKS'
const ADD_CLUB_BOOK = 'ADD_CLUB_BOOK'
const REMOVE_CLUB_BOOK = 'REMOVE_CLUB_BOOK'

/**
 * INITIAL STATE
 */
const clubBooks = []

/**
 * ACTION CREATORS
 */
const getClubBooks = books => ({
  type: GET_CLUB_BOOKS,
  books
})

const addClubBook = book => ({
  type: ADD_CLUB_BOOK,
  book
})

const removeClubBook = book => ({
  type: REMOVE_CLUB_BOOK,
  book
})

/**
 * THUNK CREATORS
 */

export const fetchClubBooks = clubId => async dispatch => {
  try {
    const {data} = await axios.get(`/api/clubs/${clubId}/books`)
    const formatedData = data.map(book => ({
      ...book.book,
      clubs_books: book.clubs_books
    }))
    dispatch(getClubBooks(formatedData))
  } catch (err) {
    console.log(err)
  }
}

export const postClubBook = (book, type, clubId) => async dispatch => {
  try {
    console.log('in postClubBook', book, type)
    const {data} = await axios.post(`/api/clubs/${clubId}/books/add`, {
      book,
      type
    })
    console.log('data: ', data)
    if (data.book) {
      dispatch(
        addClubBook({
          ...data.book,
          clubs_books: data.clubs_books,
          authors: book.authors || [book.author]
        })
      )
    }
  } catch (err) {
    console.log(err)
  }
}

export const deleteClubBook = (book, clubId) => async dispatch => {
  try {
    await axios.put(`/api/clubs/${clubId}/books/delete`, {
      book
    })
    dispatch(removeClubBook(book))
  } catch (err) {
    console.log(err)
  }
}

export default function(state = clubBooks, action) {
  switch (action.type) {
    case GET_CLUB_BOOKS:
      return action.books
    case ADD_CLUB_BOOK:
      return [action.book, ...state]
    case REMOVE_CLUB_BOOK:
      return state.filter((book, idx) => {
        //console.log(idx, ': ', book, action.book)
        return !(
          book.id === action.book.id &&
          book.clubs_books.type === action.book.clubs_books.type &&
          (book.clubs_books.type === 'past'
            ? book.clubs_books.endTime === action.book.clubs_books.endTime
            : true)
        )
      })

    default:
      return state
  }
}
