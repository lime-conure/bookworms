import React from 'react'
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import Divider from '@material-ui/core/Divider'
import MenuItem from '@material-ui/core/MenuItem'
import Icon from '@material-ui/core/Icon'
import {Link} from 'react-router-dom'

class DropDownBookOptions extends React.Component {
  state = {
    anchorEl: null
  }

  options = {
    past: ['now', 'future', 'remove'],
    now: ['past', 'future', 'remove'],
    future: ['now', 'past', 'remove']
  }

  handleButtonClick = event => {
    this.setState({anchorEl: event.currentTarget})
  }

  handleMenuClick = async (e, idx) => {
    const {removeBook, addBook, type, book} = this.props
    const moveTo = this.options[type][idx]
    if (moveTo === 'remove') {
      removeBook(e, idx, book)
    } else {
      if (type === 'now') {
        await removeBook(e, idx, book) // remove the 'now' book
        let updatedBook // update startTime and endTime before adding
        if (moveTo === 'past') {
          updatedBook = {
            ...book,
            startTime: book.clubs_books
              ? book.clubs_books.startTime
              : book.users_books.startTime,
            endTime: new Date()
          }
        } else {
          //moveto === 'future'
          updatedBook = {...book, startTime: null, endTime: null}
        }
        await addBook(e, updatedBook, moveTo)
      } else if (type === 'future') {
        await removeBook(e, idx, book) // remove the 'future' book
        let updatedBook // update startTime and endTime before adding
        if (moveTo === 'past') {
          updatedBook = {...book, startTime: null, endTime: new Date()}
        } else {
          //moveto === 'now'
          updatedBook = {...book, startTime: new Date(), endTime: null}
        }
        await addBook(e, updatedBook, moveTo)
      } else {
        // type === 'past'
        let updatedBook // update startTime and endTime before adding
        if (moveTo === 'future') {
          updatedBook = {...book, startTime: null, endTime: null}
        } else {
          //moveto === 'now'
          updatedBook = {...book, startTime: new Date(), endTime: null}
        }
        await addBook(e, updatedBook, moveTo)
      }
    }
    this.setState({anchorEl: null})
  }

  handleClose = () => {
    this.setState({anchorEl: null})
  }

  renderActionText(moveToKey) {
    switch (moveToKey) {
      case 'now':
        return 'Move to Reading'
      case 'past':
        return 'Move to Read'
      case 'future':
        return 'Move to Want to Read'
      default:
        return 'Remove Book'
    }
  }

  render() {
    const {anchorEl} = this.state
    return (
      <div>
        <Button
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleButtonClick}
        >
          <Icon color="secondary">launch</Icon>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {this.options[this.props.type].map((moveTo, idx) => (
            <MenuItem key={moveTo} onClick={e => this.handleMenuClick(e, idx)}>
              {this.renderActionText(moveTo)}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}

export default DropDownBookOptions
