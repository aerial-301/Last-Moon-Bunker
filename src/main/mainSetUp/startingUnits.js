import { createArmedPleb, createPleb } from "../../objects.js"
import { miners } from "../mainLoop/moveMiners.js"
import { HQ } from "./initMap.js"

export const startingUnits = () => {
  const p = createPleb(HQ.x - 100, HQ.y + 100)
  p.isMining = true
  miners.push(p)
  createArmedPleb(HQ.x + 70, HQ.y + 100)
  createArmedPleb(HQ.x - 350, HQ.y + 250)
}
