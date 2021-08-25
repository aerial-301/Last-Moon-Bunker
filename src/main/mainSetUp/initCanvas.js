import { pointerDown, pointerUp } from '../../mouse.js'
let c
export const initCanvasEvents = () => {
  if (c) return
  c = document.getElementById('c')
  c.addEventListener('contextmenu', (e) => e.preventDefault())
  c.addEventListener('pointerdown', (e) => pointerDown(e))
  c.addEventListener('pointerup', (e) => pointerUp(e))
}