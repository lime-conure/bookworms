import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPolls} from '../store'
import {NavLink, Link} from 'react-router-dom'
import BooksView from './BooksView'
import axios from 'axios'
import Calendar from 'react-input-calendar'

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
      dueDate: null,
      searchValue: '',
      date: '',
      time: '',
      place: ''
    }
    this.createPoll = this.createPoll.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.fetchBooks = this.fetchBooks.bind(this)
    this.addBook = this.addBook.bind(this)
    this.addDateTime = this.addDateTime.bind(this)
    this.addPlaces = this.addPlaces.bind(this)
    this.onCalendarChange = this.onCalendarChange.bind(this)
  }
  onCalendarChange(date) {
    const dueDate = new Date(
      Number(date.slice(6, 10)),
      Number(date.slice(0, 2)) - 1,
      Number(date.slice(3, 5))
    )
    console.log(dueDate)
    this.setState({
      dueDate: dueDate
    })
    console.log('state:', this.state.dueDate)
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
      const {
        selectedBooks,
        selectedDates,
        selectedPlaces,
        title,
        dueDate,
        notes
      } = this.state
      const newPoll = {
        selectedBooks,
        selectedDates,
        selectedPlaces,
        title,
        dueDate,
        notes
      }
      await axios.post(
        `/api/clubs/${this.props.match.params.clubId}/polls`,
        newPoll
      )
      this.props.history.push(`/clubs/${this.props.match.params.clubId}/polls`)
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
    console.log('state in render:', this.state)
    return (
      <div>
        <form onSubmit={this.createPoll}>
          <h3>Create a new poll</h3>
          <label htmlFor="title"> Title</label>
          <input name="title" onChange={this.handleChange} required />
          <label htmlFor="notes">Notes</label>
          <input name="notes" onChange={this.handleChange} />

          {/* select dueDate */}
          <Calendar
            format="DD/MM/YYYY"
            date={this.state.dueDate}
            onChange={this.onCalendarChange}
          />

          {/* select books */}
          <input
            name="searchValue"
            placeholder="fetch books from db"
            onChange={this.handleChange}
          />
          <button onClick={this.fetchBooks} type="submit">
            Search
          </button>

          {this.state.searchResults.length ? (
            <BooksView books={this.state.search} addBook={this.addBook} />
          ) : null}

          {/* select dates */}
          <input
            name="date"
            placeholder="yyyy/mm/dd"
            onChange={this.handleChange}
          />
          <input name="time" placeholder="hh:mm" onChange={this.handleChange} />
          <button onClick={this.addDateTime} type="submit">
            Add
          </button>

          {/* select location */}
          <input
            name="place"
            placeholder="Please enter a place"
            onChange={this.handleChange}
          />
          <button onClick={this.addPlaces} type="submit">
            Add
          </button>

          <button type="submit">Create</button>
        </form>
      </div>
    )
  }
}

export default CreatePoll
