import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchMessages, postMessage} from '../store'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Send from '@material-ui/icons/Send'

class Messages extends Component {
  constructor() {
    super()
    this.state = {
      text: ''
    }
    this.handleChangeInput = this.handleChangeInput.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }

  handleInput(e) {
    e.preventDefault()
    const clubId = Number(this.props.match.params.clubId)
    const newMessage = {
      text: this.state.text
    }

    this.props.postMessage(newMessage, clubId)
    this.setState({text: ''})

    console.log(this.state.text, 'text')
  }

  handleChangeInput(e) {
    this.setState({
      text: e.target.value
    })
  }

  render() {
    const clubId = Number(this.props.match.params.clubId)
    const messages = this.props.messages.filter(
      message => message.clubId === clubId
    )
    console.log(messages, 'clubMessages')
    return (
      <div>
        {messages.map(message => (
          <List key={message.id}>
            <ListItem>
              <Avatar alt="userImg" src={message.user.imageUrl} />
              <ListItemText
                primary={message.user.fullName}
                secondary={`${new Date(message.user.createdAt).toLocaleString(
                  'en-us',
                  {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                  }
                )}`}
              />
            </ListItem>
            <ListItemText>{message.text}</ListItemText>
          </List>
        ))}

        <TextField
          id="outlined-bare"
          defaultValue={this.state.text}
          margin="normal"
          variant="outlined"
          fullWidth
          placeholder="Type your message ..."
          onChange={this.handleChangeInput}
        />
        <IconButton onClick={this.handleInput}>
          <Send />
        </IconButton>
      </div>
    )
  }
}

const mapState = state => ({
  messages: state.messages
})

const mapDispatch = dispatch => ({
  postMessage: (message, clubId) => dispatch(postMessage(message, clubId))
})

export default connect(mapState, mapDispatch)(Messages)
