import { miners } from "../../main.js"
import { createArmedPleb, createPleb } from "../../unitObject.js"
import { HQ } from "./initMap.js"

export const startUnits = () => {
  const p = createPleb(HQ.x - 100, HQ.y + 100)
  p.isMining = true
  miners.push(p)
  createArmedPleb(HQ.x + 70, HQ.y + 100)
  createArmedPleb(HQ.x - 350, HQ.y + 250)
}
