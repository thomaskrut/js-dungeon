import { player } from "./src/player.js";
import { monsterTemplates, itemTemplates } from "./src/templates.js";
import { drawEntireMap, drawGridSection, drawInventory, drawMessages } from "./src/drawing.js";
import { messages } from "./src/messages.js";
import { charMap } from "./src/charmap.js";
import { generateMap, getEmptyPoint, initGrid } from "./src/mapgenerator.js";
import { globals as g } from "./src/globals.js";
import { getRandom } from "./src/util.js";

let gameState = 'MAZE';

let litAreaSize = 5;

const grid = initGrid(charMap);

generateMap(grid, charMap);

player.setPosition(getEmptyPoint(grid, charMap));

const items = generateItemsArray();

const monsters = generateMonstersArray();

initKeyListener();

updateMapView(player, grid);

messages.addMessage("Welcome!");
messages.updateRecent();
drawMessages(player, messages);


function generateItem(template) {

    let newItem = Object.assign({}, template);

    let point = getEmptyPoint(grid, charMap);
    newItem.x = point.x;
    newItem.y = point.y;
    newItem.value = template.minValue + getRandom(template.maxValue - template.minValue);
    newItem.pickUp = function () {
        player[template.pickupAction]?.call(player, newItem, messages);
        removeItem(newItem);
    }
    return newItem;

}

function generateMonster(template) {
    let newMonster = Object.assign({}, template);
    let point = getEmptyPoint(grid, charMap);
    newMonster.x = point.x;
    newMonster.y = point.y;
    newMonster.hp = template.hp + getRandom(5);
    newMonster.moveCounter = getRandom(template.speed);
    return newMonster;
}

function removeItem(item) {
    grid[item.x][item.y].char = charMap.get('floor');
    items.splice(items.indexOf(item), 1);

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

    for (let tick = 0; tick < player.speed; tick++) {

        monsters.forEach(m => {

            if (m.moves) {
                m.moveCounter--;
                if (m.moveCounter == 0) {
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
                        if (counter == 20) {
                            modX = 0;
                            modY = 0;
                            break;
                        }
                    }

                    if (checkOverlap(player, { x: m.x + modX, y: m.y + modY })) {
                        messages.addMessage("The " + m.name.toLowerCase() + " " + m.attack + " you!");
                        player.hp -= m.str;
                        modX = 0;
                        modY = 0;
                    }

                    m.x = m.x + modX;
                    m.y = m.y + modY;
                    grid[m.x][m.y].char = m.char;
                    m.moveCounter = m.speed;
                }


            }

        });
    }
}

function playerCommand(command) {

    switch (gameState) {

        case 'MAZE': {

            if (command.length <= 2) {
                let modX = 0;
                let modY = 0;
                if (command.includes('N')) modY = -1;
                if (command.includes('S')) modY = 1;
                if (command.includes('E')) modX = 1;
                if (command.includes('W')) modX = -1;

                if (grid[player.x + modX][player.y + modY].char != charMap.get('wall')) {
                    monsters.forEach(m => {
                        if (checkOverlap({ x: player.x + modX, y: player.y + modY }, m)) {
                            messages.addMessage("You hit the " + m.name)
                            m.hp -= player.str;
                            if (m.hp <= 0) {
                                messages.addMessage("You killed the " + m.name);
                                grid[m.x][m.y].char = charMap.get('floor');
                                monsters.splice(monsters.indexOf(m), 1);
                            }
                            modX = 0;
                            modY = 0;
                        }
                    });
                    player.x += modX;
                    player.y += modY;
                    moveMonsters(monsters, player, grid);
                    updateMapView(player, grid);
                }

                items.forEach(i => {
                    if (checkOverlap(i, player)) {
                        i.pickUp();
                    }
                })

            }

            if (command == 'rest') {
                moveMonsters(monsters, player, grid);
                updateMapView(player, grid);
            }

            drawMessages(player, messages);
            break;
        }

        case 'INVENTORY': {
            if (command == 'inventory') {
                updateMapView(player, grid);
                gameState = 'MAZE';
            }
            break;
        }
    }

}

function createGridSection(elementsWide, elementsHigh, centerObject, grid) {

    let startX = (centerObject.x > elementsWide / 2) ? centerObject.x - elementsWide / 2 : 0;
    let startY = (centerObject.y > elementsHigh / 2) ? centerObject.y - elementsHigh / 2 : 0;

    if (startX > g.GRID_SIZE - elementsWide) startX = g.GRID_SIZE - elementsWide;
    if (startY > g.GRID_SIZE - elementsHigh) startY = g.GRID_SIZE - elementsHigh;

    const playerX = centerObject.x - startX;
    const playerY = centerObject.y - startY;

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
    drawGridSection(createGridSection(g.VIEWPORT_WIDTH / g.ELEMENT_SIZE, g.VIEWPORT_HEIGHT / g.ELEMENT_SIZE, player, grid), charMap);

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

function checkOverlap(object1, object2) {
    return (object1.x == object2.x && object1.y == object2.y);
}

function initKeyListener() {

    window.addEventListener("keydown", event => {

        switch (event.key) {
            case "m":
            case "M":
                drawEntireMap(grid, player, charMap);
                break;
            case "i":
            case "I":
                switch (gameState) {
                    case 'MAZE': {
                        drawInventory(items, player);
                        gameState = 'INVENTORY';
                        break;
                    }
                    case 'INVENTORY': {
                        updateMapView(player, grid);
                        gameState = 'MAZE';
                        break;
                    }
                }

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
            default:
                console.log(event.key);
                return;
        }
        console.log(event.key);

        event.preventDefault();
    }, true);
}









