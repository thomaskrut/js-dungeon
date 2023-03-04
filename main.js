const VIEWPORT_HEIGHT = 480;
const MESSAGES_HEIGHT = 100;
const VIEWPORT_WIDTH = 800;
const ELEMENT_SIZE = 20;
const GRID_SIZE = 200;

let litAreaSize = 5;

const mapViewContext = document.getElementById('mapView').getContext("2d");
const messagesContext = document.getElementById('messages').getContext("2d");

const charMap = new Map();

charMap.set('wall', '\u25A7').set('player', '@').set('coin', '$')

const grid = initGrid();

generateMap(grid);

const items = [
    {
        name: "Gold",
        char: "$",
        prob: 80,
        value: 0,
        maxValue: 500,
        minValue: 5,
        pickupAction: "addGold",
        pickupParameter: "value",
    },
    {
        name: "Apple",
        char: "0",
        prob: 50
    }
];

const player = {
    x: 0,
    y: 0,
    gold: 0,

    setPosition: function(pos) {
        this.x = pos.x;
        this.y = pos.y;
    },

    addGold: function(amount) {
        this.gold += amount;
        console.log(amount);
    }

}

const mapItems = generateItemsArray();

const messages = {

    newMessages: [],
    messageColour: ["white", "silver", "gray", "dimgray"],
    recentMessages: [],

    addMessage: function (message) {
        this.newMessages.unshift(message);
        this.updateRecent();
    },

    updateRecent: function () {
        if (this.newMessages.length > 0) {
            if (messages.recentMessages.length > 3) messages.recentMessages.pop();
            this.recentMessages.unshift(this.newMessages.pop())
        }
    }


};

initKeyListener();

player.setPosition(getEmptyPoint(grid));

updateMapView(player, grid);

messages.addMessage("Welcome!");
messages.updateRecent();
drawMessages(messages);

function drawMessages(messages) {

    messagesContext.fillStyle = "black";
    messagesContext.font = "16px courier new";
    messagesContext.fillRect(0, 0, VIEWPORT_WIDTH, MESSAGES_HEIGHT);

    messages.recentMessages.forEach((m, i) => {
        messagesContext.fillStyle = messages.messageColour[i];
        messagesContext.fillText(m, 10, (i + 1) * 20);
    });

    messagesContext.fillStyle = messages.messageColour[0];
    messagesContext.fillText("X: " + player.x + " | Y: " + player.y, VIEWPORT_WIDTH - 160, 20)
    messagesContext.fillText("Gold: " + player.gold, VIEWPORT_WIDTH - 160, 40)
}

function generateItem(item) {

    let point = getEmptyPoint(grid);

    switch (item) {

        case 'coin': return {
            x: point.x,
            y: point.y,
            value: getRandom(500) + 5,
            char: charMap.get('coin'),
            pickUp: function () {
                messages.addMessage("You found " + this.value + " gold!")
                removeItem(this);
            }
        }
    }
}

function removeItem(item) {
    grid[item.x][item.y].char = ' ';
    mapItems.splice(mapItems.indexOf(item), 1);

}

function generateItemsArray() {

    let newItems = [];

    const numberOfItems = 10 + getRandom(20);

    for (let i = 0; i < numberOfItems; i++) {

        let r = getRandom(100);

        items.forEach(i => {
            if (i.prob >= r) {
                let o = Object.assign({},i);
                o.value = o.minValue + getRandom(o.maxValue - o.minValue);
                let pos = getEmptyPoint(grid);
                o.x = pos.x;
                o.y = pos.y;
                newItems.push(o);
            }
        })


    }

    return newItems;

}

function playerCommand(command) {

    if (command.length <= 2) {
        let modX = 0;
        let modY = 0;
        if (command.includes('N')) modY = -1;
        if (command.includes('S')) modY = 1;
        if (command.includes('E')) modX = 1;
        if (command.includes('W')) modX = -1;

        if (grid[player.x + modX][player.y + modY].char != charMap.get('wall')) {
            player.x += modX;
            player.y += modY;
            updateMapView(player, grid);
        }

        mapItems.forEach(i => {
            if (checkOverlap(i, player)) {
                player[i.pickupAction]?.call(player, i.value);
                messages.addMessage("You found " + i.name + " " + i?.value)
                removeItem(i);
            }
        })

    }
    drawMessages(messages);
}

function generateMap(grid) {

    createRoom(grid, { x: GRID_SIZE / 2, y: GRID_SIZE / 2 })

    const numberOfIterations = getRandom(2) + 5;

    for (let i = 0; i < numberOfIterations; i++) {
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
    const width = getRandom(10) + 5;
    const height = getRandom(10) + 5;

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

function createGridSection(elementsWide, elementsHigh, centerObject, grid) {

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
            mapItems.forEach(i => {
                if (checkOverlap(i, { x: startX + x, y: startY + y })) gridSection[x][y].char = i.char;
            });

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

function updateMapView(player, grid) {
    drawGridSection(createGridSection(VIEWPORT_WIDTH / ELEMENT_SIZE, VIEWPORT_HEIGHT / ELEMENT_SIZE, player, grid));

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

function drawGridSection(gridSection) {
    mapViewContext.fillStyle = "black";
    mapViewContext.font = "18pt courier new";
    mapViewContext.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    mapViewContext.fillStyle = "white";

    for (var x = 0; x < VIEWPORT_WIDTH / ELEMENT_SIZE; x++) {
        for (var y = 0; y < VIEWPORT_HEIGHT / ELEMENT_SIZE; y++) {

            if (gridSection[x][y].lit) {
                mapViewContext.fillStyle = 'silver';
                mapViewContext.fillText(gridSection[x][y].char, x * ELEMENT_SIZE, y * ELEMENT_SIZE);

            }
            else if (gridSection[x][y].visited) {
                mapViewContext.fillStyle = 'dimgray';
                mapViewContext.fillText(gridSection[x][y].char, x * ELEMENT_SIZE, y * ELEMENT_SIZE);
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





