import { randomNum, removeItem, globalAngle, getDistance, tempAngle } from './functions.js'
import { moveCamera, movePlayer, resetPointerOffsets, setPointerOffsets } from './keyboard.js'
import { createSelectionBox, beginSelection, pointerDown, pointerUp } from './mouse.js'
import { centerCam, moveMazeCamera } from './camera.js'
import { mainPlayer, makeEnemy, makeGeneralObject, makeText, moreProperties, newVillager } from './unitObject.js'
import { makeRectangle, makeCircle, shotHit, flash, actionMark } from './drawings.js'
import { GA } from './ga_minTest.js'
import { debugShape, tempIndicator} from '../extra/debug.js'
import { tempDrawing, tempEarth, tempDrawing_2, gun } from '../extra/Drawing-Test.js'

const RAD_DEG = Math.PI / 180
const initialAngle = -60

const PI = Math.PI

const C = {
  P2: 360,
  TREEBASEHEIGHT: 20,
  hitAreaDiameter: 180,
  idleSwordAngle: RAD_DEG * initialAngle,
  attackSwordAngle: RAD_DEG * (initialAngle + 120),
  SPLATGROW: 0.54,
}

let currentPlayer
let player
let MK = false




let c
let playerUnits = []
let mazeEntrance
let maze
let g
let world, uiLayer, floorLayer, objLayer, treeTops
let debugText
let units: any[] = []
let selectedUnits: any[] = []
let movingUnits: any[] = []
let solids = []
let enemies = []
let alertedEnemies = []
let movingEnemies = []
let bloods = []
let bloodSplats = []
let shots = []
let attackingTarget = []


let moved = false
let moveCycle = false

// ////////////////////////////////////////////////////////////////////////////////////////////////////////

const canvasSetup = () => {
  if (c) return
  c = document.getElementById('c')
  c.addEventListener('contextmenu', (e) => e.preventDefault())
  c.addEventListener('pointerdown', (e) => pointerDown(e))
  c.addEventListener('pointerup', (e) => pointerUp(e))
}

const moveUnits = () => {
  if (movingUnits.length > 0) {
    if(!moved) {
      moved = true
      
      for (let i in movingUnits) {
        movingUnits[i].move()
        // const u = movingUnits[i]
        // if (u) tempIndicator(u.destinationX, u.destinationY, 9, 'orange')
      }

      objLayer.children.sort((a, b) =>  (a.Y + a.height) - (b.Y + b.height))
      g.wait(10, () => {moved = false})
    }
  }
}

const moveEnemies = () => {
  if (!moveCycle) {
    moveCycle = true
    g.wait(2500, () => {
      for (const enemy of enemies) {
        if (enemy.readyToMove) {
          if (Math.random() <= 0.075) continue
          const cell = Math.floor(enemy.x / cellWidth)
          const row = Math.floor(enemy.y / cellHeight)
          let vertical = 1
          let direction = 1
          if (Math.random() >= 0.5) direction = -1
          if (Math.random() >= 0.5) vertical = 0

          let i = 0
          let gamma
          while (i <= 10) {
            i++
            gamma = i * direction
            if (maze.grid[row + gamma * vertical][cell + gamma * 0 ** vertical] != 0) continue
            break
          }
          if (i == 1) continue
          enemy.destinationX = (cell + (gamma - direction) * 0 ** vertical) * cellWidth + randomNum(5, cellWidth - enemy.width - 5)
          enemy.destinationY = (row + (gamma - direction) * vertical) * cellHeight + randomNum(5, cellHeight - enemy.height - 5)

          // tempIndicator(enemy.destinationX, enemy.destinationY)
          const mag = Math.sqrt((enemy.destinationX - enemy.x) ** 2 + (enemy.destinationY - enemy.y) ** 2)
          enemy.vx = (enemy.destinationX - enemy.x) / mag
          enemy.vy = (enemy.destinationY - enemy.y) / mag
          enemy.readyToMove = false
          enemy.isMoving = true
          enemy.steps = 500
          movingEnemies.push(enemy)
        }
      }
      if (enemies.length > 0) {
        moveCycle = false
      }
    })
  }
}

const animatePlayer = () => {
  for (const u of units) {
    if (!u.attacked && !u.attacked2) {
      if (u.isMoving) {
        u.moveAnimation()
      } else {
        u.idleAnimation()
      }
    }
  }
}


const switchMode = () => {
  if (!MK) {
    if (selectedUnits.length === 1) {
      MK = true
      // setPointerOffsets()
      currentPlayer = selectedUnits[0]
      currentPlayer.isMoving = false
      removeItem(movingUnits, currentPlayer)
      currentPlayer.deselect()
      selectedUnits = []
    } 
    
  } else {
    if (currentPlayer) {
      MK = false
      currentPlayer.isMoving = false
      currentPlayer.weapon.rotation = currentPlayer.weaponRotation
      currentPlayer = null
      // setPointerOffsets()
      setPointerOffsets()
    }
  }
  
}


