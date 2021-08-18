import { g, world, objLayer, surfaceWidth, surfaceHeight, switchMode, MK, enemies, currentPlayer } from './main.js';
import { checkCollisions, randomNum } from './functions.js';
import { makeEnemy } from './unitObject.js';
let paused = false;
let pointerOffsetX;
let pointerOffsetY;
const keys = {
    'w': false,
    's': false,
    'a': false,
    'd': false,
    'c': false,
    't': false,
    'y': false,
    'r': false
};
const resetPointerOffsets = () => {
    pointerOffsetX = 0;
    pointerOffsetY = 0;
};
window.addEventListener('keydown', (k) => {
    if (k.key in keys) {
        keys[k.key] = true;
        if (MK)
            currentPlayer.isMoving = true;
    }
    // else if (k.key === 'r') player.getHit(20)
});
window.addEventListener('keyup', (k) => {
    if (k.key in keys) {
        keys[k.key] = false;
        if (MK) {
            if (Object.values(keys).every(v => v === false)) {
                currentPlayer.isMoving = false;
            }
        }
        if (k.key === 'r')
            switchMode();
    }
});
const setPointerOffsets = () => {
    pointerOffsetX = -world.x;
    pointerOffsetY = -world.y;
};
const moveCamera = () => {
    if (keys.w) {
        if (world.y >= 300)
            return;
        world.y += 10;
        pointerOffsetY -= 10;
    }
    if (keys.s) {
        if (world.y <= g.stage.height - surfaceHeight)
            return;
        world.y -= 10;
        pointerOffsetY += 10;
    }
    if (keys.a) {
        if (world.x >= 0)
            return;
        world.x += 10;
        pointerOffsetX -= 10;
    }
    if (keys.d) {
        if (world.x <= g.stage.width - surfaceWidth)
            return;
        world.x -= 10;
        pointerOffsetX += 10;
    }
    if (keys.y) {
        addUnit();
    }
    else if (keys.t) {
        removeUnit();
    }
    // if (keys.r) {
    //   objLayer.children.sort((a, b) =>  (a.y + a.height) - (b.y + b.height))
    // }
};
const movePlayer = () => {
    if (keys.w) {
        currentPlayer.y -= currentPlayer.speed;
        checkCollisions('bot');
        currentPlayer.scan();
        objLayer.children.sort((a, b) => (a.Y + a.height) - (b.Y + b.height));
    }
    if (keys.s) {
        currentPlayer.y += currentPlayer.speed;
        checkCollisions('top');
        currentPlayer.scan();
        objLayer.children.sort((a, b) => (a.Y + a.height) - (b.Y + b.height));
    }
    if (keys.a) {
        currentPlayer.x -= currentPlayer.speed;
        checkCollisions('right');
        currentPlayer.scan();
    }
    if (keys.d) {
        currentPlayer.x += currentPlayer.speed;
        checkCollisions('left');
        currentPlayer.scan();
    }
};
let added = false;
let removed = false;
const addUnit = () => {
    if (added)
        return;
    added = true;
    const u = makeEnemy(300 + randomNum(-100, 100), 500 + randomNum(-100, 100));
    objLayer.addChild(u);
    enemies.push(u);
    // sortUnits(aggPoint.x, aggPoint.y)
    // instantSort(units, aggPoint.x, aggPoint.y)
    g.wait(50, () => { added = false; });
};
const removeUnit = () => {
    if (enemies.length == 0)
        return;
    if (removed)
        return;
    removed = true;
    g.remove(enemies.pop());
    // sortUnits(aggPoint.x, aggPoint.y)
    // instantSort(units, aggPoint.x, aggPoint.y)
    g.wait(30, () => { removed = false; });
};
export { keys, pointerOffsetX, pointerOffsetY, moveCamera, movePlayer, resetPointerOffsets, setPointerOffsets };
