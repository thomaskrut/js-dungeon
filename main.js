import { player } from "./src/player.js";
import { drawEntireMap, drawGridSection, drawMenu, drawMessages } from "./src/drawing.js";
import { messages } from "./src/messages.js";
import { charMap } from "./src/charmap.js";
import { generateMap, getEmptyPoint, initGrid } from "./src/mapgenerator.js";
import { globals as g } from "./src/globals.js";
import { getRandom, checkOverlap } from "./src/util.js";
import { generateItemsArray } from "./src/items.js";
import { generateMonstersArray, removeMonster } from "./src/monsters.js";
import { loadTemplates } from "./src/templates.js";
import { createGridSection } from "./src/grid.js";
import { menus } from "./src/menus.js";

let gameState = 'INTRO';

const grid = initGrid(charMap);

let items = [];
let monsters = [];
loadTemplates('src/templates.json');
messages.addMessage("Welcome to the dungeon! Press n for new game");
messages.updateRecent();
drawMessages(player, messages);
initKeyListener();

function startGame() {
    generateMap(grid, charMap);
    player.setPosition(getEmptyPoint(grid, charMap));
    items = generateItemsArray(grid, charMap, player);
    monsters = generateMonstersArray(grid, charMap);
    updateMapView(player, grid);
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
                        messages.addMessage("The " + m.name.toLowerCase() + " " + m.attack[getRandom(m.attack.length)] + " you!");
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

    if (command.length <= 2) {
        let modX = 0;
        let modY = 0;
        if (command.includes('N')) modY = -1;
        if (command.includes('S')) modY = 1;
        if (command.includes('E')) modX = 1;
        if (command.includes('W')) modX = -1;

        let nextPlayerPosition = {x: player.x + modX, y: player.y + modY};

        if (grid[nextPlayerPosition.x][nextPlayerPosition.y].char != charMap.get('wall')) {

            monsters.forEach(monster => {
                if (checkOverlap(nextPlayerPosition, monster)) {
                    messages.addMessage("You hit the " + monster.name.toLowerCase())
                    monster.hp -= player.str;
                    if (monster.hp <= 0) {
                        messages.addMessage("You killed the " + monster.name.toLowerCase());
                        removeMonster(monsters, monster, grid, charMap);
                    }
                    nextPlayerPosition = {x: player.x, y: player.y};
                }
            });
            player.setPosition(nextPlayerPosition);
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

}

function updateMapView() {
    drawGridSection(createGridSection(g.VIEWPORT_WIDTH / g.ELEMENT_SIZE, g.VIEWPORT_HEIGHT / g.ELEMENT_SIZE, player, grid, charMap, items), charMap);

}

function initKeyListener() {

    window.addEventListener("keydown", event => {

        switch (gameState) {

            case "INTRO": {
                switch (event.key) {

                    case "n": {
                        gameState = 'MAZE';
                        startGame();
                        break;
                    }

                    default:
                        console.log(event.key);
                        return;
                }
                break;
            }

            case "ITEM": {

                switch (event.key) {
                    case "2":
                    case "ArrowDown": {
                        menus.moveDown();
                        drawMenu(menus.getCurrentMenu());
                        break;
                    }
                    case "8":
                    case "ArrowUp": {
                        menus.moveUp();
                        drawMenu(menus.getCurrentMenu());
                        break;
                    }
                    case "5":
                    case "Enter": {

                        if (menus.selectedMenuItem == 0) {
                            menus.selectedItem.use();
                        }
                        if (menus.selectedMenuItem == 1) {
                            player.dropItem(menus.selectedItem, messages, items);
                        }
                        if (menus.selectedMenuItem == 3) {

                        }
                        drawMessages(player, messages);
                        menus.createMenu(player.getInventoryToDraw(), 'INVENTORY');
                        drawMenu(menus.getCurrentMenu());
                        gameState = 'INVENTORY';
                        break;
                    }
                    case "i": {
                        updateMapView(player, grid);
                        gameState = 'MAZE';
                        break;
                    }
                    default:
                        console.log(event.key);
                        return;
                }
                break;
            }

            case "INVENTORY": {
                switch (event.key) {
                    case "2":
                    case "ArrowDown": {
                        menus.moveDown();
                        drawMenu(menus.getCurrentMenu());
                        break;
                    }
                    case "8":
                    case "ArrowUp": {
                        menus.moveUp();
                        drawMenu(menus.getCurrentMenu());
                        break;
                    }
                    case "5":
                    case "Enter": {
                        menus.selectedItem = player.getSelectedItem(menus.selectedMenuItem);
                        console.log(menus.selectedItem.name);
                        menus.createMenu([{ name: menus.selectedItem.verb }, { name: "Drop" }, { name: "Nothing" }], "What to do with this " + menus.selectedItem.name.toLowerCase() + "?");
                        drawMenu(menus.getCurrentMenu());
                        gameState = 'ITEM';
                        break;
                    }
                    case "i": {
                        updateMapView(player, grid);
                        gameState = 'MAZE';
                        break;
                    }
                    default:
                        console.log(event.key);
                        return;
                }
                break;
            }

            case "MAP": {
                switch (event.key) {

                    default:
                        gameState = 'MAZE';
                        updateMapView();
                        return;
                }
            }

            case "MAZE": {
                switch (event.key) {

                    case "m":
                    case "M":
                        drawEntireMap(grid, player, charMap);
                        gameState = 'MAP';
                        break;

                    case "i":
                    case "I":
                        menus.createMenu(player.getInventoryToDraw(), 'INVENTORY');
                        drawMenu(menus.getCurrentMenu());
                        gameState = 'INVENTORY';
                        break;

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
            }

        }


        console.log(event.key);

        event.preventDefault();
    }, true);
}