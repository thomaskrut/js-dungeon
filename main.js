const VIEWPORT_HEIGHT = 400;
const VIEWPORT_WIDTH = 600;
const ELEMENT_SIZE = 20;
const GRID_SIZE = 200;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const charMap = new Map();

charMap.set('wall', '\u25A7').set('player', '@');

const grid = initGrid();

generateMap(grid);

const player = getEmptyPoint(grid);

initKeyListener();

updateView(player, grid);

function generateMap(grid) {

    createRoom(grid, {x: GRID_SIZE / 2, y: GRID_SIZE / 2})
    
    const numberOfIterations = getRandom(5) + 5;

    for (let i = 0; i < numberOfIterations; i++) {
        createRoom(grid, getEmptyPoint(grid));
        createRoom(grid, getEmptyPoint(grid));
        createPassage(grid, getEmptyPoint(grid));
    }

    

}

function getRandomDirection() {
    switch (getRandom(4)) {
        case 0: return {dirX: 1, dirY: 0}
        case 1: return {dirX: -1, dirY: 0}
        case 2: return {dirX: 0, dirY: 1}
        case 3: return {dirX: 0, dirY: -1}   
    }
}

function getEmptyPoint(grid) {
    while(true) {
        const randX = getRandom(GRID_SIZE);
        const randY = getRandom(GRID_SIZE);
        if (grid[randX][randY].char == ' ') return {x: randX, y: randY}
    }
}

function createPassage(grid, startingPoint) {
    let x = startingPoint.x;
    let y = startingPoint.y;
    let direction = getRandomDirection();

    while(x > 2 && x < GRID_SIZE - 2 && y > 2 && y < GRID_SIZE - 2 && getRandom(100) < 99) {
        while(getRandom(5) != 0) {
            grid[x][y] = {
                char: ' ',
                visited: false
            }
            x = x + direction.dirX;
            y = y + direction.dirY;
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
        createRoom(grid);
        return;
    }

    for (var x = startX; x < startX + width; x++) {
        for (var y = startY; y < startY + height; y++) {
            grid[x][y] = {
                char: ' ',
                visited: false
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
            }
    }
    return newGrid;
}

function getGridSection(elementsWide, elementsHigh, centerObject, grid) {

    let startX = (centerObject.x > elementsWide / 2) ? centerObject.x - elementsWide / 2 : 0;
    let startY = (centerObject.y > elementsHigh / 2) ? centerObject.y - elementsHigh / 2 : 0;

    if (startX > GRID_SIZE - elementsWide) startX = GRID_SIZE - elementsWide;
    if (startY > GRID_SIZE - elementsHigh) startY = GRID_SIZE - elementsHigh;

    let gridSection = [];
    for (var x = 0; x < elementsWide; x++) {
        gridSection[x] = [];
        for (var y = 0; y < elementsHigh; y++)
            if (checkOverlap(centerObject, { x: x + startX, y: y + startY })) {
                gridSection[x][y] = {
                    char: charMap.get('player'),
                }
            } else {
                gridSection[x][y] = grid[startX + x][startY + y];
            }

    }
    return gridSection;
}

function updateView(player, grid) {
    drawGrid(getGridSection(VIEWPORT_WIDTH / ELEMENT_SIZE, VIEWPORT_HEIGHT / ELEMENT_SIZE, player, grid));
    //drawAgents(player);
}

function drawGrid(grid) {
    ctx.fillStyle = "black";
    ctx.font = "22px courier";
    ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    ctx.fillStyle = "white";

    for (var x = 0; x < VIEWPORT_WIDTH / ELEMENT_SIZE; x++) {
        for (var y = 0; y < VIEWPORT_HEIGHT / ELEMENT_SIZE; y++) {
            ctx.fillText(grid[x][y].char, x * ELEMENT_SIZE, y * ELEMENT_SIZE)
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
                player.y++;
                break;
            case "ArrowUp":
            case "8":
                player.y--;
                break;
            case "ArrowLeft":
            case "4":
                player.x--;
                break;
            case "ArrowRight":
            case "6":
                player.x++;
                break;
            case "7":
                player.x--;
                player.y--;
                break;
            case "9":
                player.x++;
                player.y--;
                break;
            case "1":
                player.x--;
                player.y++;
                break;
            case "3":
                player.x++;
                player.y++;
                break;
            default:
                console.log(event.key);
                return; // Quit when this doesn't handle the key event.
        }
        console.log(event.key);

        updateView(player, grid);

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }, true);
}

function getRandom(max) {
    return Math.floor(Math.random() * max);
}





