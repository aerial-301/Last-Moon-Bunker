import { makeRectangle } from './drawings.js';
import { getUnitVector } from './functions.js';
import { g, shots, objLayer, maze } from './main.js';
import { makeMovableObject, moreProperties } from './unitObject.js';
const makeShot = (x, y) => {
    const m = makeMovableObject(20, 20);
    const o = Object.assign(Object.assign({}, m), { obstacles: [...maze.borders], render(c) {
            c.strokeStyle = 'black';
            c.lineWidth = 1;
            c.fillStyle = 'yellow';
            c.beginPath();
            c.rect(-this.width * o.pivotX, -this.height * o.pivotY, this.width, this.height);
            c.fill();
            c.stroke();
        } });
    moreProperties(o);
    o.speed = 7;
    o.x = x;
    o.y = y;
    objLayer.addChild(o);
    return o;
};
const makeEnemy = (x, y) => {
    const health = 100;
    const baseHealth = 100;
    const yellowHB = makeRectangle((health / baseHealth) * 100, 5, 'Yellow');
    const HB = makeRectangle((health / baseHealth) * 100, 5, 'green');
    const head = makeRectangle(20, 20, '#123');
    const m = makeMovableObject(20, 20);
    const o = Object.assign(Object.assign({}, m), { head: head, obstacles: [], health: health, baseHealth: baseHealth, isAlerted: false, OnCoolDown: false, isDamaged: false, isStunned: false, isDead: false, readyToMove: true, target: null, damagedAmount: 0, speed: 3, steps: 200, 
        // verticalMovement: 1,
        isCollided: false, range: 300, yellowHB: yellowHB, HB: HB, shoot(target) {
            if (this.isStunned)
                return;
            const shot = makeShot(this.x, this.y);
            const uv = getUnitVector(shot, target);
            shot.vx = uv.x;
            shot.vy = uv.y;
            shots.push(shot);
            this.OnCoolDown = true;
            g.wait(700, () => {
                this.OnCoolDown = false;
            });
        },
        getHit(damage) {
            this.head.fillStyle = '#F55';
            this.health -= damage;
            this.damagedAmount += damage;
            this.HB.width = (this.health / this.baseHealth) * 100;
            this.isStunned = true;
            g.wait(70, () => {
                this.head.fillStyle = '#123';
                this.isStunned = false;
            });
            if (this.health <= 0) {
                this.alpha = 0.0;
                this.damagedAmount = 0;
                g.remove(this);
                return 'dead';
            }
            if (!this.isDamaged) {
                this.decreaseHB();
                this.isDamaged = true;
            }
            return 'notDead';
        },
        decreaseHB() {
            if (this.damagedAmount > 0) {
                g.wait(1, () => {
                    this.yellowHB.width -= (1 / this.baseHealth) * 100;
                    this.damagedAmount -= 1;
                    this.decreaseHB();
                });
            }
            else {
                this.isDamaged = false;
            }
        } });
    moreProperties(o);
    o.addChild(head);
    o.addChild(yellowHB);
    yellowHB.x = o.x + o.halfWidth - yellowHB.halfWidth;
    yellowHB.y = o.y - 20;
    o.addChild(HB);
    HB.x = o.x + o.halfWidth - HB.halfWidth;
    HB.y = o.y - 20;
    o.x = x;
    o.y = y;
    return o;
};
