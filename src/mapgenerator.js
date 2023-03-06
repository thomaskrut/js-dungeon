export { generateMap, getEmptyPoint, initGrid };

import { globals as g } from "./globals.js";
import { getRandom, getEmptyPoint, getRandomDirection } from "./util.js";

function generateMap(grid, charMap) {

    createRoom(grid, charMap, { x: g.GRID_SIZE / 2, y: g.GRID_SIZE / 2 })

    const numberOfIterations = 4;

    for (let i = 0; i < numberOfIterations; i++) {
        createRoom(grid, charMap, getEmptyPoint(grid, charMap));
        createRoom(grid, charMap, createPassage(grid, charMap, getEmptyPoint(grid, charMap)));
    }
}

function createPassage(grid, charMap, startingPoint) {
    let x = startingPoint.x;
    let y = startingPoint.y;
    let direction = getRandomDirection(1, 0);
    console.log(direction);
    while (x > 2 && x < g.GRID_SIZE - 2 && y > 2 && y < g.GRID_SIZE - 2 && getRandom(100) < 99) {
        while (getRandom(5) != 0) {
            grid[x][y] = {
                char: charMap.get('floor'),
                visited: false,
                lit: false
            }
            x = x + direction.modX;
            y = y + direction.modY;
            if (x < 2 || x > g.GRID_SIZE - 2 || y < 2 || y > g.GRID_SIZE - 2) break;
        }
        direction = getRandomDirection(direction.modX, direction.modY);
    }
    return { x: x, y: y };

}

function createRoom(grid, charMap, startingPoint) {

    const startX = startingPoint.x;
    const startY = startingPoint.y;
    const width = getRandom(10) + 5;
    const height = getRandom(10) + 5;

    if (startX + width > g.GRID_SIZE - 1 || startY + height > g.GRID_SIZE - 1) {
        createRoom(grid, charMap, getEmptyPoint(grid, charMap));
        return;
    }

    for (var x = startX; x < startX + width; x++) {
        for (var y = startY; y < startY + height; y++) {
            grid[x][y] = {
                char: charMap.get('floor'),
                visited: false,
                lit: false,
            }
        }
    }

}

function initGrid(charMap) {
    let newGrid = [];
    for (var i = 0; i < g.GRID_SIZE; i++) {
        newGrid[i] = [];
        for (var j = 0; j < g.GRID_SIZE; j++)
            newGrid[i][j] = {
                char: charMap.get('wall'),
                visited: false,
                lit: false
            }
    }
    return newGrid;
}