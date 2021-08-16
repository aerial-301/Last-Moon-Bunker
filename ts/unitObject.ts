import { alertedEnemies, bloodSplats, C, enemies, floorLayer, g, PI, selectedUnits, uiLayer, MK } from './main.js'
import { globalAngle, newMoveTest, randomNum, removeItem, roll, scan } from './functions.js'
import { makeLeg, makeCircle, makeHeadDetails, makeBorder, makeRectangle, makeTwoEyes, makeThirdEye, makeSlash } from './drawings.js'

const moreProperties = (o) => {
  o.yOffset = 0
  Object.defineProperties(o, {
    gx: {get: () => {return o.parent ? o.x + o.parent.gx : o.x}},
    gy: {get: () => {return o.parent ? o.y + o.parent.gy : o.y}},
    centerX: {get: () => {return o.x + o.halfWidth}},
    centerY: {get: () => {return o.y + o.halfHeight}},
    Y: {get: () => {return o.y + o.parent.gy + o.yOffset}}
  })
  o.children = []
  o.addChild = (c) => {
    if (c.parent) c.parent.removeChild(c);
    c.parent = o;
    o.children.push(c)
  }
  o.removeChild = (c) => {if (c.parent === o) o.children.splice(o.children.indexOf(c), 1)}
  
}

const morePlayerProperties = (o, n = 1) => {
  moreProperties(o)
  o.path = []
  o.obstacles = []
  o.leftLeg = makeLeg(5)
  o.rightLeg = makeLeg(30)
  o.head = makeCircle(50, 'gray', 2)
  o.headDetails = makeHeadDetails(n)
  o.border = makeBorder(50, 50)

  o.damagedAmount = 0
  o.isDamaged = false
  o.HBscale = 0.5
  o.firstStep = true
  o.justStoped = true
  o.addChild(o.leftLeg)
  o.leftLeg.y = o.height - o.leftLeg.height
  o.addChild(o.rightLeg)
  o.rightLeg.y = o.height - o.rightLeg.height
  o.addChild(o.head)
  o.head.addChild(o.headDetails)
  o.head.putCenter(o.headDetails, 0, -24)
  o.addChild(o.border)
  o.border.x -= o.halfWidth
  o.border.y -= o.halfHeight
  o.border.alpha = 0
  o.select = () => {
    selectedUnits.push(o)
    o.border.alpha = 1
    o.HB.alpha = 1
    o.yellowHB.alpha = 1
  },
  o.deselect = () => {
    o.border.alpha = 0
    o.HB.alpha = 0
    o.yellowHB.alpha = 0
  },
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

      if (o.type == 'main') {
        o.thirdEye.y = o.twoEyes.y - 10
      }
      o.twoEyes.y = o.head.y + 10

      o.head.y += o.idleOffset
      o.offsetCounter += o.idleOffset
      if (o.offsetCounter >= 2) o.idleOffset -= 1
      else if (o.offsetCounter <= -2) o.idleOffset += 1
      g.wait(50, () => {
        o.idleAnimated = false
      })
    }
  },
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
      if (o.type  == 'main') {
        o.thirdEye.y = o.twoEyes.y - 10
      }

      if (o.moveCounter >= 15) o.legOffset -= 5
      else if (o.moveCounter <= 15) o.legOffset += 5

      g.wait(20, () => {
        o.moveAnimated = false
      })
    }
  },
  o.getHit = (damage) => {
    o.health -= damage
    if (o.health <= 0) {
      // gameOverScreen()
      o.HB.width = 0
      o.damagedAmount += (damage + o.health) * o.HBscale
      if (!o.isDamaged) o.decreaseHB()

    } else {
      o.damagedAmount += damage * o.HBscale
      o.HB.width = (o.health / o.baseHealth) * 100 * o.HBscale
      if (!o.isDamaged) {
        o.isDamaged = true
        o.decreaseHB()
      }
      o.head.fillStyle = 'red'
      o.headDetails.alpha = 0
      g.wait(80, () => {
        o.headDetails.alpha = 1
        o.head.fillStyle = 'gray'
      })
    }
  }

  o.decreaseHB = () => {
    if (o.damagedAmount > 0) {
      g.wait(1, () => {
        o.yellowHB.width -= 1
        o.damagedAmount -= 1
        o.decreaseHB()
      })
    } else {
      o.isDamaged = false
    }
  }

  if (!MK) {
    const yellowHB = makeRectangle((o.health / o.baseHealth) * 100 * o.HBscale, 5, 'Yellow')
    o.addChild(yellowHB)
    o.yellowHB = yellowHB
    yellowHB.x = o.x + o.halfWidth - yellowHB.halfWidth
    yellowHB.y = o.y - 10

    const HB = makeRectangle((o.health / o.baseHealth) * 100 * o.HBscale, 5, 'green')
    o.addChild(HB)
    o.HB = HB
    HB.x = o.x + o.halfWidth - HB.halfWidth
    HB.y = o.y - 10
    HB.alpha = yellowHB.alpha = 0
  }




}

