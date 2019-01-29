import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchClubs} from '../store'
import {Link} from 'react-router-dom'

class Clubs extends Component {
  componentDidMount() {
    this.props.fetchClubs()
  }
  render() {
    const clubs = this.props.clubs

    return (
      <div>
        <h2>YOUR CLUBS</h2>
        <ul>
          {clubs.map(club => (
            <div key={club.id}>
              <li>
                <Link to={`/clubs/${club.id}`}> {club.name} </Link>{' '}
                <button className="leaveClub" type="button">
                  {' '}
                  Leave Club
                </button>
              </li>
            </div>
          ))}
        </ul>
      </div>
    )
  }
  z
}

const mapState = state => ({
  clubs: state.clubs
})

const mapDispatch = dispatch => ({
  fetchClubs: () => dispatch(fetchClubs())
})

export default connect(mapState, mapDispatch)(Clubs)
