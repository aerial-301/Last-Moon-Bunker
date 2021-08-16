import { g, world, units, objLayer, player, surfaceWidth, surfaceHeight, switchMode, MK, enemies } from './main.js'
import { checkCollisions, randomNum } from './functions.js'
import { makeEnemy } from './enemyObject.js';


let paused: boolean = false;
let pointerOffsetX
let pointerOffsetY

interface Keys {
  'w': boolean,
  'a': boolean,
  's': boolean,
  'd': boolean,
  'c': boolean,
  't': boolean,
  'y': boolean,
  'r': boolean
}

const keys : Keys = {
  'w': false,
  's': false,
  'a': false,
  'd': false,
  'c': false,
  't': false,
  'y': false,
  'r': false
}

const resetPointerOffsets = () => {
  pointerOffsetX = 0
  pointerOffsetY = 0
}

window.addEventListener('keydown', (k) => {
  if (k.key in keys) {
    keys[k.key] = true
    if (MK) player.isMoving = true
  } 
  // else if (k.key === 'r') player.getHit(20)
})
window.addEventListener('keyup', (k) => {
  if (k.key in keys) {
    keys[k.key] = false
    if (MK) {
      if (Object.values(keys).every(v => v === false)) {
        player.isMoving = false
      }
    }

    if (k.key === 'r') switchMode()
    
  }
})


const setPointerOffsets = () => {
  pointerOffsetX = -world.x
  pointerOffsetY = -world.y
}

const moveCamera = () => {
  if (keys.w) {
    if (world.y >= 300) return
    world.y += 10
    pointerOffsetY -= 10
  }
  if (keys.s) {
    if (world.y <= g.stage.height - surfaceHeight) return
    world.y -= 10
    pointerOffsetY += 10
  }
  if (keys.a) {
    if (world.x >= 0) return
    world.x += 10
    pointerOffsetX -= 10
  }
  if (keys.d) {
    if (world.x <= g.stage.width - surfaceWidth) return
    world.x -= 10
    pointerOffsetX += 10
  }

  if (keys.y) {
    addUnit()
  } else if (keys.t) {
    removeUnit()
  }

  // if (keys.r) {
  //   objLayer.children.sort((a, b) =>  (a.y + a.height) - (b.y + b.height))
  // }

}

const movePlayer = () => {

  if (keys.w) {
    player.y -= player.speed
    checkCollisions('bot')
    player.scan()
    objLayer.children.sort((a, b) =>  (a.Y + a.height) - (b.Y + b.height))
  }
  if (keys.s) {
    player.y += player.speed
    checkCollisions('top')
    player.scan()
    objLayer.children.sort((a, b) =>  (a.Y + a.height) - (b.Y + b.height))
  }
  if (keys.a) {
    player.x -= player.speed
    checkCollisions('right')
    player.scan()
  }
  if (keys.d) {
    player.x += player.speed
    checkCollisions('left')
    player.scan()
  }
}

let added = false
let removed = false

const addUnit = () => {
  if (added) return
  added = true
  const u = makeEnemy(300 + randomNum(-100, 100), 500 + randomNum(-100, 100))
  objLayer.addChild(u)
  enemies.push(u)
  // sortUnits(aggPoint.x, aggPoint.y)
  // instantSort(units, aggPoint.x, aggPoint.y)
  g.wait(50, () => {added = false})
}

const removeUnit = () => {
  if (enemies.length == 0) return
  if (removed) return
  removed = true
  g.remove(enemies.pop())
  // sortUnits(aggPoint.x, aggPoint.y)
  // instantSort(units, aggPoint.x, aggPoint.y)
  g.wait(30, () => {removed = false})
}


export {
  keys,
  pointerOffsetX,
  pointerOffsetY,
  moveCamera,
  movePlayer,
  resetPointerOffsets,
  setPointerOffsets
}