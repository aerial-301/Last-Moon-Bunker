import { uiLayer, objLayer } from "./initLayers.js"
import { gun, makeGold, makeHead, makeRectangle, makeTwoEyes, renderTurret } from "../../drawings.js"
import { randomNum, simpleButton } from "../../functions.js"
import { g, currentAction, bluePrint, armedUnits, playerUnits, units } from "../../main.js"
import { createArmedPleb, createPleb, makeBasicObject, moreProperties } from "../../unitObject.js"
import { HQ } from './initMap.js'

let bottomPanel, buttons = []
const panelHeight = 100

export let prices = [3, 7, 15, 77]

const initBottomPanel = () => {
  bottomPanel = makeRectangle(g.stage.width, panelHeight, '#311', 10, 0, g.stage.height - panelHeight)
  uiLayer.addChild(bottomPanel)
  
  const b1 = simpleButton(0, 10, 10, 100, 23)
  const b2 = simpleButton(0, 180, 10, 100, 23)
  const b3 = simpleButton(0, 350, 10, 100, 23)
  // const b4 = simpleButton(0, 520, 10, 100, 23)

  const pleb = createPleb(50, 15)
  b1.addChild(pleb)
  
  const armed = createArmedPleb(50, 15)
  armed.weapon.rotation = -.2
  b2.addChild(armed)
  
  const turr = renderTurret(50, 30) 
  b3.addChild(turr)

  b1.action = () => {
    const u = createPleb(HQ.x + randomNum(-50, 50,0), HQ.y + 101)
    objLayer.addChild(u)
    playerUnits.push(u)
    units.push(u)
    armedUnits.push(u)
  }
  
  b2.action = () => {
    const u = createArmedPleb(HQ.x + randomNum(-50, 50, 0), HQ.y + 101)
    objLayer.addChild(u)
    playerUnits.push(u)
    units.push(u)
    armedUnits.push(u)
  }
  
  
  b3.action = () => {
    currentAction.placingBuilding = true  
    g.wait(10, () => bluePrint.visible = true)
  }
  
  

  buttons.push(b1, b2, b3)
  bottomPanel.addChild(b1)
  bottomPanel.addChild(b2)
  bottomPanel.addChild(b3)
  // bottomPanel.addChild(b4)
}


export { bottomPanel, buttons, initBottomPanel}