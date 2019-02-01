import React from 'react'
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import MenuIcon from '@material-ui/icons/Menu'
import {Link} from 'react-router-dom'
import {fetchClubs} from '../store'
import Axios from 'axios'

class DropDownClubs extends React.Component {
  state = {
    anchorEl: null
  }

  async componentDidMount() {
    this.props.fetchClubs()
  }

  handleClick = event => {
    this.setState({anchorEl: event.currentTarget})
  }

  handleClose = () => {
    this.setState({anchorEl: null})
  }

  render() {
    const {anchorEl} = this.state
    return (
      <div>
        <Button
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <IconButton color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {this.props.clubs.map(club => (
            <MenuItem key={club.id} onClick={this.handleClose}>
              <Link
                to={`/clubs/${club.id}`}
                style={{textDecoration: 'none', color: 'black'}}
              >
                {club.name}
              </Link>
            </MenuItem>
          ))}
          <MenuItem onClick={this.handleClose}>
            <Link
              to="/createclub"
              style={{textDecoration: 'none', color: 'black'}}
            >
              Create a new club
            </Link>
          </MenuItem>
        </Menu>
      </div>
    )
  }
}
const mapState = state => ({
  clubs: state.clubs
})

const mapDispatch = dispatch => ({
  fetchClubs: () => dispatch(fetchClubs())
})

export default connect(mapState, mapDispatch)(DropDownClubs)
