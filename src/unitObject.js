import { enemies, g, PI, selectedUnits, shots, attackingTarget, playerUnits, units, movingUnits, K } from './main.js'
import { playerDie, newMoveTest, randomNum, removeItem, roll, scan, tempAngle, getUnitVector, setDirection } from './functions.js'
import { gun, makeLeg, makeHeadDetails, makeBorder, makeRectangle, makeTwoEyes, makeThirdEye, makeSlash, bulletImpact, makeHead, newMakeEnemyEyes, bloodDrop, makeGold } from './drawings.js'
import { world, floorLayer, space } from './main/mainSetUp/initLayers.js'
// import { debugShape } from './debug.js'
import { currentPlayer, UC } from './keyboard.js'
import { HQ } from './main/mainSetUp/initMap.js'


const idleSwordAngle = Math.PI / 180 * -60
const attackSwordAngle = Math.PI / 180 * (-60 + 120)
let hit = false
let handPointerAngle

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
  o.target = null
  o.attacked = false,
  o.isDamaged = false
  o.isDead = false
  o.damagedAmount = 0
  o.HBscale = 0.5
  o.yellowHB = makeRectangle((o.health / o.baseHealth) * 100 * o.HBscale, 5, 'Yellow')
  o.addChild(o.yellowHB)
  o.yellowHB.y = -10
  o.HB = makeRectangle((o.health / o.baseHealth) * 100 * o.HBscale, 5, 'green')
  o.addChild(o.HB)
  o.HB.y = -10
  o.HB.visible = false
  o.yellowHB.visible = false
  o.scanForTargets = (targets) => {
    if (o == currentPlayer) return
    // g.wait(randomNum(50, 200), () => {
      targets.forEach(target => {

        // const gd = g.GlobalDistance(o, target) / Math.sqrt(2)

        if (g.GlobalDistance(o, target) / Math.sqrt(2) <= o.range) {
          o.target = target
          if (attackingTarget.indexOf(o) == -1) {
            attackingTarget.push(o)
          }
        }
      })
    // })
  }
  o.getHit = (damage) => {

    o.health -= damage
    if (o.canBleed) {
      bloodDrop(o.x, o.y)
    }

    if (o.canRet) {
      if (!o.target || o.target.isDead) {
        o.scanForTargets(o.targets)
      }
    }

    if (o.health <= 0) {
      o.isDead = true
      g.remove(o)
      removeItem(units, o)
      removeItem(attackingTarget, o)
      o.die()
      return true
    }
    else {

      o.HB.alwaysVisible = true
      o.yellowHB.alwaysVisible = true
      o.damagedAmount += damage * o.HBscale
      o.HB.width = (o.health / o.baseHealth) * 100 * o.HBscale
      if (!o.isDamaged) {
        o.isDamaged = true
        o.decreaseHB()
      }
      o.changeColor()


      

    }
  }
  o.decreaseHB = () => {
    if (o.damagedAmount > 0) {
      g.wait(30, () => {
        o.yellowHB.width -= 1 * 100 / o.baseHealth
        o.damagedAmount -= 1
        o.decreaseHB()
      })
    } else {
      o.isDamaged = false
      o.HB.alwaysVisible = false
      o.yellowHB.alwaysVisible = false
    }
  }
  o.die = () => playerDie(o)
}

const makeUnitObject = (o, n = 0, x = 0, y = 0, e = 0) => {
  makeMovableObject(o, x, y)
  
  o.speed = 2
  o.leftLeg = makeLeg(5, e)
  o.rightLeg = makeLeg(30, e)
  o.head = makeHead(e)
  if (n) {
    o.headDetails = makeHeadDetails()
    o.head.addChild(o.headDetails)
  }
  o.playerHand = {}
  makeBasicObject(o.playerHand, 0, 0, 1, 1)
  o.playerHand.alwaysVisible = true
  o.weapon = o.playerHand
  o.firstStep = true
  o.justStoped = true
  o.addChild(o.leftLeg)
  o.leftLeg.y = o.height - o.leftLeg.height
  o.addChild(o.rightLeg)
  o.rightLeg.y = o.height - o.rightLeg.height
  o.addChild(o.head)
  o.canBleed = true
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
      if (o.type == 'MK') o.thirdEye.y = o.twoEyes.y
      // o.playerHand.y = o.twoEyes.y
      o.twoEyes.y = o.head.y + (o.type=='Pleb'?8:0)
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
      o.twoEyes.y = o.head.y + (o.type == 'Pleb'? 10:0)
      if (o.type == 'MK') o.thirdEye.y = o.twoEyes.y
      if (o.moveCounter >= 15) o.legOffset -= 5
      else if (o.moveCounter <= 15) o.legOffset += 5
      g.wait(20, () => o.moveAnimated = false)
    }
  }
  o.changeColor = () => {
    o.head.c1 = o.head.c2 = K.w
    g.wait(80, () => {
      o.head.c1 = '#222'
      o.head.c2 = '#555'
    })
  }
  moreProperties(o)
}

