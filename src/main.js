import { randomNum, removeItem, tempAngle } from './functions.js'
import { moveCamera, movePlayer } from './keyboard.js'
import { createSelectionBox, beginSelection, pointerDown, pointerUp } from './mouse.js'
import { centerCam, moveMazeCamera } from './camera.js'
import { mainPlayer, makeEnemy, makeText, newVillager } from './unitObject.js'
import { makeRectangle, makeCircle, HQ, moonGround, laser } from './drawings.js'
import { moveSpeed } from './keyboard.js'
import { GA } from './ga_minTest.js'
import { tempDrawing, tempEarth, tempDrawing_2, gun } from '../extra/Drawing-Test.js'
import { tempIndicator } from '../extra/debug.js'

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
let units = []
let armedUnits = []
let selectedUnits = []
let movingUnits = []
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


let readyToScan = true
let currentScanner = -1
// ////////////////////////////////////////////////////////////////////////////////////////////////////////
const canvasSetup = () => {
    if (c)
        return
    c = document.getElementById('c')
    c.addEventListener('contextmenu', (e) => e.preventDefault())
    c.addEventListener('pointerdown', (e) => pointerDown(e))
    c.addEventListener('pointerup', (e) => pointerUp(e))
}

const moveUnits = () => {
  if (movingUnits.length > 0) {
    if (!moved) {
      moved = true
      // for (let i in movingUnits) {
      movingUnits.forEach(unit => {
        if (unit.isMoving) unit.move()
        else {
          removeItem(movingUnits, unit)
        }
      })
      g.wait(moveSpeed, () => moved = false)
    }
  }
}

const scanForEnemies = () => {
  if (readyToScan) {
    readyToScan = false


    armedUnits.forEach(unit => {
      if (!unit.target) {
        enemies.forEach(enemy => {
          if (g.gDistance(unit, enemy) < 300) {
            unit.target = enemy
            attackingTarget.push(unit)
          }
        })
      }
    })
  


    g.wait(3000, () => readyToScan = true)


  }
}




