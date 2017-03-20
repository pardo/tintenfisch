import * as d3 from 'd3'
import { changeColor } from './actions/land'

function hex (node, r, x, y, color) {
  var h = (Math.sqrt(3) / 2)
  var radius = r
  var xp = x
  var yp = y
  var hexagonData = [
    {'x': radius + xp, 'y': yp},
    {'x': radius / 2 + xp, 'y': radius * h + yp},
    {'x': -radius / 2 + xp, 'y': radius * h + yp},
    {'x': -radius + xp, 'y': yp},
    {'x': -radius / 2 + xp, 'y': -radius * h + yp},
    {'x': radius / 2 + xp, 'y': -radius * h + yp}
  ]
  var drawHexagon = d3.line()
    .x(function (d) { return d.x })
    .y(function (d) { return d.y })
    .curve(d3.curveCardinalClosed.tension(0.75))

  return node.append('path')
            .attr('d', drawHexagon(hexagonData))
            .attr('fill', color)
            .attr('stroke', 'black')
}

function drawLine (store, land, color, followLink) {
  let initial = land
  while (true) {
    let state = store.getState()
    if (!state.map.has(initial)) {
      break
    }
    store.dispatch(changeColor(initial, color))
    initial = state.map.getIn([initial, 'links', followLink])
    if (initial === undefined) {
      break
    }
  }
}

function splash (store, initialLand) {
  drawLine(store, initialLand, d3.schemeCategory20[0], '0')
  drawLine(store, initialLand, d3.schemeCategory20[1], '1')
  drawLine(store, initialLand, d3.schemeCategory20[2], '2')
  drawLine(store, initialLand, d3.schemeCategory20[3], '3')
  drawLine(store, initialLand, d3.schemeCategory20[4], '4')
  drawLine(store, initialLand, d3.schemeCategory20[5], '5')
}

function render (store, state) {
  var landList = state.map.valueSeq().toJS()
  var unitsList = state.units.valueSeq().toJS()

  function createG (node, name) {
    return node.append('g').attr('class', name)
  }

  var svg = d3.select('svg')
  svg.selectAll('*').remove()

  var circlesG = createG(svg, 'circlesG')
  var unitsG = createG(svg, 'unitsG')

  function convertPosition (position) {
    return {
      x: position.y % 2 === 0 ? position.x * 60 + 50 : (position.x * 60) + 30 + 50,
      y: 300 - position.y * 17 + 50
    }
  }

  landList.forEach(function (land) {
    let position = convertPosition(land.position)
    hex(circlesG, 20,
            position.x,
            position.y,
            land.color
        ).on('click', function () {
          splash(store, land.id)
        })
  })

  unitsList.forEach(function (unit) {
    let position = convertPosition(state.map.getIn([unit.land, 'position']).toJS())
    unitsG.append('circle')
            .attr('r', 4)
            .style('fill', unit.color)
            .attr('cx', position.x)
            .attr('cy', position.y)
  })
}

export { render }
