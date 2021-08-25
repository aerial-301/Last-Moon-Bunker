import { g, enemies, playerUnits, armedUnits } from '../../main.js'


let readyToScanE = true
let readyToScanP = true

export const lookForTargets = () => {
  scanFor()
  scanFor(false)
}

const scanFor = (forEnemies = true) => {
  if (forEnemies) {
    if (readyToScanE) {
      readyToScanE = false
      scanLoop()
      g.wait(1400, () => readyToScanE = true)
    }
  } else {
    if (readyToScanP) {
      readyToScanP = false
      scanLoop(enemies, playerUnits)
      g.wait(1100, () => readyToScanP = true)
    }
  }
}

const scanLoop = (scanners = armedUnits, scannees = enemies) => scanners.forEach(unit => {if (!unit.target) unit.scanForTargets(scannees)})
