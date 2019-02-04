import React, {Component} from 'react'
import {connect} from 'react-redux'
import {createMeeting} from '../store/meetings'
import axios from 'axios'
import socket from '../socket'

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
      time: ''
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
      const {name, location, time} = this.state
      const newMeeting = {name, location, time, userId: this.props.userId}
      const meeting = await axios.post(
        `/api/clubs/${this.props.match.params.clubId}/meetings/create`
      )
      this.props.createMeeting(this.props.match.params.clubId)
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    return <h3>component working</h3>
  }
}

const mapState = state => ({
  userId: state.user.id
})

const mapDispatch = dispatch => ({
  createMeeting: clubId => dispatch(createMeeting(clubId))
})

export default connect(mapState, mapDispatch)(CreateMeeting)
