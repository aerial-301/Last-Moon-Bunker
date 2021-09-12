import { g, currentAction, K } from "../../main.js"
import { HQ } from './initMap.js'
import { uiLayer } from "./initLayers.js"
import { bluePrint } from "../mainLoop/showBluePrint.js"
import { simpleButton, notEnough, randomNum } from "../../functions.js"
import { createArmedPleb, createPleb, moonKeeper } from "../../objects.js"
import { makeGold, rectangle, makeThirdEye, makeTwoEyes, renderTurret } from "../../drawings.js"

let tip, bottomPanel, buttons = [], goldDisplay, killsDisplay, currentKills = 0
const PANEL_HEIGHT = 100
export let currentGold = 17
export let totalGold = currentGold
export const PRICES = [3, 8, 23, 77]

const initTipBox = () => {
  tip = simpleButton({
    width: 90,
    height: 40,
    color: K.b,
    textX: 30,
    textY: 6,
    textSize: 32
  })

  tip.alpha = 0.7
  const mg = makeGold(-8, -4)
  tip.addChild(mg)
  uiLayer.addChild(tip)
  tip.visible = false
}

const initBottomPanel = () => {
  bottomPanel = rectangle(g.stage.width, PANEL_HEIGHT, '#311', 10, 0, g.stage.height - PANEL_HEIGHT)
  uiLayer.addChild(bottomPanel)

  const summonSound = () => {
    const HZ = 150
    g.soundEffect(HZ, .2, 'triangle', .2, 20, true)
  }

  const b1 = simpleButton({
    x: 10,
    y: 10,
    onPress: () => {
      if (goldDisplay.sub(PRICES[0])) {
        summonSound()
        createPleb(HQ.x - 60 - randomNum(0, 100, 0), HQ.y)
      } else notEnough()
    }
  })

  const b2 = simpleButton({
    x: 120,
    y: 10,
    onPress: () => {
      if (goldDisplay.sub(PRICES[1])) {
        summonSound()
        createArmedPleb(HQ.x + 80 + randomNum(0, 100, 0), HQ.y)
      } else notEnough()
    }
  })

  const b3 = simpleButton({
    x: 230,
    y: 10,
    onPress: () => {
      currentAction.placingBuilding = true  
      g.wait(10, () => bluePrint.visible = true)
    }
  })


  const b4 = simpleButton({
    x: 330,
    y: 10,
    color: K.b,
    onPress: () => {
      if (goldDisplay.sub(PRICES[3])) {
        summonSound()
        moonKeeper(HQ.x + 25, HQ.y + 150)
      } else notEnough()
    }
  })

  goldDisplay = simpleButton({
    x: 460,
    y: 10,
    width: 200,
    height: 40,
    color: '#555',
    text: currentGold,
    textX: 30,
    textY: 8,
    textSize: 27
  })

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

  killsDisplay = simpleButton({
    x: 460,
    y: 50,
    width: 200,
    height: 40,
    color: '#555',
    text: `K ${currentKills}`,
    textX: 8,
    textY: 8,
    textSize: 27
  })

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

  bottomPanel.addChild(b1)
  bottomPanel.addChild(b2)
  bottomPanel.addChild(b3)
  bottomPanel.addChild(b4)
  buttons.push(b1, b2, b3, b4)
}

export { currentKills, killsDisplay, goldDisplay, bottomPanel, buttons, initBottomPanel, initTipBox, tip}