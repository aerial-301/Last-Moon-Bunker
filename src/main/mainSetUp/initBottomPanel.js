import { uiLayer, objLayer } from "./initLayers.js"
import { makeRectangle } from "../../drawings.js"
import { simpleButton } from "../../functions.js"
import { g, currentAction, bluePrint, armedUnits, playerUnits, units } from "../../main.js"
import { createArmedPleb } from "../../unitObject.js"
import { HQ } from './initMap.js'

let bottomPanel, buttons = []
const panelHeight = 100

const initBottomPanel = () => {
  bottomPanel = makeRectangle(g.stage.width, panelHeight, '#533', 10, 0, g.stage.height - panelHeight)
  uiLayer.addChild(bottomPanel)
  
  const b1 = simpleButton('Wall', 10, 10, 28, 13)
  const b2 = simpleButton('Unit', 200, 10, 30, 13)

  b1.action = () => {
    currentAction.placingBuilding = true  
    g.wait(10, () => bluePrint.visible = true)
  }

  b2.action = () => {
    const tempVill = createArmedPleb(HQ.x , HQ.y)
    objLayer.addChild(tempVill)
    playerUnits.push(tempVill)
    units.push(tempVill)
    armedUnits.push(tempVill)
  }

  buttons.push(b1, b2)
  bottomPanel.addChild(b1)
  bottomPanel.addChild(b2)
}


export { bottomPanel, buttons, initBottomPanel}