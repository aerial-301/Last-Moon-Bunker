import { g } from './src/main.js'
import { rectangle } from "./src/drawings.js"
import { makeBasicObject } from "./src/unitObject.js"


const debugShape = (shape) => {
  const s = rectangle(
    shape.width,
    shape.height,
    'white',
    0
    // shape.gx,
    // shape.gy
  )
  s.alpha = 0.8
  // g.stage.addChild(s)
  shape.addChild(s)
  return s
}

const tempIndicator = (spotX, spotY, d = 700, color = 'white', dia = 20) => {
  // console.log(spotX, spotY)
  const o = {}
  makeBasicObject(o, dia, dia, color, 0, spotX, spotY)
  o.alpha = .2
  // moreProperties(i)
  g.stage.addChild(o)
  g.wait(d, () => {
    g.remove(o)
  })
}

export {
  debugShape,
  tempIndicator
}