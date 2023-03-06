const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 480;
const MESSAGES_HEIGHT = 100;
const ELEMENT_SIZE = 20;
const GRID_SIZE = 200;

let litAreaSize = 5;

const mapViewContext = document.getElementById('mapView').getContext("2d");
const messagesContext = document.getElementById('messages').getContext("2d");

const charMap = new Map();

charMap.set('wall', '\u25A7').set('player', '@').set('floor', '\u2591');

const grid = initGrid();

generateMap(grid);

const itemTemplates = [
    {
        name: "Gold",
        prefix: "pieces of",
        char: "$",
        prob: 900,
        value: 0, maxValue: 500, minValue: 5,
        pickupAction: "addGold"
    },
    {
        name: "Apple",
        prefix: "an",
        char: "õ",
        prob: 50,
        value: 10, minValue: 10, maxValue: 10,
        pickupAction: "addToInventory",
        useAction: "eatFood"
    }
];

const monsterTemplates = [
    {
        name: "Rat",
        char: "r",
        prob: 200,
        attack: "bites",
        moves: true,
        aggressive: false
    }

];


const player = {
    x: 0,
    y: 0,
    gold: 0,
    hunger: 0,

    inventory: [],

    setPosition: function (pos) {
        this.x = pos.x;
        this.y = pos.y;
    },

    earFood: function (item) {
        this.hunger = - item.value;
    },

    addGold: function (item) {
        this.gold += item.value;
        messages.addMessage("You found " + item.value + " gold!");
    },

    addToInventory: function (item) {
        this.inventory.push(item);
        console.log(this.inventory);
        messages.addMessage("You found " + item.prefix + " " + item.name.toLowerCase());
    }

}

const messages = {

    newMessages: [],
    messageColour: ["white", "silver", "gray", "dimgray", "dimgray", "dimgray"],
    recentMessages: [],

    addMessage: function (message) {
        this.newMessages.unshift(message);
        this.updateRecent();
    },

    updateRecent: function () {
        if (this.newMessages.length > 0) {
            if (messages.recentMessages.length > 6) messages.recentMessages.pop();
            this.recentMessages.unshift(this.newMessages.pop())
        }
    }


};



player.setPosition(getEmptyPoint(grid));

const mapItems = generateItemsArray();

const monsters = generateMonstersArray();

initKeyListener();

updateMapView(player, grid);

messages.addMessage("Welcome!");
messages.updateRecent();
drawMessages(messages);

function drawMessages(messages) {

    messagesContext.fillStyle = "black";
    messagesContext.font = "12px courier new";
    messagesContext.fillRect(0, 0, VIEWPORT_WIDTH, MESSAGES_HEIGHT);

    messages.recentMessages.forEach((m, i) => {
        messagesContext.fillStyle = messages.messageColour[i];
        messagesContext.fillText(m, 10, (i + 1) * 14);
    });

    messagesContext.fillStyle = messages.messageColour[0];
    messagesContext.fillText("X: " + player.x + " | Y: " + player.y, VIEWPORT_WIDTH - 160, 20)
    messagesContext.fillText("Gold: " + player.gold, VIEWPORT_WIDTH - 160, 40)
}

function generateItem(template) {

    let newItem = Object.assign({}, template);

    let point = getEmptyPoint(grid);
    newItem.x = point.x;
    newItem.y = point.y;
    newItem.value = template.minValue + getRandom(template.maxValue - template.minValue);
    newItem.pickUp = function () {
        player[template.pickupAction]?.call(player, newItem);
        removeItem(newItem);
    }
    return newItem;

}

function generateMonster(template) {
    let newMonster = Object.assign({}, template);
    let point = getEmptyPoint(grid);
    newMonster.x = point.x;
    newMonster.y = point.y;
    return newMonster;
}

function removeItem(item) {
    grid[item.x][item.y].char = charMap.get('floor');
    mapItems.splice(mapItems.indexOf(item), 1);

}

function generateMonstersArray() {
    let newMonsters = [];
    const numberOfMonsters = 10 + getRandom(20);
    for (let i = 0; i < numberOfMonsters; i++) {

        let r = getRandom(1000);

        monsterTemplates.forEach(m => {
            if (m.prob >= r) {
                newMonsters.push(generateMonster(m));
            }
        })


    }

    return newMonsters;

}


function generateItemsArray() {

    let newItems = [];

    const numberOfItems = 10 + getRandom(20);

    for (let i = 0; i < numberOfItems; i++) {

        let r = getRandom(1000);

        itemTemplates.forEach(i => {
            if (i.prob >= r) {
                newItems.push(generateItem(i));
            }
        })


    }

    return newItems;

}

