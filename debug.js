import { g } from './src/main.js'
import { rectangle } from "./src/drawings.js"
import { makeBasicObject } from "./src/unitObject.js"

export const debugShape = (shape) => {
  const s = rectangle(
    shape.width,
    shape.height,
    'white',
    0
  )
  s.alpha = 0.8
  shape.addChild(s)
  return s
}

export const tempIndicator = (spotX, spotY, d = 700, color = 'white', dia = 20) => {
  const o = {}
  makeBasicObject(o, dia, dia, color, 0, spotX, spotY)
  o.alpha = .2
  g.stage.addChild(o)
  g.wait(d, () => {
    g.remove(o)
  })
}
