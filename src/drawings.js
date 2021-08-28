import { solids, g, playerUnits, armedUnits, enemies, bloodDrops, fadeOuts, K } from "./main.js"
import { gridMap } from "./main/mainSetUp/initMap.js"
import { world, floorLayer, objLayer, uiLayer } from "./main/mainSetUp/initLayers.js"
import { makeMovableObject, makeBasicObject, moreProperties } from "./unitObject.js"
import { playerDie, randomNum, removeItem, setCellValue } from "./functions.js"

// import { debugShape } from "./debug.js"
const BP = (c) => c.beginPath()
const MT = (c, x, y) => c.moveTo(x, y)
const SK = (c) => c.stroke()
const FL = (c) => c.fill()
const L = (c, x, y) => c.lineTo(x, y)
const FR = (c, x, y, w, h) => c.fillRect(x, y, w, h)



const PI = Math.PI

const makeCircle = (d, k, l, movable = false, x = 0, y = 0) => {
  const o = {
    f: k,
    radius: d / 2 
  }
  o.render = (c) => {
    c.lineWidth = l
    c.fillStyle = o.f
    // c.beginPath()
    BP(c)
    c.arc(o.radius + (-o.radius * 2 * o.pivotX), o.radius + (-o.radius * 2 * o.pivotY), o.radius, 0, 2 * PI, false)
    // if (l) c.stroke()
    if (l) SK()
    // c.fill()
    FL(c)
  }
  if (!movable) makeBasicObject(o, x, y, d, d)
  else makeMovableObject(o, x, y, d, d)
  return o
}
const makeRectangle = (w, h, k, s = 1, x = 0, y = 0) => {
  const o = {
    x: x,
    y: y,
    width: w,
    height: h,
    f: k,
    // strokeStyle: K.b
  }
  o.render = (c) => {
    // c.strokeStyle = o.strokeStyle
    c.lineWidth = s
    c.fillStyle = o.f
    // c.beginPath()
    BP(c)
    // c.moveTo(x, y)
    MT(c, x, y)
    c.rect(-o.width * o.pivotX, -o.height * o.pivotY, o.width, o.height)
    // c.fill()
    FL(c)
    // if (s) c.stroke()
    if (s) SK(c)
  }
  makeBasicObject(o, x, y, w, h)
  return o
}
const makeSelectionBox = () => {
  const o = {
    WIDTH: 1,
    HEIGHT: 1,
    render(c) {
      c.strokeStyle = '#FFF'
      c.lineWidth = 4
      // c.beginPath()
      // c.rect(o.WIDTH, o.HEIGHT, -o.WIDTH, -o.HEIGHT)
      // c.stroke()
      BP(c)
      c.rect(o.WIDTH, o.HEIGHT, -o.WIDTH, -o.HEIGHT)
      SK(c)
    } 
  }
  makeBasicObject(o, 0, 0, 1, 1)
  return o
}
const makeSlash = (n) => {
  const o = {
    render(c) {
      c.fillStyle = '#fff'
      if (n) {
        BP(c)
        c.arc(0, 160, 160, PI * 1.5, PI * 0.165, false)
        c.arc(65, 195, 85, PI * 0.165, PI * 1.225, true)
        FL(c)
      } else {
        BP(c)
        c.arc(0, 160, 160, PI * 1.5, PI * 0.835, true)
        c.arc(-65, 195, 85, PI * 0.835, PI * 1.772, false)
        FL(c)
      }
    } 
  }
  makeBasicObject(o, 0, 0)
  o.visible = false
  return o
}

const makeHead = () => {
  const o = {
    c1: '#222',
    c2: '#555',
  }
  o.render = (c) => {
    const grad = c.createRadialGradient(2, -3, 27, 10, -20,0)
    grad.addColorStop(0, o.c1)
    grad.addColorStop(0.1, o.c2)
    c.strokeStyle = K.b
    c.fillStyle = grad
    c.lineWidth = 2
    BP(c)
    c.arc(0, 0, 25, 0, 2 * PI, false)
    SK(c)
    FL(c)
  } 
  makeBasicObject(o)
  o.head = o
  return o
}

