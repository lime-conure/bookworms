import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPolls} from '../store'
import {NavLink, Link} from 'react-router-dom'
import BooksView from './BooksView'
import axios from 'axios'

class CreatePoll extends Component {
  constructor() {
    super()
    this.state = {
      searchResults: [],
      selectedBooks: [],
      selectedDates: [],
      selectedPlaces: [],
      title: '',
      notes: '',
      dueDate: {},
      searchValue: '',
      date: '',
      time: '',
      place: ''
    }
    this.createPoll = this.createPoll.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.fetchBooks = this.fetchBooks.bind(this)
    this.addBook = this.addBook.bind(this)
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  async fetchBooks(e) {
    e.preventDefault()
    try {
      const {data} = await axios.get('/api/books')
      this.setState({
        searchResults: data
      })
    } catch (err) {
      console.error(err)
    }
  }

  async createPoll(e) {
    e.preventDefault()
    try {
      await axios.post(`/api/clubs/${this.props.match.params.clubId}/pools`)
      this.props.history.push(`/clubs/${this.props.match.params.clubId}/pools`)
    } catch (err) {
      console.err()
    }
  }

  addDateTime(e) {
    e.preventDefault()
    const {time, date} = this.state
    const dateTime = new Date(
      Number(date.slice(0, 4)),
      Number(date.slice(5, 7)),
      Number(date.slice(8, 10)),
      Number(date.slice(5, 7)),
      Number(time.slice(0, 2)),
      Number(time.slice(3, 5))
    )

    this.setState({
      selectedDates: [...this.state.selectedDates, dateTime]
    })
  }
  addPlaces(e) {
    e.preventDefault()
    this.setState({
      selectedPlaces: [...this.state.selectedPlaces, this.state.place]
    })
  }

  addBook(book) {
    this.setState({
      selectedBooks: [...this.state.selectedBooks, book]
    })
  }

  componentDidMount() {
    console.log('CreatePoll did mount')
  }

  render() {
    console.log('Create poll rendered')
    return (
      <div>
        <form onSubmit={() => this.createPoll(this.state)}>
          <h3>Create a new poll</h3>
          <label htmlFor="title"> Title</label>
          <input name="title" onChange={this.handleChange} required />
          <label htmlFor="notes">Notes</label>
          <input name="notes" onChange={this.handleChange} />
          <label htmlFor="dueDate"> Poll Due Date</label>
          <input name="dueDate" onChange={this.handleChange} required />
          {/* form to select books */}
          <form onSubmit={this.fetchBooks}>
            <input
              name="searchValue"
              placeholder="fetch books from db"
              onChange={this.handleChange}
            />
            <button type="submit">Search</button>
          </form>
          {this.state.search && this.state.search.length ? (
            <BooksView books={this.state.search} addBook={this.addBook} />
          ) : null}
          {/* form to select dates */}
          <form onSubmit={this.addDateTime}>
            <input
              name="date"
              placeholder="yyyy/mm/dd"
              onChange={this.handleChange}
            />
            <input
              name="time"
              placeholder="hh:mm"
              onChange={this.handleChange}
            />
            <button type="submit">Add</button>
          </form>
          {/* form to select location */}
          <form onSubmit={this.addPlace}>
            <input
              name="place"
              placeholder="Please enter a place"
              onChange={this.handleChange}
            />
            <button type="submit">Add</button>
          </form>

          <button type="submit">Create</button>
        </form>
      </div>
    )
  }
}

export default CreatePoll
