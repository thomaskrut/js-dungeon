const VIEWPORT_HEIGHT = 600;
const VIEWPORT_WIDTH = 800;
const ELEMENT_SIZE = 20;
const GRID_SIZE = 100;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const charMap = new Map();

charMap.set('wall', '\u25A7').set('player', '@');

const player = {
    x: 1,
    y: 1
};

var grid = initGrid();

generateMap(grid);

initKeyListener();

updateView(player, getGridSection(VIEWPORT_WIDTH / ELEMENT_SIZE, VIEWPORT_HEIGHT / ELEMENT_SIZE, player, grid));

function generateMap(grid) {
    createRoom(grid);
    createRoom(grid);
    createRoom(grid);
    createRoom(grid);
    createRoom(grid);
    createRoom(grid);

    createRoom(grid);
}

function createRoom(grid) {

    const startX = 2 + getRandom(GRID_SIZE)
    const startY = 2 + getRandom(GRID_SIZE);
    const width = getRandom(15) + 5;
    const height = getRandom(15) + 5;

    if (startX + width > GRID_SIZE - 1 || startY + height > GRID_SIZE - 1) {
        createRoom(grid);
        return;
    }

    for (var x = startX; x < startX + width; x++) {
        for (var y = startY; y < startY + height; y++) {
            //  if (grid[x][y].char == ' ')
            grid[x][y] = {
                char: ' ',
                x: x,
                y: y
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
                x: i,
                y: j,
                visited: false,
            }
    }
    return newGrid;
}

function getGridSection(elementsWide, elementsHigh, centerObject, grid) {

    let startX = (centerObject.x > elementsWide / 2) ? centerObject.x - elementsWide / 2 : 0;
    let startY = (centerObject.y > elementsHigh / 2) ? centerObject.y - elementsHigh / 2 : 0;
    let gridSection = [];
    for (var x = 0; x < elementsWide; x++) {
        gridSection[x] = [];
        for (var y = 0; y < elementsHigh; y++)
            gridSection[x][y] = grid[startX + x][startY + y];
    }
    return gridSection;
}

function updateView(player, grid) {
    drawGrid(getGridSection(VIEWPORT_WIDTH / ELEMENT_SIZE, VIEWPORT_HEIGHT / ELEMENT_SIZE, player, grid));
    drawAgents(player);
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

function drawAgents(player) {
    let playerX = (player.x > VIEWPORT_WIDTH / ELEMENT_SIZE / 2) ? VIEWPORT_WIDTH / ELEMENT_SIZE / 2 : player.x;
    let playerY = (player.y > VIEWPORT_HEIGHT / ELEMENT_SIZE / 2) ? VIEWPORT_HEIGHT / ELEMENT_SIZE / 2 : player.y;
    ctx.fillText(charMap.get('player'), playerX * ELEMENT_SIZE, playerY * ELEMENT_SIZE);
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





