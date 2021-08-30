import { g, currentAction, cellSize } from "../../main.js"
import { gridMap } from "../mainSetUp/initMap.js"
import { canBuildHere } from '../../functions.js'
import { currentGold, prices } from "../mainSetUp/initBottomPanel.js"
import { makeBluePrint } from "../../drawings.js"

export let bluePrint
let oldCol = -1, oldRow = -1
let bluePrintMoved = false

export const initBluePrint = () => {
  bluePrint = makeBluePrint(cellSize)
}


export const showBluePrint = () => {
  if (currentAction.placingBuilding) {
    const col = ((g.pointer.shiftedX) / cellSize) | 0
    const row = ((g.pointer.shiftedY) / cellSize) | 0
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
      if (canBuildHere(gridMap, row, col) && currentGold >= prices[2]) bluePrint.f = '#FFF'
      else bluePrint.f = '#F00'
    }
  }
}