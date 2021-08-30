import { randomNum } from "../../functions.js"
import { g, surfaceHeight, surfaceWidth } from "../../main.js"
import { createEnemyUnit } from "../../unitObject.js"

let readyToSummon = true
let firstWaveDelay = false
let maxSummons = 5
let minSummons = 3
let summons
let enemyLevel = 1.0
let side

const sideWave = () => {
  return Math.random() < .5 ? [-20, randomNum(50, surfaceHeight)]  : [surfaceWidth -20, randomNum(50, surfaceHeight)]
}

const bottomWave = () => {
  return [randomNum(0, surfaceWidth - 30), surfaceHeight - 130]
}

let sides = [sideWave, bottomWave]

export const summonWave = () => {
  if (readyToSummon) {
    readyToSummon = false

    if (firstWaveDelay) {

      summons = randomNum(minSummons, maxSummons)
      for (let i = 0; i < summons; i++) {
        side = sides[Math.random() < .5 ? 0 : 1]()
        createEnemyUnit(side[0], side[1], enemyLevel * 100, enemyLevel * 5)
      }

      if (Math.random() > .65) {
        minSummons += 1
        maxSummons += 2
        enemyLevel += 0.25
      }
      
    } else {
      g.wait(5000, () => {
        firstWaveDelay = true
      })
    }

    g.wait(15000, () => readyToSummon = true)
  }
}

