import { objLayer, floorLayer, solids, enemies } from '../main.js'
import { Maze } from './mazeGen.js'
import { randomNum } from '../functions.js'
import { makeEnemy } from '../enemyObject.js'
import { makeRectangle } from '../drawings.js'

let theStart: any, theExit: any
let cellWidth
let cellHeight

const createFromMaze = () => {
  const maze = new Maze()
  const W = randomNum(3, 5)
  const H = randomNum(3, 5)

  maze.generateMaze(W, H)
  cellWidth = 160
  cellHeight = 160

  for (const row in maze.maze) {
    if (row === '0' || row == maze.height + 1) continue
    for (const cell in maze.maze[row]) {
      if (cell === '0' || cell == maze.width + 1) continue
      if (maze.maze[row][cell] === 0) {
        const someWall = makeRectangle(cellWidth, cellHeight, '#000', 0, cell * cellWidth, row * cellHeight)
        objLayer.addChild(someWall)
        solids.push(someWall)
      } else if (maze.maze[row][cell] === 1) {
        if (Math.random() <= 0.3) {
          const enemy = makeEnemy(cell * cellWidth + cellWidth / 2 - 10, row * cellHeight + cellHeight / 2 - 10)
          objLayer.addChild(enemy)
          enemies.push(enemy)

        }
      } else if (maze.maze[row][cell] === 3) {
        theExit = makeRectangle(cellWidth, cellHeight, 'lightblue', 0, cell * cellWidth, row * cellHeight)
        floorLayer.addChild(theExit)
      } else if (maze.maze[row][cell] === 7) {
        theStart = makeRectangle(cellWidth, cellHeight, 'green', 0, cell * cellWidth, row * cellHeight)
        floorLayer.addChild(theStart)
      }
    }
  }

  const outerWallColor = '#000'

  const topWall = makeRectangle((maze.width + 1) * cellWidth, cellHeight, outerWallColor, 0)
  const rightWall = makeRectangle(cellWidth, (maze.height + 1) * cellHeight, outerWallColor, 0, topWall.x + topWall.width, 0)
  const bottomWall = makeRectangle(topWall.width, cellHeight, outerWallColor, 0, cellWidth, rightWall.y + rightWall.height)
  const leftWall = makeRectangle(cellWidth, rightWall.height, outerWallColor, 0, 0, topWall.y + cellHeight);
  
  [topWall, rightWall, bottomWall, leftWall].forEach(e => objLayer.addChild(e))
  
  return {
    grid: maze.maze,
    width: maze.width,
    height: maze.height,
    theStart: theStart,
    theExit: theExit,
    cellWidth: cellWidth,
    borders: [topWall, rightWall, bottomWall, leftWall]
  }
}

export { 
  createFromMaze,
  cellWidth,
  cellHeight
 }




