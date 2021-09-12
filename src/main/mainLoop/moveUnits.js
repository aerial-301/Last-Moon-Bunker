import { g } from '../../main.js'
import { removeItem, setDirection } from '../../functions.js'
import { world } from '../mainSetUp/initLayers.js'

const MOVE_DELAY = 10
let moved = false
export let movingUnits = []

export const moveUnits = () => {
  if (movingUnits.length > 0) {
    if (!moved) {
      moved = true
      movingUnits.forEach(unit => {
        if (unit.isSeeking) {
          unit.destinationX = unit.goal.centerX - world.x
          unit.destinationY = unit.goal.centerY - world.y
          setDirection(unit)
        }
        if (unit.isMoving) unit.move()
        else {
          removeItem(movingUnits, unit)
          unit.scanForTargets(unit.targets)
        }
      })
      g.wait(MOVE_DELAY, () => moved = false)
    }
  }
}