const moveEnemies = () => {
    if (!moveCycle) {
        moveCycle = true
        g.wait(2500, () => {
            for (const enemy of enemies) {
                if (enemy.readyToMove) {
                    if (Math.random() <= 0.075)
                        continue
                    const cell = Math.floor(enemy.x / cellWidth)
                    const row = Math.floor(enemy.y / cellHeight)
                    let vertical = 1
                    let direction = 1
                    if (Math.random() >= 0.5)
                        direction = -1
                    if (Math.random() >= 0.5)
                        vertical = 0
                    let i = 0
                    let gamma
                    while (i <= 10) {
                        i++
                        gamma = i * direction
                        if (maze.grid[row + gamma * vertical][cell + gamma * Math.pow(0, vertical)] != 0)
                            continue
                        break
                    }
                    if (i == 1)
                        continue
                    enemy.destinationX = (cell + (gamma - direction) * Math.pow(0, vertical)) * cellWidth + randomNum(5, cellWidth - enemy.width - 5)
                    enemy.destinationY = (row + (gamma - direction) * vertical) * cellHeight + randomNum(5, cellHeight - enemy.height - 5)
                    // tempIndicator(enemy.destinationX, enemy.destinationY)
                    const mag = Math.sqrt(Math.pow((enemy.destinationX - enemy.x), 2) + Math.pow((enemy.destinationY - enemy.y), 2))
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
  units.forEach(u => {
    // if (!u.attacked && !u.attacked2) {
    if (u.isMoving) u.moveAnimation()
    else u.idleAnimation()
    // }
  })
}
const switchMode = () => {
    if (!MK) {
        if (selectedUnits.length === 1) {
            MK = true
            currentPlayer = selectedUnits[0]
            currentPlayer.isMoving = false
            removeItem(movingUnits, currentPlayer)
            removeItem(attackingTarget, currentPlayer)
            currentPlayer.deselect()
            selectedUnits = []
        }
    }
    else {
        if (currentPlayer) {
            MK = false
            currentPlayer.isMoving = false
            currentPlayer.weapon.rotation = currentPlayer.weaponRotation
            currentPlayer = null
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
  }
  else {
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
      if (unit.target && !unit.target.isDead) {
        unit.attack(unit.target)
      }
      else {
        removeItem(attackingTarget, unit)
        unit.target = null
        unit.weapon.rotation = unit.weaponRotation
      }
    })
  }

  scanForEnemies()


    // if (moveSun) {
    //   moveSun = false
    //   sun.x += 0.8
    //   sun.y += 0.15
    //   g.wait(100, () => moveSun = true)
    // }
    // debugText.content = `
    // world.xy = ${world.x}, ${world.y}\n\n
    // pointer = ${g.pointer.x + world.x}, ${g.pointer.y + world.y}
    // `
    // if( selectedUnits.length > 0) {
    //   current = selectedUnits[0]
    //   if (current.collidedWith) {
    //     console.log(`
    //     destX - obstCX = ${Math.abs(current.destinationX + world.x - current.collidedWith.centerX)}\n
    //     destY - obstCY = ${Math.abs(current.destinationY + world.y - current.collidedWith.centerY)}\n
    //     `)
    //   }
    // }
    
}
let current


let ground
let gridMap = []
let cellSize
let sun, earth
const surfaceWidth = 2400
const surfaceHeight = 1000
const setup = () => {
  canvasSetup()
  floorLayer = g.group()
  objLayer = g.group()
  sun = makeCircle(130, 'orange', 0, false, 500, -250)
  earth = tempEarth(150, 260, -200)

  // ground = makeRectangle(surfaceWidth, surfaceHeight, '#555')
  ground = moonGround()


  world = g.group(sun, earth, ground, floorLayer, objLayer)
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
          if (cell < 12) {
            if (row == 0 && cell == 10) {
              gridMap[row].push([7, cellCenterX, cellCenterY])
              // const tempHQ = HQ(400, 380)
              const empty = makeRectangle(cellSize, cellSize, '#321', 2, cellCenterX - cellSize / 2, cellCenterY - cellSize / 2)
              floorLayer.addChild(empty)
              const tempHQ = HQ(cell * cellSize, row * cellSize)
              objLayer.addChild(tempHQ)
              solids.push(tempHQ)
              empty.alpha = 0.5
              continue
            }
          }
        }
      } else {

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
  }


  player = mainPlayer(300, 300)
  objLayer.addChild(player)
  playerUnits.push(player)
  units.push(player)

  for (let i = 0; i < 4; i++) {
    const tempVill = newVillager(300, 400 + i * 55, true)
    objLayer.addChild(tempVill)
    playerUnits.push(tempVill)
    units.push(tempVill)
    armedUnits.push(tempVill)
  }



  for (let i = 0; i < 4; i++) {
    const tempEnemy = makeEnemy(800 + i * 50, 350)
    objLayer.addChild(tempEnemy)
    units.push(tempEnemy)
    enemies.push(tempEnemy)
    armedUnits.push(tempEnemy)
    // console.log(tempEnemy)
    // tempEnemy.speed = 2
  }


  const laser1 = laser(0, 0, 100, 100)
  world.addChild(laser1)







  createSelectionBox()
  debugText = makeText(' ', '12px arial', 'white', 0, 100)
  objLayer.children.sort((a, b) => (a.Y + a.height) - (b.Y + b.height))
  centerCam()
  g.state = play
}
g = GA.create(setup)
g.start()
export { g, world, floorLayer, uiLayer, objLayer, units, enemies, alertedEnemies, shots, selectedUnits, movingUnits, solids, playerUnits, 
// player,
C, bloods, bloodSplats, maze, gridMap, cellSize, PI, surfaceWidth, surfaceHeight, switchMode, MK, currentPlayer, attackingTarget, }
