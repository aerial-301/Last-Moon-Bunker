import { world, objLayer } from './main/mainSetUp/initLayers.js'
import { g, selectedUnits, movingUnits, attackingTarget, summonWave } from './main.js'
import { checkCollisions, removeItem } from './functions.js'
import { bottomPanel } from './main/mainSetUp/initBottomPanel.js'
// import { debugShape, tempIndicator } from '../extra/debug.js'
let currentPlayer, MK

const keys = {
  'w': false,
  's': false,
  'a': false,
  'd': false,
}

window.addEventListener('keydown', (k) => {
  if (k.key in keys) {
    keys[k.key] = true
    if (MK) currentPlayer.isMoving = true
  }
})
window.addEventListener('keyup', (k) => {
  if (k.key in keys) {
    keys[k.key] = false
    if (MK) {
      if (Object.values(keys).every(v => v === false)) currentPlayer.isMoving = false
    }
    
    



    // if (k.key === 'p') moveSpeed += 100
    // if (k.key === 'o') moveSpeed -= 100

    // if (k.key === 'k') {
    //   tempIndicator(world.gx, world.gy, 400, 'white', 10)
    //   for (const c of objLayer.children) {
    //     tempIndicator(c.parent.gx, c.parent.gy, 400, 'purple', 20)
    //     tempIndicator(c.gx, c.gy, 500, 'red', 20)
    //     tempIndicator(c.centerX, c.centerY, 500, 'yellow', 20)
    //   }
    // }

    // if (k.key === 'h') {
    //   for (const c of objLayer.children) {
    //     const s = debugShape(c)
    //     shapes.push(s)
    //   }
    // }

    // if (k.key === 'j') {
    //   if (shapes.length > 0) {
    //     shapes.forEach(s => g.remove(s))
    //     shapes = []
    //   }
    // }

  } else if (k.key === 'r') switchMode()

  if (k.key === 'p') summonWave()
  
})

const moveCamera = (surfaceWidth, surfaceHeight) => {
  if (keys['w']) {
    if (world.y < 300) world.y += 10
  }
  if (keys['s']) {
    if (world.y > g.stage.height - surfaceHeight) world.y -= 10
  }
  if (keys['a']) {
    if (world.x < 0) world.x += 10
  }
  if (keys['d']) {
    if (world.x > g.stage.width - surfaceWidth) world.x -= 10
  }
}
const movePlayer = () => {
  if (keys['w']) {
    currentPlayer.y -= currentPlayer.speed
    checkCollisions('bot')
    currentPlayer.scan()
    objLayer.children.sort((a, b) => a.bottom - b.bottom)
  }
  if (keys['s']) {
    currentPlayer.y += currentPlayer.speed
    checkCollisions('top')
    currentPlayer.scan()
    objLayer.children.sort((a, b) => a.bottom - b.bottom)
  }
  if (keys['a']) {
    currentPlayer.x -= currentPlayer.speed
    checkCollisions('right')
    currentPlayer.scan()
  }
  if (keys['d']) {
    currentPlayer.x += currentPlayer.speed
    checkCollisions('left')
    currentPlayer.scan()
  }
}




const switchMode = () => {
  if (!MK) {
    if (selectedUnits.length === 1) {
      MK = true
      bottomPanel.visible = false
      currentPlayer = selectedUnits[0]
      currentPlayer.isMoving = false
      currentPlayer.target = null
      removeItem(movingUnits, currentPlayer)
      removeItem(attackingTarget, currentPlayer)
      currentPlayer.deselect()
      // currentPlayer.HB.alwaysVisible = true
      // currentPlayer.yellowHB.alwaysVisible = true
      selectedUnits.length = 0
      // ;[blackHB, yellowHB, HB].forEach(i => i.visible = true)
      // ;[yellowHB, HB].forEach(i => {
      //   i.width = (currentPlayer.health / currentPlayer.baseHealth) * 400 * currentPlayer.HBscale
      // })
    }
  }
  else {
    MK = false
    // ;[blackHB, yellowHB, HB].forEach(i => i.visible = false)
    // ;[yellowHB, HB].forEach(i => currentPlayer[i].alwaysVisible = false)
    // currentPlayer.HB.alwaysVisible = false
    // currentPlayer.yellowHB.alwaysVisible = false
    bottomPanel.visible = true
    if (!currentPlayer.isDead) {
      currentPlayer.isMoving = false
      currentPlayer.weapon.rotation = currentPlayer.weaponRotation
      currentPlayer = null
    }
  }
}











// let added = false
// let removed = false
// const addUnit = () => {
//     if (added) return
//     added = true
//     const u = makeEnemy(300 + randomNum(-100, 100), 500 + randomNum(-100, 100))
//     objLayer.addChild(u)
//     enemies.push(u)
//     g.wait(50, () => added = false)
// }

// const removeUnit = () => {
//     if (enemies.length == 0) return
//     if (removed) return
//     removed = true
//     g.remove(enemies.pop())
//     g.wait(30, () => removed = false)
// }
export { 
  keys,
  moveCamera,
  movePlayer,
  switchMode,
  currentPlayer,
  MK
}
