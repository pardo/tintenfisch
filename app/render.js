import * as d3 from "d3";
import { changeColor } from './actions/land'


function hex(node, r, x, y, color) {
    var h = (Math.sqrt(3)/2),
        radius = r,
        xp = x,
        yp = y,
        hexagonData = [
            { "x": radius+xp,   "y": yp}, 
            { "x": radius/2+xp,  "y": radius*h+yp},
            { "x": -radius/2+xp,  "y": radius*h+yp},
            { "x": -radius+xp,  "y": yp},
            { "x": -radius/2+xp,  "y": -radius*h+yp},
            { "x": radius/2+xp, "y": -radius*h+yp}
        ];

    var drawHexagon = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .curve(d3.curveCardinalClosed.tension(0.75));

    return node.append("path")
            .attr("d", drawHexagon(hexagonData))
            .attr("fill", color)
            .attr('stroke', 'black')
}



function drawLine(store, land, color, followLink){
    let initial = land
    while (true) {
        let state = store.getState()
        if (!state.map.has(initial)) {
            break
        }
        store.dispatch(changeColor(initial, color))
        initial = state.map.getIn([initial, "links", followLink])
        if (initial===undefined) {
            break
        }
    }
}

function splash(store, initialLand) {
    drawLine(store, initialLand, d3.schemeCategory20[0], '0')
    drawLine(store, initialLand, d3.schemeCategory20[1], '1')
    drawLine(store, initialLand, d3.schemeCategory20[2], '2')
    drawLine(store, initialLand, d3.schemeCategory20[3], '3')
    drawLine(store, initialLand, d3.schemeCategory20[4], '4')
    drawLine(store, initialLand, d3.schemeCategory20[5], '5')
}

function render(store, state) {
    var landList = state.map.valueSeq().toJS();
    var unitsList = state.units.valueSeq().toJS();

    function createG(node, name) {
        return node.append('g').attr('class', name)
    }

    var svg = d3.select('svg');
    svg.selectAll("*").remove();

    var circlesG = createG(svg, 'circlesG');
    var linesG = createG(svg, 'linesG');
    var unitsG = createG(svg, 'unitsG');

    landList.forEach(function(land){
        hex(circlesG, 20, 
            land.position.y%2==0?land.position.x*60+50:(land.position.x*60)+30+50,
            300-land.position.y*17+50,
            //land.position.y%2==0?"red":"yellow"
            land.color
        ).on("click", function(){
            splash(store, land.id)
        })
    })

    // var lines = linesG.selectAll('line')
        // .data(linksList);

    // lines
        // .enter()
            // .append('line')
        // .merge(lines)
            // .style('stroke', 'black' )
            // .style('stroke-width', 1 )
            // .attr('x1', p => 20 + p[0].x * 40)
            // .attr('y1', p => 20 + p[0].y * 40)
            // .attr('x2', p => 20 + p[1].x * 40)
            // .attr('y2', p => 20 + p[1].y * 40);
    // lines.exit().remove();
            

    var circles = unitsG.selectAll('circle')
        .data(unitsList, d => d.id );
        
    circles
        .enter()
            .append('circle')
            .attr('r', 4)
            .style('fill', u => u.color)
        .merge(circles)
            .attr('cx', u => 20 + state.map.getIn([u.land,'position','x']) * 40)
            .attr('cy', u => 20 + state.map.getIn([u.land,'position','y']) * 40);

    circles.exit().remove();

}

export { render }