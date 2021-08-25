import { g, surfaceHeight, surfaceWidth } from "../../main.js"
import { centerUnitCamera } from "../../camera.js"
import { movePlayer, moveCamera, currentPlayer, MK, switchMode } from "../../keyboard.js"
import { tempAngle } from "../../functions.js"
import { beginSelection } from "../../mouse.js"

export const playerInput = ( player = currentPlayer) => {
  if (MK) {
    if (player.isDead) {
      switchMode()
      return
    }
    centerUnitCamera()
    if (player.attacked || player.attacked2 || player.isRolling) return
    movePlayer()
    player.weapon.rotation = -tempAngle(player.playerHand, g.pointer, player.angleOffX, player.angleOffY) + player.weaponAngle
  }
  else {
    beginSelection()
    moveCamera(surfaceWidth, surfaceHeight)
  }
}