const makeTwoEyes = (x = 0, y = 0) => {
  const o = {
    render(c) {
      // const LL = (x, y) => c.lineTo(x, y)
      // c.lineJoin = 'round'
      c.strokeStyle = K.b
      c.fillStyle = K.r
      c.lineWidth = 0.7
      // c.beginPath()
      BP(c)
      // c.moveTo(-18, -10)
      MT(c, -18, -10)
      // c.lineTo(-4, 0)
      // c.lineTo(-18, -5)
      // c.lineTo(-18, -10)
      L(c, -4, 0)
      // L(c, -4, 0)
      L(c, -18, -5)
      L(c, -18, -10)
      // c.fill()
      FL(c)
      // Right eye
      // c.moveTo(18, -10)
      MT(c, 18, -10)
      // c.lineTo(4, 0)
      // c.lineTo(18, -5)
      // c.lineTo(18, -10)
      L(c, 4, 0)
      L(c, 18, -5)
      L(c, 18, -10)
      // c.fill()
      // c.stroke()
      FL(c)
      SK(c)
    } 
  }
  makeBasicObject(o, x, y)
  return o
}
const makeThirdEye = () => {
  const o = {
    render(c) {
      c.strokeStyle = '#000'
      c.fillStyle = 'red'
      c.lineWidth = .8
      // c.beginPath()
      // c.moveTo(-3, -18)
      // c.lineTo(3, -18)
      // c.lineTo(0, -3)
      // c.lineTo(-3, -18)
      // c.fill()
      // c.stroke()
      BP(c)
      MT(c, -3, -18)
      L(c, 3, -18)
      L(c, 0, -3)
      L(c, -3, -18)
      FL(c)
      SK(c)

    } 
  }
  makeBasicObject(o)
  return o
}
const makeLeg = (x) => {
  const o = {
    render(c) {
      c.strokeStyle = '#000'
      c.fillStyle = '#555'
      c.lineWidth = 1
      BP(c)
      MT(c, 0, 0)
      L(c, 6, 0)
      L(c, 6, 4)
      L(c, 0, 4)
      L(c, 0, 0)
      FL(c)
      SK(c)
    } 
  }
  makeBasicObject(o, x, 0, 7, 5)
  return o
}
const makeBorder = (w, h) => {
  const o = {
    render(c) {
      const l = (x,y) => L(c, x, y)
      c.strokeStyle = '#FFF'
      c.lineWidth = 2
      BP(c)
      MT(c, 0, 0)
      l(w / 4, 0)
      MT(c, w - w / 4, 0)
      l(w, 0)
      l(w, w / 4)
      MT(c, w, h - w / 4)
      l(w, h)
      l(w - w / 4, h)
      MT(c, w / 4, h)
      l(0, h)
      l(0, h - w / 4)
      MT(c, 0, w / 4)
      l(0, 0)
      SK(c)
    } 
  }
  makeBasicObject(o, 0, 0, w, h)
  return o
}
const makeHeadDetails = () => {
  const o = {
    render(c) {
      c.strokeStyle = '#000'
      c.lineWidth = 1.5
      BP(c)
      c.arc(-12, -13, 35, Math.PI * 0.20, Math.PI * 0.4, false)
      SK(c)
      BP(c)
      c.arc(20, -5, 22, Math.PI * 0.55, Math.PI * 0.85, false)
      SK(c)
      BP(c)
      c.arc(17, -3, 22, Math.PI * 0.55, Math.PI * 0.85, false)
      SK(c)
    } 
  }
  makeBasicObject(o, 0, 0)
  return o
}

