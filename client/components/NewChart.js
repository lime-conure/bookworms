import React, {Component} from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import Typography from '@material-ui/core/Typography'

const results = [
  {
    id: 1,
    goodReadsId: 2,
    title: 2,
    description: 'description',
    imageUrl: 'http/someadderss',
    pages: 30,

    clubBooks: {
      type: 'past',
      clubId: 1,
      startTime: '2019-02-04 12:10:39.15-05',
      finishTime: '2019-02-05 12:10:39.15-05'
    }
  },
  {
    id: 1,
    goodReadsId: 2,
    title: 2,
    description: 'description',
    imageUrl: 'http/someadderss',
    pages: 30,

    clubBooks: {
      type: 'past',
      clubId: 1,
      startTime: '2019-01-05 12:10:39.15-05',
      finishTime: '2019-02-05 12:10:39.15-05'
    }
  },
  {
    id: 1,
    goodReadsId: 2,
    title: 2,
    description: 'description',
    imageUrl: 'http/someadderss',
    pages: 30,

    clubBooks: {
      type: 'past',
      clubId: 1,
      startTime: '2019-01-05 12:10:39.15-05',
      finishTime: '2019-02-05 12:10:39.15-05'
    }
  },
  {
    id: 2,
    goodReadsId: 2,
    title: 1,
    description: 'description',
    imageUrl: 'http/someadderss',
    pages: 30,

    clubBooks: {
      type: 'now',
      clubId: 1,
      startTime: '2018-01-05 12:10:39.15-05',
      finishTime: '2018-02-05 12:10:39.15-05'
    }
  },
  {
    id: 3,
    goodReadsId: 2,
    title: 3,
    description: 'description',
    imageUrl: 'http/someadderss',
    pages: 30,

    clubBooks: {
      type: 'future',
      clubId: 1,
      startTime: '2018-12-05 12:10:39.15-05',
      finishTime: '2017-02-05 12:10:39.15-05'
    }
  },
  {
    id: 4,
    goodReadsId: 2,
    title: 4,
    description: 'description',
    imageUrl: 'http/someadderss',
    pages: 30,

    clubBooks: {
      id: 2,
      type: 'past',
      clubId: 1,
      startTime: '2018-07-05 12:10:39.15-05',
      finishTime: '2019-02-05 12:10:39.15-05'
    }
  }
]

function sort(criteria) {
  return results
    .sort((a, b) => {
      return new Date(a.clubBooks[criteria]) - new Date(b.clubBooks[criteria])
    })
    .reduce((accum, val) => {
      if (val.clubBooks[criteria]) {
        let date = val.clubBooks[criteria]
        accum[date] = accum[date] + 1 || 1
      }
      return accum
    }, {})
}

function final() {
  let started = sort('startTime')
  let finished = sort('finishTime')
  let startedArr = Object.keys(started)
  let finishedArr = Object.keys(finished)
  let finalArr = [...startedArr, ...finishedArr].sort(
    (a, b) => new Date(a) - new Date(b)
  )
  let result = []
  finalArr.forEach((el, idx) => {
    let created = {
      name: el.slice(0, 7),
      started: started[el] || 0,
      finished: finished[el] || 0
    }
    if (idx > 0 && created.name === result[idx - 1].name) {
      result[idx - 1].finished = created.finished
    } else result.push(created)
  })
  return result
}

export default class NewChart extends Component {
  constructor() {
    super()
    this.state = final()
  }
  render() {
    return (
      <div>
        <Typography variant="h4">BarChart</Typography>
        <BarChart
          width={600}
          height={300}
          data={this.state}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="started" fill="#8cb81d" />
          <Bar dataKey="finished" fill="#d6eaa4" />
        </BarChart>

        <Typography variant="h4">LineChart</Typography>

        <LineChart
          width={600}
          height={300}
          data={this.state}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="started"
            stroke="#8884d8"
            activeDot={{r: 8}}
          />
          <Line type="monotone" dataKey="finished" stroke="#82ca9d" />
        </LineChart>
      </div>
    )
  }
}
