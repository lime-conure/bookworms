import React, {Component} from 'react'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

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
  }
})

class BookList extends Component {
  render() {
    const {books, classes} = this.props
    if (books.length) {
      return (
        <List className={classes.root}>
          {books.map((book, idx) => (
            <div key={book.goodReadsId}>
              <ListItem
                button
                onClick={e => this.handleClickOpen(e, book.goodReadsId)}
              >
                <Avatar className={classes.avatar}>
                  <img
                    className={classes.avatarImg}
                    src={book.imageUrl}
                    alt={book.title}
                  />
                </Avatar>
                <ListItemText>
                  <Typography variant="h6" component="h6" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {book.description
                      ? `${book.description.slice(0, 200)}...`
                      : ''}
                  </Typography>
                </ListItemText>
                <IconButton
                  className={classes.removeIcon}
                  onClick={e => this.deleteOption(idx, 'book', e)}
                >
                  <Tooltip placement="right" title="Remove This Book">
                    <Icon>cancel</Icon>
                  </Tooltip>
                </IconButton>
              </ListItem>
            </div>
          ))}
        </List>
      )
    } else {
      return <div />
    }
  }
}

export default withStyles(styles)(BookList)
