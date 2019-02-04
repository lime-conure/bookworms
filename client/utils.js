import React from 'react'
import BookSearch from './components/BookSearch'
import axios from 'axios'
const apiKey = 'jrAzhFY1JP1FdDk1vp7Zg'

// Material UI

// fetches book descriptions from goodreads
export const getBookDescription = async bookId => {
  const requestUri =
    `https://cors-anywhere.herokuapp.com/` +
    `https://www.goodreads.com/book/show/${bookId}?key=${apiKey}`
  let description = 'loading...'
  try {
    const {data} = await axios.get(requestUri)
    const parser = new DOMParser()
    const XMLResponse = parser.parseFromString(data, 'application/xml')
    description = XMLResponse.getElementsByTagName('description')[0].textContent
    if (!description) {
      return 'No description found.'
    }
    // remove html tags
    const shorterDescWithoutHTML = description
      .replace(/<\/?[^>]+(>|$)/g, '')
      .substr(0, 500)
    return `${shorterDescWithoutHTML}...`
  } catch (err) {
    console.error(err)
  }
}

// constructs book object with needed fields from goodreads api
export const makeBookObject = async bookResult => {
  const description = await getBookDescription(bookResult.best_book.id)
  return {
    author: bookResult.best_book.author,
    goodReadsId: bookResult.best_book.id,
    title: bookResult.best_book.title,
    imageUrl: bookResult.best_book.image_url,
    smallImageUrl: bookResult.best_book.small_image_url,
    pubDate:
      bookResult.original_publication_month +
      '-' +
      bookResult.original_publication_day +
      '-' +
      bookResult.original_publication_year,
    rating: Math.round(bookResult.average_rating * 100),
    description
  }
}

export const renderBookSearch = (books, type, component) => {
  return (
    <BookSearch
      bookList={books}
      results={component.state[`${type}Results`]}
      setResults={results => component.setResults(results, type)}
      addBook={(e, book) => component.handleAddBook(e, book, type)}
      removeBook={(e, idx, bookId) =>
        component.handleRemoveBook(e, idx, bookId)
      }
    />
  )
}

// converts YYYY-MM-DDThh:mm into date
export const formatDate = dateString => {
  return new Date(
    Number(dateString.slice(0, 4)),
    Number(dateString.slice(5, 7)) - 1,
    Number(dateString.slice(8, 10)),
    Number(dateString.slice(11, 13)),
    Number(dateString.slice(14, 16))
  )
}

// converts date into string YYYY-MM-DDThh:mm e.g. '2019-02-02T17:33'
export const formatDateString = date => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
}

export const formatDateDisplay = dateString => {
  const date = new Date(dateString)
  var options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }

  return date.toLocaleDateString('en-US', options)
}
