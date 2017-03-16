import { combineReducers } from 'redux'
import landReducer from './land'
import units from './units'

const appReducer = combineReducers({
  map: landReducer,
  units: units
})

export default appReducer