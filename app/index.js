import { createStore } from 'redux'
import reducer from './reducers'
import { addLand, addLink, changeColor } from './actions/land'
import { addUnit, moveUnit } from './actions/units'
import { render } from './render'

let store = createStore(reducer)

store.subscribe(function() {
    render(store, store.getState())
})

for( var y=0; y < 20; y++){
    for( var x=0; x < 10; x++){
        let links = y%2==0?{
            "0": x+"#"+(y+2),
            "1": x+"#"+(y+1),
            "2": x+"#"+(y-1),
            "3": x+"#"+(y-2),
            "4": (x-1)+"#"+(y-1),
            "5": (x-1)+"#"+(y+1),
        }:{
            "0": x+"#"+(y+2),
            "1": (x+1)+"#"+(y+1),
            "2": (x+1)+"#"+(y-1),
            "3": x+"#"+(y-2),
            "4": x+"#"+(y-1),
            "5": x+"#"+(y+1),
        }
        
        
        store.dispatch(addLand(
            x+"#"+y,
            'red',
            { 'x': x, 'y': y },
            links
        ))
    }
}


//setTimeout(()=> store.dispatch(addUnit(2, 'yellow', "1#1")), 500*9)
//setTimeout(()=> store.dispatch(addUnit(1, 'cyan',   "2#3")), 500*10)
//setTimeout(()=> store.dispatch(moveUnit(2, "2#6")), 500*11)




//store.getState().map.get("0#0")