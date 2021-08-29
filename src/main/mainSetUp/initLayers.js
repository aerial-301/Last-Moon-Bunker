import { g, surfaceWidth } from '../../main.js'
import { makeCircle, tempEarth, moonGround, makeRectangle } from '../../drawings.js'
import { moreProperties } from '../../unitObject.js'
export let world, uiLayer, floorLayer, objLayer, sun, earth, ground, space
export const initLayers = (groundWidth, groundHeight) => {
  space = makeRectangle(surfaceWidth + 50, 400, '#000', 0, -25, -400)
  moreProperties(space)
  // solids.push(space)
  sun = makeCircle(130, '#fb0', 0, false, 800, -250)
  earth = tempEarth(150, 260, -200)
  earth.blendMode = 'source-atop'
  ground = moonGround(groundWidth, groundHeight)
  floorLayer = g.group()
  objLayer = g.group()
  world = g.group(space, sun, earth, ground, floorLayer, objLayer)
  uiLayer = g.group()
}



// export {space}