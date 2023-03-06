export { getRandom, checkOverlap, getRandomDirection, getEmptyPoint };
import { globals as g } from "./globals.js";

function getEmptyPoint(grid, charMap) {
    while (true) {
        const randX = 1 + getRandom(g.GRID_SIZE - 2);
        const randY = 1 + getRandom(g.GRID_SIZE - 2);
        if (grid[randX][randY].char == charMap.get('floor')) return { x: randX, y: randY }
    }
}

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

function checkOverlap(object1, object2) {
    return (object1.x == object2.x && object1.y == object2.y);
}

function getRandomDirection(modX, modY) {
    if (modX == 0) {
        switch (getRandom(2)) {
            case 0: return { modX: 1, modY: 0 }
            case 1: return { modX: -1, modY: 0 }
        }
    } else if (modY == 0) {
        switch (getRandom(2)) {
            case 0: return { modX: 0, modY: 1 }
            case 1: return { modX: 0, modY: -1 }
        }
        console.log("error");
    }
}