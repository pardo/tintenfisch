function addLand (id, color, position, ltype, links = {}) {
  return {
    type: 'ADD_LAND',
    color: color,
    position: position,
    id: id,
    links: links,
    landType: ltype
  }
}

function changeColor (id, color) {
  return {
    type: 'CHANGE_COLOR_LAND',
    id: id,
    color: color
  }
}

function addLink (id1, id2) {
  return {
    type: 'ADD_LINK',
    id1: id1,
    id2: id2
  }
}

export {addLand, addLink, changeColor}
