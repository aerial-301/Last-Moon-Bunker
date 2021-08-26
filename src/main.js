import { GA } from './ga_minTest.js'
import { initCanvasEvents } from './main/mainSetUp/initCanvas.js'
import { initLayers, objLayer, uiLayer, world } from './main/mainSetUp/initLayers.js'
import { HQ, initMap, mine } from './main/mainSetUp/initMap.js'
import { initBottomPanel } from './main/mainSetUp/initBottomPanel.js'
import { initSelectionBox} from './mouse.js'
import { initUnitCamera } from './camera.js'
import { makeBluePrint } from './drawings.js'

import { newMainPlayer, createEnemyUnit, createArmedPleb, createPleb, makeText } from './unitObject.js'

import { playerInput } from './main/mainLoop/handleInput.js'
import { moveUnits } from './main/mainLoop/moveUnits.js'
import { playAnimations } from './main/mainLoop/playAnimations.js'
import { lookForTargets } from './main/mainLoop/lookForTargets.js'
import { attackTarget } from './main/mainLoop/attackTarget.js'
import { showBluePrint } from './main/mainLoop/showBluePrint.js'
import { randomNum, removeItem, setDirection } from './functions.js'
import { debugShape } from './debug.js'

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
  y : '#ff0',
  g : '#555'
}


let gold

const PI = Math.PI

let player
let MK = false
let playerUnits = []
let maze
let g
let debugText
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

let miners = []

let placingBuilding = false
let bluePrint




// ////////////////////////////////////////////////////////////////////////////////////////////////////////

let readyToSummon = true

let firstWaveDelay = false

const summonWave = () => {
  if (readyToSummon) {
    // readyToSummon = false


    
    if (firstWaveDelay) {

      console.log('new wave !')

      
      for (let i = 0; i < 15; i++) {
        const enemy = createEnemyUnit(-500 + i * 550, surfaceHeight)
        objLayer.addChild(enemy)
        units.push(enemy)
        enemies.push(enemy)
        enemy.destinationX = HQ.centerX - world.x
        enemy.destinationY = HQ.centerY - world.y
        setDirection(enemy)
        // debugShape(enemy)
        enemy.getInRange = true
        // enemy.spaceX = enemy.range //- enemy.halfWidth
        // enemy.spaceY = enemy.range //- enemy.halfHeight
        enemy.isMoving = true
        movingUnits.push(enemy)
        
      }
      
    }




    // g.wait(50000, () => readyToSummon = true)
  }




}

const play = () => {

  playerInput()

  moveUnits()
    
  playAnimations()
  
  lookForTargets()
  
  attackTarget()
  
  showBluePrint()



  if (miners.length > 0) {
    miners.forEach(miner => {
      if (!miner.isMining) {
        removeItem(miners, miner)
        return
      }

      if (miner.readyForOrder) {

        
        if (miner.mined) {
          miner.destinationX = HQ.centerX - world.x
          miner.destinationY = HQ.centerY - world.y
          setDirection(miner)
          if (!miner.isMoving) {
            miner.isMoving = true
            movingUnits.push(miner)
          }
          miner.readyForOrder = false
        } else {
          miner.destinationX = mine.centerX - world.x
          miner.destinationY = mine.centerY - world.y
          setDirection(miner)
          if (!miner.isMoving) {
            miner.isMoving = true
            movingUnits.push(miner)
          }
          miner.readyForOrder = false
        }
        
      } else {
        const distHQ = g.GlobalDistance(miner, HQ)
        const distMI = g.GlobalDistance(miner, mine)
  
        if (miner.mined && distHQ < 85) {
          miner.mined = false
          miner.readyForOrder = true
        } else if (!miner.mined && distMI < 85) {
          miner.mined = true
          miner.readyForOrder = true
        }
      }
        
        

    })
  }

  // summonWave()

  // const hx = HQ.centerX.toFixed(1)
  // const hy = HQ.centerY.toFixed(1)
  // const ex = enemies[0].centerX.toFixed(1)
  // const ey = enemies[0].centerY.toFixed(1)
  
  if (units.length > 0) {


    const u = units[0]

    debugText.content = `
    isMining = ${u.isMining}
    isMoving = ${u.isMoving}
    movers = ${movingUnits.length}
    miners = ${miners.length}
    d = ${g.GlobalDistance(u, mine).toFixed(2)}
    d = ${g.GlobalDistance(u, HQ).toFixed(2)}
    `

  }



}

const initialStuff = () => {
  // player = newMainPlayer(200, 180)
  // objLayer.addChild(player)
  // playerUnits.push(player)
  // units.push(player)

  // const enemy = createEnemyUnit(100, 200)
  // objLayer.addChild(enemy)
  // units.push(enemy)
  // enemies.push(enemy)

  // const tempVill = createArmedPleb(275, 250)
  // objLayer.addChild(tempVill)
  // playerUnits.push(tempVill)
  // units.push(tempVill)

  // const pleb = createPleb(400, 180)
  // objLayer.addChild(pleb)
  // playerUnits.push(pleb)
  // units.push(pleb)
}


const setup = () => {


  initCanvasEvents()
  initLayers(surfaceWidth, surfaceHeight)
  initMap(surfaceWidth, surfaceHeight, cellSize)
  bluePrint = makeBluePrint(cellSize)
  initBottomPanel()

  initialStuff()

  initSelectionBox()
  // initUIHealthBar()
  // debugText = makeText(' ', '12px arial', 'white', 0, 100)
  debugText = makeText(uiLayer, ' ', '32px arial', 'white', 0, 100)



  const states = makeText(uiLayer, 'Gold = 0', '32px arial', 'white')






  objLayer.children.sort((a, b) => a.bottom - b.bottom)
  initUnitCamera()
  g.wait(5000, () => {
    firstWaveDelay = true
    console.log('first wave')
  })
  g.state = play
}

g = GA.create(setup)
g.start()


export { miners, summonWave, PI, g, units, enemies, alertedEnemies, shots, selectedUnits, movingUnits, solids, playerUnits, bloods, bloodSplats, maze, MK, attackingTarget, armedUnits, placingBuilding, bluePrint, bloodDrops, bloodLakes, cellSize
}

