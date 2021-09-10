import { rectangle } from "./drawings.js"
import { g, surfaceHeight, surfaceWidth } from "./main.js"
import { world } from './main/mainSetUp/initLayers.js'
import { currentPlayer } from './keyboard.js'

let middlePoint, camCenterX, camCenterY

const initUnitCamera = () => {
  camCenterX = g.stage.width / 2
  camCenterY = g.stage.height / 2
  middlePoint = rectangle(1, 1, '', 0)
  middlePoint.alpha = 0
  world.x = -g.stage.width / 4
  world.y = 150

}
const centerUnitCamera = () => {
  middlePoint.x = (g.pointer.x + currentPlayer.gx + currentPlayer.halfWidth) * 0.5
  middlePoint.x = (currentPlayer.gx + currentPlayer.halfWidth + middlePoint.x) * 0.5

  const x = (middlePoint.x - camCenterX) * 0.175 + 0.01 
  const X = world.x - x

  if (X < 0 && X > -surfaceWidth + g.stage.width) world.x -= x 
    
  middlePoint.y = (g.pointer.y + currentPlayer.gy + currentPlayer.halfHeight) * 0.5
  middlePoint.y = (currentPlayer.gy + currentPlayer.halfHeight + middlePoint.y) * 0.5

  const y = (middlePoint.y - camCenterY) * 0.175 + 0.01 
  const Y = world.y - y
  if (Y > -surfaceHeight + g.stage.height) world.y -= y
}

export { initUnitCamera, centerUnitCamera }
