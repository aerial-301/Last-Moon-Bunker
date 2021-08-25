import { solids, g, playerUnits, armedUnits, enemies, bloodDrops, bloodLakes, K } from "./main.js"
import { gridMap } from "./main/mainSetUp/initMap.js"
import { world, floorLayer, objLayer } from "./main/mainSetUp/initLayers.js"
import { makeMovableObject, makeBasicObject, moreProperties } from "./unitObject.js"
import { playerDie, randomNum, removeItem, setCellValue } from "./functions.js"

// import { debugShape } from "./debug.js"

const PI = Math.PI

const makeCircle = (d, k, l, movable = false, x = 0, y = 0) => {
  const o = {
    f: k,
    radius: d / 2 
  }
  o.render = (c) => {
    c.lineWidth = l
    c.fillStyle = o.f
    c.beginPath()
    c.arc(o.radius + (-o.radius * 2 * o.pivotX), o.radius + (-o.radius * 2 * o.pivotY), o.radius, 0, 2 * PI, false)
    if (l) c.stroke()
    c.fill()
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
    c.beginPath()
    c.moveTo(x, y)
    c.rect(-o.width * o.pivotX, -o.height * o.pivotY, o.width, o.height)
    c.fill()
    if (s) c.stroke()
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
      c.beginPath()
      c.rect(o.WIDTH, o.HEIGHT, -o.WIDTH, -o.HEIGHT)
      c.stroke()
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
        c.beginPath()
        c.arc(0, 160, 160, PI * 1.5, PI * 0.165, false)
        c.arc(65, 195, 85, PI * 0.165, PI * 1.225, true)
        c.fill()
      } else {
        c.beginPath()
        c.arc(0, 160, 160, PI * 1.5, PI * 0.835, true)
        c.arc(-65, 195, 85, PI * 0.835, PI * 1.772, false)
        c.fill()
      }
    } 
  }
  makeBasicObject(o, 0, 0)
  o.visible = false
  return o
}
const makeTwoEyes = (x = 0, y = 0) => {
  const o = {
    render(c) {
      c.lineJoin = 'round'
      c.strokeStyle = '#000'
      c.fillStyle = 'red'
      c.lineWidth = 0.7
      c.beginPath()
      c.moveTo(-18, -10)
      c.lineTo(-4, 0)
      c.lineTo(-18, -5)
      c.lineTo(-18, -10)
      c.fill()
      // Right eye
      c.moveTo(18, -10)
      c.lineTo(4, 0)
      c.lineTo(18, -5)
      c.lineTo(18, -10)
      c.fill()
      c.stroke()
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
      c.beginPath()
      c.moveTo(-3, -18)
      c.lineTo(3, -18)
      c.lineTo(0, -3)
      c.lineTo(-3, -18)
      c.fill()
      c.stroke()
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
      c.beginPath()
      c.moveTo(0, 0)
      c.lineTo(6, 0)
      c.lineTo(6, 4)
      c.lineTo(0, 4)
      c.lineTo(0, 0)
      c.fill()
      c.stroke()
    } 
  }
  makeBasicObject(o, x, 0, 7, 5)
  return o
}
const makeBorder = (w, h) => {
  const o = {
    render(c) {
      c.strokeStyle = '#FFF'
      c.lineWidth = 2
      c.beginPath()
      c.moveTo(0, 0)
      c.lineTo(w / 4, 0)
      c.moveTo(w - w / 4, 0)
      c.lineTo(w, 0)
      c.lineTo(w, w / 4)
      c.moveTo(w, h - w / 4)
      c.lineTo(w, h)
      c.lineTo(w - w / 4, h)
      c.moveTo(w / 4, h)
      c.lineTo(0, h)
      c.lineTo(0, h - w / 4)
      c.moveTo(0, w / 4)
      c.lineTo(0, 0)
      c.stroke()
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
      c.beginPath()
      c.arc(-12, -13, 35, Math.PI * 0.20, Math.PI * 0.4, false)
      c.stroke()
      c.beginPath()
      c.arc(20, -5, 22, Math.PI * 0.55, Math.PI * 0.85, false)
      c.stroke()
      c.beginPath()
      c.arc(17, -3, 22, Math.PI * 0.55, Math.PI * 0.85, false)
      c.stroke()
    } 
  }
  makeBasicObject(o, 0, 0)
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
    c.strokeStyle = '#000'
    c.fillStyle = grad
    c.lineWidth = 2
    c.beginPath()
    c.arc(0, 0, 25, 0, 2 * PI, false)
    c.stroke()
    c.fill()
  } 
  makeBasicObject(o)
  o.head = o
  return o
}
const bulletImpact = (x, y) => {
  const o = {
    render(c) {
      c.strokeStyle = '#F00'
      c.fillStyle = '#FF0'
      c.lineWidth = 4
      c.beginPath()
      c.arc(-1, -1, 2, 0, 2 * PI, false)
      c.stroke()
      c.fill()
    } 
  }
  makeBasicObject(o, x, y, 4, 4)
  return o
}
const flash = (x = 0, y = 0) => {
  const o = {
    render(c) {
      c.strokeStyle = '#F00'
      c.fillStyle = '#FF0'
      c.lineWidth = 2
      c.beginPath()
      c.lineTo(0, 1)
      c.lineTo(50, 0)
      c.lineTo(0, -1)
      c.stroke()
      c.fill()
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
      c.strokeStyle = '#F33'
      c.lineWidth = 2
      c.beginPath()
      c.moveTo(shooterX, shooterY)
      c.lineTo(targetX, targetY)
      c.stroke()
    },
  }
  makeBasicObject(o, 0, 0, 1, 1)
  return o
}
const actionMark = (x = 0, y = 0, attack = true) => {
  const o = {
    render(c) {
      c.lineWidth = 8
      c.beginPath()
      if (attack) {
        c.strokeStyle = '#F00'
        c.arc(20, 22, 35, 0, 2 * PI, false)
        c.stroke()
      } else {
        c.strokeStyle = '#0F0'
        c.moveTo(-10, -10)
        c.lineTo(10, 10)
        c.moveTo(10, -10)
        c.lineTo(-10, 10)
        c.stroke()
      }
    } 
  }
  makeBasicObject(o, x, y, 10, 10)
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
      // c.strokeStyle = '#FFF'
      // c.lineWidth = 2
      // const grad = c.createLinearGradient(surfaceWidth /10, -surfaceHeight * 2, -surfaceWidth / 2, surfaceHeight)
      const grad = c.createLinearGradient(0, 0, -100, 500)
      grad.addColorStop(0, '#444')
      grad.addColorStop(0.2, '#333')
      // grad.addColorStop(0.3, '#333')
      grad.addColorStop(1, '#222')
      // grad.addColorStop(1, '#111')
      c.beginPath()
      c.rect(-w / 2, -h/2, w, h)
      c.fillStyle = grad
      c.fill()
    }
  }
  makeBasicObject(o, 0, 0, w, h)
  return o
}
const makeHQ = (x, y, cellSize) => {
  const o = {
    render(c) {
      c.lineWidth = 5
      c.fillStyle = '#900'
      c.beginPath()
      c.rect(-cellSize/2, -cellSize/2, cellSize, cellSize)
      c.stroke()
      c.fill()
      c.fillStyle = '#000'
      c.fillRect(-32, -32, 64, 64)
      c.fillStyle = '#888'
      c.fillRect(30, 30, -21,  -52)
      c.fillRect(8, 30, -21,  -42)
      c.fillRect(-14, 30, -16,  -32)
    }
  }
  makeBasicObject(o, x, y, cellSize, cellSize)
  return o
}
const turret = (x, y, cellSize) => {
  const w = cellSize * .8
  const barrel = {
    muz: 4,
    color: '#000',
    render(c) {
      c.lineWidth = 1
      c.strokeStyle = '#999'
      c.fillStyle = this.color
      c.beginPath()
      c.arc(0, 0, this.muz, 0, 2*PI)
      c.fill()
      c.stroke()
    }
  }
  const o = {
    row: y,
    cel: x,
    health: 100,
    baseHealth: 100,
    range: 1000,
    damage: 37,
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
    c.beginPath()
    c.ellipse(0, w * 0.3, w/2, w/2, 0, 0, PI, true)
    c.closePath()
    c.fill()
    c.stroke()
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

      target.getHit(o.damage)


      // g.soundEffect(
      //   120,      //The sound's fequency pitch in Hertz
      //   0,              //The time, in seconds, to fade the sound in
      //   .15,               //The time, in seconds, to fade the sound out
      //   'square',                //waveform type: "sine", "triangle", "square", "sawtooth"
      //   .4,         //The sound's maximum volume
      //   0,            //The speaker pan. left: -1, middle: 0, right: 1
      //   0,                //The time, in seconds, to wait before playing the sound
      //   50,     //The number of Hz in which to bend the sound's pitch down
      //   false,             //If `reverse` is true the pitch will bend up
      //   1,         //A range, in Hz, within which to randomize the pitch
      //   1.5,          //A value in Hz. It creates 2 dissonant frequencies above and below the target pitch
      //   // undefined,                //An array: [delayTimeInSeconds, feedbackTimeInSeconds, filterValueInHz]
      //   // [.8, 0.5, false]             //An array: [durationInSeconds, decayRateInSeconds, reverse]
      // )

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
    o.c1 = o.c2 = '#FFF'
    g.wait(80, () => {
      o.c1 = '#333'
      o.c2 = '#111'
    })
  }
  o.die = () => {
    playerDie(o)
    removeItem(solids, o)
    gridMap[o.row][o.cel] = 0
    setCellValue(gridMap, o.row, o.cel, 0)
  }
  o.canBleed = false
  o.addChild(barrel)
  playerUnits.push(o)
  armedUnits.push(o)
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
    c.beginPath()
    c.fillRect(0, 0, width, width)
  }
  o.alpha = .4
  o.visible = false
  world.addChild(o)
  return o
}
const moonHole = (d, x, y) => {

  // const b = {
  //   ...j,
  //   render(c) {
  //     var lingrad2 = c.createLinearGradient(100, 0, 100, 100)
  //     lingrad2.addColorStop(0, '#200')
  //     lingrad2.addColorStop(0.5, '#F00')
  //     // c.fillStyle = '#000'
  //     c.beginPath()
  //     // c.arc(0, 0, 100, 0, 2*PI, false)
  //     // c.ellipse(0, 0, 90, 25, 0, 0, 2 * PI,false)
  //     c.ellipse(0, -d*0.8, d * 0.9, d / 4, 0, 0, 2 * PI,false)
  //     c.fillStyle = lingrad2
  //     c.fill()
  //   }
  // }
  // const o = {
  //   ...j,
  //   render(c) {
  //     c.beginPath()
  //     // c.arc(0, -300, d * 4, PI * 0.62, 1.1, true)
  //     c.ellipse(0, 0, d * 1.3, d / 2, 0, PI, 2 * PI, true)
  //     c.ellipse(0, -d * 0.8, d * 0.9, d / 4, 0, PI * 2, PI, false)
  //     // c.arc(0, -260, d * 2, 1.2, 1.8, false)
  //     var lingrad2 = c.createLinearGradient(-50, 200, 100, -100)
  //     lingrad2.addColorStop(0, '#000')
  //     lingrad2.addColorStop(0.55, '#333')
  //     lingrad2.addColorStop(1, '#666')
  //     c.fillStyle = lingrad2
  //     c.fill()
  //     // c.stoke()
  //   }
  // }
  
  const a = [0, 0, d, d / 2, 0, 0, 2 * PI, true]
  const z = [d * -0.15, d * 0.45, d, d / 1.2, 0, 0, 2 * PI, false]
  const o = {
    render(c) {
      c.strokeStyle = '#333'
      c.beginPath()
      c.ellipse(...a)
      c.fillStyle = '#222'
      c.fill()
      c.stroke()
    }
  }
  let circlePath = new Path2D()
  circlePath.ellipse(...a)
  const b = {
    render(c) {
      c.lineWidth = 3
      c.strokeStyle = '#333'
      c.beginPath()
      c.ellipse(...a)
      c.stroke()
      c.clip(circlePath)
      c.ellipse(...z)
      c.fillStyle = '#555'
      c.fill()
    }
  }

  makeBasicObject(b, x, y, d, d)
  makeBasicObject(o, x, y, d, d)

  floorLayer.addChild(o)
  floorLayer.addChild(b)

  o.rotation = PI
  b.rotation = PI

  const base = {}
  makeBasicObject(base, Math.floor(x - d / 1.8), Math.floor(y - d * 0.1), Math.floor(d * 2.2), Math.floor(d * 1.2))
  objLayer.addChild(base)
  solids.push(base)
  return o
}
const surfaceLine = (w, h, x, y, lineWidth = 2, yOff = 0) => {
  const o = {
    render(c) {
      c.lineWidth = lineWidth
      c.strokeStyle = '#000'
      c.lineJoin = "round"
      c.lineCap = 'round'
      c.beginPath()
      c.ellipse(0, 0, w/2, yOff, 0, PI, 2 * PI, false)
      c.stroke()
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
      c.beginPath()
      c.moveTo(0, 0)
      c.lineTo(this.length, 0)
      c.stroke()
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
      c.beginPath()
      c.moveTo(x, y)
      c.fillStyle = '#000'
      c.fillRect(-w/2, -h/2, w, h)
      c.fillStyle = '#222'
      c.fillRect(-w * 0.1, h / 2, -w / 10, 17)
      c.stroke()
      c.fill()
    },
  }
  makeBasicObject(o, x, y, 150, 150)
  const handle = {
    render(c) {
      c.lineWidth = 2
      c.beginPath()
      c.moveTo(x, y)
      c.fillStyle = '#433'
      c.rect(-2, -5, 4, 10)
      c.stroke()
      c.fill()
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
      // var lingrad2 = c.createLinearGradient(100, 0, 100, 100)
      // lingrad2.addColorStop(0, '#000')
      // lingrad2.addColorStop(1, '#999')
      // c.fillStyle = '#000'
      c.beginPath()
      c.arc(0, 0, d, 0, 2 * PI, false)
      // c.ellipse(0, -d*0.8, d * 0.9, d / 4, 0, 0, 2 * PI,false)
      c.fillStyle = '#00F'
      c.fill()
    }
  }

  const l = {
    render(c) {
      c.beginPath()
      c.fillStyle = '#080'
      c.moveTo(-2,-35)
      c.lineTo(75, -28)
      c.lineTo(75, 15)
      c.lineTo(24, 65)
      
      c.moveTo(25, 100)
      c.lineTo(35, 70)
      c.lineTo(80, 100)
      c.lineTo(50, 180)
      c.lineTo(38, 120)

      c.moveTo(220, 120)
      c.lineTo(190, 60)
      c.lineTo(150, 45)
      c.lineTo(170, 0)
      c.lineTo(240, 0)
      c.lineTo(260, 40)

      c.fill()
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
      c.strokeStyle = '#000'
      c.fillStyle = '#0F0'
      c.lineWidth = 2
      c.beginPath()
      c.ellipse(0, -14, 10, 12, 0, 0, 2*PI, false)
      c.stroke()
      c.fill()
    }
  }
  makeBasicObject(o)
  return o
}
const newMakeEnemyEyes = () => {
  const o = {
    render(c) {
      c.strokeStyle = '#000'
      c.fillStyle = '#0F0'
      c.lineWidth = 2
      c.beginPath()
      c.ellipse(0, -10, 10, 10, 0, 0, 2*PI, false)
      c.stroke()
      c.fill()
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
    c.strokeStyle = '#000'
    c.fillStyle = '#700'
    c.lineWidth = 2
    c.beginPath()
    c.ellipse(0, -10, 3, o.l, 0, 0, 2*PI, false)
    c.stroke()
    c.fill()
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
    c.beginPath()
    c.ellipse(0, -10, o.h, o.v, 0, 0, 2*PI, false)
    c.fill()
  }
  makeBasicObject(o, x, y)
  floorLayer.addChild(o)
  bloodLakes.push(o)
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
  bloodLake
  
 }
