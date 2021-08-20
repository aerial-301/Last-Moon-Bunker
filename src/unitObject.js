import { armedUnits, alertedEnemies, bloodSplats, C, enemies, floorLayer, g, PI, selectedUnits, uiLayer, MK, world, shots, movingUnits, attackingTarget, playerUnits, units, objLayer, currentPlayer } from './main.js'
import { newMoveTest, randomNum, removeItem, roll, scan, tempAngle } from './functions.js'
import { gun, makeEnemyEyes, makeLeg, makeCircle, makeHeadDetails, makeBorder, makeRectangle, makeTwoEyes, makeThirdEye, makeSlash, shotHit, laser, makeHead } from './drawings.js'
// import { debugShape } from '../extra/debug.js'
// import { gun, makeEnemyEyes } from '../extra/Drawing-Test.js'

const moreProperties = (o) => {
    o.yOffset = 0
    Object.defineProperties(o, {
      // gx: { get: () => { return (o.parent ? o.x + o.parent.gx : o.x) } },
      // gy: { get: () => { return (o.parent ? o.y + o.parent.gy : o.y) } },
      gx: { get: () => { return (o.x + (o.parent? o.parent.gx : 0) ) } },
      gy: { get: () => { return (o.y + (o.parent? o.parent.gy : 0) ) } },
      centerX: { get: () => { return o.gx + o.halfWidth } },
      centerY: { get: () => { return o.gy + o.halfHeight } },
      Y: { get: () => { return o.y + o.parent.gy + o.yOffset } }
    })
    o.children = []
    o.addChild = (c) => {
      if (c.parent) c.parent.removeChild(c)
      c.parent = o
      o.children.push(c)
    }
    o.removeChild = (c) => { if (c.parent === o) o.children.splice(o.children.indexOf(c), 1) }
}
const moreUnitsProperties = (o, n = 0) => {
  moreProperties(o)
  o.speed = 2
  o.obstacles = []
  o.leftLeg = makeLeg(5)
  o.rightLeg = makeLeg(30)

  o.head = makeHead()
  if (n) {
    o.headDetails = makeHeadDetails(n)
    o.head.addChild(o.headDetails)
    o.head.putCenter(o.headDetails, 0, -24)
  }
  
  o.playerHand = makeGeneralObject(1, 1)
  moreProperties(o.playerHand)
  // o.playerHand.visible = false
  o.weapon = o.playerHand
  o.attacked = false,
  o.damagedAmount = 0
  o.isDamaged = false
  o.isDead = false
  o.HBscale = 0.5
  o.firstStep = true
  o.justStoped = true
  o.addChild(o.leftLeg)
  o.leftLeg.y = o.height - o.leftLeg.height
  o.addChild(o.rightLeg)
  o.rightLeg.y = o.height - o.rightLeg.height
  o.addChild(o.head)

  const yellowHB = makeRectangle((o.health / o.baseHealth) * 100 * o.HBscale, 5, 'Yellow')
  o.addChild(yellowHB)
  o.yellowHB = yellowHB
  yellowHB.y = -10
  const HB = makeRectangle((o.health / o.baseHealth) * 100 * o.HBscale, 5, 'green')
  o.addChild(HB)
  o.HB = HB
  HB.y = -10
  HB.visible = false
  yellowHB.visible = false

  o.scanForTargets = (targets) => {
    targets.forEach(target => {
      if (g.gDistance(o, target) < o.range) {
        o.target = target
        attackingTarget.push(o)
        // return
      }
    })
  }

  o.idleAnimation = () => {
    if (!o.idleAnimated) {
      o.idleAnimated = true
      if (o.justStoped) {
        o.firstStep = true
        o.justStoped = false
        o.head.y = 0
        o.leftLeg.y = o.height - o.leftLeg.height
        o.rightLeg.y = o.height - o.rightLeg.height
        o.offsetCounter = 0
        o.idleOffset = 1
      }
      if (o.type == 'main') o.thirdEye.y = o.twoEyes.y - 10
      o.twoEyes.y = o.head.y + 10
      o.head.y += o.idleOffset
      o.offsetCounter += o.idleOffset
      if (o.offsetCounter >= 2) o.idleOffset -= 1
      else if (o.offsetCounter <= -2) o.idleOffset += 1
      g.wait(50, () => o.idleAnimated = false)
    }
  }
  o.moveAnimation = () => {
    if (!o.moveAnimated) {
      o.moveAnimated = true
      if (o.firstStep) {
        o.firstStep = false
        o.justStoped = true
        o.head.y = 0
        o.moveCounter = 0
        o.legOffset = 5
        o.oldLegOffset1 = 0
        o.oldLegOffset2 = 0
        o.oldLegOffset3 = 0
      }
      o.oldLegOffset3 = o.oldLegOffset2
      o.oldLegOffset2 = o.oldLegOffset1
      o.oldLegOffset1 = o.leftLeg.y
      o.moveCounter += o.legOffset
      o.leftLeg.y -= o.legOffset
      o.rightLeg.y = o.oldLegOffset3
      o.head.y = -Math.abs(o.legOffset) - 7
      o.twoEyes.y = o.head.y + 10
      if (o.type == 'main') o.thirdEye.y = o.twoEyes.y - 10
      if (o.moveCounter >= 15) o.legOffset -= 5
      else if (o.moveCounter <= 15) o.legOffset += 5
      g.wait(20, () => o.moveAnimated = false)
    }
  }
  o.getHit = (damage) => {
    // console.log(damage)
    o.health -= damage
    if (o.health <= 0) {
      o.isDead = true
      g.remove(o)
      removeItem(units, o)
      removeItem(attackingTarget, o)
      if (o.type == 'invader') {
        removeItem(enemies, o)
      } else {
        removeItem(playerUnits, o)
        removeItem(armedUnits, o)
      }
      // o.HB.width = 0
      // o.damagedAmount += (damage + o.health) * o.HBscale
      // if (!o.isDamaged) o.decreaseHB()



    }
    else {
      o.damagedAmount += damage * o.HBscale
      o.HB.width = (o.health / o.baseHealth) * 100 * o.HBscale
      if (MK) HB.width = (o.health / o.baseHealth) * 100 * o.HBscale
      if (!o.isDamaged) {
        o.isDamaged = true
        o.decreaseHB()
      }
      o.head.fillStyle = '#FFF'
      // o.HB.visible = true
      // o.headDetails.alpha = 0
      g.wait(80, () => {
          // o.headDetails.alpha = 1
          o.head.fillStyle = '#555'
      })
    }
  }
  o.decreaseHB = () => {
    if (o.damagedAmount > 0) {
      g.wait(2, () => {
        o.yellowHB.width -= 1 * 100 / o.baseHealth
        o.damagedAmount -= 1
        o.decreaseHB()
      })
    } else o.isDamaged = false
  }
}
const morePlayerProperties = (o, n = 1) => {
  moreUnitsProperties(o, n)
  // o.autoPilot = true
  o.border = makeBorder(50, 50)
  o.addChild(o.border)
  o.border.x -= o.halfWidth
  o.border.y -= o.halfHeight
  o.border.visible = false
  o.select = () => {
    selectedUnits.push(o)
    o.border.visible = true
    o.HB.visible = true
    o.yellowHB.visible = true
  }
  o.deselect = () => {
    o.border.visible = false
    o.HB.visible = false
    o.yellowHB.visible = false
  }
}
const makeGeneralObject = (w, h, x = 0, y = 0) => {
  const o = {
    x: x,
    y: y,
    width: w,
    height: h,
    halfWidth: w / 2,
    halfHeight: h / 2,
    scaleX: 1,
    scaleY: 1,
    pivotX: 0.5,
    pivotY: 0.5,
    rotation: 0,
    visible: true,

    alwaysVisible: false, // temp

    parent: undefined,
    stage: false,
    blendMode: undefined,
    alpha: 1,
    putCenter(b, xOff = 0, yOff = 0, a = this) {
      // b.x = a.x + a.halfWidth - b.width + xOff
      b.x = a.x + a.halfWidth - b.width + xOff
      b.y = a.y + a.halfHeight - b.halfHeight + yOff
    }
  }
  return o
}
const makeText = (content, font, fillStyle, x, y) => {
  const g = makeGeneralObject(content.length, 20, x, y)
  const o = {
    ...g,
    content: content,
    font: font || "12px sans-serif",
    fillStyle: fillStyle || "white",
    textBaseline: "top",
    render(c) {
      // c.strokeStyle = o.strokeStyle
      // c.lineWidth = o.lineWidth
      c.fillStyle = this.fillStyle
      if (o.width === 0) o.width = c.measureText(o.content).width
      if (o.height === 0) o.height = c.measureText("M").width
      c.translate(-o.width * o.pivotX, -o.height * o.pivotY)
      c.font = o.font
      c.textBaseline = o.textBaseline
      c.fillText(o.content, 0, 0)
    } 
  }
  moreProperties(o)
  uiLayer.addChild(o)
  return o
}
const makeMovableObject = (w, h, x = 0, y = 0) => {
  const g = makeGeneralObject(w, h, x, y)
  const o = {
    ...g,
    speed: 3, 
    vx: 0, 
    vy: 0, 
    destinationX: x, 
    destinationY: y, 
    scaned: false, 
    isMoving: false, 
    isCollided: false, 
    isColliding: false, 
    isCollidingH: false, 
    isCollidingV: false,
    stillCheck: false,
    xChanged: false,
    yChanged: false,
    changedDirection: false,
    collidedWith: null,
    collisionSide: null, 
    move() { newMoveTest(this) },
    scan() { scan(this) } 
  }
  return o
}
const mainPlayer = (x = 0, y = 0) => {
  let handPointerAngle
  // const health = 100
  const twoEyes = makeTwoEyes()
  const thirdEye = makeThirdEye()
  const sword = makeRectangle(2, 140, '#FFF', 0, 0)
  
  const swordHandle = makeRectangle(4, 40, '#0F0')
  const slash1 = makeSlash(1)
  const slash2 = makeSlash(0)
  const hitRange = 175
  // const handBase = makeGeneralObject(1, 1)
  const movableObject = makeMovableObject(50, 50)
  const p = {
    ...movableObject,
    type: 'main',
    health: 500,
    baseHealth: 500,
    damage: 0,
    twoEyes: twoEyes,
    thirdEye: thirdEye, 
    swordHandle: swordHandle,
    sword: sword,
    slash1: slash1,
    slash2: slash2,
    weaponRotation: PI,
    weaponAngle: C.idleSwordAngle,
    rollDistance: 10, rollCounter: 10, alertSent: false, 
    attack() {
      handPointerAngle = -tempAngle(this.playerHand, g.pointer)
      if (!this.attacked && !this.attacked2) {
        this.attacked = true
        this.swordHandle.rotation = handPointerAngle + C.attackSwordAngle
        this.rotation = 0
        this.attackHit(randomNum(14, 25))
        this.slash1.visible = true
        g.wait(40, () => this.slash1.visible = false)
        g.wait(150, () => this.attacked = false)
      }
      else if (!this.attacked2) {
        this.attacked2 = true
        this.swordHandle.rotation = handPointerAngle + C.idleSwordAngle
        this.attackHit(randomNum(23, 36))
        this.slash2.visible = true
        g.wait(40, () => this.slash2.visible = false)
        g.wait(70, () => this.attacked2 = false)
      }
    },
    attackHit(damage) {
      this.thirdEye.y += 1
      this.twoEyes.y += 2
      for (const enemy of enemies) {
        // Check distance between each enemy and playerHand
        const distance = g.gDistance(this.playerHand, enemy)
        // const distance2 = g.gDistance(this.playerHand, g.pointer, this.angleOffX, this.angleOffY)
        // console.log(`
        // toE = ${distance.toFixed()}
        // toP = ${distance2.toFixed()}
        // `)
        // tempIndicator(this.playerHand.centerX + this.angleOffX, this.playerHand.centerY + this.angleOffY)
        // tempIndicator(this.playerHand.gx, this.playerHand.gy)
        // If in range of the player attack than check if in direction of the sword slash arc thing
        if (distance <= hitRange) {
          // angle between playerHand and mouse pointer
          let angleToPointer = -tempAngle(this.playerHand, g.pointer)
          angleToPointer += 2 * PI * (angleToPointer < 0)
          // angle between playerHand and the enemy
          let angleToEnemy = -tempAngle(this.playerHand, enemy)
          angleToEnemy += 2 * PI * (angleToEnemy < 0)
          // Get the difference between those two angles
          const difference = angleToPointer - angleToEnemy
          // If difference is greater than 180 degrees subtract it from 360
          const smallest = difference > PI ? 2 * PI - difference : difference < -PI ? 2 * PI + difference : difference
          //  Calculated angles are all in Radians. 1.14 Radians is around 65 Degrees
          if (Math.abs(smallest) <= 1.14) {
            // enemy should get hit if within the slash arc
            const hitResult = enemy.getHit(damage)
            if (hitResult === 'dead') {
              removeItem(enemies, enemy)
              enemy.isDead = true
              const r = randomNum(2, 6)
              for (let i = 0; i < r; i++) {
                // const b = g.circle(15, '#900')
                const b = makeCircle(15, '#900', 0)
                floorLayer.addChild(b)
                b.x = enemy.x + randomNum(-50, 50)
                b.y = enemy.y + randomNum(-50, 50)
                b.health = 3
                b.limit = randomNum(7, 17)
                bloodSplats.push(b)
              }
              
            }
            // else {
            //   for (let i = 0 i < 1 i++) {
            //     const b = makeCircle(10, '#f00', 0)
            //     // b.blendMode = 'luminosity'
            //     objLayer.addChild(b)
            //     b.x = enemy.x
            //     b.y = enemy.y
            //     b.xd = randomNum(-3, 3)
            //     b.yd = randomNum(-3, 3)
            //     b.health = 13
            //     bloods.push(b)
            //   }
            // }
          }
        }
      }
    },
    roll(t = this) { roll(t, t.vx, t.vy) },
    alertEnemies(t = this) {
        if (enemies.length > 0) {
            if (!t.alertSent) {
                t.alertSent = true
                for (const enemy of enemies) {
                    const d = Math.sqrt(Math.pow((enemy.x - t.x), 2) + Math.pow((enemy.y - t.y), 2))
                    if (d < 300) {
                        alertedEnemies.push(enemy)
                    }
                }
                g.wait(700, () => { t.alertSent = false })
            }
        }
    } 
  }
  morePlayerProperties(p)
  const playerHand = p.playerHand
  p.addChild(twoEyes)
  p.putCenter(twoEyes, 0, -8)
  p.addChild(thirdEye)
  p.putCenter(thirdEye, 3, -170)
  // p.hand = handBase
  // p.addChild(handBase)
  // handBase.y = 27
  // handBase.x = 2.5
  thirdEye.addChild(playerHand)
  playerHand.addChild(swordHandle)
  swordHandle.x = swordHandle.halfWidth
  swordHandle.y = -12
  swordHandle.addChild(sword)
  sword.x = swordHandle.halfWidth - sword.halfWidth
  sword.y = swordHandle.height

  // thirdEye.alwaysVisible = true
  playerHand.alwaysVisible = true
  swordHandle.alwaysVisible = true
  sword.alwaysVisible = true
  p.alwaysVisible = true

  sword.addChild(slash1)
  sword.addChild(slash2)
  sword.putCenter(slash1, 67, -110)
  sword.putCenter(slash2, 70, -110)
  sword.scaleY *= -1
  // slash1.alpha = 0.0
  // slash2.alpha = 0.0
  swordHandle.rotation = PI
  p.weapon = swordHandle

  thirdEye.height = 170
  playerHand.x = -25
  playerHand.y = 16
  // const d = debugShape(playerHand)
  // world.addChild(d)
  p.x = x
  p.y = y
  return p
}
const newVillager = (x = 0, y = 0, armed = false) => {
  const twoEyes = makeTwoEyes(1, -17, -10)
  const m = makeMovableObject(50, 50)
  const o = {
    ...m, 
    type: 'villager',
    health: 100,
    baseHealth: 100,
    damage: 20,
    range: 400,
    twoEyes: twoEyes,
    weaponAngle: (PI / 2) + 0.1,
    weaponRotation: 0.4,
    target: null,
    attack(target = g.pointer) {
      if (armed) {
        if (!this.attacked) {
          const r = 5
          this.attacked = true
          let rx, ry, targetX, targetY, rate
          if (this == currentPlayer) {
            rx = randomNum(-40, 40)
            ry = randomNum(-35, 35)
            rate = 10
          } else {
            rx = randomNum(-60, 60)
            ry = randomNum(-60, 60)
            rate = 500
            
            this.weapon.rotation = -tempAngle(this.playerHand, target, this.angleOffX, this.angleOffY) + this.weaponAngle
          }

          targetX = target.centerX - r + rx + (-world.x)
          targetY = target.centerY - r + ry + (-world.y)

          const shot = shotHit(targetX, targetY)
          world.addChild(shot)
          shots.push(shot)
          this.weapon.fire()
          if (this == currentPlayer) {
            if (enemies.length > 0) {
              enemies.forEach(enemy => {
                if (g.gDistance(shot, enemy) < enemy.halfWidth + r) {
                  // console.log('e hit')
                  enemy.getHit(this.damage)
                }
              })
            }
          }
          else {

            if (g.gDistance(shot, target) < target.halfWidth + r) {
              // console.log('ally hit enenmy')
              target.getHit(24)
            }
          }
          g.wait(170, () => {
            g.remove(shot)
            removeItem(shots, shot)
          })
          g.wait(rate, () => { this.attacked = false })
        }
      }
    }
  }
  morePlayerProperties(o, 0)
  o.addChild(twoEyes)
  o.twoEyes.width = 50
  o.twoEyes.height = 50
  o.putCenter(twoEyes, 25, -25)
  const playerHand = o.playerHand
  o.twoEyes.addChild(playerHand)
  playerHand.width = 50
  playerHand.height = 50
  o.x = x
  o.y = y
  if (armed) gun(o)
  o.angleOffX = -25
  o.angleOffY = -40
  return o
}
const makeEnemy = (x = 0, y = 0) => {
  const m = makeMovableObject(50, 50, x, y)
  const eye = makeEnemyEyes()
  const o = {
    ...m,
    type: 'invader',
    baseHealth: 100,
    health: 100,
    damage: 10,
    range: 400,
    twoEyes: eye,
    weaponAngle: (PI / 2),// + 0.06,
    weaponRotation: PI,
    target: null,
    attack(target) {
      if(!this.attacked) {
        // console.log('e attacked')
        if (g.gDistance(this, target) > this.range) {
          this.target = null
          return
        }
        this.attacked = true

        this.weapon.rotation = -tempAngle(this.playerHand, target, this.angleOffX, this.angleOffY) + this.weaponAngle
        // const laser1 = laser(this.centerX, this.centerY, target.centerX, target.centerY)
        // const laser1 = laser(this.weapon.gx - world.x + 50, this.weapon.gy - world.y + 100, target.gx - world.x, target.gy - world.y)
        // this.weapon.addChild(laser1)
        // laser1.x = 0
        // laser1.y = 0

        // this.weapon.laser.visible = false


        this.laser.setLength(g.gDistance(this, target))
        this.laser.visible = true
        target.getHit(this.damage)

        g.wait(100, () => {
          this.laser.visible = false

          


        })
        
        // g.wait(100, () => g.remove(laser1))
        g.wait(800, () => this.attacked = false)
      }
    }
  }

  moreUnitsProperties(o)
  o.addChild(eye)
  o.twoEyes.addChild(o.playerHand)


  o.playerHand.width = 50
  o.playerHand.height = 50
  // o.x = x
  // o.y = y
  gun(o, false)



  // o.weapon.alwaysVisible = true
  // o.alwaysVisible = true
  // o.playerHand.alwaysVisible = true




  o.angleOffX = -23
  o.angleOffY = -40
  // o.HB.alpha = 1
  // o.yellowHB.alpha = 1


  // debugShape(o.twoEyes)

  return o
}
export { mainPlayer, newVillager, makeMovableObject, moreProperties, makeGeneralObject, makeText, makeEnemy }
