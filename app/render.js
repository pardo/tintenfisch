import * as d3 from "d3";


function render(store) {
    var linksList = store.map.links.map(l => [ 
        store.map.land[l[0]].position,
        store.map.land[l[1]].position
    ]);
    linksList = linksList.toJS();

    var landList = Object.keys(store.map.land).map((k) => store.map.land[k]);
    var unitsList = Object.keys(store.units).map((k) => store.units[k]);
    unitsList.map(function(u) {
        u.position = store.map.land[u.land].position;
    });

    function createG(node, name) {
        return node.append('g').attr('class', name)
    }

    var svg = d3.select('svg');
    svg.selectAll("*").remove();

    var circlesG = createG(svg, 'circlesG');
    var linesG = createG(svg, 'linesG');
    var unitsG = createG(svg, 'unitsG');

    var circles = circlesG.selectAll('circle')
        .data(landList, function(d){ return d.id });
        
    circles
        .enter()
            .append('circle')
            .attr('r', 8)
            .style('fill', lp => lp.color)
        .merge(circles)
            .attr('cx', lp => 20 + lp.position.x * 40)
            .attr('cy', lp => 20 + lp.position.y * 40);

    circles.exit().remove();

    var lines = linesG.selectAll('line')
        .data(linksList);

    lines
        .enter()
            .append('line')
        .merge(lines)
            .style('stroke', 'black' )
            .style('stroke-width', 1 )
            .attr('x1', p => 20 + p[0].x * 40)
            .attr('y1', p => 20 + p[0].y * 40)
            .attr('x2', p => 20 + p[1].x * 40)
            .attr('y2', p => 20 + p[1].y * 40);
    lines.exit().remove();
            

    var circles = unitsG.selectAll('circle')
        .data(unitsList, d => d.id );
        
    circles
        .enter()
            .append('circle')
            .attr('r', 4)
            .style('fill', lp => lp.color)
        .merge(circles)
            .attr('cx', lp => 20 + lp.position.x * 40)
            .attr('cy', lp => 20 + lp.position.y * 40);

    circles.exit().remove();

}

export { render }