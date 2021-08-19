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
    g.scale = 1
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
      var sprites = Array.prototype.slice.call(arguments)
      if (!(sprites[0] instanceof Array)) {
        if (sprites.length > 1) sprites.forEach(s => s.parent.removeChild(s))
        else sprites[0].parent.removeChild(sprites[0])
      }
      else {
        sprites[0].forEach(s => {
          sprite.parent.removeChild(s)
          spritesArray.splice(spritesArray.indexOf(s), 1)
        })
      }
    }
    function makeGeneralObject(w = 0, h = 0, x = 0, y = 0) {
        const o = {
            x: x,
            y: y,
            width: w,
            height: h,
            halfWidth: w / 2,
            halfHeight: h / 2,
            scaleX: 1,
            scaleY: 1,
            pivotX: 0.5,
            pivotY: 0.5,
            rotation: 0,
            visible: true,
            parent: undefined,
            stage: false,
            blendMode: undefined,
            alpha: 1,
            putCenter(b, xOff = 0, yOff = 0, a = this) {
                b.x = a.x + a.halfWidth - b.width + xOff
                b.y = a.y + a.halfHeight - b.halfHeight + yOff
            },
        }
        return o
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
        const z = makeGeneralObject(g.canvas.width, g.canvas.height, 0, 0)
        var o = Object.assign({}, z)
        moreProperties(o)
        o.stage = true
        o.parent = undefined
        return o
    }
    const addC = (c, o) => {
        if (c.parent)
            c.parent.removeChild(c)
        c.parent = o
        o.children.push(c)
    }
    const remC = (c, o) => c.parent == o ? o.children.splice(o.children.indexOf(c), 1) : 0
    g.group = function (spritesToGroup) {
        const z = makeGeneralObject()
        var o = Object.assign({}, z)
        moreProperties(o)
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
                o.children.forEach(function (c) {
                    if (c.x + c.width > o._newWidth) {
                        o._newWidth = c.x + c.width
                    }
                    if (c.y + c.height > o._newHeight) {
                        o._newHeight = c.y + c.height
                    }
                })
                o.width = o._newWidth
                o.height = o._newHeight
            }
        }
        g.stage.addChild(o)
        if (spritesToGroup) {
            var sprites = Array.prototype.slice.call(arguments)
            sprites.forEach(function (s) {
                o.addChild(s)
            })
        }
        return o
    }
    g.render = function (canvas, lagOffset) {
      let ctx = canvas.ctx
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // for (var i = 0; i < g.stage.children.length; i++) {
      //     var sprite = g.stage.children[i]
      //     displaySprite(sprite)
      // }
      g.stage.children.forEach(c => displaySprite(c))
      function displaySprite(s) {
          if (s.visible && s.gx < canvas.width + s.width && s.gx + s.width >= -s.width && s.gy < canvas.height + s.height && s.gy + s.height >= -s.height) {
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
              // if (s.shadow) {
              //     ctx.shadowColor = s.shadowColor
              //     ctx.shadowOffsetX = s.shadowOffsetX
              //     ctx.shadowOffsetY = s.shadowOffsetY
              //     ctx.shadowBlur = s.shadowBlur
              // }
              // if (s.blendMode)
              //     ctx.globalCompositeOperation = s.blendMode
              if (s.render) s.render(ctx)
              if (s.children && s.children.length > 0) {
                ctx.translate(-s.width * s.pivotX, -s.height * s.pivotY)
                s.children.forEach(c => displaySprite(c))
                // for (var j = 0; j < s.children.length; j++) {
                //     var child = s.children[j]
                //     displaySprite(child)
                // }
              }
              ctx.restore()
          }
      }
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
    g.gDistance = (a, b, aOffX = 0, aOffY = 0) => {
        // return Math.sqrt( ((b.gx + b.halfWidth) - (a.gx + a.halfWidth + aOffX)) ** 2 + ((b.gy + b.halfHeight) - (a.gy + a.halfHeight + aOffY)) ** 2 )
        return Math.sqrt(Math.pow(((b.centerX) - (a.centerX + aOffX)), 2) + Math.pow(((b.centerY) - (a.centerY + aOffY)), 2))
    }
    return g
  }
}
