import { GA } from './ga_minTest.js'
import { initCanvasEvents } from './main/mainSetUp/initCanvas.js'
import { initLayers, objLayer, uiLayer, world } from './main/mainSetUp/initLayers.js'
import { HQ, initMap, mine } from './main/mainSetUp/initMap.js'
import { buttons, goldAmount, initBottomPanel, prices } from './main/mainSetUp/initBottomPanel.js'
import { initSelectionBox} from './mouse.js'
import { initUnitCamera } from './camera.js'
import { makeBluePrint, makeGold, makeMine} from './drawings.js'

import { newMainPlayer, createEnemyUnit, makeText } from './unitObject.js'

import { playerInput } from './main/mainLoop/handleInput.js'
import { moveUnits } from './main/mainLoop/moveUnits.js'
import { playAnimations } from './main/mainLoop/playAnimations.js'
import { lookForTargets } from './main/mainLoop/lookForTargets.js'
import { attackTarget } from './main/mainLoop/attackTarget.js'
import { showBluePrint } from './main/mainLoop/showBluePrint.js'
import { randomNum, removeItem, setDirection, simpleButton } from './functions.js'
import { debugShape } from './debug.js'
import { UC } from './keyboard.js'

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

const PI = Math.PI
let player
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

let maxSummons = 8
let minSummons = 5
let summons
let enemyLevel = 5

let readyToSummon = true

let firstWaveDelay = false

let wavePosition


const sideWave = () => {
  return Math.random() < .5 ? [-20, randomNum(50, surfaceHeight)]  : [surfaceWidth -20, randomNum(50, surfaceHeight)]
}

const bottomWave = () => {
  return [randomNum(0, surfaceWidth - 30), surfaceHeight - 130]
}

let sides = [sideWave, bottomWave]
let side


const summonWave = () => {
  if (readyToSummon) {
    readyToSummon = false

    if (firstWaveDelay) {

      summons = randomNum(minSummons, maxSummons)
      for (let i = 0; i < summons; i++) {

        side = sides[Math.random() < .5 ? 0 : 1]()


        const enemy = createEnemyUnit(side[0], side[1], enemyLevel)
        // const enemy = createEnemyUnit(side[0], side[1], 100 * enemyLevel)
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


    g.wait((summons * 5) * 100, () => readyToSummon = true)
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
        } else if (!miner.mined && distMI < 60) {
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
    if (g.pointer.y > g.stage.height - 100) {
      if (g.pointer.x < 440) {

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
        
      } 
      else {
        tipSet = false
        tip.visible = false
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
  
  // if (playerUnits.length > 0) {
    // const u = playerUnits[0]
    // debugText.content = `
    // target = ${u.target}
    // isMoving = ${u.isMoving}
    // attackings = ${attackingTarget.length}
    // `
  // }



}

const initialStuff = () => {


  // const G = makeGold(65,20)
  // bottomPanel.addChild(G)


  // player = newMainPlayer(200, 180)
  // objLayer.addChild(player)
  // playerUnits.push(player)
  // units.push(player)


  const enemy = createEnemyUnit(300, 100)
  objLayer.addChild(enemy)
  units.push(enemy)



  // const m = makeMine (100, 100)
  // objLayer.addChild(m)

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



  debugText = makeText(uiLayer, ' ', '22px arial', 'white', 0, 100)


  tip = simpleButton('x25', 0, 0, 30, 6, K.b, 32, 0, 90, 40)
  tip.alpha = 0.7
  const mg = makeGold(-8, -4)
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

