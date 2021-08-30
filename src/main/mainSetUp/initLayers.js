import { g, surfaceWidth } from '../../main.js'
import { circle, tempEarth, rectangle } from '../../drawings.js'
import { moreProperties } from '../../unitObject.js'
export let world, uiLayer, floorLayer, objLayer, sun, earth, ground, space
export const initLayers = () => {
  space = rectangle(surfaceWidth + 50, 400, '#000', 0, -25, -400)
  moreProperties(space)
  sun = circle(130, '#fb0', 0, false, 800, -250)
  earth = tempEarth(150, 260, -200)
  earth.blendMode = 'source-atop'
  floorLayer = g.group()
  objLayer = g.group()
  world = g.group(space, sun, earth, floorLayer, objLayer)
  uiLayer = g.group()
}
