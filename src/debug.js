import { makeCircle, makeRectangle } from "./drawings.js"
import { g, objLayer, world } from './main.js'
import { makeBasicObject } from "./unitObject.js"


const debugShape = (shape) => {
  const s = makeRectangle(
    shape.width,
    shape.height,
    'white',
    0,
    shape.gx,
    shape.gy
  )
  s.alpha = 0.1
  g.stage.addChild(s)
  return s
}

const tempIndicator = (spotX, spotY, d = 700, color = 'white', dia = 20) => {
  // console.log(spotX, spotY)
  const i = makeBasicObject(dia, dia, color, 0, spotX, spotY)
  i.alpha = .2
  // moreProperties(i)
  g.stage.addChild(i)
  g.wait(d, () => {
    g.remove(i)
  })
}

export {
  debugShape,
  tempIndicator
}