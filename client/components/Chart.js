import React, {Component} from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

export default class Chart extends Component {
  constructor() {
    super()
    this.state = {
      book01: [{x: 2, y: 1, z: 422}, {x: 4, y: 1, z: 422}],
      book02: [{x: 3, y: 4, z: 320}, {x: 7, y: 4, z: 320}],
      book03: [{x: 10, y: 10, z: 550}],
      book04: [{x: 11, y: 8, z: 343}]
    }
  }
  render() {
    const {book01, book02, book03, book04} = this.state
    return (
      <ScatterChart
        width={600}
        height={400}
        margin={{top: 20, right: 20, bottom: 20, left: 20}}
      >
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="time" unit="month" />
        <YAxis type="number" dataKey="y" name="book" unit="book" />
        <ZAxis
          type="number"
          range={[200, 700]}
          dataKey="z"
          name="bookLength"
          unit="pages"
        />
        <Tooltip cursor={{strokeDasharray: '3 3'}} />
        <Legend />
        <Scatter
          name="Book 1"
          data={book01}
          fill="#8884d8"
          line
          shape="circle"
        />
        <Scatter
          name="Book 2"
          data={book02}
          fill="#82ca9d"
          line
          shape="circle"
        />
        <Scatter name="Book 3" data={book03} fill="#000" line shape="circle" />
        <Scatter name="Book 4" data={book04} fill="red" line shape="circle" />
      </ScatterChart>
    )
  }
}
