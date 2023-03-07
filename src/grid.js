export { createGridSection };

import { globals as g } from "./globals.js";
import { checkOverlap } from "./util.js";

let litAreaSize = 5;

function createGridSection(elementsWide, elementsHigh, player, grid, charMap, items) {

    let startX = (player.x > elementsWide / 2) ? player.x - elementsWide / 2 : 0;
    let startY = (player.y > elementsHigh / 2) ? player.y - elementsHigh / 2 : 0;

    if (startX > g.GRID_SIZE - elementsWide) startX = g.GRID_SIZE - elementsWide;
    if (startY > g.GRID_SIZE - elementsHigh) startY = g.GRID_SIZE - elementsHigh;

    const playerX = player.x - startX;
    const playerY = player.y - startY;

    let gridSection = [];

    for (var x = 0; x < elementsWide; x++) {
        gridSection[x] = [];
        for (var y = 0; y < elementsHigh; y++) {
            gridSection[x][y] = grid[startX + x][startY + y];
            gridSection[x][y].lit = false;
            items.forEach(i => {
                if (checkOverlap(i, { x: startX + x, y: startY + y })) gridSection[x][y].char = i.char;
            });


        }
    }

    gridSection[playerX][playerY] = {
        char: charMap.get('player'),
        lit: true
    }

    createLitArea(gridSection, { x: playerX, y: playerY }, 1, 0, 1, charMap);
    createLitArea(gridSection, { x: playerX, y: playerY }, -1, 0, 1, charMap);
    createLitArea(gridSection, { x: playerX, y: playerY }, 0, 1, 1, charMap);
    createLitArea(gridSection, { x: playerX, y: playerY }, 0, -1, 1, charMap);
    createLitArea(gridSection, { x: playerX, y: playerY }, 1, 1, 1, charMap);
    createLitArea(gridSection, { x: playerX, y: playerY }, 1, -1, 1, charMap);
    createLitArea(gridSection, { x: playerX, y: playerY }, -1, 1, 1, charMap);
    createLitArea(gridSection, { x: playerX, y: playerY }, -1, -1, 1, charMap);

    return gridSection;
}

function createLitArea(gridSection, startingPoint, modX, modY, step, charMap) {
    let x = startingPoint.x + modX;
    let y = startingPoint.y + modY;
    if (gridSection[x][y].lit) return;
    if (step == litAreaSize) return;
    gridSection[x][y].lit = true;
    gridSection[x][y].visited = true;

    if (gridSection[x][y].char != charMap.get('wall')) {
        createLitArea(gridSection, { x: x, y: y }, 1, 0, step + 1, charMap);
        createLitArea(gridSection, { x: x, y: y }, -1, 0, step + 1, charMap);
        createLitArea(gridSection, { x: x, y: y }, 0, 1, step + 1, charMap);
        createLitArea(gridSection, { x: x, y: y }, 0, -1, step + 1, charMap);
        createLitArea(gridSection, { x: x, y: y }, 1, 1, step + 1, charMap);
        createLitArea(gridSection, { x: x, y: y }, 1, -1, step + 1, charMap);
        createLitArea(gridSection, { x: x, y: y }, -1, 1, step + 1, charMap);
        createLitArea(gridSection, { x: x, y: y }, -1, -1, step + 1, charMap);
    }

}
