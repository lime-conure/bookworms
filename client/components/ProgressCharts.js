import React, {Component} from 'react'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Grid from '@material-ui/core/Grid'
import FilledInput from '@material-ui/core/FilledInput'

// Recharts
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

const styles = theme => ({
  yearSelector: {
    paddingTop: 22
  }
})

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
        fontWeight={300}
        fill="#fff"
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
        fill="#aaa"
        fontSize={18}
        fontFamily="Lato"
      >{`Books: ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={25}
        fontSize={22}
        textAnchor={textAnchor}
        fill="#fff"
        fontFamily="Lato"
      >
        {` ${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  )
}

class ProgressCharts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      year: '2019',
      activeIndex: 0,
      open: false,
      tableKeyName: 'clubs_books'
    }
    this.onPieEnter = this.onPieEnter.bind(this)
    this.sort = this.sort.bind(this)
    this.final = this.final.bind(this)
    this.sortPie = this.sortPie.bind(this)
    this.pie = this.pie.bind(this)
  }

  async componentDidMount() {
    if (this.props.scope === 'club') {
      const clubId = Number(this.props.match.params.clubId)
      await this.props.fetchClubBooks(clubId)
    } else {
      this.setState({tableKeyName: 'users_books'})
    }
  }
  // functions
  sort(criteria) {
    return this.props.results
      .sort((a, b) => {
        return (
          new Date(a[this.state.tableKeyName][criteria]) -
          new Date(b[this.state.tableKeyName][criteria])
        )
      })
      .reduce((accum, val) => {
        if (val[this.state.tableKeyName][criteria]) {
          let date = val[this.state.tableKeyName][criteria]
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
          new Date(a[this.state.tableKeyName][criteria]) -
          new Date(b[this.state.tableKeyName][criteria])
        )
      })
      .reduce((accum, val) => {
        if (val[this.state.tableKeyName][criteria]) {
          let date = val[this.state.tableKeyName][criteria]
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
      {name: 'In Progress', value: started},
      {name: 'Finished', value: finished}
    ]
  }

  onPieEnter(data, index) {
    this.setState({
      activeIndex: index
    })
  }

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value})
  }

  handleClose = () => {
    this.setState({open: false})
  }

  handleOpen = () => {
    this.setState({open: true})
  }

  render() {
    const all = this.final()
    const pieYear = this.pie(this.state.year)
    const {classes} = this.props

    return (
      <div>
        <Typography variant="h4" gutterBottom>
          Monthly Book Totals
        </Typography>
        <Divider />
        <BarChart
          width={1000}
          height={500}
          data={all}
          margin={{top: 50, right: 30, left: 20, bottom: 5}}
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
              backgroundColor: '#222',
              borderRadius: 3
            }}
          />
          <Legend
            width={120}
            align="left"
            wrapperStyle={{
              top: 20,
              right: 0,
              padding: 10,
              color: '#fff',
              backgroundColor: '#222',
              border: '1px solid #d5d5d5',
              fontFamily: 'Lato',
              lineHeight: '30px'
            }}
          />
          <Bar dataKey="Started" fill="#e98fa3" barSize={25} />
          <Bar dataKey="Finished" fill="#6f75aa" barSize={25} />
        </BarChart>

        <Grid container spacing={16} alignItems="flex-end">
          <Grid item>
            <Typography variant="h4">Reading Progress in</Typography>
          </Grid>
          <Grid item xs={8}>
            <FormControl>
              <form autoComplete="off">
                <Select
                  open={this.state.open}
                  onClose={this.handleClose}
                  onOpen={this.handleOpen}
                  value={this.state.year}
                  onChange={this.handleChange}
                  style={{
                    fontFamily: 'Cutive',
                    fontSize: 22,
                    minWidth: 180
                  }}
                  input={
                    <FilledInput
                      classes={{
                        input: classes.yearSelector
                      }}
                      name="year"
                      id="demo-controlled-open-select"
                    />
                  }
                >
                  <MenuItem value="2019">2019</MenuItem>
                  <MenuItem value="2018">2018</MenuItem>
                </Select>
              </form>
            </FormControl>
          </Grid>
        </Grid>

        <Divider style={{marginTop: 20}} />
        <PieChart width={1000} height={500} margin={{top: 50}}>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={pieYear}
            cx={500}
            cy={200}
            innerRadius={110}
            outerRadius={180}
            fill="#6f75aa"
            onMouseEnter={this.onPieEnter}
          />
        </PieChart>
      </div>
    )
  }
}

export default withStyles(styles)(ProgressCharts)
