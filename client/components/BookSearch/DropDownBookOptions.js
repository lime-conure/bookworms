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
    const moveTo = this.options[this.props.type][idx]
    if (moveTo === 'remove') {
      this.props.removeBook(e, idx, this.props.book.id, this.props.type)
    } else {
      if (this.props.type === 'now' || this.props.type === 'future') {
        await this.props.removeBook(e, idx, this.props.book.id, this.props.type)
      }
      await this.props.addBook(e, this.props.book, moveTo)
    }
    this.setState({anchorEl: null})
  }

  handleClose = () => {
    this.setState({anchorEl: null})
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
          Actions
          <Icon>keyboard_arrow_down</Icon>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleClose}>Options</MenuItem>
          {this.options[this.props.type].map((moveTo, idx) => (
            <MenuItem key={moveTo} onClick={e => this.handleMenuClick(e, idx)}>
              {moveTo === 'remove' ? 'remove' : `Move to ${moveTo}`}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}

export default DropDownBookOptions
