import { g } from "./main.js"
import { makeGeneralObject, makeMovableObject, moreProperties } from "./unitObject.js"

const PI = Math.PI

const makeCircle = (d: number, k: string, l: number, movable: boolean = false, x = 0, y = 0) => {
  let g
  if (!movable) g = makeGeneralObject(d, d, x, y)
  else g = makeMovableObject(d, d, x, y)
  const o = {
    ...g,
    radius: d / 2,
  }

  o.render = (c) => {
    c.strokeStyle = 'black'
    c.lineWidth = l
    c.fillStyle = k
    c.beginPath()
    c.arc(o.radius + (-o.radius * 2 * o.pivotX), o.radius + (-o.radius * 2 * o.pivotY), o.radius, 0, 2 * PI, false)
    if (l) c.stroke()
    c.fill()
  }

  moreProperties(o)
  return o
}

const makeRectangle = (w: number, h: number, k: string, s: number = 1, x = 0, y = 0) => {
  const g = makeGeneralObject(w, h)
  const o = {
    ...g,
    x: x,
    y: y,
    width: w,
    height: h,
    fillStyle: k,
    strokeStyle: 'black',
  }
  o.render = (c) => {
    c.strokeStyle = o.strokeStyle
    c.lineWidth = s
    c.fillStyle = o.fillStyle
    c.beginPath()
    c.rect(-o.width * o.pivotX, -o.height * o.pivotY, o.width, o.height);
    c.fill()
    if (s) c.stroke()
  }
  moreProperties(o)
  return o
}

const makeSelectionBox = () => {
  const g = makeGeneralObject(1, 1)
  const o = {
    ...g,
    WIDTH: 1,
    HEIGHT: 1,
    render(c){
      c.strokeStyle = '#FFF'
      c.lineWidth = 4
      c.beginPath()
      c.rect(o.WIDTH, o.HEIGHT, -o.WIDTH, -o.HEIGHT)
      c.stroke()
    }
  }
  moreProperties(o)
  return o
}

const makeTreeTop = (t, type, color) => {
  const treeYOffset = 16
  const w = t.width * 3
  const g = makeGeneralObject(w, w)
  const o = {
    ...g,
    type: type,
    x: t.x,
    y: t.y,
    r: (t.width) * 1.5,
    render(c) {
      c.fillStyle = color
      if (type) {
        c.beginPath()
        c.arc(0, 0, o.r, 0, PI * 2, false)
        c.fill()
      } else { 
        c.beginPath()
        c.arc(-3, treeYOffset - 2, 5, PI * 0.0, PI * 1.4, false)
        c.arc(-11, treeYOffset - 6, 5, PI * 0.0, PI * 1.4, false)
        c.arc(-17, treeYOffset - 15, 6, PI * 0.4, PI * 1.7, false)
        c.arc(-11, treeYOffset - 27, 7, PI * 0.7, PI * 2, false)
        c.arc(+ 2, treeYOffset - 30, 7, PI * 1.1, PI * 0.2, false)
        c.arc(+ 17, treeYOffset - 24, 9, PI * 1.1, PI * 0.5, false)
        c.arc(+ 15, treeYOffset - 9, 6, PI * 1.5, PI * 0.8, false)
        c.arc(+ 6,  treeYOffset - 2, 5, PI * 1.7, PI * 0.9, false)
        c.fill()
      }
    }
  }
  moreProperties(o)

  
  return o
}

const makeTreeTrunk = (x = 0, y = 0, width = 30, color) => {
  const g = makeGeneralObject(width, width * 3, x, y)
  const o = {
    ...g,
  }
  o.render = (c) => {
    c.fillStyle = color
    c.beginPath()
    c.rect(-o.width * o.pivotX, -o.height * o.pivotY, o.width, o.height)
    c.fill()
  }
  moreProperties(o)
  return o
}

const makeSlash = (n: number) => {
  const g = makeGeneralObject(140, 140)
  const o = {
    ...g,
    // blendMode: 'exclusion',
    render(c) {
      c.fillStyle = '#fff'
      if (n) {
        c.beginPath()
        c.arc(0, 160, 160, PI * 1.5, PI * 0.165, false)
        c.arc(65, 195, 85, PI * 0.165, PI * 1.225, true)
        c.fill()
      } else {
        c.beginPath()
        c.arc(0, 160, 160, PI * 1.5, PI * 0.835, true)
        c.arc(-65, 195, 85, PI * 0.835, PI * 1.772, false)
        c.fill()
      }
    }
  }
  moreProperties(o)
  return o
}

