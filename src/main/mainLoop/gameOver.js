import { makeGold, rectangle } from "../../drawings.js"
import { currentAction, g, K } from "../../main.js"
import { makeText } from "../../unitObject.js"
import { currentKills, totalGold } from "../mainSetUp/initBottomPanel.js"
import { uiLayer, world } from "../mainSetUp/initLayers.js"
import { HQ } from "../mainSetUp/initMap.js"

export const gameOver = () => {
  if (HQ.health <= 0) {
    g.pause()
    g.remove(world)
    currentAction.started = false
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