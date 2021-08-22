export var GA = {
  create(setup) {
    var g = {}
    g.canvas = document.getElementById('c')
    g.canvas.style.backgroundColor = "black"
    g.canvas.ctx = g.canvas.getContext("2d")
    g.stage = makeStage()
    g.pointer = makePointer()
    g.state = undefined
    g.setup = setup
    g.paused = false
    g._fps = 60
    g._startTime = Date.now()
    g._frameDuration = 1000 / g._fps
    g._lag = 0
    g.interpolate = true

    let scaleToFit = Math.min(window.innerWidth / g.canvas.width, window.innerHeight / g.canvas.height)
    // g.canvas.style.transformOrigin = "0 0";
    // g.canvas.style.transform = "scale(" + scaleToFit + ")";
    // g.scale = scaleToFit
    g.scale = 1

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
      if (g._fps === undefined) {
        update()
        g.render(g.canvas, 0)
      }
      else {
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
    g.remove = function (s) {
      let sprites = Array.prototype.slice.call(arguments)
      if (!(sprites[0] instanceof Array)) {
        if (sprites.length > 1) sprites.forEach(s => s.parent.removeChild(s))
        else sprites[0].parent.removeChild(sprites[0])
      }
      else {
        let p = sprites[0]
        p.forEach(s => {
          s.parent.removeChild(s)
          p.splice(p.indexOf(s), 1)
        })
      }
    }
    function makeBasicObject(o, x = 0, y = 0, w = 50, h = 50) {
      o.x= x
      o.y= y
      o.width= w
      o.height= h
      o.halfWidth= w / 2
      o.halfHeight= h / 2
      o.scaleX= 1
      o.scaleY= 1
      o.pivotX= 0.5
      o.pivotY= 0.5
      o.rotation= 0
      o.alpha= 1
      o.stage= false
      o.visible= true
      o.children = []
      o.parent= undefined
      o.blendMode= undefined
      o.addChild = (c) => {
        if (c.parent) c.parent.removeChild(c)
        c.parent = o
        o.children.push(c)
      }
      o.removeChild = (c) => { if (c.parent === o) o.children.splice(o.children.indexOf(c), 1) }
      Object.defineProperties(o, {
        gx: { get: () => { return (o.x + (o.parent? o.parent.gx : 0) ) } },
        gy: { get: () => { return (o.y + (o.parent? o.parent.gy : 0) ) } },
        centerX: { get: () => { return o.gx + o.halfWidth } },
        centerY: { get: () => { return o.gy + o.halfHeight } },
        bottom: { get: () => { return o.y + o.parent.gy} }
      })
    }
    function moreProperties(o) {
      o.yOffset = 0
      Object.defineProperties(o, {
          gx: { get: () => { return o.parent ? o.x + o.parent.gx : o.x } },
          gy: { get: () => { return o.parent ? o.y + o.parent.gy : o.y } },
          centerX: { get: () => { return o.x + o.halfWidth } },
          centerY: { get: () => { return o.y + o.halfHeight } },
          Y: { get: () => { return o.y + o.parent.gy + o.yOffset } }
      })
      o.children = []
      o.addChild = (c) => {
          addC(c, o)
      }
      o.removeChild = (c) => remC(c, o)
    }
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
        let hit = false, combinedHalfWidths, combinedHalfHeights, vx, vy
        if (global) {
            vx = (r1.gx + r1.halfWidth) - (r2.gx + r2.halfWidth)
            vy = (r1.gy + r1.halfHeight) - (r2.gy + r2.halfHeight)
        }
        else {
            vx = r1.centerX - r2.centerX
            vy = r1.centerY - r2.centerY
        }
        combinedHalfWidths = r1.halfWidth + r2.halfWidth
        combinedHalfHeights = r1.halfHeight + r2.halfHeight
        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {
            //A collision might be occuring. Check for a collision on the y axis
            if (Math.abs(vy) < combinedHalfHeights) {
                //There's definitely a collision happening
                hit = true
            }
            else {
                //There's no collision on the y axis
                hit = false
            }
        }
        else {
            //There's no collision on the x axis
            hit = false
        }
        //`hit` will be either `true` or `false`
        return hit
    }
    g.hitTestPoint = function (point, sprite) {
        var shape, left, right, top, bottom, vx, vy, magnitude, hit
        if (sprite.radius) {
            shape = "circle"
        }
        else {
            shape = "rectangle"
        }
        //Rectangle
        if (shape === "rectangle") {
            //Get the position of the sprite's edges
            left = sprite.gx
            right = sprite.gx + sprite.width
            top = sprite.gy
            bottom = sprite.gy + sprite.height
            //Find out if the point is intersecting the rectangle
            hit = point.x > left && point.x < right && point.y > top && point.y < bottom
        }
        //Circle
        if (shape === "circle") {
            //Find the distance between the point and the
            //center of the circle
            vx = point.x - sprite.centerX,
                vy = point.y - sprite.centerY,
                magnitude = Math.sqrt(vx * vx + vy * vy)
            //The point is intersecting the circle if the magnitude
            //(distance) is less than the circle's radius
            hit = magnitude < sprite.radius
        }
        //`hit` will be either `true` or `false`
        return hit
    }
    g.GlobalDistance = (a, b, aOffX = 0, aOffY = 0) => {return Math.sqrt(Math.pow(((b.centerX) - (a.centerX + aOffX)), 2) + Math.pow(((b.centerY) - (a.centerY + aOffY)), 2))}
    return g
  }
}
