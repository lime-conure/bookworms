import React, {Component} from 'react'
import BookList from './BookList'
import Search from './Search'
import BookResults from './BookResults'

class BookSearch extends Component {
  constructor() {
    super()
    this.state = {
      results: [],
      showResults: false
    }
    this.setResults = this.setResults.bind(this)
  }

  componentDidMount() {
    this.setState({showResults: this.props.showResults})
  }

  setResults = results => {
    this.setState({results})
    this.setState({showResults: true})
  }

  render() {
    const {
      type,
      bookList,
      addBook,
      removeBook,
      loadingNewBook,
      showResults
    } = this.props

    return (
      <div>
        <BookList
          type={type}
          bookList={bookList}
          removeBook={removeBook}
          addBook={addBook}
        />
        <Search setResults={this.setResults} />
        <BookResults
          type={type}
          results={this.state.results}
          addBook={addBook}
          loadingNewBook={loadingNewBook}
          showResults={this.state.showResults}
        />
      </div>
    )
  }
}

export default BookSearch
