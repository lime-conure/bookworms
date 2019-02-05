import React, {Component} from 'react'
import {connect} from 'react-redux'
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

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Send from '@material-ui/icons/Send'
import Mood from '@material-ui/icons/Mood'
import Chat from '@material-ui/icons/Chat'
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
    width: drawerWidth,
    top: 80,
    paddingTop: theme.spacing.unit * 4
  },

  content: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: 840
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  },
  messageUsername: {
    color: '#fff',
    '&:hover': {
      cursor: 'pointer',
      color: '#fff'
    }
  },
  messageTimestamp: {
    color: '#fff',
    fontWeight: 300
  },
  messageContent: {
    marginLeft: 72,
    paddingBottom: theme.spacing.unit * 2
  },
  messageText: {
    color: '#fff',
    fontFamily: 'Cutive',
    marginBottom: theme.spacing.unit
  },
  chatIcon: {
    marginRight: theme.spacing.unit
  },
  closeThreadButton: {
    marginTop: theme.spacing.unit * 2
  }
})

class Messages extends Component {
  constructor() {
    super()
    this.state = {
      inputValue: '',
      threadInputValue: '',
      emojiShown: false,
      emojiShownThread: false
    }
    this.handleChangeInput = this.handleChangeInput.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleThreadChange = this.handleThreadChange.bind(this)
    this.handleThreadInput = this.handleThreadInput.bind(this)
  }
  async componentDidMount() {
    const clubId = Number(this.props.match.params.clubId)
    await this.props.fetchMessages()
    this.filterInput(clubId)
    this.filterThreadInput(clubId, this.props.thread.id)
  }

  filterInput(clubId) {
    if (this.props.messageEntry.length) {
      const input = this.props.messageEntry.filter(
        message => message.clubId === clubId
      )
      if (input.length) {
        this.setState({
          inputValue: input[0].message
        })
      }
    }
  }
  filterThreadInput(clubId, threadId) {
    const input = this.props.threadMessageEntry.filter(
      message => message.clubId === clubId && message.threadId === threadId
    )
    if (input.length) {
      this.setState({threadInputValue: input[0].message})
    }
  }

  //displays emoji inside the input window
  handleEmojiClick = (n, e) => {
    const clubId = Number(this.props.match.params.clubId)
    let emoji = jsemoji.replace_colons(`:${e.name}:`)
    this.props.writeInputMessage(this.state.inputValue + emoji, clubId)
    this.setState({inputValue: this.state.inputValue + emoji})
  }
  handleThreadEmojiClick = (n, e) => {
    const clubId = Number(this.props.match.params.clubId)
    let emoji = jsemoji.replace_colons(`:${e.name}:`)
    this.props.writeThreadMessage(
      this.state.threadInputValue + emoji,
      clubId,
      this.props.thread.id
    )
    this.setState({threadInputValue: this.state.threadInputValue + emoji})
  }

