import { g, units, bloodDrops, bloodLakes, shots } from "../../main.js"
import { removeItem } from "../../functions.js"

const animateUnits = () => {
  units.forEach(unit => {
    if (unit.isMoving) unit.moveAnimation()
    else unit.idleAnimation()
  })
}

const animateBulletImpact = () => {
  if (shots.length > 0) {
    shots.forEach(shot => {
      shot.scaleX += 0.1
      shot.scaleY += 0.1
    })
  }
}

const animateBloodDrops = () => {
  if (bloodDrops.length > 0) {
    bloodDrops.forEach(drop => {
      drop.x += drop.vx
      drop.y += drop.vy
    })
  }
}

const animateBloodLakes = () => {
  if (bloodLakes.length > 0) {
    bloodLakes.forEach(lake => {
      if (lake.alpha > 0.1) lake.alpha -= 0.003
      else {
        g.remove(lake)
        removeItem(bloodLakes, lake)
      }
    })
  }
}

export const playAnimations = () => {
  animateUnits()
  animateBulletImpact()
  animateBloodDrops()
  animateBloodLakes()
}