import React from 'react'
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import Divider from '@material-ui/core/Divider'
import MenuItem from '@material-ui/core/MenuItem'
import Icon from '@material-ui/core/Icon'
import {Link} from 'react-router-dom'
import {fetchClubs} from '../store'

class DropDownClubs extends React.Component {
  state = {
    anchorEl: null
  }

  async componentDidMount() {
    await this.props.fetchClubs()
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
          Clubs
          <Icon>keyboard_arrow_down</Icon>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleClose} component={Link} to="/clubs">
            All Clubs
          </MenuItem>
          {this.props.clubs.map(club => (
            <MenuItem
              key={club.id}
              onClick={this.handleClose}
              component={Link}
              to={`/clubs/${club.id}`}
            >
              {club.name}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem
            onClick={this.handleClose}
            component={Link}
            to="/createclub"
          >
            Create a new club
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
