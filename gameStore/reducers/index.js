var combineReducers = require('redux').combineReducers
var landReducer = require('./land')
var units = require('./units')

const appReducer = combineReducers({
  map: landReducer,
  units: units
})

module.exports = appReducer
