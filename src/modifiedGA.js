/*
modified version of the GA library: https://github.com/kittykatattack/ga
*/

import { world } from './main/mainSetUp/initLayers.js'
import { randomNum } from './functions.js'
import { makeBasicObject } from './objects.js'

export let GA = {
  create(setup) {
    let g = {}
    g.canvas = document.getElementById('c')
    g.canvas.style.backgroundColor = '#333'
    g.canvas.ctx = g.canvas.getContext("2d")
    g.stage = makeStage()
    g.pointer = makePointer()
    g.state = undefined
    g.setup = setup
    g.paused = false
    g._fps = 40
    g._startTime = Date.now()
    g._frameDuration = 1000 / g._fps
    g._lag = 0
    g.interpolate = true
    let scaleToFit = Math.min(window.innerWidth / g.canvas.width,( window.innerHeight) / g.canvas.height)
    g.canvas.style.transformOrigin = "0 0";
    g.canvas.style.transform = "scale(" + scaleToFit + ")";
    g.scale = scaleToFit

    g.render = (canvas, lagOffset) => {
      let ctx = canvas.ctx
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      g.stage.children.forEach(c => displaySprite(c))
      function displaySprite(s) {

        if (s.alwaysVisible || s.visible && s.gx < canvas.width + s.width && s.gx + s.width >= -s.width && s.gy < canvas.height + s.height && s.gy + s.height >= -s.height) {
          ctx.save()
          if (g.interpolate) {
            if (s._previousX !== undefined) s.renderX = (s.x - s._previousX) * lagOffset + s._previousX
            else s.renderX = s.x
            if (s._previousY !== undefined) s.renderY = (s.y - s._previousY) * lagOffset + s._previousY
            else s.renderY = s.y
          } else {
            s.renderX = s.x
            s.renderY = s.y
          }
          ctx.translate(s.renderX + (s.width * s.pivotX), s.renderY + (s.height * s.pivotY))
          ctx.globalAlpha = s.alpha
          ctx.rotate(s.rotation)
          ctx.scale(s.scaleX, s.scaleY)
          if (s.blendMode)  ctx.globalCompositeOperation = s.blendMode;
          if (s.render) s.render(ctx)
          if (s.children && s.children.length > 0) {
            ctx.translate(-s.width * s.pivotX, -s.height * s.pivotY)
            s.children.forEach(c => displaySprite(c))
          }
          ctx.restore()
        }
      }
    }

    function gameLoop() {
      requestAnimationFrame(gameLoop, g.canvas)
      var current = Date.now(), elapsed = current - g._startTime
      if (elapsed > 1000) elapsed = g._frameDuration
      g._startTime = current
      g._lag += elapsed
      while (g._lag >= g._frameDuration) {
        capturePreviousSpritePositions()
        update()
        g._lag -= g._frameDuration
      }
      g.render(g.canvas, g._lag / g._frameDuration)
    }
    function capturePreviousSpritePositions() {
      g.stage.children.forEach(s => setPosition(s))
      function setPosition(s) {
        s._previousX = s.x
        s._previousY = s.y
        if (s.children && s.children.length > 0) s.children.forEach(child => setPosition(child))
      }
    }
    function update() {if (g.state && !g.paused) g.state()}
    g.start = () => {
      g.setup()
      gameLoop()
    }
    g.pause = () => g.paused = true
    g.resume = () => g.paused = false
    Object.defineProperties(g, {
      fps: {
        get: () => { return g._fps },
        set: v => {
          g._fps = v
          g._startTime = Date.now()
          g._frameDuration = 1000 / g._fps
        },
      }
    })
    g.remove = (s) => s.parent.removeChild(s)
    // function makeBasicObject(o, x = 0, y = 0, w = 50, h = 50) {
    //   o.x= x
    //   o.y= y
    //   o.width= w
    //   o.height= h
    //   o.halfWidth= w / 2
    //   o.halfHeight= h / 2
    //   o.scaleX= 1
    //   o.scaleY= 1
    //   o.pivotX= 0.5
    //   o.pivotY= 0.5
    //   o.rotation= 0
    //   o.alpha= 1
    //   o.stage= false
    //   o.visible= true
    //   o.children = []
    //   o.parent= undefined
    //   o.blendMode= undefined
    //   o.addChild = (c) => {
    //     if (c.parent) c.parent.removeChild(c)
    //     c.parent = o
    //     o.children.push(c)
    //   }
    //   o.removeChild = (c) => { if (c.parent === o) o.children.splice(o.children.indexOf(c), 1) }
    //   Object.defineProperties(o, {
    //     gx: { get: () => { return (o.x + (o.parent? o.parent.gx : 0) ) } },
    //     gy: { get: () => { return (o.y + (o.parent? o.parent.gy : 0) ) } },
    //     centerX: { get: () => { return o.gx + o.halfWidth } },
    //     centerY: { get: () => { return o.gy + o.halfHeight } },
    //     bottom: { get: () => { return o.y + o.parent.gy} }
    //   })
    // }

    function makeStage() {
      const o = {}
      makeBasicObject(o, 0, 0, g.canvas.width, g.canvas.height)
      o.stage = true
      o.parent = undefined
      return o
    }
    const addC = (c, o) => {
      if (c.parent) c.parent.removeChild(c)
      c.parent = o
      o.children.push(c)
    }
    const remC = (c, o) => c.parent == o ? o.children.splice(o.children.indexOf(c), 1) : 0
    g.group = function (s){
      const o = {}
      makeBasicObject(o)
      o.addChild = (c) => {
          addC(c, o)
          o.calculateSize()
      }
      o.removeChild = (c) => {
          remC(c, o)
          o.calculateSize()
      }
      o.calculateSize = () => {
        if (o.children.length > 0) {
          o._newWidth = 0
          o._newHeight = 0
          o.children.forEach(c => {
            if (c.x + c.width > o._newWidth) o._newWidth = c.x + c.width
            if (c.y + c.height > o._newHeight) o._newHeight = c.y + c.height
          })
          o.width = o._newWidth
          o.height = o._newHeight
        }
      }
      g.stage.addChild(o)
      if (s) {
        var sprites = Array.prototype.slice.call(arguments)
        sprites.forEach(s => o.addChild(s))
      }
      return o
    }
    function makePointer() {
      let o = {}
      o._x = 0
      o._y = 0
      Object.defineProperties(o, {
        x: { get: () => o._x / g.scale },
        y: { get: () => o._y / g.scale },
        gx: { get: () => o.x },
        gy: { get: () => o.y },
        halfWidth: { get: () => 0 },
        halfHeight: { get: () => 0 },
        centerX: { get: () => o.x },
        centerY: { get: () => o.y },
        shiftedX: {get: () => o.x - world.x},
        shiftedY: {get: () => o.y - world.y}
      })
      o.moveHandler = function (e) {
        o._x = (e.pageX - e.target.offsetLeft)
        o._y = (e.pageY - e.target.offsetTop)
        e.preventDefault()
      }
      g.canvas.addEventListener("mousemove", o.moveHandler.bind(o), false)
      return o
    }

    g.wait = (d, c) => setTimeout(c, d)
    g.hitTestRectangle = (r1, r2, global = false) => {
      let hit, vx, vy
      if (global) {
        vx = (r1.gx + r1.halfWidth) - (r2.gx + r2.halfWidth)
        vy = (r1.gy + r1.halfHeight) - (r2.gy + r2.halfHeight)
      }
      else {
        vx = r1.centerX - r2.centerX
        vy = r1.centerY - r2.centerY
      }

      if (Math.abs(vx) < r1.halfWidth + r2.halfWidth) {
        if (Math.abs(vy) < r1.halfHeight + r2.halfHeight) {
          hit = true
        }
        else {
          hit = false
        }
      }
      else {
        hit = false
      }
      return hit
    }
    g.hitTestPoint = function (p, s) {
      if (p.x < s.gx || p.x > s.gx + s.width || p.y < s.gy || p.y > s.gy + s.height) return false
      return true
    }
    g.GlobalDistance = (a, b, aOffX = 0, aOffY = 0) => {return Math.sqrt( ( b.centerX - a.centerX + aOffX)**2 + ( b.centerY - a.centerY + aOffY)**2 )}
    
    g.soundEffect = function(frequencyValue, decay, type, volumeValue, pitchBendAmount, reverse, randomValue) {
      let actx = g.actx
      let oscillator, volume, compressor

      oscillator = actx.createOscillator()
      volume = actx.createGain()
      compressor = actx.createDynamicsCompressor()

      oscillator.connect(volume)
      volume.connect(compressor)
      compressor.connect(actx.destination)


      volume.gain.value = volumeValue;
      oscillator.type = type
      let frequency
      if (randomValue > 0) {
        frequency = randomNum(
          frequencyValue - randomValue / 2,
          frequencyValue + randomValue / 2, 1
        )
      } else frequency = frequencyValue
      oscillator.frequency.value = frequency

      fadeIn(volume)
      fadeOut(volume)
      if (pitchBendAmount > 0) pitchBend(oscillator)

      play(oscillator)
      oscillator.stop(actx.currentTime + 0.5);

      function fadeIn(volumeNode) {
        volumeNode.gain.value = 0;
        volumeNode.gain.linearRampToValueAtTime(
          0, actx.currentTime
        );
        volumeNode.gain.linearRampToValueAtTime(
          volumeValue, actx.currentTime + 0.05
        );
      }

      function fadeOut(volumeNode) {
        volumeNode.gain.linearRampToValueAtTime(volumeValue, actx.currentTime)
        volumeNode.gain.linearRampToValueAtTime(0, actx.currentTime + decay)
      }

      function pitchBend(oscillatorNode) {
        var frequency = oscillatorNode.frequency.value
        if (!reverse) {
          oscillatorNode.frequency.linearRampToValueAtTime(frequency, actx.currentTime)
          oscillatorNode.frequency.linearRampToValueAtTime(frequency - pitchBendAmount, actx.currentTime + decay)
        }

        else {
          oscillatorNode.frequency.linearRampToValueAtTime(frequency, actx.currentTime)
          oscillatorNode.frequency.linearRampToValueAtTime(frequency + pitchBendAmount, actx.currentTime + decay)
        }
      }

      function play(node) {
        node.start(actx.currentTime);
      }

    }
    return g
  }
}
