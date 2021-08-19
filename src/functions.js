import { makeRectangle } from './drawings.js'
import { g, movingUnits, solids, MK, currentPlayer, world, objLayer } from './main.js'
import { makeText } from './unitObject.js'
import { tempIndicator } from '../extra/debug.js'

const OBSDIST = 250
const OBSDIST_UNDERGROUND = 400
const simpleButton = (text, action = () => console.log(text), textX = -56, textY = -20, yPos = 130, xPos = g.stage.width / 2 - 140, color = '#444444', width = 280, height = 120) => {
  const button = makeRectangle(width, height, color, 1, xPos, yPos)
  button.action = action
  const tSize = 90 - (text.length * 5)
  const t = makeText(text, `${tSize}px arial`, '#00ff00', 0, 0)
  button.addChild(t)
  button.putCenter(t, textX, textY)
  return button
}

const aroundAll = (collider, H) => {
  collider.obstacles.forEach(obst => {
    if (g.hitTestRectangle(collider, obst)) {
      const desX = collider.destinationX + world.x
      const desY = collider.destinationY + world.y

      const obCx = obst.centerX
      const obCY = obst.centerY
      const collX = collider.centerX
      const collY = collider.centerY
      // collider.destinationX += world.x
      // collider.destinationY += world.y
      // console.log(`
      // diffX = ${Math.abs(desX - obCx)}
      // diffY = ${Math.abs(desY - obCY)}
      // `)


      if (collider.collidedWith == undefined) {
        collider.collidedWith = obst
        if (Math.abs(desX - obCx) <= (obst.halfWidth + 60)) {
          if (Math.abs(desY - obCY) <= (obst.halfHeight + 60)) {
            // tempIndicator(collider.x, collider.y, 20, 'green', 80)
            // tempIndicator(obCx, obCY, 10, 'red', 20)

            // tempIndicator(desX, desY, 100, '#33F', 40)



            // collider.destinationX = collider.x
            // collider.destinationY = collider.y
            collider.destinationX = collider.x// - collider.speed * collider.vx * 1 //+ world.x
            collider.destinationY = collider.y// - collider.speed * collider.vy * 1//+ world.y
            // console.log('new dests = ', collider.destinationX, collider.destinationY)
            // setDirection(collider)
            // collider.collidedWith = undefined
            // return
          }
        }
      }

      // tempIndicator(desX, desY, 50, 'white', 30)
      // tempIndicator(obCx, obCY, 40, 'red', 20)


      if (H) {
        collider.isCollidingH = true
        collider.x -= collider.vx * collider.speed
        if (desY > obCY) collider.vy = 0.9
        else collider.vy = -0.9
      }
      else {
        collider.isCollidingV = true
        collider.y -= collider.vy * collider.speed
        if (desX > obCx) collider.vx = 0.9
        else collider.vx = -0.9
      }
    }
    else {
      if (obst == collider.collidedWith) {
        collider.collidedWith = undefined
        if (H) collider.isCollidingH = false
        else collider.isCollidingV = false
        collider.xChanged = false
        collider.yChanged = false
        setDirection(collider)
      }
    }
  })
}
const checkCollisions = (side, collider = currentPlayer) => {
  if (!collider.obstacles) return false
  collider.obstacles.forEach(obst => {
    if (g.hitTestRectangle(collider, obst)) {
      collider.collidedWith = obst
      collider.collisionSide = side
      switch (side) {
        case 'top':
            collider.y = obst.y - collider.height - 1
            break
        case 'bot':
            collider.y = obst.y + obst.height + 1
            break
        case 'left':
            collider.x = obst.x - collider.width - 1
            break
        case 'right':
            collider.x = obst.x + obst.width + 1
            break
        default:
            console.log('side not found !')
            break
      }
    }
  })
}
const xDistance = (a, b) => Math.abs(b.centerX - a.centerX)
const yDistance = (a, b) => Math.abs(b.centerY - a.centerY)
const randomNum = (min, max, int = 1) => {
    const r = Math.random() * (max - min) + min
    return int ? Math.floor(r) : r
}
const removeItem = (array, item) => {
    const index = array.indexOf(item)
    if (index !== -1) array.splice(index, 1)
}
const getDistance = (a, b) => {
    if (a.gx === undefined) return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2))
    return Math.sqrt(Math.pow((a.gx - b.gx), 2) + Math.pow((a.gy - b.gy), 2))
}
const getUnitVector = (a, b, toPointer = false) => {
  let xv, yv
  if (toPointer) {
    xv = b.x - (a.gx + a.halfWidth)
    yv = b.y - (a.gy + a.halfHeight)
  } else {
    b.halfWidth == null ? b.halfWidth = 0 : null
    b.halfHeight == null ? b.halfHeight = 0 : null
    xv = (b.gx + b.halfWidth) - (a.gx + a.halfWidth)
    yv = (b.gy + b.halfHeight) - (a.gy + a.halfHeight)
  }
  const mag = Math.sqrt((Math.pow(xv, 2)) + (Math.pow(yv, 2)))
  const uv = { x: xv / mag, y: yv / mag }
  return uv
}
const globalAngle = (a, b) => {return Math.atan2((b.gx + b.halfWidth - a.gx + a.halfWidth), (b.gy + b.halfHeight - a.gy + a.halfHeight))}

