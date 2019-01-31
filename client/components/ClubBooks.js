import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchClubBooks} from '../store'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

export class ClubBooks extends Component {
  componentDidMount() {
    const clubId = Number(this.props.match.params.clubId)
    this.props.fetchClubBooks(clubId)
  }

  render() {
    const books = this.props.books
    return (
      <div>
        <Typography variant="h2" gutterBottom>
          Club Books
        </Typography>
        <Divider />
        <List>
          {books.length
            ? books.map(book => (
                <ListItem button key={book.id}>
                  <ListItemText>Book ID: {book.id}</ListItemText>
                </ListItem>
              ))
            : ''}
        </List>
      </div>
    )
  }
}

const mapState = state => ({
  books: state.clubBooks
})

const mapDispatch = dispatch => ({
  fetchClubBooks: clubId => dispatch(fetchClubBooks(clubId))
})

export default connect(mapState, mapDispatch)(ClubBooks)
