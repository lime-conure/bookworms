import React, {Component} from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Sector
} from 'recharts'
import Typography from '@material-ui/core/Typography'
import {connect} from 'react-redux'
import {fetchClubBooks} from '../store'

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
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fontSize={30}
        fill="#999"
        fontFamily="Lato"
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill="#e98fa3"
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill="#e98fa3"
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
        fontSize={20}
        fontFamily="Lato"
      >{`books: ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        fontSize={20}
        textAnchor={textAnchor}
        fill="#999"
        fontFamily="Lato"
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
  }
  // functions
  sort(criteria) {
    return this.props.results
      .sort((a, b) => {
        return (
          new Date(a.clubs_books[criteria]) - new Date(b.clubs_books[criteria])
        )
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
    let finished = this.sort('endTime')

    let startedArr = Object.keys(started)
    let finishedArr = Object.keys(finished)
    let finalArr = [...startedArr, ...finishedArr].sort(
      (a, b) => new Date(a) - new Date(b)
    )

    let result = []
    finalArr.forEach((el, idx) => {
      let created = {
        name: el.slice(0, 7),
        Started: started[el] || 0,
        Finished: finished[el] || 0
      }

      if (
        idx > 0 &&
        result.length &&
        created.name === result[result.length - 1].name
      ) {
        if (created.Started)
          result[result.length - 1].Started =
            result[result.length - 1].Started + 1
        if (created.Finished)
          result[result.length - 1].Finished =
            result[result.length - 1].Finished + 1
      } else {
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
          let date = val.clubs_books[criteria]
          if (date.startsWith(value)) {
            accum = accum + 1
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

  onPieEnter(data, index) {
    this.setState({
      activeIndex: index
    })
  }

  render() {
    const all = this.final()

    return (
      <div>
        <Typography variant="h4" style={{marginBottom: 60}}>
          Monthly book totals
        </Typography>
        <BarChart
          width={1000}
          height={500}
          data={all}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{fontFamily: 'Lato'}} />
          <YAxis
            type="number"
            tick={{fontFamily: 'Lato'}}
            domain={[0, 'dataMax + 1']}
          />
          <Tooltip
            cursor={{fill: '#444', opacity: 0.6}}
            contentStyle={{
              fontFamily: 'Lato',
              color: '#fff',
              backgroundColor: '#222'
            }}
          />
          <Legend
            width={100}
            wrapperStyle={{
              top: 40,
              right: 20,
              color: '#fff',
              backgroundColor: '#333',
              border: '1px solid #d5d5d5',
              borderRadius: 3,
              lineHeight: '40px',
              fontFamily: 'Lato'
            }}
          />
          <Bar dataKey="Started" fill="#e98fa3" barSize={25} />
          <Bar dataKey="Finished" fill="#6f75aa" barSize={25} />
        </BarChart>

        <Typography variant="h4">Progress in 2018</Typography>
        <PieChart width={1000} height={500}>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={this.state.year}
            cx={500}
            cy={200}
            innerRadius={80}
            outerRadius={150}
            fill="#6f75aa"
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
