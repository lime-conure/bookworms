import React, {Component} from 'react'
import {connect} from 'react-redux'
import Axios from 'axios'
import {inviteUser} from '../store'

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
    this.props.inviteUser('')
    this.props.history.push(`/clubs/${this.props.match.params.clubId}`)
  }

  async componentDidMount() {
    const inviteLink = `/clubs/${this.props.match.params.clubId}/join/${
      this.props.match.params.hash
    }`
    const {data} = await Axios.get(`/api/${inviteLink}`)
    this.setState({
      clubName: data
    })
    this.props.inviteUser(inviteLink)
  }

  render() {
    const {isLoggedIn} = this.props
    return (
      <div>
        {isLoggedIn ? (
          <div>
            <h2>Welcome to {this.state.clubName}!</h2>
            <button onClick={this.handleClick} type="button">
              Join
            </button>
          </div>
        ) : (
          <div>
            <p>Please login or sign up to join the club</p>
          </div>
        )}
      </div>
    )
  }
}
const mapState = state => ({
  isLoggedIn: !!state.user.id,
  inviteLink: state.user.inviteLink
})
const mapDispatch = {
  inviteUser
}

export default connect(mapState, mapDispatch)(JoinClub)
