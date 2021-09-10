import { g } from '../../main.js'
import { pointerDown, pointerUp } from '../../mouse.js'
let c
export const initCanvasEvents = () => {
  if (c) return
  c = document.getElementById('c')
  c.addEventListener('contextmenu', (e) => e.preventDefault())
  c.addEventListener('pointerdown', (e) => pointerDown(e))
  c.addEventListener('pointerup', (e) => pointerUp(e))
}




window.onresize = resizeWindow


function resizeWindow() {
  let scaleToFit = Math.min(window.innerWidth / g.canvas.width,( window.innerHeight) / g.canvas.height)
  g.canvas.style.transformOrigin = "0 0";
  g.canvas.style.transform = "scale(" + scaleToFit + ")";
  g.scale = scaleToFit
}