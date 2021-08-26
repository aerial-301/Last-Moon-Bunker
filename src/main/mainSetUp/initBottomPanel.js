import { uiLayer, objLayer } from "./initLayers.js"
import { makeRectangle } from "../../drawings.js"
import { simpleButton } from "../../functions.js"
import { g, currentAction, bluePrint, armedUnits, playerUnits, units } from "../../main.js"
import { createArmedPleb, createPleb } from "../../unitObject.js"
import { HQ } from './initMap.js'

let bottomPanel, buttons = []
const panelHeight = 100

const initBottomPanel = () => {
  bottomPanel = makeRectangle(g.stage.width, panelHeight, '#533', 10, 0, g.stage.height - panelHeight)
  uiLayer.addChild(bottomPanel)
  
  const b1 = simpleButton('Turret', 10, 10, 27, 20)
  const b2 = simpleButton('Scout', 200, 10, 31, 20)
  const b3 = simpleButton('Worker', 390, 10, 19, 20, 42)

  b1.action = () => {
    currentAction.placingBuilding = true  
    g.wait(10, () => bluePrint.visible = true)
  }

  b2.action = () => {
    const u = createArmedPleb(HQ.x , HQ.y)
    objLayer.addChild(u)
    playerUnits.push(u)
    units.push(u)
    armedUnits.push(u)
  }

  b3.action = () => {
    const u = createPleb(HQ.x, HQ.y + 100)
    objLayer.addChild(u)
    playerUnits.push(u)
    units.push(u)
    armedUnits.push(u)
  }

  buttons.push(b1, b2, b3)
  bottomPanel.addChild(b1)
  bottomPanel.addChild(b2)
  bottomPanel.addChild(b3)
}


export { bottomPanel, buttons, initBottomPanel}