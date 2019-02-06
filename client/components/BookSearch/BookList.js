import React, {Component} from 'react'
import {getBookDescription, renderBookRating} from '../../utils'
import DropDownBookOptions from './DropDownBookOptions'

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
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'

const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 4,
    maxHeight: 375,
    overflow: 'scroll',
    backgroundColor: theme.palette.grey[800],
    borderRadius: '5px'
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
  },
  rating: {
    color: '#fff',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    opacity: 0.9
  },
  dialogImage: {
    width: '100%'
  },
  goodreadsButton: {
    marginTop: theme.spacing.unit * 3
  },
  author: {
    opacity: 0.6
  },
  description: {
    marginTop: theme.spacing.unit * 1.5,
    lineHeight: '1.614em'
  }
})

class BookList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dialogOpen: false,
      loadingDialog: false,
      dialogBook: {}
    }
    this.handleDialogOpen = this.handleDialogOpen.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)
  }

  handleDialogOpen = async (e, book) => {
    this.setState({loadingDialog: true})
    e.preventDefault()
    if (!this.state.dialogOpen) {
      const description = await getBookDescription(book.goodReadsId)
      const dialogBook = {...book, description}
      this.setState({
        dialogOpen: true,
        loadingDialog: false,
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
    const {
      type,
      bookList,
      removeBook,
      addBook,
      hideBookActions,
      classes
    } = this.props
    if (bookList.length) {
      return (
        <div>
          {this.state.loadingDialog ? <LinearProgress color="primary" /> : ''}
          <List className={classes.root}>
            {bookList.map((book, idx) => (
              <div key={book.goodReadsId}>
                <ListItem button>
                  <Tooltip
                    placement="left-start"
                    title="Click to view more about this book"
                  >
                    <Avatar
                      onClick={e => this.handleDialogOpen(e, book)}
                      className={classes.avatar}
                    >
                      <img
                        className={classes.avatarImg}
                        src={book.imageUrl}
                        alt={book.title}
                      />
                    </Avatar>
                  </Tooltip>

                  <ListItemText onClick={e => this.handleDialogOpen(e, book)}>
                    <Typography variant="h6" component="h6">
                      {book.title}{' '}
                      <span className={classes.author}>
                        {book.authors && book.authors.length
                          ? `by ${book.authors[0].name}`
                          : ''}
                      </span>
                    </Typography>

                    <Typography
                      variant="body1"
                      component="span"
                      inline
                      className={classes.rating}
                    >
                      {book.rating > 0 && renderBookRating(book.rating)}
                    </Typography>
                  </ListItemText>

                  {/* create poll form doesn't have book actions dropdown */}
                  {hideBookActions ? (
                    <IconButton
                      className={classes.removeIcon}
                      onClick={e => removeBook(e, idx, book.id)}
                    >
                      <Icon>cancel</Icon>
                    </IconButton>
                  ) : (
                    <DropDownBookOptions
                      type={type}
                      book={book}
                      removeBook={removeBook}
                      addBook={addBook}
                    />
                  )}
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
                  <DialogTitle id="book-modal" className={classes.bookModal}>
                    <Typography variant="h6" component="h6">
                      {this.state.dialogBook.title}
                      <span className={classes.author}>
                        {this.state.dialogBook.authors &&
                        this.state.dialogBook.authors.length
                          ? ` by ${this.state.dialogBook.authors[0].name}`
                          : ''}
                      </span>
                    </Typography>
                    <Typography
                      variant="body1"
                      component="p"
                      inline
                      className={classes.rating}
                    >
                      {book.rating > 0 && renderBookRating(book.rating)}
                    </Typography>
                  </DialogTitle>
                  <DialogContent className={classes.bookModal}>
                    <Grid
                      container
                      spacing={16}
                      justify="flex-start"
                      alignItems="flex-start"
                    >
                      <Grid item xs={3}>
                        <img
                          className={classes.dialogImage}
                          src={this.state.dialogBook.imageUrl}
                          alt={this.state.dialogBook.title}
                        />
                      </Grid>
                      <Grid item xs={9}>
                        <Typography
                          variant="body2"
                          component="span"
                          className={classes.description}
                        >
                          {this.state.dialogBook.description}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Button
                      target="_blank"
                      href={`https://www.goodreads.com/book/show/${
                        this.state.dialogBook.goodReadsId
                      }`}
                      variant="contained"
                      color="primary"
                      className={classes.goodreadsButton}
                    >
                      View On Goodreads
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </List>
        </div>
      )
    } else {
      return <div />
    }
  }
}

export default withStyles(styles)(BookList)
