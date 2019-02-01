import React, {Component} from 'react'
import axios from 'axios'
const apiKey = 'jrAzhFY1JP1FdDk1vp7Zg'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 4
  },
  avatar: {
    width: 'auto',
    height: 'auto',
    borderRadius: 0
  },
  avatarImg: {
    maxHeight: 130
  },
  removeIcon: {
    opacity: 0.25
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500]
  },
  progress: {
    margin: theme.spacing.unit * 2
  }
})

class BookList extends Component {
  constructor() {
    super()
    this.state = {
      dialogOpen: false,
      dialogBook: {}
    }
    this.handleDialogOpen = this.handleDialogOpen.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)
  }

  getDescription = async bookId => {
    const requestUri =
      `https://cors-anywhere.herokuapp.com/` +
      `https://www.goodreads.com/book/show/${bookId}?key=${apiKey}`
    let description = 'loading...'
    try {
      const {data} = await axios.get(requestUri)
      const parser = new DOMParser()
      const XMLResponse = parser.parseFromString(data, 'application/xml')
      description = XMLResponse.getElementsByTagName('description')[0]
        .textContent
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

  handleDialogOpen = async (e, book) => {
    e.preventDefault()
    if (!this.state.dialogOpen) {
      const description = await this.getDescription(book.goodReadsId)
      const dialogBook = {...book, description}
      this.setState({
        dialogOpen: true,
        dialogBook
      })
    }
  }

  handleDialogClose = () => {
    if (this.state.dialogOpen) {
      this.setState({dialogOpen: false, dialogBook: {}})
    }
  }

  render() {
    const {books, removeBook, classes} = this.props
    if (books.length) {
      return (
        <List className={classes.root}>
          {books.map(book => (
            <div key={book.goodReadsId}>
              <ListItem button onClick={e => this.handleDialogOpen(e, book)}>
                <Avatar className={classes.avatar}>
                  <img
                    className={classes.avatarImg}
                    src={book.imageUrl}
                    alt={book.title}
                  />
                </Avatar>
                <ListItemText>
                  <Typography variant="h6" component="h6" gutterBottom>
                    {book.title}{' '}
                    {book.authors.length ? `by ${book.authors[0].name}` : ''}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {book.description
                      ? `${book.description.slice(0, 200)}...`
                      : ''}
                  </Typography>
                </ListItemText>
                <IconButton className={classes.removeIcon} onClick={removeBook}>
                  <Tooltip placement="right" title="Remove This Book">
                    <Icon>cancel</Icon>
                  </Tooltip>
                </IconButton>
              </ListItem>
              <Dialog
                aria-labelledby="book-modal"
                onClose={this.handleDialogClose}
                open={this.state.dialogOpen}
              >
                <IconButton
                  aria-label="Close"
                  className={classes.closeButton}
                  onClick={this.handleDialogClose}
                >
                  <Icon>cancel</Icon>
                </IconButton>
                <DialogTitle id="book-modal">
                  {this.state.dialogBook.title}
                  {this.state.dialogBook.authors &&
                  this.state.dialogBook.authors.length
                    ? ` by ${this.state.dialogBook.authors[0].name}`
                    : ''}
                </DialogTitle>
                <DialogContent>
                  <img
                    src={this.state.dialogBook.imageUrl}
                    alt={this.state.dialogBook.title}
                  />
                  <Typography
                    variant="body1"
                    component="span"
                    className={classes.description}
                  >
                    {this.state.dialogBook.description}
                  </Typography>
                  <Button
                    target="_blank"
                    href={`https://www.goodreads.com/book/show/${
                      this.state.dialogBook.goodReadsId
                    }`}
                    variant="contained"
                    color="primary"
                  >
                    View On Goodreads
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </List>
      )
    } else {
      return (
        <div>
          <CircularProgress className={classes.progress} color="primary" />
        </div>
      )
    }
  }
}

export default withStyles(styles)(BookList)
