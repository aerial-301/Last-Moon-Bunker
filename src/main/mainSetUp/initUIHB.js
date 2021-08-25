import { uiLayer } from './initLayers.js'
import { makeRectangle } from '../../drawings.js'
export let blackHB, yellowHB, HB
export const initUIHealthBar = () => {
  blackHB = makeRectangle(400, 5, 'black', 8, 100, 20)
  blackHB.strokeStyle = 'darkgray'
  yellowHB = makeRectangle(400, 5, 'Yellow', 0, 100, 20)
  HB = makeRectangle(400, 5, 'red', 0, 100, 20)
  uiLayer.addChild(blackHB)
  uiLayer.addChild(yellowHB)
  uiLayer.addChild(HB);
  [blackHB, yellowHB, HB].forEach(i => i.visible = false)
}