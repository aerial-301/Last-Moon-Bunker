import { checkNeighbors, DIRECTIONS, randomNum } from '../../functions.js'
import { surfaceLine, moonHole, makeHQ, makeMine } from '../../drawings.js'
import { CELLSIZE, SURFACE_HEIGHT, SURFACE_WIDTH} from '../../main.js'
import { floorLayer } from './initLayers.js'
import { solids, turret } from '../../objects.js'

let mine, HQ, gridMap = []

const initMap = () => {

  const rows = (SURFACE_HEIGHT / CELLSIZE) | 0
  const cols = (SURFACE_WIDTH / CELLSIZE) | 0

  for (let i = 0; i < rows; i++) {
    gridMap[i] = Array(cols).fill(0)
  }

  const hqrow = 1
  const hqcol = cols / 2

  const mRow = 4
  const mCol = 12

  gridMap[mRow][mCol] = 5
  gridMap[hqrow][hqcol] = 5
  
  DIRECTIONS.forEach(d => {
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
        if (Math.random() < 0.5) surfaceLine(randomNum(10, 170, 1), 10, cel * CELLSIZE, row * CELLSIZE + randomNum(-CELLSIZE, CELLSIZE, 1), randomNum(1, 4), randomNum(0, 5, 1))

        if (Math.random() < 0.2) {
          if (cel % 2 == 0) {
            if (gridMap[row][cel] === 0 && checkNeighbors(gridMap, row,cel)) {
              gridMap[row][cel] = 4
              const diameter = randomNum(10, CELLSIZE * 0.4)
              moonHole(diameter, cel * CELLSIZE + diameter, row * CELLSIZE + diameter)
            }
          }
        }
      }

    }
  }


  turret(tc, tr)

  HQ = makeHQ(CELLSIZE * hqcol , CELLSIZE * hqrow, CELLSIZE)
  floorLayer.addChild(HQ)
  solids.push(HQ)

  mine = makeMine(CELLSIZE * mCol, CELLSIZE * mRow, CELLSIZE)
  floorLayer.addChild(mine)
  solids.push(mine)
}

export {
  initMap,
  gridMap,
  HQ,
  mine
}