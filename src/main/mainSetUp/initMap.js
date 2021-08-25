import { randomNum, setCellValue } from '../../functions.js'
import { surfaceLine, moonHole, makeHQ } from '../../drawings.js'
import { solids} from '../../main.js'
import { floorLayer } from './initLayers.js'

let HQ, gridMap = []

const initMap = (surfaceWidth, surfaceHeight, cellSize) => {

  const rows = Math.floor(surfaceHeight / cellSize)
  const cols = Math.floor(surfaceWidth / cellSize)

  for (let i = 0; i < rows; i++) {
    gridMap[i] = Array(cols).fill(0)
  }

  const hqrow = 1
  const hqcol = cols / 2


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
          surfaceLine(randomNum(10, 170, 0), 10, cel * cellSize, row * cellSize + randomNum(-cellSize, cellSize), randomNum(1, 4), randomNum(0, 5, 0))
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
}

export {
  initMap,
  gridMap,
  HQ
}