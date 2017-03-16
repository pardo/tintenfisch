import { createStore } from 'redux'
import reducer from './reducers'
import { addLand, addLink } from './actions/land'
import { addUnit } from './actions/units'
import { render } from './render'

let store = createStore(reducer)

store.subscribe(function() {
    console.log(store.getState())
    render(store.getState())
})


setTimeout(()=> store.dispatch(addLand(1, 'red',    { x: 0, y: 0 })), 1000*1)
setTimeout(()=> store.dispatch(addLand(2, 'blue',   { x: 1, y: 0 })), 1000*2)
setTimeout(()=> store.dispatch(addLand(3, 'green',  { x: 0, y: 1 })), 1000*3)
setTimeout(()=> store.dispatch(addLand(4, 'magenta',{ x: 1, y: 1 })), 1000*4)

setTimeout(()=> store.dispatch(addLink(1,2)), 1000*5)
setTimeout(()=> store.dispatch(addLink(1,3)), 1000*6)
setTimeout(()=> store.dispatch(addLink(2,4)), 1000*7)
setTimeout(()=> store.dispatch(addLink(3,4)), 1000*8)

setTimeout(()=> store.dispatch(addUnit(1, 'yellow', 2)), 1000*9)
setTimeout(()=> store.dispatch(addUnit(2, 'cyan', 4)), 1000*10)