import { makeGeneralObject, makeMovableObject, moreProperties } from "./unitObject.js"
const PI = Math.PI
const makeCircle = (d, k, l, movable = false, x = 0, y = 0) => {
    let g
    if (!movable)
        g = makeGeneralObject(d, d, x, y)
    else
        g = makeMovableObject(d, d, x, y)
    const o = Object.assign(Object.assign({}, g), { fillStyle: k, radius: d / 2 })
    o.render = (c) => {
        c.strokeStyle = 'black'
        c.lineWidth = l
        c.fillStyle = o.fillStyle
        c.beginPath()
        c.arc(o.radius + (-o.radius * 2 * o.pivotX), o.radius + (-o.radius * 2 * o.pivotY), o.radius, 0, 2 * PI, false)
        if (l)
            c.stroke()
        c.fill()
    }
    moreProperties(o)
    return o
}
const makeRectangle = (w, h, k, s = 1, x = 0, y = 0) => {
    const g = makeGeneralObject(w, h, x, y)
    const o = Object.assign(Object.assign({}, g), { x: x, y: y, width: w, height: h, fillStyle: k, strokeStyle: 'black' })
    o.render = (c) => {
        c.strokeStyle = o.strokeStyle
        c.lineWidth = s
        c.fillStyle = o.fillStyle
        c.beginPath()
        c.moveTo(x, y)
        c.rect(-o.width * o.pivotX, -o.height * o.pivotY, o.width, o.height)
        c.fill()
        if (s)
            c.stroke()
    }
    moreProperties(o)
    return o
}
const makeSelectionBox = () => {
    const g = makeGeneralObject(1, 1)
    const o = Object.assign(Object.assign({}, g), { WIDTH: 1, HEIGHT: 1, render(c) {
            c.strokeStyle = '#FFF'
            c.lineWidth = 4
            c.beginPath()
            c.rect(o.WIDTH, o.HEIGHT, -o.WIDTH, -o.HEIGHT)
            c.stroke()
        } })
    moreProperties(o)
    return o
}
const makeSlash = (n) => {
    const g = makeGeneralObject(140, 140)
    const o = Object.assign(Object.assign({}, g), { 
        // blendMode: 'exclusion',
        render(c) {
            c.fillStyle = '#fff'
            if (n) {
                c.beginPath()
                c.arc(0, 160, 160, PI * 1.5, PI * 0.165, false)
                c.arc(65, 195, 85, PI * 0.165, PI * 1.225, true)
                c.fill()
            }
            else {
                c.beginPath()
                c.arc(0, 160, 160, PI * 1.5, PI * 0.835, true)
                c.arc(-65, 195, 85, PI * 0.835, PI * 1.772, false)
                c.fill()
            }
        } })
    moreProperties(o)
    return o
}
const makeTwoEyes = (two = 1, x = 0, y = 0) => {
    const g = makeGeneralObject(34, 10)
    const o = Object.assign(Object.assign({}, g), { render(c) {
            c.lineJoin = 'round'
            c.strokeStyle = 'black'
            c.fillStyle = 'red'
            c.lineWidth = 0.7
            c.beginPath()
            c.moveTo(x, y)
            c.lineTo(x + 14, y + 10)
            c.lineTo(x, y + 5)
            c.lineTo(x, y)
            c.fill()
            // Right eye
            if (two) {
                c.moveTo(x + 34, y)
                c.lineTo(x + 20, y + 10)
                c.lineTo(x + 34, y + 5)
                c.lineTo(x + 34, y)
                c.fill()
            }
            c.stroke()
        } })
    moreProperties(o)
    return o
}
const makeThirdEye = (x = -3, y = -80) => {
    const g = makeGeneralObject(6, 15)
    const o = Object.assign(Object.assign({}, g), { render(c) {
            c.strokeStyle = 'black'
            c.fillStyle = 'red'
            c.lineWidth = 0.5
            c.beginPath()
            c.moveTo(x, y)
            c.lineTo(x + 6, y)
            c.lineTo(x + 3, y + 15)
            c.lineTo(x, y)
            c.fill()
            c.stroke()
        } })
    moreProperties(o)
    return o
}
const makeLeg = (x) => {
    const g = makeGeneralObject(7, 5)
    const o = Object.assign(Object.assign({}, g), { x: x, render(c) {
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
        } })
    moreProperties(o)
    return o
}
const makeBorder = (w, h) => {
    const g = makeGeneralObject(w, h)
    const o = Object.assign(Object.assign({}, g), { render(c) {
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
        } })
    moreProperties(o)
    return o
}
const makeHeadDetails = (two = 1) => {
    const g = makeGeneralObject(50, 50)
    const o = Object.assign(Object.assign({}, g), { render(c) {
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
                c.arc(14, 12, 35, Math.PI * 0.20, Math.PI * 0.4, false)
                c.stroke()
                c.beginPath()
                c.arc(47, 20, 22, Math.PI * 0.55, Math.PI * 0.85, false)
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
        } })
    moreProperties(o)
    return o
}
const shotHit = (x, y) => {
    const g = makeGeneralObject(10, 10, x, y)
    const o = Object.assign(Object.assign({}, g), { render(c) {
            c.strokeStyle = '#F00'
            c.fillStyle = '#FF0'
            c.lineWidth = 4
            c.beginPath()
            c.arc(-1, -1, 2, 0, 2 * PI, false)
            c.stroke()
            c.fill()
        } })
    moreProperties(o)
    return o
}
const flash = (x = 0, y = 0) => {
    const g = makeGeneralObject(10, 10, x, y)
    const o = Object.assign(Object.assign({}, g), { render(c) {
            c.strokeStyle = '#F00'
            c.fillStyle = '#FF0'
            c.lineWidth = 2
            c.beginPath()
            c.lineTo(0, 1)
            c.lineTo(50, 0)
            c.lineTo(0, -1)
            c.stroke()
            c.fill()
        } })
    moreProperties(o)
    return o
}
const actionMark = (x = 0, y = 0, attack = true) => {
    const g = makeGeneralObject(10, 10, x, y)
    const o = Object.assign(Object.assign({}, g), { render(c) {
            c.lineWidth = 8
            c.beginPath()
            if (attack) {
                c.strokeStyle = '#F00'
                c.arc(20, 22, 35, 0, 2 * PI, false)
                c.stroke()
            }
            else {
                c.strokeStyle = '#0F0'
                c.moveTo(-10, -10)
                c.lineTo(10, 10)
                c.moveTo(10, -10)
                c.lineTo(-10, 10)
                c.stroke()
            }
        } })
    moreProperties(o)
    return o
}
const makeEnemyEyes = () => {
    const g = makeGeneralObject(0, 0)
    const o = Object.assign(Object.assign({}, g), { render(c) {
            c.strokeStyle = '#FFF'
            c.lineWidth = 2
            c.beginPath()
        } })
    moreProperties(o)
    return o
}
const moonSurface1 = (w, h) => {
    const g = makeGeneralObject(w, h)
    const o = Object.assign(Object.assign({}, g), { render(c) {
            c.strokeStyle = '#FFF'
            c.lineWidth = 2
            c.beginPath()
            c.rect(0, 0, 100, 100)
            c.stroke()
        } })
    moreProperties(o)
    return o
}
export { makeCircle, makeRectangle, makeSelectionBox, 
// makeTreeTop,
// makeTreeTrunk,
makeSlash, makeTwoEyes, makeThirdEye, makeLeg, makeBorder, makeHeadDetails, shotHit, flash, actionMark
// moonSurface1
 }
