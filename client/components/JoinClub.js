import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import Axios from 'axios'
import {inviteUser, fetchClubs} from '../store'
import socket from '../socket'

import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 16,
    marginLeft: theme.spacing.unit * 36,
    marginRight: theme.spacing.unit * 36
  },
  button: {
    marginTop: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 2
  },
  form: {
    marginTop: theme.spacing.unit * 4
  }
})

class JoinClub extends Component {
  constructor() {
    super()
    this.state = {
      clubName: ''
    }
    this.handleClick = this.handleClick.bind(this)
  }

  async handleClick(e) {
    e.preventDefault()
    await Axios.post(
      `/api/clubs/${this.props.match.params.clubId}/join/${
        this.props.match.params.hash
      }`
    )
    this.props.fetchClubs()
    socket.emit('JOIN', this.props.match.params.clubId)
    this.props.inviteUser('')
    this.props.history.push(`/clubs/${this.props.match.params.clubId}/books`)
  }

  async componentDidMount() {
    const inviteLink = `clubs/${this.props.match.params.clubId}/join/${
      this.props.match.params.hash
    }`
    const {data} = await Axios.get(`/api/${inviteLink}`)
    this.setState({
      clubName: data
    })
    this.props.inviteUser(inviteLink)
  }

  render() {
    const {isLoggedIn, classes} = this.props
    return (
      <Paper className={classes.root} elevation={2}>
        {isLoggedIn ? (
          <div>
            <Typography variant="h3" component="h3" gutterBottom>
              Welcome to {this.state.clubName}!
            </Typography>
            <Button
              onClick={this.handleClick}
              className={classes.button}
              type="button"
              color="secondary"
              variant="contained"
              size="large"
            >
              Join The Club
            </Button>
          </div>
        ) : (
          <div>
            <Typography variant="h4" component="h4" gutterBottom>
              Please log in or sign up to join {this.state.clubName}
            </Typography>
            <Button
              className={classes.button}
              type="button"
              color="primary"
              variant="contained"
              component={Link}
              to="/login"
              size="large"
            >
              Log In
            </Button>
            <Button
              className={classes.button}
              type="button"
              color="primary"
              variant="contained"
              component={Link}
              to="/signup"
              size="large"
            >
              Sign Up
            </Button>
          </div>
        )}
      </Paper>
    )
  }
}

const StyledJoinClub = withStyles(styles)(JoinClub)

const mapState = state => ({
  isLoggedIn: !!state.user.id,
  inviteLink: state.user.inviteLink
})
const mapDispatch = {
  inviteUser,
  fetchClubs
}

export default connect(mapState, mapDispatch)(StyledJoinClub)