const makeTwoEyes = (two = 1) => {
  const g = makeGeneralObject(34, 10)
  const o = {
    ...g,
    render(c) {
      c.lineJoin = 'round'
      c.strokeStyle = 'black'
      c.fillStyle = 'red'
      c.lineWidth = 0.7
      c.beginPath()
      c.moveTo(0, 0)
      c.lineTo(14, 10)
      c.lineTo(0, 5)
      c.lineTo(0, 0)
      c.fill()
      
      // Right eye
      if (two) {
        c.moveTo(34, 0)
        c.lineTo(20, 10)
        c.lineTo(34, 5)
        c.lineTo(34, 0)
        c.fill()
      }
      c.stroke()
    }
  }
  moreProperties(o)
  return o
}

const makeThirdEye = () => {
  const g = makeGeneralObject(6, 15)
  const o = {
    ...g,
    render(c){
      c.strokeStyle = 'black'
      c.fillStyle = 'red'
      c.lineWidth = 0.5
      c.beginPath()
      c.moveTo(0, 0)
      c.lineTo(6, 0)
      c.lineTo(3, 15)
      c.lineTo(0, 0)
      c.fill()
      c.stroke()
    }
  }
  moreProperties(o)
  return o
}

const makeLeg = (x: number) => {
  const g = makeGeneralObject(7, 5)
  const o = {
    ...g,
    x: x,
    render(c) {
      c.strokeStyle = '#000'
      c.fillStyle = '#555'
      c.lineWidth = 1
      c.beginPath()
      c.moveTo(0, 0)
      c.lineTo(6, 0)
      c.lineTo(6, 4)
      c.lineTo(0, 4)
      c.lineTo(0, 0)
      c.fill()
      c.stroke()
    }
  }
  moreProperties(o)
  return o
}

const makeBorder = (w, h) => {
  const g = makeGeneralObject(w, h)
  const o = {
    ...g,
    render(c) {
      c.strokeStyle = '#FFF'
      c.lineWidth = 2
      c.beginPath()
      c.moveTo(0, 0)
      c.lineTo(w / 4, 0)
      c.moveTo(w - w / 4, 0)
      c.lineTo(w, 0)
      c.lineTo(w, w / 4)
      c.moveTo(w, h - w / 4)
      c.lineTo(w, h)
      c.lineTo(w - w / 4, h)
      c.moveTo(w / 4, h)
      c.lineTo(0, h)
      c.lineTo(0, h - w / 4)
      c.moveTo(0, w / 4)
      c.lineTo(0, 0)
      c.stroke()
    }
  }
  moreProperties(o)
  return o
}

const makeHeadDetails = (two = 1) => {
  const g = makeGeneralObject(50, 50)
  const o = {
    ...g,
    render(c) {
      c.lineWidth = 4.5
      c.strokeStyle = '#555'
      c.beginPath()
      c.arc(25, 24, 23, Math.PI * 0.2, Math.PI * 1.2, false)
      c.stroke()
      c.strokeStyle = 'gray'
      c.beginPath()
      c.arc(27, 22, 22, Math.PI * 0.2, Math.PI * 1.2, false)
      c.stroke()
      if (two) {
        c.strokeStyle = 'black'
        c.lineWidth = 1.5
        c.beginPath()
        c.arc(14, 12, 35, Math.PI * 0.20, Math.PI * 0.4 , false)
        c.stroke()
        c.beginPath()
        c.arc(47, 20, 22, Math.PI * 0.55, Math.PI * 0.85 , false)
        c.stroke()
        c.beginPath()
        c.arc(43, 22, 22, Math.PI * 0.55, Math.PI * 0.85, false)
        c.stroke()
      } 
      // else {
      //   c.strokeStyle = 'black'
      //   c.lineWidth = 1.2
      //   c.beginPath()
      //   c.moveTo(30, 25)
      //   c.lineTo(42, 17)
      //   // c.arc(40, 52, 35, Math.PI * 1.2, Math.PI * 1.78 , false)
      //   c.stroke()
      // }
    }
  }
  moreProperties(o)
  return o
}


const moonSurface1 = (w, h) => {
  const g = makeGeneralObject(w, h)
  const o = {
    ...g,
    render(c) {
      c.strokeStyle = '#FFF'
      c.lineWidth = 2
      c.beginPath()
      c.rect(0, 0, 100, 100)
      c.stroke()
    }
  }
  moreProperties(o)
  return o
}

export {
  makeCircle,
  makeRectangle,
  makeSelectionBox,
  makeTreeTop,
  makeTreeTrunk,
  makeSlash,
  makeTwoEyes,
  makeThirdEye,
  makeLeg,
  makeBorder,
  makeHeadDetails,
  // moonSurface1
}