const bulletImpact = (x, y) => {
  const o = {
    render(c) {
      c.strokeStyle = K.r
      c.fillStyle = K.y
      c.lineWidth = 4
      BP(c)
      c.arc(-1, -1, 2, 0, 2 * PI, false)
      SK(c)
      FL(c)
    } 
  }
  makeBasicObject(o, x, y, 4, 4)
  return o
}
const flash = (x = 0, y = 0) => {
  const o = {
    render(c) {
      c.strokeStyle = K.r
      c.fillStyle = K.y
      c.lineWidth = 2
      BP(c)
      L(c, 0, 1)
      L(c, 50, 0)
      L(c, 0, -1)
      SK(c)
      FL(c)
    } 
  }
  makeBasicObject(o, x, y)
  o.visible = false
  return o
}
const laser = (shooterX, shooterY, targetX, targetY) => {
  const o = {
    alwaysVisible: true,
    render(c) {
      // c.strokeStyle = '#F33'
      c.strokeStyle = K.r
      c.lineWidth = 2
      BP(c)
      MT(c, shooterX, shooterY)
      L(c, targetX, targetY)
      SK(c)
    },
  }
  makeBasicObject(o, 0, 0, 1, 1)
  return o
}
const actionMark = (p, x = 0, y = 0, attack = true) => {
  const o = {
    render(c) {
      c.lineWidth = 8
      BP(c)
      if (attack) {
        c.strokeStyle = K.r
        c.arc(20, 22, 35, 0, 2 * PI, false)
        SK(c)
      } else {
        c.strokeStyle = '#0F0'
        MT(c, -10, -10)
        L(c, 10, 10)
        MT(c, 10, -10)
        L(c, -10, 10)
        SK(c)
      }
    } 
  }
  makeBasicObject(o, x, y, 10, 10)
  p.addChild(o)
  o.fadeRate = 0.1
  fadeOuts.push(o)




  return o
}
// const moonSurface1 = (w, h) => {
//   const o = {
//     render(c) {
//       c.strokeStyle = '#FFF'
//       c.lineWidth = 2
//       c.beginPath()
//       c.rect(0, 0, 100, 100)
//       c.stroke()
//     }
//   }
//   makeBasicObject(o, 0, 0, w, h)
//   return o
// }
const moonGround = (w, h) => {
  const o = {
    render(c) {
      // const grad = c.createLinearGradient(0, 0, -100, 500)
      // grad.addColorStop(0, '#444')
      // grad.addColorStop(0.2, '#333')
      // grad.addColorStop(1, '#222')

      // c.fillStyle = '#444'

      // BP(c)
      // c.rect(-w / 2, -h/2, w, h)
      // c.fillStyle = '#444'
      // FL(c)
    }
  }
  makeBasicObject(o, 0, 0, w, h)
  return o
}
const makeHQ = (x, y, cellSize) => {
  const o = {
    health: 1000,
    baseHealth: 1000,
    c1: '#900',
    c2: '#888',
    render(c) {
      c.lineWidth = 5
      c.fillStyle = this.c1
      BP(c)
      c.rect(-cellSize/2, -cellSize/2, cellSize, cellSize)
      SK(c)
      FL(c)
      c.fillStyle = K.b
      FR(c, -32, -32, 64, 64)
      c.fillStyle = this.c2
      FR(c, 30, 30, -21,  -52)
      FR(c, 8, 30, -21,  -42)
      FR(c, -14, 30, -16,  -32)
    }
  }
  makeBasicObject(o, x, y, cellSize, cellSize)
  moreProperties(o)
  o.select = () => {}
  o.deselect = () => {}
  o.changeColor = () => {
    o.c1 = o.c2 = K.w
    g.wait(80, () => {
      o.c1 = '#900'
      o.c2 = '#888'
    })
  }

  o.canBleed = false
  playerUnits.push(o)
  return o
}




