import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchClubs} from '../store'
import {leaveClub} from '../store/clubs'
import {Link} from 'react-router-dom'

class Clubs extends Component {
  constructor(props) {
    super(props)
    this.leaveClub = this.leaveClub.bind(this)
  }

  componentDidMount() {
    this.props.fetchClubs()
  }
  leaveClub(id) {
    this.props.leaveClub(id)
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
                <button
                  type="submit"
                  onClick={() => this.leaveClub(club.id)}
                  className="leaveClub"
                >
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
  fetchClubs: () => dispatch(fetchClubs()),
  leaveClub: id => dispatch(leaveClub(id))
})

export default connect(mapState, mapDispatch)(Clubs)
