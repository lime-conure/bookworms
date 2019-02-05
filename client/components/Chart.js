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

// 1. find all books for the club in past and present
// 2. if startedDate -exist and finished- null  - present
//3. startedDate -null and finished- exist  - past circle
//4. startedDate -exist and finished- null  - present circle
// 5. startedDate -exist and finished- exist  - past lines
// 6. if !type === future

// [{id, type, clubId, bookId, start, finish},{id, type, clubId, bookId, start, finish}]
// results.map(r=>{
//  if(r.type!==future){
//   let
//  }
//})
//book01: [{x: startedDate, y: bookName, z: pages}, {x: finished, y: bookName, z: pages},],

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
      startTime: 2,
      finishTime: 4
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
      startTime: 1,
      finishTime: null
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
      startTime: 1,
      finishTime: null
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
      startTime: null,
      finishTime: 6
    }
  }
]
const chartInfo = results => {
  if (results.length) {
    return results.filter(r => r.clubBooks.type !== 'future').map(r => {
      if (r.clubBooks.startTime && r.clubBooks.finishTime)
        return {
          el: [
            {x: r.clubBooks.startTime, y: r.title, z: r.pages},
            {x: r.clubBooks.finishTime, y: r.title, z: r.pages}
          ]
        }
      else if (r.clubBooks.startTime && !r.clubBooks.finishTime)
        return {el: [{x: r.clubBooks.startTime, y: r.title, z: r.pages}]}
      else if (!r.clubBooks.startTime && r.clubBooks.finishTime)
        return {el: [{x: r.clubBooks.finishTime, y: r.title, z: r.pages}]}
    })
  }
}

const data = chartInfo(results)

/// [[], [], []]
//[{ x: startedDate, y: bookName, z: pages }, { x: finished, y: bookName, z: pages },],
export default class Chart extends Component {
  constructor() {
    super()
    // this.state = {
    //   arr: [
    //     {book01: [{x: 2, y: 1, z: 422}, {x: 4, y: 1, z: 422}]},
    //     {book02: [{x: 3, y: 4, z: 320}, {x: 7, y: 4, z: 320}]},
    //     {book03: [{x: 10, y: 10, z: 550}]},
    //     {book04: [{x: 11, y: 8, z: 343}]}
    //   ]
    // }
    this.state = {arr: data}
  }

  render() {
    // const {book01, book02, book03, book04} = this.state
    let state = []
    this.state.arr.map(obj => {
      const book = obj[Object.keys(obj)[0]]
      state.push(book)
    })

    console.log('final state', state)
    state.map((el, i) => {
      console.log(el, 'el')
    })

    return (
      <ScatterChart
        width={600}
        height={400}
        margin={{top: 20, right: 20, bottom: 20, left: 20}}
      >
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="time" unit="month" />
        <YAxis type="number" dataKey="y" name="book" unit="" />
        <ZAxis
          type="number"
          range={[200, 700]}
          dataKey="z"
          name="bookLength"
          unit="pages"
        />
        <Tooltip cursor={{strokeDasharray: '3 3'}} />
        <Legend />
        {state.map((el, i) => (
          <Scatter
            key={i}
            name={el[0].y}
            data={el}
            fill="red"
            line
            shape="circle"
          />
        ))}
      </ScatterChart>
    )
  }
}

// this.state = { arr: chartInfo(results) }
//   this.state = {
//     arr: [
//       {
//         el: [
//           {x: '2019-01-05', y: 'The best book1', z: 30},
//           {x: '2019-02-05', y: 'The best book1', z: 30}
//         ]
//       },
//       {
//         el: [
//           {x: '2019-01-05', y: 'The best book2', z: 30},
//           {x: '2019-02-05', y: 'The best book1', z: 30}
//         ]
//       }
//     ]
//   }
// }
// render() {
//   // const {book01, book02, book03, book04} = this.state
//   console.log(this.state, 'state')
//   return (
//     <ScatterChart
//       width={600}
//       height={400}
//       margin={{top: 20, right: 20, bottom: 20, left: 20}}
//     >
//       <CartesianGrid />
//       <XAxis type="number" dataKey="x" name="date" unit="month" />
//       <YAxis type="number" dataKey="y" name="book" unit="book" />
//       <ZAxis
//         type="number"
//         range={[200, 700]}
//         dataKey="z"
//         name="bookLength"
//         unit="pages"
//       />
//       <Tooltip cursor={{strokeDasharray: '3 3'}} />
//       <Legend />
//       {this.state.arr.map((el, i) => (
//         <div>
//           <h3> hi</h3>

//           <Scatter
//             key={i}
//             name={el.el[0].y}
//             data={el.el}
//             fill="#8884d8"
//             line
//             shape="circle"
//           />
//         </div>
//       ))}

//     </ScatterChart>
//   )
// }
