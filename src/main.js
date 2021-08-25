import { GA } from './ga_minTest.js'
import { initCanvasEvents } from './main/mainSetUp/initCanvas.js'
import { initLayers, objLayer } from './main/mainSetUp/initLayers.js'
import { initMap } from './main/mainSetUp/initMap.js'
import { initBottomPanel } from './main/mainSetUp/initBottomPanel.js'
import { initUIHealthBar } from './main/mainSetUp/initUIHB.js'
import { initSelectionBox} from './mouse.js'
import { initUnitCamera } from './camera.js'
import { makeBluePrint } from './drawings.js'

import { newMainPlayer, createEnemyUnit, createArmedPleb, createPleb } from './unitObject.js'

import { playerInput } from './main/mainLoop/handleInput.js'
import { moveUnits } from './main/mainLoop/moveUnits.js'
import { playAnimations } from './main/mainLoop/playAnimations.js'
import { lookForTargets } from './main/mainLoop/lookForTargets.js'
import { attackTarget } from './main/mainLoop/attackTarget.js'
import { showBluePrint } from './main/mainLoop/showBluePrint.js'

// import { debugShape } from './debug.js'

export const surfaceWidth = 2400
export const surfaceHeight = 1000
const cellSize = 73

export const currentAction = {
  placingBuilding: false,
}

export const K = {
  b : '#000',
  w : '#fff',
  r : '#f00',
  g : '#555'
}


const PI = Math.PI

let player
let MK = false
let playerUnits = []
let maze
let g
// let debugText
let units = []
let armedUnits = []
let selectedUnits = []
let movingUnits = []
let solids = []
let enemies = []
let alertedEnemies = []
// let movingEnemies = []
let bloods = []
let bloodSplats = []
let shots = []
let attackingTarget = []
let bloodDrops = []
let bloodLakes = []

let placingBuilding = false
let bluePrint

// ////////////////////////////////////////////////////////////////////////////////////////////////////////

const play = () => {

  playerInput()

  moveUnits()
    
  playAnimations()
  
  lookForTargets()
  
  attackTarget()
  
  showBluePrint()
  
  // debugText.content = `
  // world.xy = ${world.x}, ${world.y}\n\n
  // pointer = ${g.pointer.x + world.x}, ${g.pointer.y + world.y}
  // `
}


const setup = () => {


  initCanvasEvents()
  initLayers(surfaceWidth, surfaceHeight)
  initMap(surfaceWidth, surfaceHeight, cellSize)
  bluePrint = makeBluePrint(cellSize)
  initBottomPanel()

  player = newMainPlayer(200, 180)
  objLayer.addChild(player)
  playerUnits.push(player)
  units.push(player)

  const tem = createEnemyUnit(300, 180)
  objLayer.addChild(tem)
  units.push(tem)

  for (let i = 0; i < 7; i++) {
    const tempEnemy = createEnemyUnit(1400 + i * 50, 350)
    objLayer.addChild(tempEnemy)
    units.push(tempEnemy)
    enemies.push(tempEnemy)
  }

  const tempVill = createArmedPleb(275, 250)
  objLayer.addChild(tempVill)
  playerUnits.push(tempVill)
  units.push(tempVill)

  const pleb = createPleb(400, 180)
  objLayer.addChild(pleb)
  playerUnits.push(pleb)
  units.push(pleb)

  initSelectionBox()
  initUIHealthBar()
  // debugText = makeText(' ', '12px arial', 'white', 0, 100)
  objLayer.children.sort((a, b) => a.bottom - b.bottom)
  initUnitCamera()
  g.state = play
}

g = GA.create(setup)
g.start()


export { PI, g, units, enemies, alertedEnemies, shots, selectedUnits, movingUnits, solids, playerUnits, bloods, bloodSplats, maze, MK, attackingTarget, armedUnits, placingBuilding, bluePrint, bloodDrops, bloodLakes, cellSize
}

