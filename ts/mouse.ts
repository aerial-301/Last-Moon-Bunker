import { g, uiLayer, units, selectedUnits, movingUnits, solids, MK, player, MK } from './main.js'
import { getUnitVector, sortUnits } from './functions.js'
import { pointerOffsetX, pointerOffsetY } from './keyboard.js'
import { makeRectangle, makeSelectionBox } from './drawings.js'

let selectionBox
let selectionStarted
let boxSet

const createSelectionBox = () => {
  selectionStarted = false
  boxSet = false
  selectionBox = makeSelectionBox()
  selectionBox.alpha = 0;
  uiLayer.addChild(selectionBox)
}

const pointerDown = (e) => {
  if (e.button === 0) leftMouseDown()
  else if (e.button === 2) rightMouseDown()
}

const pointerUp = (e) => {
  if (MK) return false
  if (e.button === 0) leftMouseUp()
  else if (e.button === 2) rightMouseUp()
  
}

const leftMouseDown = () => {
  if (!MK) {
    selectionStarted = true
    selectionBox.alpha = 1
  } else {
    player.attack()
  }
}

const rightMouseDown = () => {
  if (!MK) {


    if (selectedUnits.length > 0) {
      for (const obj of solids) {
        if (g.hitTestPoint(g.pointer, obj)) {
          console.log('obj clicked')
          return
        }
      }


      // try {
      //   const cell = Math.floor((g.pointer.x + pointerOffsetX) / cellSize)
      //   const row = Math.floor((g.pointer.y + pointerOffsetY) / cellSize)
      //   // console.log(`[${row}][${cell}]`)
      //   const currentCell = gridMap[row][cell]
      //   // console.log('value = ',currentCell)

      //   if (currentCell[0] == 0) {
      //     const x = currentCell[1]
      //     const y = currentCell[2]
      //     sortUnits(selectedUnits, x, y, movingUnits)
      //     // sortUnits(selectedUnits, g.pointer.x + pointerOffsetX, g.pointer.y + pointerOffsetY, movingUnits)
      //   }
      // } catch (error) {
      //   console.log(error)
      // }
  
      

      

      sortUnits(selectedUnits, g.pointer.x + pointerOffsetX, g.pointer.y + pointerOffsetY, movingUnits)
    }
  } else {
    // if (!g.state) return false
    // if (g.state.name !== 'play') return false
  
    if (player.rollOnCooldown) return false
    player.rollOnCooldown = true
    const uv = getUnitVector(player, g.pointer, true)
    player.vx = uv.x
    player.vy = uv.y
  
    const sides = []
    if (uv.x > 0) sides.push('left')
    else sides.push('right')
    if (uv.y > 0) sides.push('top')
    else sides.push('down')
  
    player.isRolling = true
    player.scan(1500, 350)
    player.roll()
  
    g.wait(200, () => {
      player.rollOnCooldown = false
    })
  }
}

const leftMouseUp = () => {
  if (selectionStarted) {
    selectedUnits.forEach(v => v.deselect())
    
    selectedUnits.length = 0
    const w = selectionBox.WIDTH
    const h = selectionBox.HEIGHT
    const tempBox = makeRectangle(w? Math.abs(w) : 1, h? Math.abs(h) : 1, '#FFF', 0, w < 0 ? selectionBox.gx + w : selectionBox.gx, h < 0 ? selectionBox.gy + h : selectionBox.gy)
    g.stage.addChild(tempBox)
    for (const unit of units) {
      if (g.hitTestRectangle(tempBox, unit, true)) {
        if (selectedUnits.findIndex((value) => value == unit) == -1) {
          unit.select()
        }
      }
    }
    selectionStarted = false
    selectionBox.alpha = 0
    boxSet = false
    g.wait(80, () => {g.remove(tempBox)})
  }
}


const beginSelection = () => {
  if (selectionStarted) {
    if (!boxSet) {
      selectionBox.x = g.pointer.x
      selectionBox.y = g.pointer.y
      boxSet = true
    }
    selectionBox.WIDTH = g.pointer.x - selectionBox.x
    selectionBox.HEIGHT = g.pointer.y - selectionBox.y
  }
}

const rightMouseUp = () => {
  // rightClicked = false
}

export { 
  createSelectionBox,
  beginSelection,
  pointerDown,
  pointerUp,
}
