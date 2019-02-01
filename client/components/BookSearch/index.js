import React, {Component} from 'react'
import BookList from './BookList'
import Search from './Search'
import BookResults from './BookResults'

class BookSearch extends Component {
  constructor() {
    super()
    this.state = {
      results: []
    }
    this.setResults = this.setResults.bind(this)
  }

  setResults = results => {
    this.setState({results})
  }

  render() {
    const {bookList, addBook, removeBook} = this.props

    return (
      <div>
        <BookList bookList={bookList} removeBook={removeBook} />
        <Search setResults={this.setResults} />
        <BookResults results={this.state.results} addBook={addBook} />
      </div>
    )
  }
}

export default BookSearch
