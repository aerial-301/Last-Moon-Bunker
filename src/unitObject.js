import { armedUnits, alertedEnemies, bloodSplats, C, enemies, floorLayer, g, PI, selectedUnits, uiLayer, MK, world, shots, movingUnits, attackingTarget, playerUnits, units, objLayer, currentPlayer } from './main.js'
import { newMoveTest, randomNum, removeItem, roll, scan, tempAngle } from './functions.js'
import { gun, makeEnemyEyes, makeLeg, makeCircle, makeHeadDetails, makeBorder, makeRectangle, makeTwoEyes, makeThirdEye, makeSlash, shotHit, laser, makeHead, newMakeEnemyEyes } from './drawings.js'
import { debugShape } from './debug.js'

const makeBasicObject = (o, x = 0, y = 0, w = 50, h = 50) => {
  o.x= x
  o.y= y
  o.width= w
  o.height= h
  o.halfWidth= w / 2
  o.halfHeight= h / 2
  o.scaleX= 1
  o.scaleY= 1
  o.pivotX= 0.5
  o.pivotY= 0.5
  o.rotation= 0
  o.alpha= 1
  o.stage= false
  o.visible= true
  o.children = []
  o.parent= undefined
  o.blendMode= undefined
  o.addChild = (c) => {
    if (c.parent) c.parent.removeChild(c)
    c.parent = o
    o.children.push(c)
  }
  o.removeChild = (c) => { if (c.parent === o) o.children.splice(o.children.indexOf(c), 1) }
  Object.defineProperties(o, {
    gx: { get: () => { return (o.x + (o.parent? o.parent.gx : 0) ) } },
    gy: { get: () => { return (o.y + (o.parent? o.parent.gy : 0) ) } },
    centerX: { get: () => { return o.gx + o.halfWidth } },
    centerY: { get: () => { return o.gy + o.halfHeight } },
    bottom: { get: () => { return o.y + o.parent.gy} }
  })
}

