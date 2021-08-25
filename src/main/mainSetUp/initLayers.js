import { g } from '../../main.js'
import { makeCircle, tempEarth, moonGround } from '../../drawings.js'
export let world, uiLayer, floorLayer, objLayer, sun, earth, ground
export const initLayers = (groundWidth, groundHeight) => {
  sun = makeCircle(130, '#fb0', 0, false, 500, -250)
  earth = tempEarth(150, 260, -200)
  ground = moonGround(groundWidth, groundHeight)
  floorLayer = g.group()
  objLayer = g.group()
  world = g.group(sun, earth, ground, floorLayer, objLayer)
  uiLayer = g.group()
}