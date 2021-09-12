import { currentAction, g, playerUnits, selectedUnits, movingUnits, enemies, attackingTarget, cellSize, miners } from './main.js'
import { gridMap, mine } from './main/mainSetUp/initMap.js'
import { uiLayer, world, floorLayer } from './main/mainSetUp/initLayers.js'
import { getUnitVector, sortUnits, setDirection, checkNeighbors, notEnough } from './functions.js'
import { actionMark, rectangle, makeSelectionBox } from './drawings.js'
import { currentPlayer, UC } from './keyboard.js'
import { buttons, currentGold, goldDisplay, prices } from './main/mainSetUp/initBottomPanel.js'
import { bluePrint } from './main/mainLoop/showBluePrint.js'
import { turret } from './objects.js'

let selectionBox
let selectionStarted
let boxSet

const initSelectionBox = () => {
  selectionStarted = false
  boxSet = false
  selectionBox = makeSelectionBox()
  selectionBox.alpha = 0
  uiLayer.addChild(selectionBox)
}
const pointerDown = (e) => {
  if (e.button === 0) leftMouseDown()
  else if (e.button === 2) rightMouseDown()
}
const pointerUp = (e) => {
  if (UC) return false
  if (e.button === 0) leftMouseUp()
}
const clickedBottomPanel = () => {
  if (g.pointer.y > g.stage.height - 100) return true
}
const leftMouseDown = () => {

  if (!currentAction.started) {
    buttons.forEach(button => {
      if (g.hitTestPoint(g.pointer, button)) {
        button.onPress()
      }
    })
    return
  }


  if (!UC) {
    if (clickedBottomPanel()) {
      buttons.forEach(button => {
        if (g.hitTestPoint(g.pointer, button)) {
          button.onPress()
        }
      })

    } else {
      if (currentAction.placingBuilding) {
        
        const row = ((g.pointer.y - world.y) / cellSize) | 0
        if (row < 0) return
        const cel = ((g.pointer.x - world.x) / cellSize) | 0

        const currentCell = gridMap[row][cel]

        if (currentCell || !checkNeighbors(gridMap, row, cel) || currentGold < prices[2]) {
          notEnough()
          // console.log('cant build here')
        } else {
          goldDisplay.sub(prices[2])
          currentAction.placingBuilding = false
          gridMap[row][cel] = 4
          turret(cel, row)
          bluePrint.visible = false
          // console.log('construction complete')
        }
        
      } else {
        selectionStarted = true
        g.wait(20, () => selectionBox.alpha = 1)
      }
    }
  } else currentPlayer.attack()
}
const rightMouseDown = () => {
  if (!UC) {

    if (g.pointer.shiftedY < -20) return

    if (!clickedBottomPanel()) {
      if (currentAction.placingBuilding) {
        currentAction.placingBuilding = false
        bluePrint.visible = false
      }

      if (selectedUnits.length > 0) {
        if (enemies.length > 0) {
          for (const enemy of enemies) {
            if (g.GlobalDistance(enemy, g.pointer) <= 25) {
              const a = actionMark(enemy, 0, 0, true)
              enemy.addChild(a)
              selectedUnits.forEach(unit => {
                if (g.GlobalDistance(unit, enemy) > unit.range) {
                  unit.destinationX = enemy.centerX - world.x
                  unit.destinationY = enemy.centerY - world.y
                  unit.goal = enemy
                  setDirection(unit)
                  unit.getInRange = true
                  unit.isSeeking = true
                  if (!unit.isMoving) {
                    unit.isMoving = true
                    movingUnits.push(unit)
                  }
                } else {
                  unit.isMoving = false
                  unit.target = enemy
                  if (attackingTarget.indexOf(unit) == -1) {
                    attackingTarget.push(unit)
                  }
                }
              })
              return
            }   
          }
        }


        const dis = g.GlobalDistance(mine, g.pointer)
        if (dis < 25) {
          selectedUnits.forEach(unit => {
            if (unit.type == 'Pleb') {
              unit.readForOrders = true
              if (!unit.isMining) {
                unit.isMining = true
                miners.push(unit)
              }
              if (!unit.isMoving) {
                unit.isMoving = true
                movingUnits.push(unit)
              }
            }
          })
          return
        }
        actionMark(floorLayer, g.pointer.shiftedX, g.pointer.shiftedY, false)
        sortUnits(selectedUnits, g.pointer.shiftedX, g.pointer.shiftedY, movingUnits)
      }

    }

  } else {
    if (currentPlayer.type == 'MK') {
      if (currentPlayer.rollOnCooldown) return false
      currentPlayer.rollOnCooldown = true
      const uv = getUnitVector(currentPlayer, g.pointer)
      currentPlayer.vx = uv.x
      currentPlayer.vy = uv.y
      currentPlayer.isRolling = true
      currentPlayer.scan(1500, 350)
      currentPlayer.roll()
      g.wait(200, () => {
        if (currentPlayer) currentPlayer.rollOnCooldown = false
      })
    }
  }
}
const leftMouseUp = () => {
  if (currentAction.started) {
    if (selectionStarted) {
      selectedUnits.forEach(v => v.deselect())
      selectedUnits.length = 0
      const w = selectionBox.WIDTH
      const h = selectionBox.HEIGHT
      const tempBox = rectangle(w ? Math.abs(w) : 1, h ? Math.abs(h) : 1, '#FFF', 0, w < 0 ? selectionBox.gx + w : selectionBox.gx, h < 0 ? selectionBox.gy + h : selectionBox.gy)
      g.stage.addChild(tempBox)
      playerUnits.forEach(unit => {
        if (g.hitTestRectangle(tempBox, unit, true)) {
          if (selectedUnits.findIndex((value) => value == unit) == -1) unit.select()
        }
      })
      selectionStarted = false
      selectionBox.alpha = 0
      boxSet = false
      g.wait(80, () => g.remove(tempBox))
    }
  }
}
const beginSelection = () => {
  if (selectionStarted) {
    if (!boxSet) {
      selectionBox.x = g.pointer.x
      selectionBox.y = g.pointer.y
      boxSet = true
    }
    const x = g.pointer.x - selectionBox.x
    const y = g.pointer.y - selectionBox.y
    selectionBox.WIDTH = x
    selectionBox.HEIGHT = y
  }
}

export { initSelectionBox, beginSelection, pointerDown, pointerUp, }
