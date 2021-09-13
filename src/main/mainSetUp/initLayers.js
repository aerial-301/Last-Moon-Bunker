import { g, K, SURFACE_WIDTH } from '../../main.js'
import { circle, makeEarth, rectangle } from '../../drawings.js'
import { moreProperties } from '../../objects.js'
import { randomNum } from '../../functions.js'
export let world, uiLayer, floorLayer, objLayer, sun, earth, ground, space
export const initLayers = () => {
  space = rectangle(SURFACE_WIDTH + 50, 350, K.b, 0, -25, -400)
  moreProperties(space)
  sun = circle(130, '#fb0', 0, false, 2100, -250)
  earth = makeEarth(150, 360, -250)
  earth.blendMode = 'source-atop'
  floorLayer = g.group()
  objLayer = g.group()
  let stars = g.group()
  for (let i = 0; i < 222; i++) {
    const c = circle(randomNum(1, 3, 0), K.w, 0, 0, randomNum(0, SURFACE_WIDTH), randomNum(-300, -57))
    stars.addChild(c)
  }

  world = g.group(space, stars, sun, earth, floorLayer, objLayer)
  uiLayer = g.group()
}
