import * as unitActions from '../gameStore/actions/units'

// var state = {
//   selectedPosition: '3#4', // position id
//   selectedUnit: "id",
// }


function getAvailableToMoveTo (position, unit, gameState) {
  var available = []
  var visited = []
  var queue = []
  queue.unshift(
    [gameState.map.get(position), 0]
  )

  function visit (land, distance) {
    if (distance > 3 || visited.indexOf(land.get('id')) !== -1) {
      return
    }
    visited.push(land.get('id'))
    if (land.get('landType') === 'dirt') {
      available.push(land.get('id'))
      land.get('links').forEach(function (position) {
        var land = gameState.map.get(position)
        if (land) {
          queue.unshift([land, distance + 1])
        }
      })
    }
  }

  while (queue.length > 0) {
    visit.apply(this, queue.pop())
  }
  return available
}


function getAvailableToAttackTo (position, unit, gameState) {
  var available = []
  var visited = []
  var queue = []
  queue.unshift(
    [gameState.map.get(position), 0]
  )

  function visit (land, distance) {
    if (distance > 1 || visited.indexOf(land.get('id')) !== -1) {
      return
    }
    visited.push(land.get('id'))
    available.push(land.get('id'))
    land.get('links').forEach(function (position) {
      var land = gameState.map.get(position)
      if (land) {
        queue.unshift([land, distance + 1])
      }
    })
  }

  while (queue.length > 0) {
    visit.apply(this, queue.pop())
  }

  return available
}





class ClientCore {
  constructor (gameStore) {
    this.gameStore = gameStore
    this.selectedPosition = undefined
    this.selectedUnit = undefined
    // should be empty if no unit is selected
    this.availableToMoveTo = []
    this.availableToAttackTo = []
  }

  get gameState () {
    return this.gameStore.getState()
  }

  clickPosition (position) {
    var unit = this.gameState.units.find(function (value, key) {
      return value.get('land') === position
    })
    var isAvailableToMoveTo = this.availableToMoveTo.indexOf(position) !== -1
    var isAvailableToAttackTo = this.availableToAttackTo.indexOf(position) !== -1
    if (this.selectedPosition) {

      if (isAvailableToMoveTo && !unit) {
        this.moveTo(position)
      } else if (unit && isAvailableToAttackTo) {
        this.attackTo()
      } else if (unit) {
        this.unselectPosition()
      } else {
        this.unselectPosition()
      }
    } else if (unit) {
      this.selectPosition(position, unit.toJS())
    }
  }

  selectPosition (position, unit) {
    this.selectedPosition = position
    this.selectedUnit = unit.id
    this.availableToMoveTo = getAvailableToMoveTo(
      position,
      unit,
      this.gameState
    )
    this.availableToAttackTo = getAvailableToAttackTo(
      position,
      unit,
      this.gameState
    )
  }

  unselectPosition () {
    this.selectedPosition = undefined
    this.selectedUnit = undefined
    this.availableToMoveTo = []
    this.availableToAttackTo = []
  }

  moveTo (position) {
    console.log(this.selectedUnit, position)
    this.gameStore.dispatchClient(
      unitActions.moveUnit(this.selectedUnit, position)
    )
    this.unselectPosition()
  }
  attackTo (position) {
    console.log("ATTACK")
  }
}

export default ClientCore
