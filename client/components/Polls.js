import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPolls} from '../store'
import {NavLink, Link} from 'react-router-dom'

class Polls extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
    console.log('Polls did mount')
    this.props.fetchPolls()
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
                <Link to={`/polls/${poll.id}`}>
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
  polls: state.polls
})

const mapDispatch = {
  fetchPolls
}

export default connect(mapState, mapDispatch)(Polls)
