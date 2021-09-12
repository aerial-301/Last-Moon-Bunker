import { GA } from './modifiedGA.js'
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

import { simpleButton, removeItem } from './functions.js'
import { startingUnits } from './main/mainSetUp/startingUnits.js'

const SURFACE_WIDTH = 2400
const SURFACE_HEIGHT = 1000
const CELLSIZE = 73
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

g = GA.create(mainMenu)
g.start()

function mainMenu(){
  initCanvasEvents()
  initLayers()

  menu = simpleButton({
    x: g.stage.width / 2 - 100,
    y: g.stage.height / 2 - 100,
    width: 200,
    height: 100,
    color: '#800',
    text: '>',
    textX: 70,
    textY: 5,
    textSize: 99,
    onPress: () => {
      g.actx = new AudioContext()
      removeItem(buttons, menu)
      currentAction.started = true
      g.remove(menu)
      g.resume()
      setup()
    },
  })

  buttons.push(menu)
  uiLayer.addChild(menu)
  g.pause()
}

function setup(){

  initMap()

  initBluePrint()

  initBottomPanel()

  startingUnits()

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
}

export { 
  g,
  K,
  PI,
  currentAction,
  SURFACE_HEIGHT,
  SURFACE_WIDTH,
  CELLSIZE
}