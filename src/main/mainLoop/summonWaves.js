import { randomNum } from "../../functions.js"
import { g, SURFACE_HEIGHT, SURFACE_WIDTH } from "../../main.js"
import { createEnemyUnit } from "../../objects.js"

let readyToSummon = true
let firstWaveDelay = false
let maxSummons = 5
let minSummons = 3
let summons
let enemyLevel = 1.0
let side

const sideWave = () => {
  return Math.random() < .5 ? [-20, randomNum(50, SURFACE_HEIGHT)]  : [SURFACE_WIDTH -20, randomNum(50, SURFACE_HEIGHT)]
}

const bottomWave = () => {
  return [randomNum(0, SURFACE_WIDTH - 30), SURFACE_HEIGHT - 130]
}

let sides = [sideWave, bottomWave]

export const summonWave = () => {
  if (readyToSummon) {
    readyToSummon = false

    if (firstWaveDelay) {

      summons = randomNum(minSummons, maxSummons)
      for (let i = 0; i < summons; i++) {
        side = sides[Math.random() < .5 ? 0 : 1]()
        createEnemyUnit(side[0], side[1], enemyLevel * 95, enemyLevel * 4)
      }

      if (Math.random() > .65) {
        minSummons += 1
        maxSummons += 2
        enemyLevel += 0.24
      }
      
    } else {
      g.wait(5000, () => {
        firstWaveDelay = true
      })
    }

    g.wait(15000, () => readyToSummon = true)
  }
}

