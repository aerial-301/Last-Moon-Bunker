import { g, currentAction, cellSize, bluePrint } from "../../main.js"
import { gridMap } from "../mainSetUp/initMap.js"
import { canBuildHere } from '../../functions.js'

let oldCol = -1, oldRow = -1
let bluePrintMoved = false

export const showBluePrint = () => {
  if (currentAction.placingBuilding) {
    const col = Math.floor((g.pointer.shiftedX) / cellSize)
    const row = Math.floor((g.pointer.shiftedY) / cellSize)
    if (col != oldCol) {
      bluePrint.x = col * cellSize - cellSize / 2
      oldCol = col
      bluePrintMoved = true
    }
    if (row != oldRow) {
      bluePrint.y = row * cellSize - cellSize / 2
      oldRow = row
      bluePrintMoved = true
    }
    if (bluePrintMoved) {
      bluePrintMoved = false
      if (row < 0) {
        bluePrint.f = '#F00'
        return
      }
      if (canBuildHere(gridMap, row, col)) bluePrint.f = '#FFF'
      else bluePrint.f = '#F00'
    }
  }
}