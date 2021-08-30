import { g, movingUnits, solids, playerUnits, armedUnits } from './main.js'
import { world, objLayer } from './main/mainSetUp/initLayers.js'
import { rectangle } from './drawings.js'
import { makeText } from './unitObject.js'
import { currentPlayer } from './keyboard.js'

const OBSDIST = 250
const OBSDIST_UNDERGROUND = 400

const directions = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1]
]

const tempAngle = (a, b, bOffsetX = 0, bOffsetY = 0) => {return Math.atan2((b.centerX + bOffsetX - a.centerX), (b.centerY + bOffsetY - a.centerY))}
const xDistance = (a, b) => Math.abs(b.centerX - a.centerX)
const yDistance = (a, b) => Math.abs(b.centerY - a.centerY)
const addVectors = (a, b) => {return [a[0] + b[0], a[1] + b[1]]}

const canBuildHere = (gridMap, r, c) => {
  try {if (!gridMap[r][c] && checkNeighbors(gridMap,r, c)) return true}
  catch (e) { console.log('error')}
  return false
}
const checkNeighbors = (gridMap, row, col) => {
  let n
  for (let d of directions) {
    n = addVectors([row, col], d)
    try {
      if (gridMap[n[0]][n[1]] != 0) return false
    } catch (e) {null}
  }
  return true
}
const simpleButton = (
  text,
  xPos = 10,
  yPos = 10,
  textX = 10,
  textY = 10,
  color = '#555',
  size = 28,
  action = () => console.log(text),
  width = 100,
  height = 80
  ) => {
  const button = rectangle(width, height, color, 1, xPos, yPos)
  button.action = action
  const tSize = size
  if (text ) button.text = makeText(button, text, `${tSize}px arial`, '#FFF', textX, textY)
  return button
}
const aroundAll = (collider, H) => {
  collider.obstacles.forEach(obst => {
    if (g.hitTestRectangle(collider, obst)) {
      const desX = collider.destinationX + world.x
      const desY = collider.destinationY + world.y
      const obCx = obst.centerX
      const obCY = obst.centerY
      
      if (collider.collidedWith == undefined) {
        collider.collidedWith = obst
        if (Math.abs(desX - obCx) <= (obst.halfWidth + 50)) {
          if (Math.abs(desY - obCY) <= (obst.halfHeight + 50)) {
            collider.destinationX = collider.x
            collider.destinationY = collider.y
          }
        }
      }

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
          break
      }
    }
  })
}
const randomNum = (min, max, int = 1) => {
    const r = Math.random() * (max - min) + min
    return int ? r | 0 : r
}
const removeItem = (array, item) => {
    const index = array.indexOf(item)
    if (index !== -1) array.splice(index, 1)
}
const getUnitVector = (a, b) => {
  let xv, yv
  xv = b.centerX - a.centerX
  yv = b.centerY - a.centerY
  const mag = Math.sqrt( (xv**2) + (yv**2) )
  return { x: xv / mag, y: yv / mag }
}
const sortUnits = (array, x, y, moveArray) => {
  const len = array.length
  if (len == 0) return
  const size = Math.sqrt(len) | 0
  let z = 1
  while (z < size) {
    if ((len - z) % size !== size - 1) z++
    else break
  }
  array.sort((a, b) => b.width - a.width)
  const maxWidth = array[0].width
  const maxHeight = array[0].height
  const xSpace = 20
  const ySpace = 10
  const firstX = x
  const firstY = y
  const lastX = x + ((len - z) % size) * (maxWidth + 4) + maxWidth
  const lastY = y + (0 | ((len - z) / size)) * (maxHeight + 4) + maxHeight
  const midX = (lastX - firstX) / 2
  const midY = (lastY - firstY) / 2
  for (let i in array) {
    const u = array[i]

    u.getInRange = false
    u.isCollided = false
    u.target = null
    u.isSeeking = false

    if (u.isMining) {
      u.isMining = false
      u.readyForOrder = true
    }
    
    u.destinationX = x + (i % size) * (maxWidth + xSpace) - midX
    u.destinationY = y + (0 | (i / size)) * (maxHeight + ySpace) - midY
    setDirection(u)

    if (moveArray.findIndex((e) => e == u) == -1) {
      u.isMoving = true
      moveArray.push(u)
    }
  }
}
const setDirection = (u) => {
  const xD = u.destinationX - u.x
  const yD = u.destinationY - u.y
  const mag = Math.sqrt(xD**2 + yD**2)
  u.vx = (xD / mag)
  u.vy = (yD / mag)
}
const newMoveX = (u) => {
  const xD = u.destinationX - u.x
  const xd = Math.abs(xD)
  if (!u.isCollidingV) {
    if (xd > u.speed + (u.getInRange ? u.range / Math.sqrt(2) - 95 : 0)) {
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
  objLayer.children.sort((a, b) => a.bottom - b.bottom)
  const yD = u.destinationY - u.y
  const yd = Math.abs(yD)
  if (!u.isCollidingH) {
    if (yd > u.speed + (u.getInRange ? u.range / Math.sqrt(2) - 45 : 0)) {
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
    u.getInRange = false
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
      if (vx > 0) checkCollisions('left', t)
      else if (vx < 0) checkCollisions('right', t)
      t.y += vy * t.speed * 12.5
      if (vy > 0) checkCollisions('top', t)
      else if (vy < 0) checkCollisions('bot', t)
      t.rollCounter -= 1
      roll(t, vx, vy)
    })
  }
  else {
    t.rollCounter = t.rollDistance
    t.rotation = 0
    t.isRolling = false
  }
}
const playerDie = (o) => {
  removeItem(playerUnits, o)
  removeItem(armedUnits, o)
}
const notEnough = () => {
  const HZ = 150
  g.soundEffect(HZ, .2, 'sawtooth', .05, 100, false)
}

export { notEnough, checkNeighbors, setDirection, simpleButton, checkCollisions, removeItem, randomNum, getUnitVector, sortUnits, xDistance, yDistance, scan, roll, newMoveTest, tempAngle, playerDie, canBuildHere }
