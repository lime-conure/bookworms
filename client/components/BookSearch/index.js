import React, {Component} from 'react'
import BookList from './BookList'
import Search from './Search'
import BookResults from './BookResults'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {}
})

class BookSearch extends Component {
  constructor() {
    super()
    this.state = {
      results: []
    }
    this.setResults = this.setResults.bind(this)
    // this.addBook = this.addBook.bind(this)
  }

  setResults = results => {
    this.setState({results})
  }
  // addBook() {}

  render() {
    const {bookList, addBook, removeBook, classes} = this.props

    return (
      <div className={classes.root}>
        <BookList bookList={bookList} removeBook={removeBook} />
        <Search setResults={this.setResults} />
        <BookResults results={this.state.results} addBook={addBook} />
      </div>
    )
  }
}

export default withStyles(styles)(BookSearch)
