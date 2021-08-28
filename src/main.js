import { GA } from './ga_minTest.js'
import { initCanvasEvents } from './main/mainSetUp/initCanvas.js'
import { initLayers, objLayer, uiLayer, world } from './main/mainSetUp/initLayers.js'
import { HQ, initMap, mine } from './main/mainSetUp/initMap.js'
import { bottomPanel, buttons, goldAmount, initBottomPanel, prices } from './main/mainSetUp/initBottomPanel.js'
import { initSelectionBox} from './mouse.js'
import { initUnitCamera } from './camera.js'
import { makeBluePrint, makeGold, makeRectangle } from './drawings.js'

import { newMainPlayer, createEnemyUnit, createArmedPleb, createPleb, makeText } from './unitObject.js'

import { playerInput } from './main/mainLoop/handleInput.js'
import { moveUnits } from './main/mainLoop/moveUnits.js'
import { playAnimations } from './main/mainLoop/playAnimations.js'
import { lookForTargets } from './main/mainLoop/lookForTargets.js'
import { attackTarget } from './main/mainLoop/attackTarget.js'
import { showBluePrint } from './main/mainLoop/showBluePrint.js'
import { randomNum, removeItem, setDirection, simpleButton } from './functions.js'
import { debugShape } from './debug.js'
import { currentPlayer, UC } from './keyboard.js'

// import { debugShape } from './debug.js'

export const surfaceWidth = 2400
export const surfaceHeight = 1000
const cellSize = 73

export const currentAction = {
  placingBuilding: false,
  // UIupdated: false,
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
// let UC = false
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
let fadeOuts = []

let miners = []

let placingBuilding = false
let bluePrint

let tip


// ////////////////////////////////////////////////////////////////////////////////////////////////////////

let maxSummons = 2
let minSummons = 0
let summons
let enemyLevel = 1

let readyToSummon = true

let firstWaveDelay = false

const summonWave = () => {
  if (readyToSummon) {
    readyToSummon = false

    if (firstWaveDelay) {

      console.log('new wave !')

      summons = randomNum(minSummons, maxSummons)

      for (let i = 0; i < summons; i++) {
        const enemy = createEnemyUnit(50 + i * 150, surfaceHeight, 100 * enemyLevel)
        objLayer.addChild(enemy)
        units.push(enemy)
        enemies.push(enemy)
        enemy.destinationX = HQ.centerX - world.x
        enemy.destinationY = HQ.centerY - world.y
        setDirection(enemy)
        enemy.getInRange = true
        enemy.isMoving = true
        movingUnits.push(enemy)
        
      }


      if (Math.random() > .75) {
        minSummons += 1
        maxSummons += 1
        enemyLevel += 0.5
      }
      
    }


    g.wait((summons * 5) * 200, () => readyToSummon = true)
  }




}




const moveMiners = () => {
  if (miners.length > 0) {
    miners.forEach(miner => {
      if (!miner.isMining || miner.isDead) {
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
          miner.gb.visible = false
          goldAmount.add(1)


          miner.readyForOrder = true
        } else if (!miner.mined && distMI < 85) {
          miner.mined = true
          miner.gb.visible = true
          miner.readyForOrder = true
        }
      }
    })
  }
}

let tipSet = false

const showTip = () => {

  if (!UC) {
    // console.log(UC)
    if (g.pointer.y > g.stage.height - 100) {
      for (let i in buttons) {
        if (g.hitTestPoint(g.pointer, buttons[i])) {
          tip.x = g.pointer.x
          tip.y = g.pointer.y - tip.height
          tip.text.content = `x${prices[i]}`
          
          if (!tipSet) {
            tipSet = true
            g.wait(150, () => tip.visible = true)
          }
          
        }
      }
    } else {
      if (tipSet) {
        tipSet = false
        tip.visible = false
      }
    }

  }

}


const play = () => {

  playerInput()

  moveUnits()
    
  playAnimations()
  
  lookForTargets()
  
  attackTarget()
  
  showBluePrint()

  moveMiners()

  showTip()

  // summonWave()






  // const hx = HQ.centerX.toFixed(1)
  // const hy = HQ.centerY.toFixed(1)
  // const ex = enemies[0].centerX.toFixed(1)
  // const ey = enemies[0].centerY.toFixed(1)
  
  if (enemies.length > 0) {
    const e = enemies[0]
    debugText.content = `
    target = ${e.target}
    isMoving = ${e.isMoving}
    attackings = ${attackingTarget.length}
    enemies = ${enemies.length}
    `
  }



}

const initialStuff = () => {


  // const G = makeGold(65,20)
  // bottomPanel.addChild(G)


  player = newMainPlayer(200, 180)
  objLayer.addChild(player)
  playerUnits.push(player)
  units.push(player)

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
  debugText = makeText(uiLayer, ' ', '22px arial', 'white', 0, 100)



  // const states = makeText(uiLayer, 'Gold = 0', '32px arial', 'white')


  // const tip = makeRectangle(200, 100, K.b, 0, 0, 0)
  tip = simpleButton('x25', 100, 0, 60, 20, 32, () => {}, 150, 80, K.b)
  tip.alpha = 0.7
  const mg = makeGold(20, 10)
  tip.addChild(mg)
  uiLayer.addChild(tip)
  tip.visible = false



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


export { tip, miners, summonWave, PI, g, units, enemies, alertedEnemies, shots, selectedUnits, movingUnits, solids, playerUnits, bloods, bloodSplats, maze, UC, attackingTarget, armedUnits, placingBuilding, bluePrint, bloodDrops, fadeOuts, cellSize
}