  toggleEmojiState = () => {
    this.setState({
      emojiShown: !this.state.emojiShown
    })
  }
  toggleEmojiThreadState = async () => {
    this.setState({
      emojiShownThread: !this.state.emojiShownThread
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

  async handleThreadChange(e, threadId) {
    const clubId = Number(this.props.match.params.clubId)
    if (this.state.emojiShownThread) this.toggleEmojiThreadState()
    await this.setState({threadInputValue: e.target.value})
    this.props.writeThreadMessage(this.state.threadInputValue, clubId, threadId)
  }

  async handleThreadInput(e, threadId) {
    e.preventDefault()
    const clubId = Number(this.props.match.params.clubId)
    if (this.state.emojiShownThread) this.toggleEmojiThreadState()
    this.filterThreadInput(clubId, threadId)
    const newMessage = {
      text: this.state.threadInputValue
    }
    this.props.postToThread(newMessage, clubId, threadId, socket)
    await this.setState({threadInputValue: ''})
    this.props.writeThreadMessage(this.state.threadInputValue, clubId, threadId)
  }
  async handleChangeInput(e) {
    const clubId = Number(this.props.match.params.clubId)
    if (this.state.emojiShown) this.toggleEmojiState()
    await this.setState({inputValue: e.target.value})
    this.props.writeInputMessage(this.state.inputValue, clubId)
  }

  async handleInput(e) {
    e.preventDefault()
    const clubId = Number(this.props.match.params.clubId)
    if (this.state.emojiShown) this.toggleEmojiState()
    this.filterInput(clubId)
    const newMessage = {
      text: this.state.inputValue
    }
    this.setState({inputValue: ''})
    await this.props.postMessage(newMessage, clubId)
  }

  render() {
    const {classes, theme, open, thread} = this.props
    const clubId = Number(this.props.match.params.clubId)
    let threads = []
    if (this.props.threads.length) {
      threads = this.props.threads.filter(t => t.clubId === clubId)
    }

    return (
      <div className={classes.root}>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open
          })}
        >
          <Typography variant="h3" component="h3">
            Messages
          </Typography>
          <Divider />
          {threads[0] && threads[0].id ? (
            <List>
              {threads.map(t => (
                <div key={t.id}>
                  <ListItem>
                    <Avatar alt="userImg" src={t.messages[0].user.imageUrl} />
                    <ListItemText
                      classes={{
                        primary: classes.messageUsername,
                        secondary: classes.messageTimestamp
                      }}
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
                  <div className={classes.messageContent}>
                    <Typography className={classes.messageText}>
                      {t.messages[0].text}
                    </Typography>
                    {t.messages[1] ? (
                      <div>
                        {t.messages.length - 1 === 1 ? (
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            onClick={() => this.handleDrawerOpen(t.id)}
                          >
                            <Chat className={classes.chatIcon} size="small" />
                            {t.messages.length - 1} reply
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            onClick={() => this.handleDrawerOpen(t.id)}
                          >
                            <Chat className={classes.chatIcon} size="small" />
                            {t.messages.length - 1} replies
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <Button
                          variant="outlined"
                          size="small"
                          color="secondary"
                          onClick={() => this.handleDrawerOpen(t.id)}
                        >
                          reply
                        </Button>
                      </div>
                    )}
                  </div>
                  <Divider />
                </div>
              ))}
            </List>
          ) : (
            <div />
          )}
          <TextField
            id="outlined-bare"
            value={this.state.inputValue}
            autoFocus={true}
            margin="normal"
            variant="outlined"
            fullWidth
            placeholder="Send a message..."
            onChange={this.handleChangeInput}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                this.handleInput(e) // send on enter
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={this.toggleEmojiState}>
                    <Mood />
                  </IconButton>
                  <IconButton
                    onClick={this.handleInput}
                    disabled={!this.state.inputValue}
                  >
                    <Send />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          {this.state.emojiShown ? (
            <div
              style={{
                position: 'fixed',
                bottom: '11%',
                right: '22%',
                opacity: 0.7
              }}
            >
              <EmojiPicker onEmojiClick={this.handleEmojiClick} />
            </div>
          ) : null}
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
            <List>
              {thread.messages.map(message => (
                <div key={message.id}>
                  <ListItem>
                    <Avatar alt="userImg" src={message.user.imageUrl} />
                    <ListItemText
                      classes={{
                        primary: classes.messageUsername,
                        secondary: classes.messageTimestamp
                      }}
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
                  <div className={classes.messageContent}>
                    <Typography className={classes.messageText}>
                      {message.text}
                    </Typography>
                  </div>
                </div>
              ))}
            </List>
            <TextField
              id="outlined-bare"
              autoFocus={true}
              value={this.state.threadInputValue}
              style={{margin: 10}}
              variant="outlined"
              placeholder="Send a reply..."
              onChange={e => this.handleThreadChange(e, thread.id)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  this.handleThreadInput(e, thread.id) // send on enter
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={this.toggleEmojiThreadState}>
                      <Mood />
                    </IconButton>
                    <IconButton
                      onClick={e => this.handleThreadInput(e, thread.id)}
                      disabled={!this.state.threadInputValue}
                    >
                      <Send />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {this.state.emojiShownThread ? (
              <div
                style={{
                  marginLeft: '3%',
                  opacity: 0.7
                }}
              >
                <EmojiPicker onEmojiClick={this.handleThreadEmojiClick} />
              </div>
            ) : null}
            <Button
              onClick={this.handleDrawerClose}
              variant="text"
              color="secondary"
              className={classes.closeThreadButton}
            >
              Close Thread
            </Button>
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
    dispatch(postToThread(message, clubId, threadId, socket)),
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
