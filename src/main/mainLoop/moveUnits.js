import { g, movingUnits } from '../../main.js'
import { removeItem } from '../../functions.js'

const moveSpeed = 8
let moved = false

export const moveUnits = () => {
  if (movingUnits.length > 0) {
    if (!moved) {
      moved = true
      movingUnits.forEach(unit => {
        if (unit.isMoving) unit.move()
        else removeItem(movingUnits, unit)
      })
      g.wait(moveSpeed, () => moved = false)
    }
  }
}