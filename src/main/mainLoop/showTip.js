import { g } from "../../main.js"
import { UC } from "../../keyboard.js"
import { buttons, PRICES, tip } from "../mainSetUp/initBottomPanel.js"

let tipSet = false

export const showTip = () => {
  if (!UC) {
    if (g.pointer.y > g.stage.height - 100) {
      if (g.pointer.x < 440) {

        for (let i in buttons) {
          if (g.hitTestPoint(g.pointer, buttons[i])) {
            tip.x = g.pointer.x
            tip.y = g.pointer.y - tip.height
            tip.text.content = `x${PRICES[i]}`
            if (!tipSet) {
              tipSet = true
              g.wait(150, () => tip.visible = true)
            }
          }
        }
        
      } 
      else {
        tipSet = false
        tip.visible = false
      }
      
    } else {
      if (tipSet) {
        tipSet = false
        tip.visible = false
      }
    }
  }
}