function moveMonsters(monsters, player, grid) {

    monsters.forEach(m => {

        if (m.moves) {
            grid[m.x][m.y].char = charMap.get('floor');
            let modX = 0;
            let modY = 0;
            if (player.x > m.x) modX = 1;
            if (player.x < m.x) modX = -1;
            if (player.y > m.y) modY = 1;
            if (player.y < m.y) modY = -1;
            let counter = 0;
            while (grid[m.x + modX][m.y + modY].char != charMap.get('floor')) {
                modX = getRandom(2) - 1;
                modY = getRandom(2) - 1;
                counter++;
                if (counter == 10) {
                    modX = 0;
                    modY = 0;
                    break;
                }
            }
            
            if (checkOverlap(player, { x: m.x + modX, y: m.y + modY })) {
                messages.addMessage("The " + m.name.toLowerCase() + " " + m.attack + " you!");
                modX = 0;
                modY = 0;
            }
            
            m.x = m.x + modX;
            m.y = m.y + modY;
            grid[m.x][m.y].char = m.char;

        }

    });

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
            monsters.forEach(m => {
                if (checkOverlap({x: player.x + modX, y: player.y + modY}, m)) {
                    messages.addMessage("You hit the " + m.name)
                    modX = 0;
                    modY = 0;
                }
            });
            player.x += modX;
            player.y += modY;
            moveMonsters(monsters, player, grid);
            updateMapView(player, grid);
        }

        mapItems.forEach(i => {
            if (checkOverlap(i, player)) {
                i.pickUp();
            }
        })

    }

    if (command == 'rest') {
        moveMonsters(monsters, player, grid);
        updateMapView(player, grid);
    }

    drawMessages(messages);
}

function generateMap(grid) {

    createRoom(grid, { x: GRID_SIZE / 2, y: GRID_SIZE / 2 })

    const numberOfIterations = 4;

    for (let i = 0; i < numberOfIterations; i++) {
        createRoom(grid, getEmptyPoint(grid));
        createRoom(grid, createPassage(grid, getEmptyPoint(grid)));
    }
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

function getEmptyPoint(grid) {
    while (true) {
        const randX = 1 + getRandom(GRID_SIZE - 2);
        const randY = 1 + getRandom(GRID_SIZE - 2);
        if (grid[randX][randY].char == charMap.get('floor')) return { x: randX, y: randY }
    }
}

function createPassage(grid, startingPoint) {
    let x = startingPoint.x;
    let y = startingPoint.y;
    let direction = getRandomDirection(1, 0);
    console.log(direction);
    while (x > 2 && x < GRID_SIZE - 2 && y > 2 && y < GRID_SIZE - 2 && getRandom(100) < 99) {
        while (getRandom(5) != 0) {
            grid[x][y] = {
                char: charMap.get('floor'),
                visited: false,
                lit: false
            }
            x = x + direction.modX;
            y = y + direction.modY;
            if (x < 2 || x > GRID_SIZE - 2 || y < 2 || y > GRID_SIZE - 2) break;
        }
        direction = getRandomDirection(direction.modX, direction.modY);
    }
    return { x: x, y: y };

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
                char: charMap.get('floor'),
                visited: false,
                lit: false,
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
            monsters.forEach(m => {
                if (checkOverlap(m, { x: startX + x, y: startY + y })) gridSection[x][y].char = m.char;
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

function updateMapView() {
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
    mapViewContext.font = "16pt courier new";
    mapViewContext.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    mapViewContext.fillStyle = "white";

    for (var x = 0; x < VIEWPORT_WIDTH / ELEMENT_SIZE; x++) {
        for (var y = 0; y < VIEWPORT_HEIGHT / ELEMENT_SIZE; y++) {

            if (gridSection[x][y].lit) {
                mapViewContext.fillStyle = '#CCC';
                mapViewContext.fillText(gridSection[x][y].char, x * ELEMENT_SIZE, y * ELEMENT_SIZE);

            }
            else if (gridSection[x][y].visited) {
                mapViewContext.fillStyle = '#444';
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
            case "5":
                playerCommand('rest');
                break;
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
            case "m":
            case "M":
                drawEntireMap(grid);
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

function drawEntireMap(grid) {

    updateMapView();
    const startX = VIEWPORT_WIDTH / 2 - GRID_SIZE;
    const startY = 30;
    mapViewContext.fillStyle = '#222'
    mapViewContext.fillRect(startX, startY, GRID_SIZE * 2, GRID_SIZE * 2);
    mapViewContext.strokeStyle = "silver";
    mapViewContext.strokeRect(startX - 1, startY - 1, (GRID_SIZE * 2 + 2), (GRID_SIZE * 2) + 2);

    mapViewContext.fillStyle = "gray";
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {

            if (grid[x][y].char == charMap.get('floor')) {
                mapViewContext.fillRect(startX + (x * 2), startY + (y * 2), 2, 2);
            }

        }
    }

    mapViewContext.fillStyle = "red";
    mapViewContext.strokeStyle = "red";
    mapViewContext.fillRect(startX + (player.x * 2), startY + (player.y * 2), 2, 2);
    mapViewContext.strokeRect(startX + (player.x * 2) - VIEWPORT_WIDTH / ELEMENT_SIZE / 2, startY + (player.y * 2) - VIEWPORT_HEIGHT / ELEMENT_SIZE / 2, VIEWPORT_WIDTH / ELEMENT_SIZE, VIEWPORT_HEIGHT / ELEMENT_SIZE)
}





