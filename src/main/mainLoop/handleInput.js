import { g, SURFACE_HEIGHT, SURFACE_WIDTH } from "../../main.js"
import { centerUnitCamera } from "../../camera.js"
import { movePlayer, moveCamera, currentPlayer, UC, switchMode } from "../../keyboard.js"
import { tempAngle } from "../../functions.js"
import { beginSelection } from "../../mouse.js"

export const playerInput = ( player = currentPlayer) => {
  if (UC) {
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
    moveCamera(SURFACE_WIDTH, SURFACE_HEIGHT)
  }
}