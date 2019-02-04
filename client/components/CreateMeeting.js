import React, {Component} from 'react'
import {connect} from 'react-redux'
import {createMeeting} from '../store/meetings'
import axios from 'axios'

import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Textfield from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

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
      this.props.createMeeting(this.props.match.params.clubId)
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    return (
      <div>
        <h3>Create Meeting</h3>
        <label> name </label>
        <input
          name="name"
          type="text"
          value={this.state.name}
          onChange={this.handleChange}
        />
        <label> location </label>
        <input
          name="location"
          type="text"
          value={this.state.location}
          onChange={this.handleChange}
        />
        <label> date </label>
        <input
          name="date"
          type="text"
          value={this.state.date}
          onChange={this.handleChange}
        />
        <button onClick={this.createMeeting} type="submit">
          Create meeting
        </button>
      </div>
    )
  }
}

const mapState = state => ({
  user: state.user
})

const mapDispatch = dispatch => ({
  createMeeting: userId => dispatch(createMeeting(userId))
})

export default connect(mapState, mapDispatch)(CreateMeeting)
