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
  Legend,
  PieChart,
  Pie,
  Sector,
  Cell
} from 'recharts'
import Typography from '@material-ui/core/Typography'
import {connect} from 'react-redux'
import {fetchClubBooks} from '../store'

// const results = [
//   {
//     id: 1,
//     goodReadsId: 2,
//     title: 2,
//     description: 'description',
//     imageUrl: 'http/someadderss',
//     pages: 30,

//     clubBooks: {
//       type: 'past',
//       clubId: 1,
//       startTime: '2019-02-04 12:10:39.15-05',
//       finishTime: '2019-02-05 12:10:39.15-05'
//     }
//   },
//   {
//     id: 1,
//     goodReadsId: 2,
//     title: 2,
//     description: 'description',
//     imageUrl: 'http/someadderss',
//     pages: 30,

//     clubBooks: {
//       type: 'past',
//       clubId: 1,
//       startTime: '2019-01-05 12:10:39.15-05',
//       finishTime: '2019-02-05 12:10:39.15-05'
//     }
//   },
//   {
//     id: 1,
//     goodReadsId: 2,
//     title: 2,
//     description: 'description',
//     imageUrl: 'http/someadderss',
//     pages: 30,

//     clubBooks: {
//       type: 'past',
//       clubId: 1,
//       startTime: '2019-01-05 12:10:39.15-05',
//       finishTime: '2019-02-05 12:10:39.15-05'
//     }
//   },
//   {
//     id: 2,
//     goodReadsId: 2,
//     title: 1,
//     description: 'description',
//     imageUrl: 'http/someadderss',
//     pages: 30,

//     clubBooks: {
//       type: 'now',
//       clubId: 1,
//       startTime: '2018-01-05 12:10:39.15-05',
//       finishTime: '2018-02-05 12:10:39.15-05'
//     }
//   },
//   {
//     id: 3,
//     goodReadsId: 2,
//     title: 3,
//     description: 'description',
//     imageUrl: 'http/someadderss',
//     pages: 30,

//     clubBooks: {
//       type: 'future',
//       clubId: 1,
//       startTime: '2018-12-05 12:10:39.15-05',
//       finishTime: '2017-02-05 12:10:39.15-05'
//     }
//   },
//   {
//     id: 4,
//     goodReadsId: 2,
//     title: 4,
//     description: 'description',
//     imageUrl: 'http/someadderss',
//     pages: 30,

//     clubBooks: {
//       id: 2,
//       type: 'past',
//       clubId: 1,
//       startTime: '2018-07-05 12:10:39.15-05',
//       finishTime: '2019-02-05 12:10:39.15-05'
//     }
//   }
// ]

const renderActiveShape = props => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#999"
      >{`Books: ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {` ${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  )
}

class NewChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      all: this.final(),
      year: this.pie('2019'),
      activeIndex: 0
    }
    this.onPieEnter = this.onPieEnter.bind(this)
    this.sort = this.sort.bind(this)
    this.final = this.final.bind(this)
    this.sortPie = this.sortPie.bind(this)
    this.pie = this.pie.bind(this)
  }

  async componentDidMount() {
    const clubId = Number(this.props.match.params.clubId)
    await this.props.fetchClubBooks(clubId)
    console.log('in component did mount', this.props.results)
    console.log(this.state, 'state')
  }
  // functions
  sort(criteria) {
    console.log(this.props, 'props')
    return this.props.results
      .sort((a, b) => {
        //added line 207
        // if (a.club_books[criteria]){
        return (
          new Date(a.clubs_books[criteria]) - new Date(b.clubs_books[criteria])
        )
        // }
      })
      .reduce((accum, val) => {
        if (val.clubs_books[criteria]) {
          let date = val.clubs_books[criteria]
          accum[date] = accum[date] + 1 || 1
        }
        return accum
      }, {})
  }

  final() {
    let started = this.sort('startTime')
    console.log('started', started)
    let finished = this.sort('endTime')
    console.log('finished', finished)
    let startedArr = Object.keys(started)
    let finishedArr = Object.keys(finished)
    let finalArr = [...startedArr, ...finishedArr].sort(
      (a, b) => new Date(a) - new Date(b)
    )
    console.log(finalArr, 'finalArr')
    let result = []
    finalArr.forEach((el, idx) => {
      console.log('element', el)
      let created = {
        name: el.slice(0, 7),
        started: started[el] || 0,
        finished: finished[el] || 0
      }
      console.log('created', created)
      console.log(result, 'result')
      if (
        idx > 0 &&
        result.length &&
        created.name === result[result.length - 1].name
      ) {
        // result[idx - 1].finished = created.finished
        console.log('inside if ')
        if (created.started)
          result[result.length - 1].started =
            result[result.length - 1].started + 1
        if (created.finished)
          result[result.length - 1].finished =
            result[result.length - 1].finished + 1
      } else {
        console.log('results', result)
        result.push(created)
      }
    })
    return result
  }

  sortPie(criteria, value) {
    return this.props.results
      .sort((a, b) => {
        return (
          new Date(a.clubs_books[criteria]) - new Date(b.clubs_books[criteria])
        )
      })
      .reduce((accum, val) => {
        if (val.clubs_books[criteria]) {
          // let date = val.clubBooks[criteria].slice(0,7)
          let date = val.clubs_books[criteria]
          if (date.startsWith(value)) {
            accum = accum + 1

            // accum[date] = (accum[date] + 1) || 1
          }
        }

        return accum
      }, 0)
  }

  pie(year) {
    let started = this.sortPie('startTime', year)
    let finished = this.sortPie('endTime', year)
    return [
      {name: 'In progress', value: started},
      {name: 'Finished', value: finished}
    ]
  }

  //=======================================

  onPieEnter(data, index) {
    this.setState({
      activeIndex: index
    })
  }

  render() {
    console.log('props', this.props)
    return (
      <div>
        <Typography variant="h4"> Overall progress</Typography>
        <BarChart
          width={600}
          height={300}
          data={this.state.all}
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
          data={this.state.all}
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

        <Typography variant="h4">Progress in 2018</Typography>

        <PieChart width={800} height={400}>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={this.state.year}
            cx={300}
            cy={200}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            onMouseEnter={this.onPieEnter}
          />
        </PieChart>
      </div>
    )
  }
}

const mapState = state => ({
  results: state.clubBooks
})
const mapDispatch = dispatch => ({
  fetchClubBooks: clubId => dispatch(fetchClubBooks(clubId))
})

export default connect(mapState, mapDispatch)(NewChart)
