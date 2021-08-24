import { randomNum, removeItem, simpleButton, tempAngle } from './functions.js'
import { moveCamera, movePlayer } from './keyboard.js'
import { initSelectionBox, beginSelection, pointerDown, pointerUp } from './mouse.js'
import { initUnitCamera, centerUnitCamera } from './camera.js'
import { makeText, newMainPlayer, createEnemyUnit, createArmedPleb, createPleb } from './unitObject.js'
import { bloodLake, bloodDrop, makeRectangle, makeCircle, makeHQ, moonGround, laser, tempDrawing, tempEarth, tempDrawing_2, gun, turret, makeBluePrint } from './drawings.js'
import { GA } from './ga_minTest.js'
import { debugShape } from './debug.js'
// import { tempIndicator } from '../extra/debug.js'

const moveSpeed = 8

export const currentAction = {
  placingBuilding: false,
}

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

let HQ
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
let buttons = []

let bloodDrops = []
let bloodLakes = []


let moved = false
let moveCycle = false

let readyToScanE = true
let readyToScanP = true
let enemiesScanned = false
let currentScanner = -1
let blackHB, yellowHB, HB

let ground
let gridMap = []
let sun, earth

let bottomPanel
let lowerUI
let upperUI

const surfaceWidth = 2400
const surfaceHeight = 1000
const cellSize = 73

let placingBuilding = false
let bluePrint

// ////////////////////////////////////////////////////////////////////////////////////////////////////////

const playerInput = () => {
  if (MK) {
    if (currentPlayer.isDead) switchMode()
    centerUnitCamera()
    if (!currentPlayer.attacked) {
      if (!currentPlayer.attacked2) {
        if (!currentPlayer.isRolling) {
          movePlayer()
          currentPlayer.weapon.rotation = -tempAngle(currentPlayer.playerHand, g.pointer, currentPlayer.angleOffX, currentPlayer.angleOffY) + currentPlayer.weaponAngle
        }
      }
    }
  }
  else {
    beginSelection()
    moveCamera()
  }
}

const animatePlayer = () => {
  units.forEach(u => {
    if (u.isMoving) u.moveAnimation()
    else u.idleAnimation()
  })
}

const moveUnits = () => {
  if (movingUnits.length > 0) {
    if (!moved) {
      moved = true
      movingUnits.forEach(unit => {
        if (unit.isMoving) unit.move()
        else removeItem(movingUnits, unit)
      })
      g.wait(moveSpeed, () => moved = false)
    }
  }
}

const runScanners = () => {
  scanFor()
  scanFor(false)
}

const scanFor = (forEnemies = true) => {
  if (forEnemies) {
    if (readyToScanE) {
      readyToScanE = false
      scanLoop()
      g.wait(1400, () => readyToScanE = true)
    }
  } else {
    if (readyToScanP) {
      readyToScanP = false
      scanLoop(enemies, playerUnits)
      g.wait(1100, () => readyToScanP = true)
    }
  }
}

const scanLoop = (scanners = armedUnits, scannees = enemies) => scanners.forEach(unit => {if (!unit.target) unit.scanForTargets(scannees)})


const switchMode = () => {
  if (!MK) {
    if (selectedUnits.length === 1) {
      MK = true
      bottomPanel.visible = false
      currentPlayer = selectedUnits[0]
      currentPlayer.isMoving = false
      currentPlayer.target = null
      removeItem(movingUnits, currentPlayer)
      removeItem(attackingTarget, currentPlayer)
      // removeItem(armedUnits, currentPlayer)
      currentPlayer.deselect()
      selectedUnits = []
      ;[blackHB, yellowHB, HB].forEach(i => i.visible = true)
      ;[yellowHB, HB].forEach(i => {
        i.width = (currentPlayer.health / currentPlayer.baseHealth) * 400 * currentPlayer.HBscale
      })
    }
  }
  else {
    MK = false
    ;[blackHB, yellowHB, HB].forEach(i => i.visible = false)
    bottomPanel.visible = true
    if (!currentPlayer.isDead) {
      currentPlayer.isMoving = false
      currentPlayer.weapon.rotation = currentPlayer.weaponRotation
      // armedUnits.push(currentPlayer)
      currentPlayer = null
    }
  }
}

