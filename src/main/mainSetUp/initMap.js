import { checkNeighbors, directions, randomNum } from '../../functions.js'
import { surfaceLine, moonHole, makeHQ, makeMine } from '../../drawings.js'
import { cellSize, solids, surfaceHeight, surfaceWidth} from '../../main.js'
import { floorLayer } from './initLayers.js'
import { turret } from '../../unitObject.js'

let mine, HQ, gridMap = []

const initMap = () => {

  const rows = (surfaceHeight / cellSize) | 0
  const cols = (surfaceWidth / cellSize) | 0

  for (let i = 0; i < rows; i++) {
    gridMap[i] = Array(cols).fill(0)
  }

  const hqrow = 1
  const hqcol = cols / 2

  const mRow = 4
  const mCol = 12

  gridMap[mRow][mCol] = 5
  gridMap[hqrow][hqcol] = 5
  
  directions.forEach(d => {
    try {
      gridMap[hqrow + d[0]][hqcol + d[1]] = 5
    } catch (e) {}
  })


  const tr = 2
  const tc = 11
  gridMap[tr][tc] = 4
  
  
  for (let row = 0; row < rows; row++) {
    for (let cel = 0; cel < cols; cel++) {
      if (row % 2 == 1) {
        if (Math.random() < 0.5) surfaceLine(randomNum(10, 170, 1), 10, cel * cellSize, row * cellSize + randomNum(-cellSize, cellSize, 1), randomNum(1, 4), randomNum(0, 5, 1))

        if (Math.random() < 0.2) {
          if (cel % 2 == 0) {
            if (gridMap[row][cel] === 0 && checkNeighbors(gridMap, row,cel)) {
              gridMap[row][cel] = 4
              const d = randomNum(10, cellSize * 0.4)
              moonHole(d, cel * cellSize + d, row * cellSize + d)
            }
          }
        }
      }

    }
  }


  turret(tc, tr)

  HQ = makeHQ(cellSize * hqcol , cellSize * hqrow, cellSize)
  floorLayer.addChild(HQ)
  solids.push(HQ)

  mine = makeMine(cellSize * mCol, cellSize * mRow, cellSize)
  floorLayer.addChild(mine)
  solids.push(mine)
}

export {
  initMap,
  gridMap,
  HQ,
  mine
}