function addUnit (id, color, land) {
  return {
    type: 'ADD_UNIT',
    id: id,
    color: color,
    land: land
  }
}

function moveUnit (id, land) {
  return {
    type: 'MOVE_UNIT',
    id: id,
    land: land
  }
}

function attackUnit (id, fromUnit, toUnit) {
  return {
    type: 'ATTACK_UNIT',
    power: 50,
    fromUnit: fromUnit,
    toUnit: toUnit
  }
}

module.exports = {
  addUnit: addUnit,
  moveUnit: moveUnit
}