let oldCol = -1, oldRow = -1
let bluePrintMoved = false

const canBuildHere = (r, c) => {
  try {if (!gridMap[r][c]) return true}
  catch (e) {}
  return false
}



const play = () => {
  playerInput()
  animatePlayer()
  moveUnits()

  if (shots.length > 0) {
    shots.forEach(shot => {
      shot.scaleX += 0.1
      shot.scaleY += 0.1
    })
  }

  if (attackingTarget.length > 0) {
    attackingTarget.forEach(unit => {
      if (!unit.target || unit.isDead || unit.target.isDead) {
        removeItem(attackingTarget, unit)
        unit.target = null
        g.wait(150, () => unit.weapon.rotation = unit.weaponRotation)
      } else unit.attack(unit.target)
    })
  }


  if (bloodDrops.length > 0) {
    bloodDrops.forEach(drop => {
      drop.x += drop.vx
      drop.y += drop.vy
    })
  }

  if (bloodLakes.length > 0) {
    bloodLakes.forEach(lake => {
      if (lake.alpha > 0.1) lake.alpha -= 0.003
      else {
        g.remove(lake)
        removeItem(bloodLakes, lake)
      }
    })
  }

  runScanners()

  if (currentAction.placingBuilding) {

    const col = Math.floor((g.pointer.shiftedX) / cellSize)
    const row = Math.floor((g.pointer.shiftedY) / cellSize)

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
      if (canBuildHere(row, col)) {
        bluePrint.f = '#FFF'
      } else {
        bluePrint.f = '#F00'
      }
    }

  }

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
}

const initCanvasEvents = () => {
  if (c) return
  c = document.getElementById('c')
  c.addEventListener('contextmenu', (e) => e.preventDefault())
  c.addEventListener('pointerdown', (e) => pointerDown(e))
  c.addEventListener('pointerup', (e) => pointerUp(e))
  // const test = document.createElement('p')
  // test.style.fontSize = '90pt'
  // test.innerHTML = 'ajsldkjf;laksdjfalewinflkn'
  // document.body.appendChild(test)
  // console.log(test)
}

const addVectors = (a, b) => {return [a[0] + b[0], a[1] + b[1]]}

const directions = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1]
]


const setCellValue = (row, col, value) => {
  let n
  directions.forEach(d => {
    n = addVectors([row, col], d)
    try {
      gridMap[n[0]][n[1]] = value
    } catch (e) {}
  })
}



const initMap = () => {

  const rows = Math.floor(surfaceHeight / cellSize)
  const cols = Math.floor(surfaceWidth / cellSize)

  for (let i = 0; i < rows; i++) {
    gridMap[i] = Array(cols).fill(0)
  }

  const hqrow = 1
  const hqcol = cols / 2


  gridMap[hqrow][hqcol] = 5
  setCellValue(hqrow, hqcol, 3)


  for (let row = 0; row < rows; row++) {
    for (let cel = 0; cel < cols; cel++) {
      const cellCenterX = cellSize * cel + cellSize / 2
      const cellCenterY = cellSize * row + cellSize / 2

      // const empty = makeRectangle(cellSize, cellSize, '#321', 2, cellCenterX - cellSize / 2, cellCenterY - cellSize / 2)
      // empty.alpha = 0.4
      // floorLayer.addChild(empty)

      if (row % 2 == 1) {
        if (Math.random() < 0.5) {
          tempDrawing_2(randomNum(10, 170, 0), 10, cel * cellSize, row * cellSize + randomNum(-cellSize, cellSize), randomNum(1, 4), randomNum(0, 5, 0))
        }

        if (Math.random() < 0.3) {
          if (cel % 2 == 0) {
            if (gridMap[row][cel] === 0) {
              gridMap[row][cel] = 4
              setCellValue(row, cel, 3)
              const d = randomNum(5, cellSize * 0.25)
              // tempDrawing(d, cel * cellSize + d * 1.5 + randomNum(-35, 35), row * cellSize + d * 1.5 + randomNum(-35, 35))
              tempDrawing(d, cel * cellSize + d, row * cellSize + d)
            }
          }
        }
      }

    }
  }

  HQ = makeHQ(cellSize * hqcol , cellSize * hqrow)
  floorLayer.addChild(HQ)
  solids.push(HQ)

  // gridMap.forEach(c => console.log(c.join('') ))
}

