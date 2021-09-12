import { g, currentAction, CELLSIZE } from "../../main.js"
import { gridMap } from "../mainSetUp/initMap.js"
import { canBuildHere } from '../../functions.js'
import { currentGold, PRICES } from "../mainSetUp/initBottomPanel.js"
import { makeBluePrint } from "../../drawings.js"

export let bluePrint
let oldCol = -1, oldRow = -1
let bluePrintMoved = false

export const initBluePrint = () => {
  bluePrint = makeBluePrint(CELLSIZE)
}


export const showBluePrint = () => {
  if (currentAction.placingBuilding) {
    const col = ((g.pointer.shiftedX) / CELLSIZE) | 0
    const row = ((g.pointer.shiftedY) / CELLSIZE) | 0
    if (col != oldCol) {
      bluePrint.x = CELLSIZE * (col - .5)
      oldCol = col
      bluePrintMoved = true
    }
    if (row != oldRow) {
      bluePrint.y = CELLSIZE * (row - .5)
      oldRow = row
      bluePrintMoved = true
    }
    if (bluePrintMoved) {
      bluePrintMoved = false
      if (row < 0) {
        bluePrint.f = '#F00'
        return
      }
      if (canBuildHere(gridMap, row, col) && currentGold >= PRICES[2]) bluePrint.f = '#FFF'
      else bluePrint.f = '#F00'
    }
  }
}