const moreProperties = (o) => {
  o.yellowHB = makeRectangle((o.health / o.baseHealth) * 100 * o.HBscale, 5, 'Yellow')
  o.addChild(o.yellowHB)
  o.yellowHB.y = -10
  o.HB = makeRectangle((o.health / o.baseHealth) * 100 * o.HBscale, 5, 'green')
  o.addChild(o.HB)
  o.HB.y = -10
  o.HB.visible = false
  o.yellowHB.visible = false
  o.scanForTargets = (targets) => {
    targets.forEach(target => {
      if (g.GlobalDistance(o, target) < o.range) {
        o.target = target
        attackingTarget.push(o)
      }
    })
  }
  o.getHit = (damage) => {
    o.health -= damage
    if (o.health <= 0) {
      o.isDead = true
      g.remove(o)
      removeItem(units, o)
      removeItem(attackingTarget, o)
      if (o.type == 'invader') removeItem(enemies, o)
      else {
        removeItem(playerUnits, o)
        removeItem(armedUnits, o)
      }
    }
    else {
      o.damagedAmount += damage * o.HBscale
      o.HB.width = (o.health / o.baseHealth) * 100 * o.HBscale
      if (MK) o.HB.width = (o.health / o.baseHealth) * 100 * o.HBscale
      if (!o.isDamaged) {
        o.isDamaged = true
        o.decreaseHB()
      }
      o.changeColor()
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

const makeUnitObject = (o, n = 0, x = 0, y = 0, w = 50, h = 50) => {
  makeMovableObject(o, x, y)
  o.speed = 2
  o.leftLeg = makeLeg(5)
  o.rightLeg = makeLeg(30)
  o.head = makeHead()
  if (n) {
    o.headDetails = makeHeadDetails(n)
    o.head.addChild(o.headDetails)
  }
  o.playerHand = {}
  makeBasicObject(o.playerHand, 0, 0, 1, 1)
  o.playerHand.alwaysVisible = true
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
  o.scanForTargets = (targets) => {
    targets.forEach(target => {
      if (g.GlobalDistance(o, target) < o.range) {
        o.target = target
        attackingTarget.push(o)
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
      if (o.type == 'main') o.thirdEye.y = o.twoEyes.y
      o.twoEyes.y = o.head.y + (o.type=='villager'?8:0)
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
      o.twoEyes.y = o.head.y + (o.type == 'villager'? 10:0)
      if (o.type == 'main') o.thirdEye.y = o.twoEyes.y
      if (o.moveCounter >= 15) o.legOffset -= 5
      else if (o.moveCounter <= 15) o.legOffset += 5
      g.wait(20, () => o.moveAnimated = false)
    }
  }
  o.changeColor = () => {
    o.head.c1 = o.head.c2 = '#FFF'
    g.wait(80, () => {
      o.head.c1 = '#222'
      o.head.c2 = '#555'
    })
  }
  moreProperties(o)
}

const makePlayerUnitObject = (o, n = 1, x = 0, y = 0, w = 50, h = 50) => {
  makeUnitObject(o, n, x, y, w, h)
  o.border = makeBorder(w, h)
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

const makeMovableObject = (o, x = 0, y = 0, w = 50, h = 50) => {
  o.speed = 2
  o.vx = 0
  o.vy = 0
  o.destinationX = x
  o.destinationY = y
  o.scaned = false
  o.isMoving = false
  o.obstacles = []
  o.isCollided = false
  o.isColliding = false
  o.isCollidingH = false
  o.isCollidingV = false
  o.stillCheck = false
  o.xChanged = false
  o.yChanged = false
  o.changedDirection = false
  o.collidedWith = null
  o.collisionSide = null
  o.move = () => newMoveTest(o)
  o.scan = () => scan(o)
  makeBasicObject(o, x, y, w, h)
}

const makeText = (parent, content, font, fillStyle, x, y) => {
  const o = {
    content: content,
    font: font || "12px sans-serif",
    fillStyle: fillStyle || "white",
    textBaseline: "top",
    render(c) {
      c.fillStyle = this.fillStyle
      if (o.width === 0) o.width = c.measureText(o.content).width
      if (o.height === 0) o.height = c.measureText("M").width
      c.translate(-o.width * o.pivotX, -o.height * o.pivotY)
      c.font = o.font
      c.textBaseline = o.textBaseline
      c.fillText(o.content, 0, 0)
    } 
  }
  makeBasicObject(o, x, y, content.length, 20)
  parent.addChild(o)
}

const newMainPlayer = (x = 0, y = 0) => {
  let handPointerAngle
  const twoEyes = makeTwoEyes()
  const thirdEye = makeThirdEye()
  const sword = makeRectangle(2, 140, '#FFF', 0, 0)
  const swordHandle = makeRectangle(4, 40, '#0F0')
  const slash1 = makeSlash(1)
  const slash2 = makeSlash(0)
  const hitRange = 175
  const o = {
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
    weaponRotation: 3,
    weaponAngle: C.idleSwordAngle,
    rollDistance: 10, 
    rollCounter: 10, 
    alertSent: false,
  }
    
  o.attack = () => {
    handPointerAngle = -tempAngle(o.playerHand, g.pointer)
    if (!o.attacked && !o.attacked2) {
      o.attacked = true
      o.swordHandle.rotation = handPointerAngle + C.attackSwordAngle
      o.rotation = 0
      o.attackHit(randomNum(14, 25))
      o.slash1.visible = true
      g.wait(40, () => o.slash1.visible = false)
      g.wait(150, () => o.attacked = false)
    }
    else if (!o.attacked2) {
      o.attacked2 = true
      o.swordHandle.rotation = handPointerAngle + C.idleSwordAngle
      o.attackHit(randomNum(23, 36))
      o.slash2.visible = true
      g.wait(40, () => o.slash2.visible = false)
      g.wait(70, () => o.attacked2 = false)
    }
  }
  o.attackHit = (damage) => {
    for (const enemy of enemies) {
      // Check distance between each enemy and playerHand
      const distance = g.GlobalDistance(o.playerHand, enemy)
      // If in range of the player attack than check if in direction of the sword slash arc thing
      if (distance <= hitRange) {
        // angle between playerHand and mouse pointer
        let angleToPointer = -tempAngle(o.playerHand, g.pointer)
        angleToPointer += 2 * PI * (angleToPointer < 0)
        // angle between playerHand and the enemy
        let angleToEnemy = -tempAngle(o.playerHand, enemy)
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
  }
  o.roll = () => roll(o, o.vx, o.vy)
  
  makePlayerUnitObject(o, 1, x, y)
  const playerHand = o.playerHand
  o.addChild(twoEyes)
  o.addChild(thirdEye)
  thirdEye.addChild(playerHand)
  playerHand.addChild(swordHandle)
  swordHandle.x = -1
  swordHandle.y = -21
  swordHandle.addChild(sword)
  sword.x = swordHandle.halfWidth - sword.halfWidth
  sword.y = swordHandle.height
  playerHand.alwaysVisible = true
  swordHandle.alwaysVisible = true
  sword.alwaysVisible = true
  o.alwaysVisible = true
  sword.addChild(slash1)
  slash1.x = -24.5
  slash1.y = -25.5
  sword.addChild(slash2)
  slash2.x = -23.5
  slash2.y = -25.5
  sword.scaleY *= -1
  swordHandle.rotation = o.weaponRotation
  o.weapon = swordHandle
  playerHand.x = -1
  playerHand.y = 28
  return o
}

const createPlayerUnit = (x = 0, y = 0, armed = false) => {
  const twoEyes = makeTwoEyes(0, 8)
  const o = {
    type: 'villager',
    health: 100,
    baseHealth: 100,
    damage: 20,
    range: 400,
    twoEyes: twoEyes,
    weaponAngle: (PI / 2) + 0.1,
    weaponRotation: 0.4,
    target: null,
  }
  o.attack = (target = g.pointer) => {
      if (armed) {
        if (!o.attacked) {
          const r = 5
          o.attacked = true
          let rx, ry, targetX, targetY, rate
          if (o == currentPlayer) {
            rx = randomNum(-40, 40)
            ry = randomNum(-35, 35)
            rate = 10
          } else {
            rx = randomNum(-60, 60)
            ry = randomNum(-60, 60)
            rate = 500
            
            o.weapon.rotation = -tempAngle(o.playerHand, target, o.angleOffX, o.angleOffY) + o.weaponAngle
          }

          targetX = target.centerX - r + rx + (-world.x)
          targetY = target.centerY - r + ry + (-world.y)

          const shot = shotHit(targetX, targetY)
          world.addChild(shot)
          shots.push(shot)
          o.weapon.fire()
          if (o == currentPlayer) {
            if (enemies.length > 0) {
              enemies.forEach(enemy => {
                if (g.GlobalDistance(shot, enemy) < enemy.halfWidth + r) {
                  // console.log('e hit')
                  enemy.getHit(o.damage)
                }
              })
            }
          }
          else {

            if (g.GlobalDistance(shot, target) < target.halfWidth + r) {
              // console.log('ally hit enenmy')
              target.getHit(24)
            }
          }
          g.wait(170, () => {
            g.remove(shot)
            removeItem(shots, shot)
          })
          g.wait(rate, () => { o.attacked = false })
        }
      }
  }
  makePlayerUnitObject(o, 0, x, y)
  o.addChild(twoEyes)
  const playerHand = o.playerHand
  o.twoEyes.addChild(playerHand)
  if (armed) gun(o)
  o.angleOffX = -25
  o.angleOffY = -40
  return o
}

const createEnemyUnit = (x = 0, y = 0) => {
  const o = {
    type: 'invader',
    baseHealth: 100,
    health: 100,
    damage: 10,
    range: 700,
    weaponAngle: (PI / 2),
    weaponRotation: PI,
    target: null
  }
  o.attack = (target) => {
    if(!o.attacked) {
      if (g.GlobalDistance(o, target) > o.range) {
        o.target = null
        return
      }
      o.attacked = true
      o.weapon.rotation = -tempAngle(o.playerHand, target, o.angleOffX, o.angleOffY) + o.weaponAngle
      o.laser.setLength(g.GlobalDistance(o, target))

      o.laser.alwaysVisible = true
      o.alwaysVisible = true
      o.playerHand.alwaysVisible = true
      o.twoEyes.alwaysVisible = true

      target.getHit(o.damage)

      g.wait(50, () => {    
      o.laser.alwaysVisible = false
      o.alwaysVisible = false
      o.playerHand.alwaysVisible = false
      o.twoEyes.alwaysVisible = false
      })
      g.wait(800, () => o.attacked = false)
    }
  }
  makeUnitObject(o, 0, x, y)
  o.twoEyes = newMakeEnemyEyes()
  o.addChild(o.twoEyes)
  o.twoEyes.addChild(o.playerHand)
  o.playerHand.width = 50
  o.playerHand.height = 50
  gun(o, false)
  o.angleOffX = -23
  o.angleOffY = -40
  return o
}

export { 
  newMainPlayer, 
  createPlayerUnit, 
  makeText, 
  createEnemyUnit,
  makeBasicObject,
  makeMovableObject,
  moreProperties
}
