import { world, objLayer } from './main/mainSetUp/initLayers.js'
import { g, selectedUnits, movingUnits, attackingTarget, tip, summonWave} from './main.js'
import { checkCollisions, removeItem } from './functions.js'
import { bottomPanel } from './main/mainSetUp/initBottomPanel.js'
// import { gridMap } from './main/mainSetUp/initMap.js'
// import { debugShape, tempIndicator } from '../extra/debug.js'
let currentPlayer, UC

const keys = {
  'w': false,
  's': false,
  'a': false,
  'd': false,
}

window.addEventListener('keydown', (k) => {
  if (k.key in keys) {
    keys[k.key] = true
    if (UC) currentPlayer.isMoving = true
  }
})
window.addEventListener('keyup', (k) => {
  if (k.key in keys) {
    keys[k.key] = false
    if (UC) {
      if (Object.values(keys).every(v => v === false)) currentPlayer.isMoving = false
    }

  } else if (k.key === 'r') switchMode()

  if (k.key === 'p') summonWave()
  // if (k.key === 'o') {
  //   gridMap.forEach(r => console.log(r.join('')))
  // }
  
})

const moveCamera = (surfaceWidth, surfaceHeight) => {
  if (keys['w']) {
    if (world.y < 300) world.y += 20
  }
  if (keys['s']) {
    if (world.y > g.stage.height - surfaceHeight) world.y -= 20
  }
  if (keys['a']) {
    if (world.x < 0) world.x += 20
  }
  if (keys['d']) {
    if (world.x > g.stage.width - surfaceWidth) world.x -= 20
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
  if (!UC) {
    if (selectedUnits.length === 1) {
      UC = true
      tip.visible = false
      bottomPanel.visible = false
      currentPlayer = selectedUnits[0]
      currentPlayer.isMoving = false
      currentPlayer.target = null
      removeItem(movingUnits, currentPlayer)
      removeItem(attackingTarget, currentPlayer)
      currentPlayer.deselect()
      selectedUnits.length = 0
    }
  }
  else {
    UC = false
    bottomPanel.visible = true
    if (!currentPlayer.isDead) {
      currentPlayer.isMoving = false
      currentPlayer.weapon.rotation = currentPlayer.weaponRotation
      currentPlayer = null
    }
  }
}

export { 
  keys,
  moveCamera,
  movePlayer,
  switchMode,
  currentPlayer,
  UC
}
