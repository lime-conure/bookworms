import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withStyles} from '@material-ui/core/styles'
import {
  postMessage,
  writeInputMessage,
  fetchMessages,
  fetchThread,
  toggleOpen,
  postToThread,
  writeThreadMessage
} from '../store'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Send from '@material-ui/icons/Send'
import Close from '@material-ui/icons/Close'
import socket from '../socket'
import InputAdornment from '@material-ui/core/InputAdornment'
import EmojiPicker from 'emoji-picker-react'
import JSEMOJI from 'emoji-js'
//emoji set up
let jsemoji = new JSEMOJI()
// set the style to emojione (default - apple)
jsemoji.img_set = 'emojione'
// set the storage location for all emojis
jsemoji.img_sets.emojione.path =
  'https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/'

const drawerWidth = 360

const styles = theme => ({
  root: {
    display: 'flex'
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start'
  },
  drawerPaper: {
    width: drawerWidth
  },

  content: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
    // marginRight: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  }
})

class Messages extends Component {
  constructor() {
    super()
    this.state = {
      emojiShown: false
    }
    this.handleChangeInput = this.handleChangeInput.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }
  async componentDidMount() {
    await this.props.fetchMessages()
  }

  //displays emoji inside the input window
  handleEmojiClick = (e, threadInputValue) => {
    console.log('handle emojiClick')
    console.log(e, 'e')
    console.log(e.name)
    const clubId = Number(this.props.match.params.clubId)
    let emoji = jsemoji.replace_colons(`:${e.name}:`)
    this.props.writeInputMessage(threadInputValue + emoji, clubId)
  }

  toogleEmojiState = () => {
    this.setState({
      emojiShown: !this.state.emojiShown
    })
  }

  handleDrawerOpen = async threadId => {
    const clubId = Number(this.props.match.params.clubId)
    await this.props.fetchThread(clubId, threadId)
    this.props.toggleOpen(true)
  }

  handleDrawerClose = () => {
    this.props.toggleOpen(false)
  }

  async handleThreadInput(e, threadId) {
    e.preventDefault()
    const clubId = Number(this.props.match.params.clubId)
    let threadInputValue = ''
    const input = this.props.threadMessageEntry.filter(
      message => message.clubId === clubId && message.threadId === threadId
    )
    if (input.length) {
      threadInputValue = input[0].message
    }
    const newMessage = {
      text: threadInputValue
    }

    await this.props.postToThread(newMessage, clubId, threadId)
    this.props.writeThreadMessage('', clubId, threadId)
  }

  handleThreadChange(e, threadId) {
    const clubId = Number(this.props.match.params.clubId)
    this.props.writeThreadMessage(e.target.value, clubId, threadId)
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
    const {classes, theme, open, thread} = this.props
    const clubId = Number(this.props.match.params.clubId)
    let threads = []
    if (this.props.threads.length) {
      threads = this.props.threads.filter(t => t.clubId === clubId)
    }

    let inputValue = ''
    if (this.props.messageEntry.length) {
      const input = this.props.messageEntry.filter(
        message => message.clubId === clubId
      )
      if (input.length) {
        inputValue = input[0].message
      }
    }
    let threadInputValue = ''
    if (this.props.threadMessageEntry.length && this.props.thread) {
      const input = this.props.threadMessageEntry.filter(
        message =>
          message.clubId === clubId && message.threadId === this.props.thread.id
      )
      if (input.length) {
        threadInputValue = input[0].message
      }
    }

    return (
      <div className={classes.root}>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open
          })}
        >
          {threads[0] && threads[0].id ? (
            <div>
              {threads.map(t => (
                <div key={t.id}>
                  <List>
                    <ListItem>
                      <Avatar alt="userImg" src={t.messages[0].user.imageUrl} />
                      <ListItemText
                        primary={t.messages[0].user.fullName}
                        secondary={`${new Date(
                          t.messages[0].createdAt
                        ).toLocaleString('en-us', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric'
                        })}`}
                      />
                    </ListItem>
                    <ListItemText>{t.messages[0].text}</ListItemText>
                  </List>
                  {t.messages[1] ? (
                    <div>
                      {t.messages.length - 1 === 1 ? (
                        <ListItemText>
                          {t.messages.length - 1} reply
                        </ListItemText>
                      ) : (
                        <ListItemText>
                          {t.messages.length - 1} replies
                        </ListItemText>
                      )}
                      <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        onClick={() => this.handleDrawerOpen(t.id)}
                      >
                        View thread
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      onClick={() => this.handleDrawerOpen(t.id)}
                    >
                      Start a thread
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Typography>No messages in this book Club </Typography>
          )}
          <TextField
            id="outlined-bare"
            value={inputValue}
            margin="normal"
            variant="outlined"
            fullWidth
            placeholder="Type your message ..."
            onChange={this.handleChangeInput}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={this.handleInput} disabled={!inputValue}>
                    <Send />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </main>
        {thread.id ? (
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={open}
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <div style={{padding: theme.spacing.unit * 4}} />
            <List>
              <ListItem>
                <ListItemIcon onClick={this.handleDrawerClose}>
                  <Close />
                </ListItemIcon>
                <ListItemText>Thread</ListItemText>
              </ListItem>
            </List>

            <Divider />
            <List>
              {thread.messages.map(message => (
                <div key={message.id}>
                  <ListItem>
                    <Avatar alt="userImg" src={message.user.imageUrl} />
                    <ListItemText
                      primary={message.user.fullName}
                      secondary={`${new Date(message.createdAt).toLocaleString(
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
                </div>
              ))}
            </List>
            <TextField
              id="outlined-bare"
              value={threadInputValue}
              style={{margin: 10}}
              variant="outlined"
              placeholder="Type your message ..."
              onChange={e => this.handleThreadChange(e, thread.id)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={this.toggleEmojiState}>
                      <Send />
                    </IconButton>
                    <IconButton
                      onClick={this.handleInput}
                      disabled={!threadInputValue}
                    >
                      <Send />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <div>
              <EmojiPicker
                onEmojiClick={e => this.handleEmojiClick(e, threadInputValue)}
              />
            </div>
          </Drawer>
        ) : null}
      </div>
    )
  }
}

const mapState = state => ({
  threads: state.threads.threads,
  messageEntry: state.messageEntry,
  open: state.threads.open,
  thread: state.threads.singleThread,
  threadMessageEntry: state.threadMessageEntry
})

const mapDispatch = dispatch => ({
  postMessage: (message, clubId) =>
    dispatch(postMessage(message, clubId, socket)),
  writeInputMessage: (message, clubId) =>
    dispatch(writeInputMessage(message, clubId)),
  fetchMessages: () => dispatch(fetchMessages()),
  fetchThread: (clubId, threadId) => dispatch(fetchThread(clubId, threadId)),
  toggleOpen: isOpen => dispatch(toggleOpen(isOpen)),
  postToThread: (message, clubId, threadId) =>
    dispatch(postToThread(message, clubId, threadId)),
  writeThreadMessage: (message, clubId, threadId) =>
    dispatch(writeThreadMessage(message, clubId, threadId))
})
Messages.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, {withTheme: true})(
  connect(mapState, mapDispatch)(Messages)
)
