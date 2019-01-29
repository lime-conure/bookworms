import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchSingleClub} from '../store/singleClub'
import {leaveClub} from '../store/clubs'

export class SingleClub extends Component {
  constructor(props) {
    super(props)
    this.leaveClub = this.leaveClub.bind(this)
  }
  componentDidMount() {
    const singleClubId = Number(this.props.match.params.clubsId)
    this.props.fetchSingleClub(singleClubId)
  }
  leaveClub() {
    this.props.leaveClub(this.props.singleClub.id)
  }
  render() {
    const club = this.props.singleClub
    return (
      <div>
        <h2>{club.name}</h2>
        <button onClick={this.leaveClub} className="leaveClub" type="button">
          {' '}
          Leave Club
        </button>
      </div>
    )
  }
}

const mapState = state => ({
  singleClub: state.singleClub
})

const mapDispatch = dispatch => ({
  fetchSingleClub: id => dispatch(fetchSingleClub(id)),
  leaveClub: id => dispatch(leaveClub(id))
})

export default connect(mapState, mapDispatch)(SingleClub)
