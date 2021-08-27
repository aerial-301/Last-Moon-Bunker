import { randomNum, setCellValue } from '../../functions.js'
import { surfaceLine, moonHole, makeHQ, makeMine } from '../../drawings.js'
import { solids} from '../../main.js'
import { floorLayer } from './initLayers.js'
import { debugShape } from '../../debug.js'

let mine, HQ, gridMap = []

const initMap = (surfaceWidth, surfaceHeight, cellSize) => {

  const rows = (surfaceHeight / cellSize) | 0
  const cols = (surfaceWidth / cellSize) | 0

  for (let i = 0; i < rows; i++) {
    gridMap[i] = Array(cols).fill(0)
  }

  const hqrow = 1
  const hqcol = cols / 2

  const mRow = 4
  const mCol = 6

  gridMap[mRow][mCol] = 5
  setCellValue(gridMap, mRow, mCol, 3)

  gridMap[hqrow][hqcol] = 5
  setCellValue(gridMap, hqrow, hqcol, 3)


  for (let row = 0; row < rows; row++) {
    for (let cel = 0; cel < cols; cel++) {
      // const cellCenterX = cellSize * cel + cellSize / 2
      // const cellCenterY = cellSize * row + cellSize / 2

      // const empty = makeRectangle(cellSize, cellSize, '#321', 2, cellCenterX - cellSize / 2, cellCenterY - cellSize / 2)
      // empty.alpha = 0.4
      // floorLayer.addChild(empty)

      if (row % 2 == 1) {
        if (Math.random() < 0.5) {
          surfaceLine(randomNum(10, 170, 1), 10, cel * cellSize, row * cellSize + randomNum(-cellSize, cellSize, 1), randomNum(1, 4), randomNum(0, 5, 1))
        }

        if (Math.random() < 0.3) {
          if (cel % 2 == 0) {
            if (gridMap[row][cel] === 0) {
              gridMap[row][cel] = 4
              setCellValue(gridMap, row, cel, 3)
              const d = randomNum(5, cellSize * 0.25)
              moonHole(d, cel * cellSize + d, row * cellSize + d)
            }
          }
        }
      }

    }
  }

  HQ = makeHQ(cellSize * hqcol , cellSize * hqrow, cellSize)
  floorLayer.addChild(HQ)
  solids.push(HQ)



  mine = makeMine(cellSize * mCol, cellSize * mRow, cellSize)
  floorLayer.addChild(mine)
  solids.push(mine)

  // debugShape(mine)
}

export {
  initMap,
  gridMap,
  HQ,
  mine
}