function addUnit(id, color, land){
    return {
        type: "ADD_UNIT",
        id: id,
        color: color,
        land: land
    }
}

export { addUnit }