const initUIHealthBar = () => {
  blackHB = makeRectangle(400, 5, 'black', 8, 100, 20)
  blackHB.strokeStyle = 'darkgray'
  yellowHB = makeRectangle(400, 5, 'Yellow', 0, 100, 20)
  HB = makeRectangle(400, 5, 'red', 0, 100, 20)
  uiLayer.addChild(blackHB)
  uiLayer.addChild(yellowHB)
  uiLayer.addChild(HB);
  [blackHB, yellowHB, HB].forEach(i => i.visible = false)
}

const initLayers = () => {
  sun = makeCircle(130, 'orange', 0, false, 500, -250)
  earth = tempEarth(150, 260, -200)
  ground = moonGround()
  floorLayer = g.group()
  objLayer = g.group()
  world = g.group(sun, earth, ground, floorLayer, objLayer)
  // lowerUI = g.group()
  // uiLayer = g.group(lowerUI, bottomPanel)
  uiLayer = g.group()
}

const setup = () => {
  initCanvasEvents()
  initLayers()
  initMap()
  
  const panelHeight = 100

  bluePrint = makeBluePrint()
  world.addChild(bluePrint)

  bottomPanel = makeRectangle(g.stage.width, panelHeight, '#533', 10, 0, g.stage.height - panelHeight)
  uiLayer.addChild(bottomPanel)
  
  const b1 = simpleButton('Wall', 10, 10, 28, 13)
  const b2 = simpleButton('Unit', 200, 10, 30, 13)

  b1.action = () => {
    currentAction.placingBuilding = true  
    g.wait(10, () => bluePrint.visible = true)
  }

  b2.action = () => {
    const tempVill = createArmedPleb(HQ.x , HQ.y, true)
    objLayer.addChild(tempVill)
    playerUnits.push(tempVill)
    units.push(tempVill)
    armedUnits.push(tempVill)
  }

  buttons.push(b1, b2)
  bottomPanel.addChild(b1)
  bottomPanel.addChild(b2)

  // const T = turret(300, 100)
  // floorLayer.addChild(T)
  // solids.push(T)

  player = newMainPlayer(200, 180)
  objLayer.addChild(player)
  playerUnits.push(player)
  units.push(player)

  const tem = createEnemyUnit(300, 180)
  objLayer.addChild(tem)
  units.push(tem)

  // const h = makeHQ(400, 180)
  // floorLayer.addChild(h)
  // debugShape(h)

  // const tempt = turret(300, 180)
  // objLayer.addChild(tempt)

  for (let i = 0; i < 7; i++) {

    const tempEnemy = createEnemyUnit(1400 + i * 50, 350)
    objLayer.addChild(tempEnemy)
    units.push(tempEnemy)
    enemies.push(tempEnemy)
  }

  const tempVill = createArmedPleb(275, 250, true)
  objLayer.addChild(tempVill)
  playerUnits.push(tempVill)
  units.push(tempVill)


  const pleb = createPleb(400, 180)
  objLayer.addChild(pleb)
  playerUnits.push(pleb)
  units.push(pleb)

  // const b = bloodDrop(370, 200)
  // objLayer.addChild(b)

  // const l = bloodLake(370, 250)
  // floorLayer.addChild(l)

  initSelectionBox()

  initUIHealthBar()
  
  // uiLayer.addChild(bottomPanel)
  
  // debugText = makeText(' ', '12px arial', 'white', 0, 100)
  
  objLayer.children.sort((a, b) => a.bottom - b.bottom)
  initUnitCamera()
  g.state = play
}

g = GA.create(setup)
g.start()


export { g, world, floorLayer, uiLayer, objLayer, units, enemies, alertedEnemies, shots, selectedUnits, movingUnits, solids, playerUnits, C, bloods, bloodSplats, maze, gridMap, cellSize, PI, surfaceWidth, surfaceHeight, switchMode, MK, currentPlayer, attackingTarget, armedUnits, buttons, placingBuilding, setCellValue, bluePrint, bloodDrops, bloodLakes
}
