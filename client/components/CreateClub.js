import React, {Component} from 'react'
import {connect} from 'react-redux'
import {createNewClub} from '../store/clubs'
import axios from 'axios'

import Button from '@material-ui/core/Button'
import Textfield from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

export class CreateClub extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.createClub = this.createClub.bind(this)
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  async createClub(evt) {
    evt.preventDefault()
    try {
      const {name} = this.state
      const newClub = {name, userId: this.props.userId}
      await axios.post('/api/clubs/create', newClub)
      this.props.history.push(`/clubs`)
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    return (
      <div>
        <h3>New Club</h3>
        <form>
          <Typography variant="h5" color="secondary" gutterBottom>
            Club Name{' '}
          </Typography>
          <Grid
            item
            xs={6}
            container
            spacing={24}
            justify="space-between"
            alignItems="center"
          >
            <Textfield
              name="name"
              label="Type a club name"
              value={this.state.name}
              onChange={this.handleChange}
              variant="filled"
              type="text"
            />
          </Grid>
        </form>
        <Button
          onClick={this.createClub}
          type="submit"
          color="secondary"
          variant="contained"
        >
          Create Club
        </Button>
      </div>
    )
  }
}

const mapState = state => ({
  userId: state.user.id
})

const mapDispatch = dispatch => ({
  createNewClub: newClub => dispatch(createNewClub(newClub))
})

export default connect(mapState, mapDispatch)(CreateClub)
