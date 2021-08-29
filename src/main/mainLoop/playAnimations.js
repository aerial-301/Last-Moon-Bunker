import { g, units, bloodDrops, fadeOuts, shots } from "../../main.js"
import { removeItem } from "../../functions.js"


let animate = true
const animateUnits = () => {
  if (animate) {
    animate = false
    units.forEach(unit => {
      if (unit.isMoving) unit.moveAnimation()
      else unit.idleAnimation()
    })
    g.wait(5, () => animate = true)
  }
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


const fadeOut = () => {
  if (fadeOuts.length > 0) {
    fadeOuts.forEach(s => {
      if (s.alpha > 0.1) s.alpha -= s.fadeRate
      else {
        g.remove(s)
        removeItem(fadeOuts, s)
      }
    })
  }
}

export const playAnimations = () => {
  animateUnits()
  animateBulletImpact()
  animateBloodDrops()
  fadeOut()
}