const turret = (x, y, cellSize) => {
  const w = cellSize * .8
  const barrel = {
    muz: 4,
    color: K.b,
    render(c) {
      c.lineWidth = 1
      c.strokeStyle = '#999'
      c.fillStyle = this.color
      BP(c)
      c.arc(0, 0, this.muz, 0, 2*PI)
      FL(c)
      SK(c)
    }
  }
  const o = {
    row: y,
    cel: x,
    health: 100,
    baseHealth: 100,
    range: 300,
    damage: 10,
    type: 'Building',
    c1: '#333',
    c2: '#111',
    originalColor: '#333',
    weapon: {rotation:0},
    weaponRotation:0,
    targets: enemies,
  }
  makeBasicObject(barrel, 0, 0, w, w * .6)
  makeBasicObject(o, x * cellSize, y * cellSize, w, w *.6)

  o.render = (c) => {
    const grad = c.createLinearGradient(w, 0, 0, w)
    grad.addColorStop(0, o.c1)
    grad.addColorStop(1, o.c2)
    c.fillStyle = grad
    c.lineWidth = 2
    BP(c)
    c.ellipse(0, w * 0.3, w/2, w/2, 0, 0, PI, true)
    c.closePath()
    FL(c)
    SK(c)
  },
  o.attack = (target) => {
    if(!o.attacked) {
      if (g.GlobalDistance(o, target) > o.range) {
        o.target = null
        return
      }
      o.attacked = true
      barrel.muz = 8
      barrel.color = '#ff0'

      const HZ = 700

      g.soundEffect(
        HZ,      //The sound's fequency pitch in Hertz
        0,              //The time, in seconds, to fade the sound in
        .2,               //The time, in seconds, to fade the sound out
        'triangle',                //waveform type: "sine", "triangle", "square", "sawtooth"
        .1,         //The sound's maximum volume
        0,            //The speaker pan. left: -1, middle: 0, right: 1
        0,                //The time, in seconds, to wait before playing the sound
        HZ * .9,     //The number of Hz in which to bend the sound's pitch down
        false,             //If `reverse` is true the pitch will bend up
        0,         //A range, in Hz, within which to randomize the pitch
        0        //A value in Hz. It creates 2 dissonant frequencies above and below the target pitch
        // undefined,                //An array: [delayTimeInSeconds, feedbackTimeInSeconds, filterValueInHz]
        // [.8, 0.5, false]             //An array: [durationInSeconds, decayRateInSeconds, reverse]
      )

      target.getHit(o.damage)

      g.wait(50, () => {
        barrel.muz = 4
        barrel.color = '#000'
      })
      g.wait(500, () => o.attacked = false)
    }
  }


  moreProperties(o)
  o.select = () => {}
  o.deselect = () => {}
  o.changeColor = () => {
    o.c1 = o.c2 = K.w
    g.wait(80, () => {
      o.c1 = '#333'
      o.c2 = '#111'
    })
  }
  o.die = () => {
    playerDie(o)
    removeItem(solids, o)
    gridMap[o.row][o.cel] = 0
    // setCellValue(gridMap, o.row, o.cel, 0)
  }
  o.canBleed = false
  o.addChild(barrel)
  playerUnits.push(o)
  armedUnits.push(o)
  return o
}

const makeMine = (x, y, cellSize) => {
  // const m = makeHQ(x, y, cellSize)
  const o = {
    render(c) {
      c.lineWidth = 5
      c.fillStyle = '#533'
      BP(c)
      c.arc(0, 0, 25, 0, 2*PI, false)
      FL(c)
    }
  }
  makeBasicObject(o, x, y, cellSize, cellSize)
  // moreProperties(o)

  // o.canBleed = false
  // playerUnits.push(o)
  return o
}



