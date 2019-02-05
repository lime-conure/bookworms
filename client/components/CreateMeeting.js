import React, {Component} from 'react'
import {connect} from 'react-redux'
import {createMeeting} from '../store'
import axios from 'axios'

import {withStyles} from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Textfield from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  form: {
    maxWidth: 660
  },
  formSection: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  },
  headerIcon: {
    marginRight: theme.spacing.unit
  }
})

export class CreateMeeting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      location: '',
      date: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.createMeeting = this.createMeeting.bind(this)
  }
  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  async createMeeting(evt) {
    evt.preventDefault()
    try {
      const {name, location, date} = this.state
      const newMeeting = {name, location, date}
      const meeting = await axios.post(
        `/api/clubs/${this.props.match.params.clubId}/meetings/create`,
        newMeeting
      )
      this.props.history.push(
        `/clubs/${this.props.match.params.clubId}/meetings`
      )
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const {classes} = this.props
    return (
      <div>
        <form className={classes.form}>
          <Typography variant="h3" component="h3">
            Create a New Meeting
          </Typography>
          <Divider />
          <div className={classes.formSection}>
            <Textfield
              label="Name your meeting"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
              margin="normal"
              variant="filled"
              fullWidth
              autoFocus={true}
              required
            />
            <br />
            <Textfield
              label="Type a location"
              name="location"
              value={this.state.location}
              onChange={this.handleChange}
              margin="normal"
              variant="filled"
              fullWidth
              required
            />
            <br />
            <Textfield
              label="Choose a date"
              type="date"
              name="date"
              value={this.state.date}
              onChange={this.handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              variant="filled"
              fullWidth
              required
            />
          </div>

          <Button
            type="submit"
            onClick={this.createMeeting}
            disable={!this.state.name}
            variant="contained"
            color="primary"
            size="large"
          >
            Create Meeting
          </Button>
        </form>
      </div>
    )
  }
}

const StyledCreateMeeting = withStyles(styles)(CreateMeeting)

const mapState = state => ({
  user: state.user
})

const mapDispatch = dispatch => ({
  createMeeting: userId => dispatch(createMeeting(userId))
})

export default connect(mapState, mapDispatch)(StyledCreateMeeting)
