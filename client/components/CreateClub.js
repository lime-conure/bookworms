import React, {Component} from 'react'
import {connect} from 'react-redux'
import {createNewClub} from '../store/clubs'
import axios from 'axios'

export class CreateClub extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      inviteLink: ''
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
      const {name, inviteLink} = this.state
      const newClub = {name, inviteLink}
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
          <label>Club Name </label>
          <input
            value={this.state.name}
            onChange={this.handleChange}
            name="name"
            type="text"
          />
          <br />
          <label>Invite Link</label>
          <input
            value={this.state.inviteLink}
            onChange={this.handleChange}
            name="inviteLink"
            type="text"
          />
        </form>
        <button onClick={this.createClub} type="submit">
          Create Club
        </button>
      </div>
    )
  }
}

const mapDispatch = dispatch => ({
  createNewClub: newClub => dispatch(createNewClub(newClub))
})

export default connect(null, mapDispatch)(CreateClub)
