import { currentAction, g, K } from "../../main.js"
import { makeGold, rectangle } from "../../drawings.js"
import { makeText } from "../../objects.js"
import { currentKills, totalGold } from "../mainSetUp/initBottomPanel.js"
import { uiLayer, world } from "../mainSetUp/initLayers.js"

const STORAGE_KEY = 'LastMoonBunkerjs13k2021'
const FONT = 'sans-serif'

export const gameOver = () => {
  g.pause()
  g.remove(world)
  currentAction.started = false
  uiLayer.children.length = 0
  const b = rectangle(g.stage.width, g.stage.height, '#300')
  const x = g.stage.width / 2
  const y = g.stage.height / 2 - 80
  makeText(b, 'GAME OVER', "99px " + FONT, K.r, x - 300, y - 100)
  const k = makeGold(x - 237, y + 70)
  b.addChild(k)
  makeText(b, totalGold, '35px ' + FONT, K.w, x - 193, y + 78)
  makeText(b, `k ${currentKills}`, '35px ' + FONT, K.w, x - 220, y + 120)
  const line = rectangle(200, 2, K.w, 0, x - 250, y + 160)
  b.addChild(line)

  const total = totalGold + currentKills
  
  
  uiLayer.addChild(b)
  
  const best = updateBestScore(total)
  if (best[0]) {
    makeText(b, 'Best: ' + best[1], '35px ' + FONT, K.w, x - 285, y + 270)
  } else {
    makeText(b, 'New Best!', '35px ' + FONT, K.y, x - 250, y + 270)
  }
  makeText(b, total, '35px ' + FONT, K.w, x - 195, y + 170)
}


function updateBestScore(currentTotal) {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    localStorage.setItem(STORAGE_KEY, currentTotal)
    return [0, currentTotal]
  } else {
    const best = localStorage.getItem(STORAGE_KEY)
    if (currentTotal > best) {
      localStorage.setItem(STORAGE_KEY, currentTotal)
      return [0, currentTotal]
    }
    return [1, best]
  }
}