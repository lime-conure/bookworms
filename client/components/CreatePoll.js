import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPolls} from '../store'
import {NavLink, Link} from 'react-router-dom'
import BooksView from './BooksView'
import axios from 'axios'
import Calendar from 'react-input-calendar'
import Popup from 'reactjs-popup'

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
    // this.deleteOption = this.deleteOption.bind(this)
  }
  onCalendarChange(date) {
    const dueDate = new Date(
      Number(date.slice(6, 10)),
      Number(date.slice(0, 2)),
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
      console.error(err)
    }
  }

  addDateTime(e) {
    e.preventDefault()
    const {time, date} = this.state
    const dateTime = new Date(
      Number(date.slice(0, 4)),
      Number(date.slice(5, 7)) - 1,
      Number(date.slice(8, 10)),
      Number(time.slice(0, 2)),
      Number(time.slice(3, 5))
    )

    this.setState({
      selectedDates: [...this.state.selectedDates, dateTime],
      date: '',
      time: ''
    })
  }
  addPlaces(e) {
    e.preventDefault()
    this.setState({
      selectedPlaces: [...this.state.selectedPlaces, this.state.place],
      place: ''
    })
  }

  addBook(e, book) {
    e.preventDefault()
    this.setState({
      selectedBooks: [...this.state.selectedBooks, book]
    })
  }

  deleteOption(idx, method, e) {
    e.preventDefault()
    if (method === 'book') {
      this.setState({
        selectedBooks: this.state.selectedBooks.filter(
          book => book !== this.state.selectedBooks[idx]
        )
      })
    }
    if (method === 'place') {
      this.setState({
        selectedPlaces: this.state.selectedPlaces.filter(
          place => place !== this.state.selectedPlaces[idx]
        )
      })
    }
    if (method === 'date') {
      this.setState({
        selectedDates: this.state.selectedDates.filter(
          date => date !== this.state.selectedDates[idx]
        )
      })
    }
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
          <h3>Create a New Poll</h3>
          <div>
            <label htmlFor="title"> Title</label>
            <input name="title" onChange={this.handleChange} required />
          </div>
          <br />
          <div>
            <label htmlFor="notes">Notes</label>
            <input name="notes" onChange={this.handleChange} />
          </div>
          <br />
          {/* select dueDate */}
          <div>
            <label htmlFor="dueDate">Due Date</label>
            <Calendar
              format="DD/MM/YYYY"
              date={this.state.dueDate}
              name="dueDate"
              onChange={this.onCalendarChange}
            />
          </div>
          <br />
          {/* select books */}
          <div>
            <label htmlFor="searchValue">Add Book Options</label>
            <input
              name="searchValue"
              placeholder="Search for a book..."
              onChange={this.handleChange}
            />
            <button onClick={this.fetchBooks} type="submit">
              Search
            </button>
            <br />

            {this.state.searchResults.length ? (
              // <BooksView books={this.state.search} addBook={this.addBook} />
              <div>
                {this.state.searchResults.map(bookResult => (
                  <div key={bookResult.id}>
                    <Popup
                      trigger={<p>{bookResult.title}</p>}
                      position="right center"
                      modal
                    >
                      {close => (
                        <div className="modal">
                          <a className="close" onClick={close}>
                            &times;
                          </a>
                          <div className="header"> {bookResult.title}</div>
                          <div className="content">
                            {bookResult.description}
                          </div>
                          <div className="actions">
                            <button className="button">
                              <a
                                href="https://www.goodreads.com/api/documentation"
                                target="_blank"
                              >
                                More info
                              </a>
                            </button>
                          </div>
                        </div>
                      )}
                    </Popup>
                    {/* <p>{bookResult.title}</p> */}
                    <button onClick={e => this.addBook(e, bookResult)}>
                      Add a book
                    </button>
                    <br />
                  </div>
                ))}
                <br />
                <div>
                  {this.state.selectedBooks.length
                    ? this.state.selectedBooks.map((book, idx) => (
                        <div key={book.id}>
                          <p>{book.title}</p>
                          <button
                            onClick={e => this.deleteOption(idx, 'book', e)}
                          >
                            X
                          </button>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            ) : null}
          </div>
          <br />
          {/* select dates */}
          <div>
            <label htmlFor="date">Add Date/Time Options</label>
            <input
              name="date"
              placeholder="yyyy/mm/dd"
              value={this.state.date}
              onChange={this.handleChange}
            />
            <input
              name="time"
              placeholder="hh:mm"
              value={this.state.time}
              onChange={this.handleChange}
            />
            <button onClick={this.addDateTime} type="submit">
              Add Date/Time
            </button>

            <br />
            <div>
              {this.state.selectedDates.length
                ? this.state.selectedDates.map((date, idx) => (
                    <div key={idx}>
                      <p>{date.toString()}</p>
                      <button
                        onClick={e => this.deleteOption(idx, 'date', e)}
                        type="submit"
                      >
                        X
                      </button>
                    </div>
                  ))
                : null}
            </div>
          </div>

          <br />
          {/* select location */}
          <div>
            <label htmlFor="place">Add Location Options</label>
            <input
              name="place"
              placeholder="Type a location..."
              value={this.state.place}
              onChange={this.handleChange}
            />
            <button onClick={this.addPlaces} type="submit">
              Add Location
            </button>
            <br />
            <div>
              {this.state.selectedPlaces.length
                ? this.state.selectedPlaces.map((place, idx) => (
                    <div key={idx}>
                      <p>{place}</p>
                      <button onClick={e => this.deleteOption(idx, 'place', e)}>
                        X
                      </button>
                    </div>
                  ))
                : null}
            </div>
          </div>

          <br />
          <button type="submit">Create Poll</button>
        </form>
      </div>
    )
  }
}

export default CreatePoll
