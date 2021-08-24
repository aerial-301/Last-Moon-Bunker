import { world } from "./main.js"

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

    let scaleToFit = Math.min(window.innerWidth / g.canvas.width,( window.innerHeight - 300) / g.canvas.height)
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
        shiftedX: {get: () => o._x - world.x},
        shiftedY: {get: () => o._y - world.y}
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
    g.hitTestPoint = function (p, s) {
      if (p.x < s.gx || p.x > s.gx + s.width || p.y < s.gy || p.y > s.gy + s.height) return false
      return true
    }
    g.GlobalDistance = (a, b, aOffX = 0, aOffY = 0) => {return Math.sqrt(Math.pow(((b.centerX) - (a.centerX + aOffX)), 2) + Math.pow(((b.centerY) - (a.centerY + aOffY)), 2))}



    g.actx = new AudioContext()

    g.soundEffect = function(
      frequencyValue,      //The sound's fequency pitch in Hertz
      attack,              //The time, in seconds, to fade the sound in
      decay,               //The time, in seconds, to fade the sound out
      type,                //waveform type: "sine", "triangle", "square", "sawtooth"
      volumeValue,         //The sound's maximum volume
      panValue,            //The speaker pan. left: -1, middle: 0, right: 1
      wait,                //The time, in seconds, to wait before playing the sound
      pitchBendAmount,     //The number of Hz in which to bend the sound's pitch down
      reverse,             //If `reverse` is true the pitch will bend up
      randomValue,         //A range, in Hz, within which to randomize the pitch
      dissonance,          //A value in Hz. It creates 2 dissonant frequencies above and below the target pitch
      echo,                //An array: [delayTimeInSeconds, feedbackTimeInSeconds, filterValueInHz]
      reverb               //An array: [durationInSeconds, decayRateInSeconds, reverse]
    ) {
    
      //Set the default values
      if (frequencyValue === undefined) frequencyValue = 200;
      if (attack === undefined) attack = 0;
      if (decay === undefined) decay = 1;
      if (type === undefined) type = "sine";
      if (volumeValue === undefined) volumeValue = 1;
      if (panValue === undefined) panValue = 0;
      if (wait === undefined) wait = 0;
      if (pitchBendAmount === undefined) pitchBendAmount = 0;
      if (reverse === undefined) reverse = false;
      if (randomValue === undefined) randomValue = 0;
      if (dissonance === undefined) dissonance = 0;
      if (echo === undefined) echo = undefined;
      if (reverb === undefined) reverb = undefined;
    
      //The audio context
      var actx = g.actx;
    
      //Create an oscillator, gain and pan nodes, and connect them
      //together to the destination
      var oscillator, volume, pan;
      oscillator = actx.createOscillator();
      volume = actx.createGain();
      if (!actx.createStereoPanner) {
        pan = actx.createPanner();
      } else {
        pan = actx.createStereoPanner();
      }
      oscillator.connect(volume);
      volume.connect(pan);
      pan.connect(actx.destination);
    
      //Set the supplied values
      volume.gain.value = volumeValue;
      if (!actx.createStereoPanner) {
        pan.setPosition(panValue, 0, 1 - Math.abs(panValue));
      } else {
        pan.pan.value = panValue; 
      }
      oscillator.type = type;
    
      //Optionally randomize the pitch. If the `randomValue` is greater
      //than zero, a random pitch is selected that's within the range
      //specified by `frequencyValue`. The random pitch will be either
      //above or below the target frequency.
      var frequency;
      var randomInt = function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min
      };
      if (randomValue > 0) {
        frequency = randomInt(
          frequencyValue - randomValue / 2,
          frequencyValue + randomValue / 2
        );
      } else {
        frequency = frequencyValue;
      }
      oscillator.frequency.value = frequency;
    
      //Apply effects
      if (attack > 0) fadeIn(volume);
      fadeOut(volume);
      if (pitchBendAmount > 0) pitchBend(oscillator);
      if (echo) addEcho(volume);
      if (reverb) addReverb(volume);
      if (dissonance > 0) addDissonance();
    
      //Play the sound
      play(oscillator);
    
    
      function play(node) {
        node.start(actx.currentTime + wait);
      }

      function addReverb(volumeNode) {
        var convolver = actx.createConvolver();
        convolver.buffer = impulseResponse(reverb[0], reverb[1], reverb[2], actx);
        volumeNode.connect(convolver);
        convolver.connect(pan);
      }
  
      function addEcho(volumeNode) {
  
        //Create the nodes
        var feedback = actx.createGain(),
            delay = actx.createDelay(),
            filter = actx.createBiquadFilter();
  
        //Set their values (delay time, feedback time and filter frequency)
        delay.delayTime.value = echo[0];
        feedback.gain.value = echo[1];
        if (echo[2]) filter.frequency.value = echo[2];
  
        //Create the delay feedback loop, with
        //optional filtering
        delay.connect(feedback);
        if (echo[2]) {
          feedback.connect(filter);
          filter.connect(delay);
        } else {
          feedback.connect(delay);
        }
  
        //Connect the delay loop to the oscillator's volume
        //node, and then to the destination
        volumeNode.connect(delay);
  
        //Connect the delay loop to the main sound chain's
        //pan node, so that the echo effect is directed to
        //the correct speaker
        delay.connect(pan);
      }
  
      //The `fadeIn` function
      function fadeIn(volumeNode) {
  
        //Set the volume to 0 so that you can fade
        //in from silence
        volumeNode.gain.value = 0;
  
        volumeNode.gain.linearRampToValueAtTime(
          0, actx.currentTime + wait
        );
        volumeNode.gain.linearRampToValueAtTime(
          volumeValue, actx.currentTime + wait + attack
        );
      }
  
      //The `fadeOut` function
      function fadeOut(volumeNode) {
        volumeNode.gain.linearRampToValueAtTime(
          volumeValue, actx.currentTime + attack + wait
        );
        volumeNode.gain.linearRampToValueAtTime(
          0, actx.currentTime + wait + attack + decay
        );
      }
  
      //The `pitchBend` function
      function pitchBend(oscillatorNode) {
  
        //If `reverse` is true, make the note drop in frequency. Useful for
        //shooting sounds
  
        //Get the frequency of the current oscillator
        var frequency = oscillatorNode.frequency.value;
  
        //If `reverse` is true, make the sound drop in pitch
        if (!reverse) {
          oscillatorNode.frequency.linearRampToValueAtTime(
            frequency, 
            actx.currentTime + wait
          );
          oscillatorNode.frequency.linearRampToValueAtTime(
            frequency - pitchBendAmount, 
            actx.currentTime + wait + attack + decay
          );
        }
  
        //If `reverse` is false, make the note rise in pitch. Useful for
        //jumping sounds
        else {
          oscillatorNode.frequency.linearRampToValueAtTime(
            frequency, 
            actx.currentTime + wait
          );
          oscillatorNode.frequency.linearRampToValueAtTime(
            frequency + pitchBendAmount, 
            actx.currentTime + wait + attack + decay
          );
        }
      }
  
      //The `addDissonance` function
      function addDissonance() {
  
        //Create two more oscillators and gain nodes
        var d1 = actx.createOscillator(),
            d2 = actx.createOscillator(),
            d1Volume = actx.createGain(),
            d2Volume = actx.createGain();
  
        //Set the volume to the `volumeValue`
        d1Volume.gain.value = volumeValue;
        d2Volume.gain.value = volumeValue;
  
        //Connect the oscillators to the gain and destination nodes
        d1.connect(d1Volume);
        d1Volume.connect(actx.destination);
        d2.connect(d2Volume);
        d2Volume.connect(actx.destination);
  
        //Set the waveform to "sawtooth" for a harsh effect
        d1.type = "sawtooth";
        d2.type = "sawtooth";
  
        //Make the two oscillators play at frequencies above and
        //below the main sound's frequency. Use whatever value was
        //supplied by the `dissonance` argument
        d1.frequency.value = frequency + dissonance;
        d2.frequency.value = frequency - dissonance;
  
        //Fade in/out, pitch bend and play the oscillators
        //to match the main sound
        if (attack > 0) {
          fadeIn(d1Volume);
          fadeIn(d2Volume);
        }
        if (decay > 0) {
          fadeOut(d1Volume);
          fadeOut(d2Volume);
        }
        if (pitchBendAmount > 0) {
          pitchBend(d1);
          pitchBend(d2);
        }
        if (echo) {
          addEcho(d1Volume);
          addEcho(d2Volume);
        }
        if (reverb) {
          addReverb(d1Volume);
          addReverb(d2Volume);
        }
        play(d1);
        play(d2);
      }


      function impulseResponse(duration, decay, reverse, actx) {

        //The length of the buffer.
        var length = actx.sampleRate * duration;
    
        //Create an audio buffer (an empty sound container) to store the reverb effect.
        var impulse = actx.createBuffer(2, length, actx.sampleRate);
    
        //Use `getChannelData` to initialize empty arrays to store sound data for
        //the left and right channels.
        var left = impulse.getChannelData(0),
            right = impulse.getChannelData(1);
    
        //Loop through each sample-frame and fill the channel
        //data with random noise.
        for (var i = 0; i < length; i++){
    
          //Apply the reverse effect, if `reverse` is `true`.
          var n;
          if (reverse) {
            n = length - i;
          } else {
            n = i;
          }
    
          //Fill the left and right channels with random white noise which
          //decays exponentially.
          left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
          right[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        }
    
        //Return the `impulse`.
        return impulse;
      };
    
    }




    return g
  }
}