const tempAngle = (a, b, bOffsetX = 0, bOffsetY = 0) => {return Math.atan2((b.centerX + bOffsetX - a.centerX), (b.centerY + bOffsetY - a.centerY))}

const sortUnits = (array, x, y, moveArray) => {
  const len = array.length
  if (len == 0) return
  const size = Math.floor(Math.sqrt(len))
  let z = 1
  while (z < size) {
    if ((len - z) % size !== size - 1) z++
    else break
  }
  array.sort((a, b) => b.width - a.width)
  const maxWidth = array[0].width
  const maxHeight = array[0].height
  const xSpace = 10
  const ySpace = 10
  const firstX = x
  const firstY = y
  const lastX = x + ((len - z) % size) * (maxWidth + 4) + maxWidth
  const lastY = y + Math.floor((len - z) / size) * (maxHeight + 4) + maxHeight
  const midX = (lastX - firstX) / 2
  const midY = (lastY - firstY) / 2
  for (let i in array) {
    const u = array[i]
    u.isCollided = false
    u.target = null
    const dX = x + (i % size) * (maxWidth + xSpace) - midX
    const dY = y + Math.floor(i / size) * (maxHeight + ySpace) - midY
    u.destinationX = dX //- world.x
    u.destinationY = dY
    // tempIndicator(dX, dY, 500, '#0FF', 50)
    const xV = dX - u.x
    const yV = dY - u.y
    const mag = Math.sqrt((Math.pow(xV, 2)) + (Math.pow(yV, 2)))
    u.vx = (xV / mag)
    u.vy = (yV / mag)
    if (moveArray.findIndex((e) => e == u) == -1) {
      u.isMoving = true
      moveArray.push(u)
    }
  }
}
const setDirection = (u) => {
  const xV = u.destinationX - u.x
  const yV = u.destinationY - u.y
  const mag = Math.sqrt((Math.pow(xV, 2)) + (Math.pow(yV, 2)))
  u.vx = (xV / mag)
  u.vy = (yV / mag)
}
const newMoveX = (u) => {
  const xD = u.destinationX - u.x
  const xd = Math.abs(xD)
  if (!u.isCollidingV) {
    if (xd > u.speed) {
      u.x += u.vx * u.speed
      if (u.obstacles.length > 0) {
        if (xD != 0) aroundAll(u, 1)
      }
      u.scan(1500, OBSDIST)
      return true
    } else return false
  } else u.x += u.vx * u.speed
}
const newMoveY = (u) => {
  objLayer.children.sort((a, b) => (a.Y + a.height) - (b.Y + b.height))
  const yD = u.destinationY - u.y
  const yd = Math.abs(yD)
  if (!u.isCollidingH) {
    if (yd > u.speed) {
      u.y += u.vy * u.speed
      if (u.obstacles.length > 0) {
        if (yD != 0) aroundAll(u, 0)
      }
      u.scan(1500, OBSDIST)
      return true
    } else return false
  } else u.y += u.vy * u.speed
}
const newMoveTest = (u) => {
  const x = newMoveX(u)
  const y = newMoveY(u)

  if (!x && !y) {
    removeItem(movingUnits, u)
    u.isMoving = false
  }
}
const scan = (u, delay = 400, distance = OBSDIST_UNDERGROUND) => {
  if (!u.scaned) {
    u.scaned = true
    for (const obj of solids) {
      if (xDistance(u, obj) < distance) {
        if (yDistance(u, obj) < distance) {
          if (u.obstacles.findIndex((value) => value == obj) == -1) u.obstacles.push(obj)
          continue
        }
      }
      removeItem(u.obstacles, obj)
    }
    g.wait(delay, () => u.scaned = false)
  }
}
const roll = (t, vx, vy) => {
  if (t.rollCounter > 0) {
    g.wait(1, () => {
      t.rotation += 0.625
      t.x += vx * t.speed * 12.5
      if (vx > 0) checkCollisions('left')
      else if (vx < 0) checkCollisions('right')
      t.y += vy * t.speed * 12.5
      if (vy > 0) checkCollisions('top')
      else if (vy < 0) checkCollisions('bot')
      t.rollCounter -= 1
      t.roll()
    })
  }
  else {
    t.rollCounter = t.rollDistance
    t.rotation = 0
    t.isRolling = false
  }
}
export { simpleButton, checkCollisions, removeItem, randomNum, getDistance, getUnitVector, globalAngle, sortUnits, xDistance, yDistance, scan, roll, newMoveTest, tempAngle }
