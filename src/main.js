import { GA } from './ga_minTest.js'
import { initCanvasEvents } from './main/mainSetUp/initCanvas.js'
import { initLayers, objLayer, uiLayer } from './main/mainSetUp/initLayers.js'
import { initMap } from './main/mainSetUp/initMap.js'
import { buttons, initBottomPanel, initTipBox } from './main/mainSetUp/initBottomPanel.js'
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
import { removeItem, simpleButton } from './functions.js'
import { startUnits } from './main/mainSetUp/startUnits.js'
import { gameOver } from './main/mainLoop/gameOver.js'

const surfaceWidth = 2400
const surfaceHeight = 1000
const cellSize = 73
const PI = Math.PI

const currentAction = {
  placingBuilding: false,
  started: false
}

const K = {
  b : '#000',
  w : '#fff',
  r : '#f00',
  y : '#ff0',
  g : '#555'
}

let g
let menu
let solids = []
let units = []
let playerUnits = []
let selectedUnits = []
let movingUnits = []
let armedUnits = []
let enemies = []
let attackingTarget = []
let shots = []
let bloodDrops = []
let fadeOuts = []
let miners = []

g = GA.create(mainMenu)
g.start()

function mainMenu(){
  initCanvasEvents()
  initLayers()
  menu = simpleButton('>', g.stage.width / 2 - 100, g.stage.height / 2 - 100, 70, 5, '#800', 99, () => {
    removeItem(buttons, menu)
    currentAction.started = true
    g.remove(menu)
    g.resume()
    setup()
  }, 200, 100)
  buttons.push(menu)
  uiLayer.addChild(menu)
  g.pause()
}

function setup(){

  initMap()

  initBluePrint()

  initBottomPanel()

  startUnits()

  initSelectionBox()

  initTipBox()

  objLayer.children.sort((a, b) => a.bottom - b.bottom)

  initUnitCamera()

  g.state = play
}

function play(){

  playerInput()

  moveUnits()
    
  playAnimations()
  
  lookForTargets()
  
  attackTarget()
  
  showBluePrint()

  moveMiners()

  showTip()

  summonWave()

  gameOver()
}

export { 
  g,
  K,
  PI,
  currentAction,
  surfaceHeight,
  surfaceWidth,
  units,
  playerUnits,
  selectedUnits,
  movingUnits,
  miners,
  enemies,
  shots,
  solids,
  UC,
  attackingTarget,
  armedUnits,
  bloodDrops,
  fadeOuts,
  cellSize
}