const makeBluePrint = (width, x = 0, y = 0) => {
  const o = {
    f: '#FFF'
  }
  makeBasicObject(o, x, y, width, width)
  o.render = (c) => {
    c.fillStyle = o.f
    c.lineWidth = 2
    BP(c)
    FR(c, 0, 0, width, width)
  }
  o.alpha = .4
  o.visible = false
  world.addChild(o)
  return o
}
const moonHole = (d, x, y) => {
  
  const a = [0, 0, d, d / 2, 0, 0, 2 * PI, true]
  const z = [d * -0.15, d * 0.45, d, d / 1.2, 0, 0, 2 * PI, false]
  const o = {
    render(c) {
      c.strokeStyle = '#333'
      BP(c)
      c.ellipse(...a)
      c.fillStyle = '#222'
      FL(c)
      SK(c)
    }
  }
  let circlePath = new Path2D()
  circlePath.ellipse(...a)
  const b = {
    render(c) {
      c.lineWidth = 3
      c.strokeStyle = '#333'
      BP(c)
      c.ellipse(...a)
      SK(c)
      c.clip(circlePath)
      c.ellipse(...z)
      c.fillStyle = '#555'
      FL(c)
    }
  }

  makeBasicObject(b, x, y, d, d)
  makeBasicObject(o, x, y, d, d)

  floorLayer.addChild(o)
  floorLayer.addChild(b)

  o.rotation = PI
  b.rotation = PI

  const base = {}
  makeBasicObject(base, (x - d / 1.8) | 0, (y - d * 0.1) | 0, (d * 2.2) | 0, (d * 1.2) | 0)
  objLayer.addChild(base)
  solids.push(base)
  return o
}
const surfaceLine = (w, h, x, y, lineWidth = 2, yOff = 0) => {
  const o = {
    render(c) {
      c.lineWidth = lineWidth
      c.strokeStyle = K.b
      c.lineJoin = "round"
      c.lineCap = 'round'
      BP(c)
      c.ellipse(0, 0, w/2, yOff, 0, PI, 2 * PI, false)
      SK(c)
    }
  }
  makeBasicObject(o, x, y, w, h)
  o.alpha -= (lineWidth * 0.3)
  floorLayer.addChild(o)
  o.rotation = randomNum(-0.15, 0.15, 0)
  return o
}
const tempLaser = (x = 0, y = 0) => {
  const o = {
    length: 10,
    render(c) {
      c.strokeStyle = '#F00'
      c.lineWidth = 2
      BP(c)
      MT(c, 0, 0)
      L(c, this.length, 0)
      SK(c)
    },
    setLength(l) {this.length = l -40}
  }
  makeBasicObject(o, x, y, 100, 100)
  o.visible = false
  return o
}
const gun = (owner, rifle = true, x = -55, y = -30, w = 70, h = 5) => {
  const o = {
    render(c) {
      c.lineWidth = 2
      BP(c)
      MT(c, x, y)
      c.fillStyle = K.b
      FR(c, -w/2, -h/2, w, h)
      c.fillStyle = '#222'
      FR(c, -w * 0.1, h / 2, -w / 10, 17)
      SK(c)
      FL(c)
    },
  }
  makeBasicObject(o, x, y, 150, 150)
  const handle = {
    render(c) {
      c.lineWidth = 2
      BP(c)
      MT(c, x, y)
      c.fillStyle = '#433'
      c.rect(-2, -5, 4, 10)
      SK(c)
      FL(c)
    },
  }
  handle.fire = () => {
    handle.flash.alwaysVisible = true
    g.wait(25, () => handle.flash.alwaysVisible = false)
  }
  makeBasicObject(handle, x, y, 150, 150)
  handle.alwaysVisible = true
  handle.addChild(o)
  o.y = -8
  o.x = 23

  owner.playerHand.addChild(handle)
  owner.weapon = handle
  owner.weapon.rotation = owner.weaponRotation

  if (rifle) {
    const gunFlash = flash()
    handle.addChild(gunFlash)
    handle.flash = gunFlash
    gunFlash.x = 108
    gunFlash.y = 42
  } else {
    var laser1 = tempLaser()
    handle.addChild(laser1)
    laser1.x = 82.5
    laser1.y = 17
    owner.laser = laser1
  }
 
}
const tempEarth = (d, x, y) => {
  const b = {
    render(c) {
      BP(c)
      c.arc(0, 0, d, 0, 2 * PI, false)
      c.fillStyle = '#00F'
      FL(c)
    }
  }

  const l = {
    render(c) {
      BP(c)
      c.fillStyle = '#080'
      MT(c, -2,-35)
      L(c, 75, -28)
      L(c, 75, 15)
      L(c, 24, 65)
      
      MT(c, 25, 100)
      L(c, 35, 70)
      L(c, 80, 100)
      L(c, 50, 180)
      L(c, 38, 120)

      MT(c, 220, 120)
      L(c, 190, 60)
      L(c, 150, 45)
      L(c, 170, 0)
      L(c, 240, 0)
      L(c, 260, 40)

      FL(c)
    }
  }
  makeBasicObject(l, x, y, d ,d)
  makeBasicObject(b, x, y, d, d)
  b.addChild(l)
  l.x = -120
  l.y = -50

  return b
}
const makeEnemyEyes = () => {
  const o = {
    render(c) {
      c.strokeStyle = K.b
      c.fillStyle = '#0F0'
      c.lineWidth = 2
      BP(c)
      c.ellipse(0, -14, 10, 12, 0, 0, 2*PI, false)
      SK(c)
      FL(c)
    }
  }
  makeBasicObject(o)
  return o
}
const newMakeEnemyEyes = () => {
  const o = {
    render(c) {
      c.strokeStyle = K.b
      c.fillStyle = '#0F0'
      c.lineWidth = 2
      BP(c)
      c.ellipse(0, -10, 10, 10, 0, 0, 2*PI, false)
      SK(c)
      FL(c)
    }
  }
  makeBasicObject(o, 0, 0)
  return o
}

