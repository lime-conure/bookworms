import React, {Component} from 'react'
import {connect} from 'react-redux'
import {createNewClub} from '../store/clubs'

export class CreateClub extends Component {
  constructor(props) {
    super(props)
    this.createNewClub = this.createNewClub.bind(this)
  }

  componentDidMount() {
    console.log(this.props, 'this.props')
    this.props.createNewClub()
    console.log('you clicked')
  }
  render() {
    return (
      <div>
        <h3>New Club</h3>
        <form>
          <label>Club Name: </label>
          <input type="text" />
          <label>Invite Link:</label>
          <input type="text" />
        </form>
        <button onClick={this.createNewClub} type="submit">
          Create Club
        </button>
      </div>
    )
  }
}

const mapState = state => ({
  clubs: state.clubs
})

const mapDispatch = dispatch => ({
  createNewClub: () => dispatch(createNewClub())
})

export default connect(mapState, mapDispatch)(CreateClub)
