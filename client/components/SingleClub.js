import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchSingleClub} from '../store/singleClub'

export class SingleClub extends Component {
  componentDidMount() {
    const singleClubId = Number(this.props.match.params.clubsId)
    this.props.fetchSingleClub(singleClubId)
  }
  render() {
    const club = this.props.singleClub
    return (
      <div>
        <h2>{club.name}</h2>
        <button className="leaveClub" type="button">
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
  fetchSingleClub: id => dispatch(fetchSingleClub(id))
})

export default connect(mapState, mapDispatch)(SingleClub)
