function addLand (id, color, position) {
    return {
        type: "ADD_LAND",
        color: color,
        position: position,
        id: id
    }
}

function addLink (id1, id2) {
    return {
        type: "ADD_LINK",
        id1: id1,
        id2: id2
    }
}

export {addLand, addLink}