const makeGeneralObject = (w: number, h: number, x = 0, y = 0) => {
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
    parent: undefined,
    stage: false,
    blendMode: undefined,
    alpha: 1,
    putCenter(b, xOff = 0, yOff = 0, a = this) {
      b.x = a.x + a.halfWidth - b.width + xOff
      b.y = a.y + a.halfHeight - b.halfHeight + yOff
    },
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
      // c.strokeStyle = o.strokeStyle;
      // c.lineWidth = o.lineWidth;
      c.fillStyle = this.fillStyle;
      if (o.width === 0)
          o.width = c.measureText(o.content).width;
      if (o.height === 0)
          o.height = c.measureText("M").width;
      c.translate(-o.width * o.pivotX, -o.height * o.pivotY);
      c.font = o.font;
      c.textBaseline = o.textBaseline;
      c.fillText(o.content, 0, 0);
    }
  }
  moreProperties(o)
  uiLayer.addChild(o)
  return o
}

const makeMovableObject = (w: number, h: number, x = 0, y = 0) => {
  const g = makeGeneralObject(w ,h, x, y)
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
    // move(b = 0) {move(this, b)},
    // move(b = 0) {newMove(this, b)},
    move() {newMoveTest(this)},
    scan() {scan(this)},
  }
  return o
}