const bloodDrop = (x, y) => {
  const o = {
    l: 3,
    vx: randomNum(-.5, .5, false),
    vy: 2,
  }
  o.render = (c) => {
    c.strokeStyle = K.b
    c.fillStyle = '#700'
    c.lineWidth = 2
    BP(c)
    c.ellipse(0, -10, 3, o.l, 0, 0, 2*PI, false)
    SK(c)
    FL(c)
  }
  makeBasicObject(o, x, y)
  world.addChild(o)
  bloodDrops.push(o)
  g.wait(randomNum(300, 450), () => {
    g.remove(o)
    removeItem(bloodDrops, o)
    bloodLake(o.x, o.y)
  })
}

const bloodLake = (x, y) => {
  const o = {
    h: randomNum(15, 40),
    v: randomNum(3, 7)
  }
  o.render = (c) => {
    c.fillStyle = '#700'
    BP(c)
    c.ellipse(0, -10, o.h, o.v, 0, 0, 2*PI, false)
    FL(c)
  }
  makeBasicObject(o, x, y)
  floorLayer.addChild(o)
  o.fadeRate = 0.003
  fadeOuts.push(o)
}

const makeGold = (x = 0, y = 0) => {
  const o = {
    render(c) {
      c.strokeStyle = K.b
      c.fillStyle = '#fb5'
      c.lineWidth = 5
      BP(c)
      c.rect(-6, -12, 12, 24)
      SK(c)
      FL(c)
    }
  }
  makeBasicObject(o, x, y)
  // uiLayer.addChild(o)
  return o
}

const renderTurret = (x, y) => {
  const w = 40
  const barrel = {
    render(c) {
      c.strokeStyle = '#999'
      c.fillStyle = K.b
      BP(c)
      c.arc(0, 0, 2, 0, 2*PI)
      FL(c)
      SK(c)
    }
  }

  const o = {
    render(c) {
      const grad = c.createLinearGradient(w, 0, 0, w)
      grad.addColorStop(0, '#555')
      grad.addColorStop(1, '#222')
      c.fillStyle = grad
      c.lineWidth = 2
      BP(c)
      c.ellipse(0, w * 0.3, w/2, w/2, 0, 0, PI, true)
      c.closePath()
      FL(c)
      SK(c)
    },
  }

  makeBasicObject(barrel, 0, 0)
  makeBasicObject(o, x, y)
  moreProperties(o)
  o.addChild(barrel)

 return o

}



export { 
  makeCircle, 
  makeRectangle, 
  makeSelectionBox, 
  makeSlash, 
  makeTwoEyes, 
  makeThirdEye, 
  makeLeg, 
  makeBorder, 
  makeHeadDetails, 
  bulletImpact, 
  flash, 
  actionMark,
  makeHQ,
  moonGround,
  laser,
  makeHead,
  surfaceLine,
  moonHole,
  tempEarth,
  makeEnemyEyes,
  gun,
  newMakeEnemyEyes,
  turret,
  makeBluePrint,
  bloodDrop,
  bloodLake,
  makeMine,
  makeGold,
  renderTurret
  
 }
