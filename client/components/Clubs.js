import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchClubs} from '../store'
import {leaveClub} from '../store/clubs'
import {Link} from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

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
        <div>
          <Typography variant="h3" gutterBottom color="primary">
            Your Clubs
          </Typography>

          <List>
            {clubs.map(club => (
              <ListItem
                button
                component={Link}
                key={club.id}
                to={`/clubs/${club.id}`}
              >
                <ListItemText>
                  <Typography variant="h5">{club.name}</Typography>
                </ListItemText>
                <Button
                  type="submit"
                  onClick={() => this.leaveClub(club.id)}
                  className="leaveClub"
                  color="primary"
                  variant="contained"
                >
                  Leave Club
                </Button>
              </ListItem>
            ))}
          </List>
        </div>

        <Link to="/createclub">
          <Button type="button" color="secondary" variant="contained">
            Create Club
          </Button>
        </Link>
      </div>
    )
  }
}

const mapState = state => ({
  clubs: state.clubs
})

const mapDispatch = dispatch => ({
  fetchClubs: () => dispatch(fetchClubs()),
  leaveClub: id => dispatch(leaveClub(id))
})

export default connect(mapState, mapDispatch)(Clubs)
