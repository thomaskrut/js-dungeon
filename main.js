const VIEWPORT_HEIGHT = 600;
const VIEWPORT_WIDTH = 800;
const ELEMENT_SIZE = 20;
const GRID_SIZE = 200;

let litAreaSize = 5;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const charMap = new Map();

charMap.set('wall', '\u25A7').set('player', '@');

const grid = initGrid();

generateMap(grid);

const player = getEmptyPoint(grid);

initKeyListener();

updateView(player, grid);

function playerCommand(command) {

    if (command.length <= 2) {
        let modX = 0;
        let modY = 0;
        if (command.includes('N')) modY = -1;
        if (command.includes('S')) modY = 1;
        if (command.includes('E')) modX = 1;
        if (command.includes('W')) modX = -1;

        if (grid[player.x + modX][player.y + modY].char == ' ') {
            player.x += modX;
            player.y += modY;
            updateView(player, grid);
        }

    }
}

function generateMap(grid) {

    createRoom(grid, { x: GRID_SIZE / 2, y: GRID_SIZE / 2 })

    const numberOfIterations = getRandom(2) + 5;

    for (let i = 0; i < numberOfIterations; i++) {
        createRoom(grid, getEmptyPoint(grid));
        createRoom(grid, getEmptyPoint(grid));
        createRoom(grid, getEmptyPoint(grid));
        createPassage(grid, getEmptyPoint(grid));
    }



}

function getRandomDirection() {
    switch (getRandom(4)) {
        case 0: return { modX: 1, modY: 0 }
        case 1: return { modX: -1, modY: 0 }
        case 2: return { modX: 0, modY: 1 }
        case 3: return { modX: 0, modY: -1 }
    }
}

function getEmptyPoint(grid) {
    while (true) {
        const randX = 1 + getRandom(GRID_SIZE - 2);
        const randY = 1 + getRandom(GRID_SIZE - 2);
        if (grid[randX][randY].char == ' ') return { x: randX, y: randY }
    }
}

function createPassage(grid, startingPoint) {
    let x = startingPoint.x;
    let y = startingPoint.y;
    let direction = getRandomDirection();

    while (x > 2 && x < GRID_SIZE - 2 && y > 2 && y < GRID_SIZE - 2 && getRandom(100) < 99) {
        while (getRandom(5) != 0) {
            grid[x][y] = {
                char: ' ',
                visited: false,
                lit: false
            }
            x = x + direction.modX;
            y = y + direction.modY;
            if (x < 2 || x > GRID_SIZE - 2 || y < 2 || y > GRID_SIZE - 2) break;
        }
        direction = getRandomDirection();
    }


}

function createRoom(grid, startingPoint) {

    const startX = startingPoint.x;
    const startY = startingPoint.y;
    const width = getRandom(15) + 5;
    const height = getRandom(15) + 5;

    if (startX + width > GRID_SIZE - 1 || startY + height > GRID_SIZE - 1) {
        createRoom(grid, getEmptyPoint(grid));
        return;
    }

    for (var x = startX; x < startX + width; x++) {
        for (var y = startY; y < startY + height; y++) {
            grid[x][y] = {
                char: ' ',
                visited: false,
                lit: false
            }
        }
    }

}

function initGrid() {
    let newGrid = [];
    for (var i = 0; i < GRID_SIZE; i++) {
        newGrid[i] = [];
        for (var j = 0; j < GRID_SIZE; j++)
            newGrid[i][j] = {
                char: charMap.get('wall'),
                visited: false,
                lit: false
            }
    }
    return newGrid;
}

