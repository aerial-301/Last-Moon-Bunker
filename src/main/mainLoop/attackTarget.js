import { g, attackingTarget } from "../../main.js"
import { removeItem } from "../../functions.js"

export const attackTarget = () => {
  if (attackingTarget.length > 0) {
    attackingTarget.forEach(unit => {
      if (!unit.target || unit.isDead || unit.target.isDead) {
        removeItem(attackingTarget, unit)
        unit.target = null
        g.wait(150, () => unit.weapon.rotation = unit.weaponRotation)
      } else unit.attack(unit.target)
    })
  }
}