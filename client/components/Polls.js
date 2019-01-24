import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPolls} from '../store'
import {NavLink, Link} from 'react-router-dom'

const FAKE_CLUB_ID = 1

class Polls extends Component {
  // constructor() {
  //   super()
  // }

  componentDidMount() {
    console.log('Polls did mount')
    this.props.fetchPolls(this.props.match.params.clubId)
    //this.props.fetchPolls(1)
  }

  render() {
    const polls = this.props.polls
    console.log('Polls rendered')
    return (
      <div>
        <h2> All Polls:</h2>
        <Link to="/Polls/create">
          <button> Create a new poll</button>
        </Link>
        <ul>
          {polls.map(poll => (
            <div key={poll.id}>
              <li>
                <Link to={`/clubs/polls/${poll.id}`}>
                  <p>Title: {poll.title}</p>
                  <p>Due date: {new Date(poll.dueDate).toString()}</p>
                </Link>
              </li>
            </div>
          ))}
        </ul>
      </div>
    )
  }
}

const mapState = state => ({
  polls: state.polls.allPolls
})

const mapDispatch = dispatch => ({
  fetchPolls: clubId => dispatch(fetchPolls(clubId))
})
export default connect(mapState, mapDispatch)(Polls)
