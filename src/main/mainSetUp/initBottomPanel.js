import { uiLayer } from "./initLayers.js"
import { makeGold, rectangle, makeThirdEye, makeTwoEyes, renderTurret } from "../../drawings.js"
import { notEnough, randomNum, simpleButton } from "../../functions.js"
import { g, currentAction, K } from "../../main.js"
import { createArmedPleb, createPleb, moonKeeper } from "../../unitObject.js"
import { HQ } from './initMap.js'
import { bluePrint } from "../mainLoop/showBluePrint.js"

let tip, bottomPanel, buttons = [], goldDisplay, killsDisplay, currentKills = 0
const panelHeight = 100
export let currentGold = 30
export let totalGold = currentGold
export let prices = [3, 7, 25, 77]


const initTipBox = () => {
  tip = simpleButton('x25', 0, 0, 30, 6, K.b, 32, 0, 90, 40)
  tip.alpha = 0.7
  const mg = makeGold(-8, -4)
  tip.addChild(mg)
  uiLayer.addChild(tip)
  tip.visible = false
}

const initBottomPanel = () => {
  bottomPanel = rectangle(g.stage.width, panelHeight, '#311', 10, 0, g.stage.height - panelHeight)
  uiLayer.addChild(bottomPanel)

  const summonSound = () => {
    const HZ = 150
    g.soundEffect(HZ, .2, 'triangle', .2, 20, true)
  }

  const b1 = simpleButton(0, 10, 10, 100, 23)
  const b2 = simpleButton(0, 120, 10, 100, 23)
  const b3 = simpleButton(0, 230, 10, 100, 23)
  const b4 = simpleButton(0, 340, 10, 100, 23, K.b)

  goldDisplay = simpleButton(`${currentGold}`, 460, 10, 30, 8, '#555', 27, 0, 200, 40)
  goldDisplay.add = (x) => {
    currentGold += x
    totalGold += x
    goldDisplay.text.content = `${currentGold}`
  }
  goldDisplay.sub = (x) => {
    if (x <= currentGold) {
      currentGold -= x
      goldDisplay.text.content = `${currentGold}`
      return true
    } else return false
  }
  const gb = makeGold(-10, -5)
  goldDisplay.addChild(gb)
  bottomPanel.addChild(goldDisplay)


  killsDisplay = simpleButton(`K ${currentKills}`, 460, 50, 8, 8, '#555', 27, 0,200, 40)
  killsDisplay.add = (x) => {
    currentKills += x
    killsDisplay.text.content = `K ${currentKills}`
  }

  bottomPanel.addChild(killsDisplay)

  const pleb = createPleb(25, 15, 0)
  b1.addChild(pleb)
  
  const armed = createArmedPleb(25, 15, 0)
  armed.weapon.rotation = -.2
  b2.addChild(armed)
  
  const turr = renderTurret(24, 30) 
  b3.addChild(turr)


  const thirdeye = makeThirdEye(25, 15)
  const twoeyes = makeTwoEyes(25, 15)
  const swrd = rectangle(55, 2, K.w, 0, 46, 46)
  const sh = rectangle(40, 4, '#ea5', 1, 10, 45)
  b4.addChild(twoeyes)
  b4.addChild(thirdeye)
  b4.addChild(swrd)
  b4.addChild(sh)

  b1.action = () => {
    if (goldDisplay.sub(prices[0])) {
      summonSound()
      createPleb(HQ.x - 60 - randomNum(0, 100, 0), HQ.y)
    } else notEnough()
  }
  
  b2.action = () => {
    if (goldDisplay.sub(prices[1])) {
      summonSound()
      createArmedPleb(HQ.x + 80 + randomNum(0, 100, 0), HQ.y)
    } else notEnough()
  }
  
  b3.action = () => {
    currentAction.placingBuilding = true  
    g.wait(10, () => bluePrint.visible = true)
  }


  b4.action = () => {
    if (goldDisplay.sub(prices[3])) {
      summonSound()
      moonKeeper(HQ.x + 25, HQ.y + 150)
    } else notEnough()
  }
  

  bottomPanel.addChild(b1)
  bottomPanel.addChild(b2)
  bottomPanel.addChild(b3)
  bottomPanel.addChild(b4)
  buttons.push(b1, b2, b3, b4)
}

export { currentKills, killsDisplay, goldDisplay, bottomPanel, buttons, initBottomPanel, initTipBox, tip}