const makePlayerUnitObject = (o, n = 1, x = 0, y = 0, w = 50, h = 50) => {
  makeUnitObject(o, n, x, y)
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
  // o.obstacles.push(space)
}

const makeMovableObject = (o, x = 0, y = 0, w = 50, h = 50) => {
  o.speed = 2
  o.vx = 0
  o.vy = 0
  o.destinationX = x
  o.destinationY = y
  // o.spaceX = 0
  // o.spaceY = 0
  o.isSeeking = false
  o.goal = null
  o.getInRange = false
  o.scaned = false
  o.isMoving = false
  o.obstacles = [space]
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
    font: font, // "12px sans-serif"
    fs: fillStyle,
    textBaseline: "top",
    render(c) {
      c.fillStyle = this.fs
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
  return o
}

const slice1 = (o, t) => {
  o.attacked = true
  o.swordHandle.rotation = handPointerAngle + attackSwordAngle
  o.rotation = 0
  o.attackHit(t, randomNum(45, 63))
  const HZ = 100
  g.soundEffect(HZ, .18, 'triangle', .13, HZ * 5, true, 50)
  o.slash1.visible = true
  g.wait(40, () => o.slash1.visible = false)
  g.wait(150, () => o.attacked = false)
}

const slice2 = (o, t) => {
  o.attacked2 = true
  o.swordHandle.rotation = handPointerAngle + idleSwordAngle
  o.attackHit(t, randomNum(57, 82))
  const HZ = 100
  g.soundEffect(HZ, .14, 'triangle', .17, HZ * 5, true, 50)
  o.slash2.visible = true
  g.wait(40, () => o.slash2.visible = false)
  g.wait(120, () => o.attacked2 = false)
}

const newMainPlayer = (x = 0, y = 0) => {
  
  const twoEyes = makeTwoEyes()
  const thirdEye = makeThirdEye()
  const sword = makeRectangle(2, 140, '#FFF', 0, 0)
  const swordHandle = makeRectangle(4, 40, '#ea5')
  const slash1 = makeSlash(1)
  const slash2 = makeSlash(0)
  const hitRange = 175
  const o = {
    type: 'MK',
    health: 999,
    damage: 0,
    range: 400,
    twoEyes: twoEyes,
    thirdEye: thirdEye, 
    swordHandle: swordHandle,
    sword: sword,
    slash1: slash1,
    slash2: slash2,
    weaponRotation: 3,
    weaponAngle: idleSwordAngle,
    rollDistance: 10, 
    rollCounter: 10, 
    alertSent: false,
    
  }
  o.baseHealth = o.health
  makePlayerUnitObject(o, 1, x, y)
  
  o.attack = (target = g.pointer) => {
    if (UC || o.inRange) {
      handPointerAngle = -tempAngle(o.playerHand, target)
      if (!o.attacked && !o.attacked2) slice1(o, target)
      else if (!o.attacked2) slice2(o, target)
      o.inRange = false
    } else {

      if (g.GlobalDistance(o, target) > hitRange - 50) {
        if (!o.isRolling) {
          o.inRange = false
          o.rotation += 0.85
          o.destinationX = target.centerX - world.x
          o.destinationY = target.centerY - world.y
          setDirection(o)
          o.isRolling = true
          o.roll(o, o.vx, o.vy)
          // const HZ = 1
          // g.soundEffect(HZ, 0, .001, 'triangle', .09, 0, 0, HZ * 700, true)
          return
        }
      } else {
        o.rotation = 0
        o.inRange = true
      }

    }
  }

  o.attackHit = (target = g.pointer, damage) => {
    
    for (const enemy of enemies) {
      const distance = g.GlobalDistance(o.playerHand, enemy)
      if (distance <= hitRange) {
        let angleToPointer = -tempAngle(o.playerHand, target)
        angleToPointer += 2 * PI * (angleToPointer < 0)

        let angleToEnemy = -tempAngle(o.playerHand, enemy)
        angleToEnemy += 2 * PI * (angleToEnemy < 0)

        const difference = angleToPointer - angleToEnemy
        // If difference is greater than 180 degrees subtract it from 360
        const smallest = difference > PI ? 2 * PI - difference : difference < -PI ? 2 * PI + difference : difference
        //  Calculated angles are all in Radians. 1.14 Radians is around 65 Degrees
        if (Math.abs(smallest) <= 1.14) {
          if (enemy.getHit(damage)) {
            g.wait(500, () => {
              if (!o.target) {
                o.destinationX = HQ.x + 25
                o.destinationY = HQ.y + 200
                setDirection(o)
                o.roll(o, o.vx, o.vy)
              }
            })
          }

          
        }
      }
    }
  }
  o.roll = () => {
    if (o.isRolling) {
      const HZ = 1
      g.soundEffect(HZ, .29, 'sine', .1, HZ * 800, true)
      roll(o, o.vx, o.vy)
    }
  }

  o.targets = enemies
  
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

const makeArmed = (o) => {
  o.attack = (target = g.pointer) => {
    if (!o.attacked) {
      o.attacked = true
      const r = 5
      let rate
      if (o == currentPlayer) {
        rate = 10
        if (enemies.length > 0) {
          hit = false
          for (const enemy of enemies) {
            if (g.GlobalDistance(target, enemy) < enemy.halfWidth + r) {
              enemy.getHit(o.damage)
              hit = true
              break
            }
          }
        }
        if (!hit) shotHit()
      }
      else {
        o.isMoving = false
        if (g.GlobalDistance(o, target) > o.range) {
          o.target = null
          o.attacked = false
          return
        }
        rate = o.attackRate
        o.weapon.rotation = -tempAngle(o.playerHand, target, o.angleOffX, o.angleOffY) + o.weaponAngle
        target.getHit(o.damage)
      }

      o.weapon.fire()
      const HZ = 950
      g.soundEffect(HZ, .13, 'sine', .09, HZ * .7, false, 120)
      g.wait(rate, () => o.attacked = false)
    }
  }
  o.type = 'Scout'
  o.damage = 21
  o.range = 300
  o.attackRate = 500
  o.targets = enemies
  o.canRet = true
  o.weaponAngle = (PI / 2) + 0.1
  o.weaponRotation = 0.4
  gun(o)
  o.angleOffX = -25
  o.angleOffY = -40
}

const makePleb = (o) => {
  const twoEyes = makeTwoEyes(0, 8)
  o.twoEyes = twoEyes
  o.addChild(twoEyes)
  const playerHand = o.playerHand
  o.twoEyes.addChild(playerHand)
}

const createArmedPleb = (x = 0, y = 0) => {
  const o = {}
  o.health = 100
  o.baseHealth = o.health
  makePlayerUnitObject(o, 0, x, y)
  makePleb(o)
  makeArmed(o)
  return o
}

const createPleb = (x, y) => {
 const o = {}
 o.type = 'Pleb'
 o.mined = false
 o.isMining = false
 o.readyForOrder = true
 o.hasGold = false
 o.health = 50
 o.baseHealth = o.health
 o.attack = () => {}
 makePlayerUnitObject(o, 0, x, y)
 makePleb(o)

 o.scanForTargets = () => {}
 const gb = makeGold(0, 10)
 gb.visible = false
 gb.rotation = PI/2
 o.playerHand.addChild(gb)
 o.gb = gb
 return o
}

const createEnemyUnit = (x = 0, y = 0, hp) => {
  const o = {
    type: 'invader',
    health: hp,
    damage: 9,
    range: 300,
    weaponAngle: (PI / 2),
    weaponRotation: 0.4,
    targets: playerUnits,
  }
  o.baseHealth = o.health
  makeUnitObject(o, 0, x, y, 1)
  o.attack = (target) => {
    if(!o.attacked) {
      if (g.GlobalDistance(o, target) > o.range) {
        o.target = null
        return
      }
      o.attacked = true
      o.isMoving = false
      o.weapon.rotation = -tempAngle(o.playerHand, target, o.angleOffX, o.angleOffY) + o.weaponAngle
      o.laser.setLength(g.GlobalDistance(o, target))

      o.laser.alwaysVisible = true
      o.alwaysVisible = true
      o.playerHand.alwaysVisible = true
      o.twoEyes.alwaysVisible = true

      const HZ = 10
      g.soundEffect(HZ, .25, 'sine', .04, HZ * 120, true, 50)

      if (target.getHit(o.damage)) {
        o.isMoving = true
        movingUnits.push(o)
      }

      g.wait(25, () => {    
      o.laser.alwaysVisible = false
      o.alwaysVisible = false
      o.playerHand.alwaysVisible = false
      o.twoEyes.alwaysVisible = false
      })
      g.wait(800, () => o.attacked = false)
    }
  }

  
  o.canRet = true
  o.die = () => removeItem(enemies, o)
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

const shotHit = (tx = g.pointer.shiftedX, ty = g.pointer.shiftedY) => {
  // const shot = bulletImpact(tx, ty)
  const shot = bulletImpact(tx, ty)
  floorLayer.addChild(shot)
  shots.push(shot)

  g.wait(170, () => {
    g.remove(shot)
    removeItem(shots, shot)
  })
  
}

export { 
  makeBasicObject,
  makeMovableObject,
  makeText,
  moreProperties,
  createEnemyUnit,
  newMainPlayer,
  createPleb,
  createArmedPleb,
}