const play = () => {
  
  moveUnits()
  animatePlayer()
  
  if (MK) {
    moveMazeCamera()

    if (!currentPlayer.attacked) {
      if (!currentPlayer.attacked2) {
        if (!currentPlayer.isRolling) {
          movePlayer()
          // currentPlayer.weapon.rotation = -globalAngle(currentPlayer.playerHand, g.pointer) + currentPlayer.weaponAngle
          currentPlayer.weapon.rotation = -tempAngle(currentPlayer.playerHand, g.pointer, currentPlayer.angleOffX, currentPlayer.angleOffY) + currentPlayer.weaponAngle
            // debugText.content = `
            // a = ${currentPlayer.playerHand.centerX}  ${currentPlayer.playerHand.centerY}
            // b = ${g.pointer.centerX}  ${g.pointer.centerY}
            // `


          // player.swordHandle.rotation = -globalAngle(player.playerHand, g.pointer) + C.idleSwordAngle
          // tempVill.gun.rotation = -globalAngle(tempVill.playerHand, g.pointer)
        }
      }
    }
    
  } else {
    beginSelection()
    moveCamera()
  }

  if (shots.length > 0) {
    shots.forEach(shot => {
      shot.scaleX += 0.1
      shot.scaleY += 0.1
    })
  }


  if (attackingTarget.length > 0) {
    attackingTarget.forEach(unit => {
      if (!unit.attacked) {
        if (unit.target) unit.attack(unit.target)
        else {
          removeItem(attackingTarget, unit)
          unit.weapon.rotation = -0.2
        }
      }
    })
  }


  // if (moveSun) {
  //   moveSun = false
  //   sun.x += 0.8
  //   sun.y += 0.15

  //   g.wait(100, () => moveSun = true)
  // }

  // debugText.content = `
  // p.vx = ${player.vx.toFixed(4)}
  // p.vy = ${player.vy.toFixed(4)}
  // CH = ${player.isCollidingH}
  // CV = ${player.isCollidingV}
  // `
}

let ground
let gridMap = []
let cellSize
let sun, earth

const surfaceWidth = 2400 
const surfaceHeight = 1000

const setup = () => {

  canvasSetup()
  resetPointerOffsets()
  floorLayer = g.group()
  objLayer = g.group()
  treeTops = g.group()
  sun = makeCircle(130, 'orange', 0, false, 500, -250)
  earth = tempEarth(150, 260, -200)

  ground = makeRectangle(surfaceWidth, surfaceHeight, '#555')
  world = g.group(sun, earth, ground, floorLayer, objLayer, treeTops)
  uiLayer = g.group()

  let maxPlayerUnits = 4
  cellSize = 100
  const rows = ground.height / cellSize
  const cols = ground.width / cellSize



  // Map Objects
  for (let row = 0; row < rows; row++) {
    gridMap.push([])
    for (let cell = 0; cell < cols; cell++) {
      const cellCenterX = cellSize * cell + cellSize / 2
      const cellCenterY = cellSize * row + cellSize / 2
      if (row < 2) {
        if (cell > 8) {
          if (cell < 12){
            if ( row == 0 && cell == 10) {
              gridMap[row].push([7, cellCenterX, cellCenterY])
              const empty = makeRectangle(cellSize, cellSize, '#321', 2, cellCenterX - cellSize / 2, cellCenterY - cellSize / 2)
              floorLayer.addChild(empty)
              empty.alpha = 1
              continue
            }
          }
        }
      }
      if (Math.random() <= 0.20) {
        gridMap[row].push([0, cellCenterX, cellCenterY])
        // const empty = makeRectangle(cellSize, cellSize, '#321', 2, cellCenterX - cellSize / 2, cellCenterY - cellSize / 2)
        // floorLayer.addChild(empty)
        if (Math.random() <= 0.2) {
          if (maxPlayerUnits) {
            const v = newVillager(cellCenterX - 25, cellCenterX - 25)
            objLayer.addChild(v)
            playerUnits.push(v)
            units.push(v)
            v.speed = 2
            maxPlayerUnits -= 1
          }
        }
      } else {
        if (row % 2 == 1) {
          if (Math.random() > 0.5) {
            tempDrawing_2(randomNum(10, 170, 0), 10, cell * cellSize, row * cellSize + randomNum(-100, 100), randomNum(1, 4), randomNum(0, 5, 0))
            continue
          }
          if (cell % 2 == 0) {
            gridMap[row].push([3, cellCenterX, cellCenterY])
            const d = randomNum(5, cellSize * 0.25)
            tempDrawing(d, cell * cellSize + d * 1.5 + randomNum(-35, 35), row * cellSize + d * 1.5 + randomNum(-35, 35))
          }
        } 
      }
      


    }

  }


  // Create the main player unit
  // player = mainPlayer(100, 200)
  player = mainPlayer(300, 300)
  objLayer.addChild(player)
  playerUnits.push(player)
  units.push(player)
  player.speed = 2

  const tempVill = newVillager(300, 400, true)
  objLayer.addChild(tempVill)
  playerUnits.push(tempVill)
  units.push(tempVill)
  tempVill.speed = 2


  const tempEnemy = makeEnemy(400, 300)
  objLayer.addChild(tempEnemy)
  units.push(tempEnemy)
  enemies.push(tempEnemy)
  tempEnemy.speed = 2

  // const tempMark = actionMark(400, 300)
  // objLayer.addChild(tempMark)



  // debugShape(tempEnemy)



  createSelectionBox()
  debugText = makeText(' ', '22px arial', 'white', 20, 100)
  objLayer.children.sort((a, b) =>  (a.Y + a.height) - (b.Y + b.height))

  centerCam()

  g.state = play
}

g = GA.create(setup)
g.start()

export { 
  g, 
  world,
  floorLayer,
  uiLayer,
  objLayer,
  units,
  enemies,
  alertedEnemies,
  shots,
  selectedUnits, 
  movingUnits,
  solids,
  playerUnits,
  // player,
  C,
  bloods,
  bloodSplats,
  maze,
  gridMap,
  cellSize,
  PI,
  surfaceWidth,
  surfaceHeight,
  switchMode,
  MK,
  currentPlayer,
  attackingTarget,
}