function getGridSection(elementsWide, elementsHigh, centerObject, grid) {

    let startX = (centerObject.x > elementsWide / 2) ? centerObject.x - elementsWide / 2 : 0;
    let startY = (centerObject.y > elementsHigh / 2) ? centerObject.y - elementsHigh / 2 : 0;
    
    if (startX > GRID_SIZE - elementsWide) startX = GRID_SIZE - elementsWide;
    if (startY > GRID_SIZE - elementsHigh) startY = GRID_SIZE - elementsHigh;
    const playerX = centerObject.x - startX;
    const playerY = centerObject.y - startY;
    let gridSection = [];
    for (var x = 0; x < elementsWide; x++) {
        gridSection[x] = [];
        for (var y = 0; y < elementsHigh; y++) {
            gridSection[x][y] = grid[startX + x][startY + y];
            gridSection[x][y].lit = false;
        }
    }

    

    gridSection[playerX][playerY] = {
        char: charMap.get('player'),
        lit: true
    }

    createLitArea(gridSection, { x: playerX, y: playerY }, 1, 0, 1);
    createLitArea(gridSection, { x: playerX, y: playerY }, -1, 0, 1);
    createLitArea(gridSection, { x: playerX, y: playerY }, 0, 1, 1);
    createLitArea(gridSection, { x: playerX, y: playerY }, 0, -1, 1);
    createLitArea(gridSection, { x: playerX, y: playerY }, 1, 1, 1);
    createLitArea(gridSection, { x: playerX, y: playerY }, 1, -1, 1);
    createLitArea(gridSection, { x: playerX, y: playerY }, -1, 1, 1);
    createLitArea(gridSection, { x: playerX, y: playerY }, -1, -1, 1);

    return gridSection;
}

function updateView(player, grid) {
    drawGrid(getGridSection(VIEWPORT_WIDTH / ELEMENT_SIZE, VIEWPORT_HEIGHT / ELEMENT_SIZE, player, grid));

}

function createLitArea(gridSection, startingPoint, modX, modY, step) {
    let x = startingPoint.x + modX;
    let y = startingPoint.y + modY;
    if (gridSection[x][y].lit) return;
    if (step == litAreaSize) return;
    gridSection[x][y].lit = true;
    gridSection[x][y].visited = true;

    if (gridSection[x][y].char != charMap.get('wall')) {
    createLitArea(gridSection, { x: x, y: y }, 1, 0, step + 1);
    createLitArea(gridSection, { x: x, y: y }, -1, 0, step + 1);
    createLitArea(gridSection, { x: x, y: y }, 0, 1, step + 1);
    createLitArea(gridSection, { x: x, y: y }, 0, -1, step + 1);
    createLitArea(gridSection, { x: x, y: y }, 1, 1, step + 1);
    createLitArea(gridSection, { x: x, y: y }, 1, -1, step + 1);
    createLitArea(gridSection, { x: x, y: y }, -1, 1, step + 1);
    createLitArea(gridSection, { x: x, y: y }, -1, -1, step + 1);
    }

}

function drawGrid(grid) {
    ctx.fillStyle = "black";
    ctx.font = "22px monospace";
    ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    ctx.fillStyle = "white";

    for (var x = 0; x < VIEWPORT_WIDTH / ELEMENT_SIZE; x++) {
        for (var y = 0; y < VIEWPORT_HEIGHT / ELEMENT_SIZE; y++) {

            if (grid[x][y].lit) {
                ctx.fillStyle = 'silver';
                ctx.fillText(grid[x][y].char, x * ELEMENT_SIZE, y * ELEMENT_SIZE);
            }
            else if (grid[x][y].visited) {
                ctx.fillStyle = 'gray';
                ctx.fillText(grid[x][y].char, x * ELEMENT_SIZE, y * ELEMENT_SIZE);
            }
        }
    }
}

function checkOverlap(object1, object2) {
    return (object1.x == object2.x && object1.y == object2.y);
}


function initKeyListener() {

    window.addEventListener("keydown", event => {

        switch (event.key) {
            case "ArrowDown":
            case "2":
                playerCommand('S');
                break;
            case "ArrowUp":
            case "8":
                playerCommand('N');
                break;
            case "ArrowLeft":
            case "4":
                playerCommand('W');
                break;
            case "ArrowRight":
            case "6":
                playerCommand('E');
                break;
            case "7":
                playerCommand('NW');
                break;
            case "9":
                playerCommand('NE');
                break;
            case "1":
                playerCommand('SW');
                break;
            case "3":
                playerCommand('SE');
                break;
            default:
                console.log(event.key);
                return; // 
        }
        console.log(event.key);

        event.preventDefault();
    }, true);
}

function getRandom(max) {
    return Math.floor(Math.random() * max);
}





