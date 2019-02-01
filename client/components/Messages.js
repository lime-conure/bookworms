import React, {Component} from 'react'
import {connect} from 'react-redux'
import {postMessage, writeInputMessage, fetchMessages} from '../store'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Send from '@material-ui/icons/Send'

class Messages extends Component {
  constructor() {
    super()
    this.handleChangeInput = this.handleChangeInput.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }

  async componentDidMount() {
    await this.props.fetchMessages()
    console.log(this.props.threads, 'props')
  }

  async handleInput(e) {
    e.preventDefault()
    const clubId = Number(this.props.match.params.clubId)
    let inputValue = ''
    const input = this.props.messageEntry.filter(
      message => message.clubId === clubId
    )
    if (input.length) {
      inputValue = input[0].message
    }
    const newMessage = {
      text: inputValue
    }
    await this.props.postMessage(newMessage, clubId)
  }

  handleChangeInput(e) {
    const clubId = Number(this.props.match.params.clubId)
    this.props.writeInputMessage(e.target.value, clubId)
  }

  render() {
    const clubId = Number(this.props.match.params.clubId)
    let threads = []
    if (this.props.threads.length) {
      threads = this.props.threads.filter(thread => thread.clubId === clubId)
    }
    console.log(threads, 'threads')

    let inputValue = ''
    if (this.props.messageEntry.length) {
      const input = this.props.messageEntry.filter(
        message => message.clubId === clubId
      )
      if (input.length) {
        inputValue = input[0].message
      }
    }
    return (
      <div>
        {threads[0] && threads[0].id ? (
          <div>
            {threads.map(thread => (
              <div key={thread.id}>
                <Typography> thread iteration {thread.name}</Typography>
                <List>
                  <ListItem>
                    <Avatar
                      alt="userImg"
                      src={thread.messages[0].user.imageUrl}
                    />
                    <ListItemText
                      primary={thread.messages[0].user.fullName}
                      secondary={`${new Date(
                        thread.messages[0].createdAt
                      ).toLocaleString('en-us', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                      })}`}
                    />
                  </ListItem>
                  <ListItemText>{thread.messages[0].text}</ListItemText>
                </List>
                {thread.messages[1] ? (
                  <List>
                    <Typography>
                      Dispalaying last message in the thread{' '}
                    </Typography>
                    <ListItem>
                      <Avatar
                        alt="userImg"
                        src={
                          thread.messages[thread.messages.length - 1].user
                            .imageUrl
                        }
                      />
                      <ListItemText
                        primary={
                          thread.messages[thread.messages.length - 1].user
                            .fullName
                        }
                        secondary={`${new Date(
                          thread.messages[thread.messages.length - 1].createdAt
                        ).toLocaleString('en-us', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric'
                        })}`}
                      />
                    </ListItem>
                    <ListItemText>
                      {thread.messages[thread.messages.length - 1].text}
                    </ListItemText>
                  </List>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <Typography>No messages in this book Club </Typography>
        )}
        <TextField
          id="outlined-bare"
          defaultValue={inputValue}
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
  threads: state.threads,
  messageEntry: state.messageEntry
})

const mapDispatch = dispatch => ({
  postMessage: (message, clubId) => dispatch(postMessage(message, clubId)),
  writeInputMessage: (message, clubId) =>
    dispatch(writeInputMessage(message, clubId)),
  fetchMessages: () => dispatch(fetchMessages())
})

export default connect(mapState, mapDispatch)(Messages)