const mainPlayer = (x = 0, y = 0) => {
  let handPointerAngle
  const health = 100

  const twoEyes = makeTwoEyes()
  const thirdEye = makeThirdEye()
  const playerHand = makeGeneralObject(1, 1)
  moreProperties(playerHand)
  const sword = makeRectangle(2, 140, '#FFF', 0)
  const swordHandle = makeRectangle(4, 40, '#0F0')
  const slash1 = makeSlash(1)
  const slash2 = makeSlash(0)
  const hitRange = 163

  const movableObject = makeMovableObject(50, 50)

  const p = {
    ...movableObject,
    type: 'main',
    health: 100,
    baseHealth: 100,
    speed: 5,
    damage: 0,
    twoEyes: twoEyes,
    thirdEye: thirdEye,
    playerHand: playerHand,
    swordHandle: swordHandle,
    sword: sword,
    slash1: slash1,
    slash2: slash2,
    attacked: false,
    attacked2: false,
    isRolling: false,
    rollDistance: 10,
    rollCounter: 10,
    alertSent: false,
    attack() {
      handPointerAngle = -globalAngle(this.playerHand, g.pointer)
      if (!this.attacked && !this.attacked2) {
        this.attacked = true
        this.swordHandle.rotation = handPointerAngle + C.attackSwordAngle
        this.rotation = 0
        this.attackHit(randomNum(14, 25))
        this.slash1.alpha = 1
        g.wait(40, () => { this.slash1.alpha = 0 })
        g.wait(150, () => { this.attacked = false })
      } else if (!this.attacked2) {
        this.attacked2 = true
        this.swordHandle.rotation = handPointerAngle + C.idleSwordAngle
        this.attackHit(randomNum(23, 36))
        this.slash2.alpha = 1
        g.wait(40, () => { this.slash2.alpha = 0 })
        g.wait(70, () => { this.attacked2 = false })
      }
    },
    attackHit(damage: number) {
      this.thirdEye.y += 1
      this.twoEyes.y += 2
      // this.head.y = 0
      // this.playerHand.y = this.halfHeight
      for (const enemy of enemies) {
        // Check distance between each enemy and playerHand
        const distance = g.gDistance(this.playerHand, enemy)

        // If in range of the player attack than check if in direction of the sword slash arc thing
        if (distance <= hitRange) {

          // angle between playerHand and mouse pointer
          let angleToPointer = -globalAngle(this.playerHand, g.pointer)
          angleToPointer += 2 * PI * (angleToPointer < 0)

          // angle between playerHand and the enemy
          let angleToEnemy = -globalAngle(this.playerHand, enemy)
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
              };
            } 
            
            // else {
            //   for (let i = 0; i < 1; i++) {
            //     const b = makeCircle(10, '#f00', 0)
            //     // b.blendMode = 'luminosity'
            //     objLayer.addChild(b)
            //     b.x = enemy.x
            //     b.y = enemy.y
            //     b.xd = randomNum(-3, 3)
            //     b.yd = randomNum(-3, 3)
            //     b.health = 13
            //     bloods.push(b)
            //   };
            // }
          }
        }
      }
    },
    roll(t = this) {roll(t, t.vx, t.vy)},
    alertEnemies(t = this) {
      if (enemies.length > 0) {
        if (!t.alertSent) {
          t.alertSent = true
          for (const enemy of enemies) {
            const d = Math.sqrt((enemy.x - t.x) ** 2 + (enemy.y - t.y) ** 2)
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

  p.addChild(twoEyes)
  p.putCenter(twoEyes, 0, - 8)
  p.addChild(thirdEye)
  p.putCenter(thirdEye, 0, - 18)
  thirdEye.addChild(playerHand)

  playerHand.x = Math.random() > 0.5 ? -20 : 31
  playerHand.y = p.halfHeight
  
  playerHand.addChild(swordHandle)
  swordHandle.x -= swordHandle.halfWidth - playerHand.halfWidth
  swordHandle.y -= swordHandle.halfHeight - playerHand.halfHeight
  swordHandle.addChild(sword)
  sword.x = swordHandle.halfWidth - sword.halfWidth
  sword.y = swordHandle.height
  sword.addChild(slash1)
  sword.addChild(slash2)
  sword.putCenter(slash1, 67, -110)
  sword.putCenter(slash2, 70, -110)
  sword.scaleY *= -1
  slash1.alpha = 0.0
  slash2.alpha = 0.0
  swordHandle.rotation = PI


  // const HBscale = 1
  // Health bar

  if (MK) {
    p.HBscale = 2
    const blackHB = makeRectangle((p.health / p.baseHealth) * 100 * p.HBscale, 5, 'black', 8, 100, 20)
    blackHB.strokeStyle = 'darkgray'
    uiLayer.addChild(blackHB)
    p.blackHB = blackHB
    
    const yellowHB = makeRectangle((p.health / p.baseHealth) * 100 * p.HBscale, 5, 'Yellow', 0, 100, 20)
    uiLayer.addChild(yellowHB)
    p.yellowHB = yellowHB

    const HB = makeRectangle((p.health / p.baseHealth) * 100 * p.HBscale, 5, 'red', 0, 100, 20)
    uiLayer.addChild(HB)
    p.HB = HB 
    // HB.alpha = 1
  }
    


  p.x = x
  p.y = y
  return p
}

const newVillager = (x = 0, y = 0) => {
  const twoEyes = makeTwoEyes(1)
  const m = makeMovableObject(50, 50)
  const o = {
    ...m,
    type: 'villager',
    health: 100,
    baseHealth: 100,
    speed: 5,
    damage: 0,
    twoEyes: twoEyes,
  }
  morePlayerProperties(o, 0)
  o.addChild(twoEyes)
  o.putCenter(twoEyes, 0, - 8)

  o.x = x
  o.y = y
  return o
}

export {
  mainPlayer,
  newVillager,
  makeMovableObject,
  moreProperties,
  makeGeneralObject,
  makeText,
}