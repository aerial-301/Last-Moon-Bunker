
import { randomNum } from "../functions.js"

const addVectors = (v1, v2) => {
  return [v1[0] + v2[0], v1[1] + v2[1]]
}

class Maze {
  maze: any[]
  width: number
  height: number
  constructor () {
    this.maze = []
  }

  generateMaze (width: number, height: number) {
    this.width = width % 2 === 0 ? width + 1 : width
    this.height = height % 2 === 0 ? height + 1 : height

    const DIRECTIONS = [
      [0, -2],
      [0, 2],
      [2, 0],
      [-2, 0]
    ]

    const stack = []
    const unvisited = []

    let currentCell: [number, number]
    let nextCell: [number, number]
    let neighbors: any[]
    let exitCell: [number, number]
    let stackMaxLength: number = 0

    for (let row = 0; row < this.height; row++) {
      this.maze.push([])
      for (let col = 0; col < this.width; col++) {
        if (row % 2 === 0 && col % 2 === 0) {
          unvisited.push([row, col])
        }
        this.maze[row].push(0)
      }
    }

    const unvisitedL = unvisited.length
    currentCell = unvisited[randomNum(0, unvisitedL)]
    stack.push(currentCell)
    this.maze[currentCell[0]][currentCell[1]] = 7

    while (stack.length > 0) {
      neighbors = []
      for (const direction of DIRECTIONS) {
        const n = addVectors(currentCell, direction)
        if (n[0] >= 0 && n[0] < this.height && n[1] >= 0 && n[1] < this.width) {
          if (this.maze[n[0]][n[1]] === 0) {
            neighbors.push(n)
          }
        }
      }

      if (neighbors.length === 0) {
        currentCell = stack.pop()
        continue
      }

      nextCell = neighbors[randomNum(0, neighbors.length)]
      this.maze[nextCell[0]][nextCell[1]] = 1
      this.maze[(nextCell[0] + currentCell[0]) / 2][(nextCell[1] + currentCell[1]) / 2] = 1

      currentCell = nextCell
      stack.push(currentCell)

      if (stack.length > stackMaxLength) {
        stackMaxLength = stack.length
        exitCell = currentCell
      }
    }

    this.maze[exitCell[0]][exitCell[1]] = 3

    for (const i in this.maze) {
      this.maze[i].unshift(0)
      this.maze[i].push(0)
    }

    const a = Array(this.width + 2).fill(0)
    this.maze.unshift(a)
    this.maze.push(a)

    // for(const i of this.maze) console.log(i)
  }
}



export { Maze }