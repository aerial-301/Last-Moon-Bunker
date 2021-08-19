import { g, world, objLayer, surfaceWidth, surfaceHeight, switchMode, MK, enemies, currentPlayer } from './main.js'
import { checkCollisions, randomNum } from './functions.js'
import { makeEnemy } from './unitObject.js'
import { debugShape, tempIndicator } from '../extra/debug.js'


export var moveSpeed = 0



let shapes = []


let paused = false
const keys = {
  'w': false,
  's': false,
  'a': false,
  'd': false,
  'c': false,
  't': false,
  'y': false,
  'r': false,
  'p': false,
  'o': false,
  'k': false,
  'h': false,
  'j': false,
}

window.addEventListener('keydown', (k) => {
    if (k.key in keys) {
        keys[k.key] = true
        if (MK)
            currentPlayer.isMoving = true
    }
    // else if (k.key === 'r') player.getHit(20)
})
window.addEventListener('keyup', (k) => {
  if (k.key in keys) {
    keys[k.key] = false
    if (MK) {
      if (Object.values(keys).every(v => v === false)) currentPlayer.isMoving = false
    }
    if (k.key === 'r') switchMode()
    if (k.key === 'p') moveSpeed += 10
    if (k.key === 'o') moveSpeed -= 10





    if (k.key === 'k') {
      // console.log('world = ', world.x, world.y)
      // console.log('objLayer =  ', objLayer.gx, objLayer.gy)
      tempIndicator(world.gx, world.gy, 400, 'white', 10)
      for (const c of objLayer.children) {


        tempIndicator(c.parent.gx, c.parent.gy, 400, 'purple', 20)

        
        tempIndicator(c.gx, c.gy, 500, 'red', 20)
        tempIndicator(c.centerX, c.centerY, 500, 'yellow', 20)
        
      }
    }

    if (k.key === 'h') {
      for (const c of objLayer.children) {
        const s = debugShape(c)
        shapes.push(s)
      }
    }

    if (k.key === 'j') {
      if (shapes.length > 0) {
        shapes.forEach(s => g.remove(s))
        shapes = []
      }
    }

  }
})

const moveCamera = () => {
  if (keys.w) {
    if (world.y >= 300) return
    world.y += 10
  }
  if (keys.s) {
    if (world.y <= g.stage.height - surfaceHeight) return
    world.y -= 10
  }
  if (keys.a) {
    if (world.x >= 0) return
    world.x += 10
  }
  if (keys.d) {
    if (world.x <= g.stage.width - surfaceWidth) return
    world.x -= 10
  }
  if (keys.y) addUnit()
  else if (keys.t) removeUnit()

  
}
const movePlayer = () => {
  if (keys.w) {
    currentPlayer.y -= currentPlayer.speed
    checkCollisions('bot')
    currentPlayer.scan()
    objLayer.children.sort((a, b) => (a.Y + a.height) - (b.Y + b.height))
  }
  if (keys.s) {
    currentPlayer.y += currentPlayer.speed
    checkCollisions('top')
    currentPlayer.scan()
    objLayer.children.sort((a, b) => (a.Y + a.height) - (b.Y + b.height))
  }
  if (keys.a) {
    currentPlayer.x -= currentPlayer.speed
    checkCollisions('right')
    currentPlayer.scan()
  }
  if (keys.d) {
    currentPlayer.x += currentPlayer.speed
    checkCollisions('left')
    currentPlayer.scan()
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
    g.wait(50, () => added = false)
}

const removeUnit = () => {
    if (enemies.length == 0) return
    if (removed) return
    removed = true
    g.remove(enemies.pop())
    g.wait(30, () => removed = false)
}
export { 
  keys,
  moveCamera,
  movePlayer,
}
