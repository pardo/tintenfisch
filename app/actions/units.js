function addUnit(id, color, land){
    return {
        type: "ADD_UNIT",
        id: id,
        color: color,
        land: land
    }
}

function moveUnit(id, land){
    return {
        type: "MOVE_UNIT",
        id: id,
        land: land
    }
}

export { addUnit, moveUnit }