import { GA } from './ga_minTest.js'
import { initCanvasEvents } from './main/mainSetUp/initCanvas.js'
import { initLayers, objLayer, uiLayer, world } from './main/mainSetUp/initLayers.js'
import { HQ, initMap } from './main/mainSetUp/initMap.js'
import { buttons, currentKills, initBottomPanel, initTipBox, totalGold } from './main/mainSetUp/initBottomPanel.js'
import { initSelectionBox} from './mouse.js'
import { initUnitCamera } from './camera.js'

import { playerInput } from './main/mainLoop/handleInput.js'
import { moveUnits } from './main/mainLoop/moveUnits.js'
import { playAnimations } from './main/mainLoop/playAnimations.js'
import { lookForTargets } from './main/mainLoop/lookForTargets.js'
import { attackTarget } from './main/mainLoop/attackTarget.js'
import { moveMiners } from './main/mainLoop/moveMiners.js'
import { initBluePrint, showBluePrint } from './main/mainLoop/showBluePrint.js'
import { showTip } from './main/mainLoop/showTip.js'
import { summonWave } from './main/mainLoop/summonWaves.js'

import { UC } from './keyboard.js'
import { createPleb, makeText } from './unitObject.js'
import { makeGold, rectangle } from './drawings.js'
import { removeItem, simpleButton } from './functions.js'

const surfaceWidth = 2400
const surfaceHeight = 1000
const cellSize = 73

const currentAction = {
  placingBuilding: false,
}

const K = {
  b : '#000',
  w : '#fff',
  r : '#f00',
  y : '#ff0',
  g : '#555'
}

const PI = Math.PI
let g
let menu
let started = false
let solids = []
let units = []
let playerUnits = []
let selectedUnits = []
let movingUnits = []
let armedUnits = []
let enemies = []
let attackingTarget = []
let shots = []
let bloods = []
let bloodDrops = []
let bloodSplats = []
let fadeOuts = []
let miners = []

// ////////////////////////////////////////////////////////////////////////////////////////////////////////

const play = () => {

  playerInput()

  moveUnits()
    
  playAnimations()
  
  lookForTargets()
  
  attackTarget()
  
  showBluePrint()

  moveMiners()

  showTip()

  summonWave()

  if (HQ.health <= 0) {
    g.pause()
    g.remove(world)
    started = false
    uiLayer.children.length = 0
    const b = rectangle(g.stage.width, g.stage.height, '#900')
    b.alpha = 0.5
    const x = g.stage.width / 2
    const y = g.stage.height / 2
    makeText(b, 'GAME OVER', "99px sans-serif", K.r, x - 300, y - 200)
    const k = makeGold(x - 237, y + 70)
    b.addChild(k)
    makeText(b, `${totalGold}`, '35px sans-serif', K.w, x - 193, y + 78)
    makeText(b, `k ${currentKills}`, '35px sans-serif', K.w, x - 220, y + 120)
    uiLayer.addChild(b)
  }

}

const initialStuff = () => {

  // const tempVill = createArmedPleb(275, 250)
  // objLayer.addChild(tempVill)
  // playerUnits.push(tempVill)
  // units.push(tempVill)

  // createPleb(400, 180)
  // objLayer.addChild(pleb)
  // playerUnits.push(pleb)
  // units.push(pleb)
}


const setup = () => {

  initMap()

  initBluePrint()

  initBottomPanel()

  initialStuff()

  initSelectionBox()

  initTipBox()

  objLayer.children.sort((a, b) => a.bottom - b.bottom)

  initUnitCamera()

  g.state = play
}

const mainMenu = () => {
  initCanvasEvents()
  initLayers()
  menu = simpleButton('>', g.stage.width / 2 - 100, g.stage.height / 2 - 100, 70, 5, '#800', 99, () => {
    removeItem(buttons, menu)
    started = true
    g.remove(menu)
    g.resume()
    setup()
  }, 200, 100)
  buttons.push(menu)
  uiLayer.addChild(menu)
  g.pause()
}

g = GA.create(mainMenu)
g.start()

export { started, menu, PI, K, currentAction, surfaceHeight, surfaceWidth, miners, g, units, enemies, shots, selectedUnits, movingUnits, solids, playerUnits, bloods, bloodSplats, UC, attackingTarget, armedUnits, bloodDrops, fadeOuts, cellSize
}
