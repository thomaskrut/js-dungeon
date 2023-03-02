const HEIGHT = 600;
const WIDTH = 800;
const ELEMENT_SIZE = 20;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const charMap = new Map();

charMap.set('wall', '\u25A7').set('player', '@');

const player = {
    x: 20,
    y: 20
};

var grid = fillGrid();

generateMap(grid);

initKeyListener();

updateView();

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

    const startX = 2 + getRandom(WIDTH / ELEMENT_SIZE)
    const startY = 2 + getRandom(HEIGHT / ELEMENT_SIZE);
    const width = getRandom(15) + 5;
    const height = getRandom(15) + 5;

    if (startX + width > (WIDTH / ELEMENT_SIZE) - 1 || startY + height > (HEIGHT / ELEMENT_SIZE) - 1) {
        createRoom(grid);
        return;
    }

    for(var x = startX; x < startX + width; x++) {
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

function fillGrid() {
    let newGrid = [];
    for (var i = 0; i < WIDTH / ELEMENT_SIZE; i++) {
        newGrid[i] = [];
        for (var j = 0; j < HEIGHT / ELEMENT_SIZE; j++)
            newGrid[i][j] = {
                char: charMap.get('wall'),
                x: i,
                y: j,
                visited: false,
            }
    }
    return newGrid;
}

function updateView() {
    ctx.fillStyle = "black";
    ctx.font = "22px courier";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "white";

    grid.forEach((row) => {

        row.forEach(element => {
            ctx.fillText(element.char, element.x * ELEMENT_SIZE, element.y * ELEMENT_SIZE)
        })


    });

    ctx.fillText(charMap.get('player'), player.x * ELEMENT_SIZE, player.y * ELEMENT_SIZE);
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

        updateView();

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }, true);
}

function getRandom(max) {
    return Math.floor(Math.random() * max);
}





