import { makeRectangle } from "./drawings.js"
import { pointerOffsetX, pointerOffsetY, setPointerOffsets } from "./keyboard.js"
import { g, world, player } from "./main.js"

let middlePoint, camCenterX, camCenterY
const centerCam = () => {
  camCenterX = g.stage.width / 2
  camCenterY = g.stage.height / 2
  // world.x += (camCenterX - player.gx)
  // world.y += (camCenterY - player.gy)
  
  middlePoint = makeRectangle(1,1, '', 0)
  middlePoint.alpha = 0
}

const moveMazeCamera = () => {
  middlePoint.x = (g.pointer.x + player.gx + player.halfWidth) * 0.5
  middlePoint.x = (player.gx + player.halfWidth + middlePoint.x) * 0.5
  const x = (middlePoint.x - camCenterX) * 0.175 + 0.01
  world.x -= x

  middlePoint.y = (g.pointer.y + player.gy + player.halfHeight) * 0.5
  middlePoint.y = (player.gy + player.halfHeight + middlePoint.y) * 0.5
  const y = (middlePoint.y - camCenterY) * 0.175 + 0.01
  world.y -= y

  
}

export { centerCam, moveMazeCamera }