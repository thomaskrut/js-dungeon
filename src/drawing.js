export {drawGridSection, drawMessages, drawInventory, drawEntireMap};

import { globals as g } from "./globals.js";
import { messages } from "./messages.js";
import { player } from "./player.js";

const mapViewContext = document.getElementById('mapView').getContext("2d");
const messagesContext = document.getElementById('messages').getContext("2d");

const interval = setInterval(() => {
    messages.addMessage(" ");
    drawMessages(player, messages);
}, 1500)

function drawInventory(items, player) {
    
    const startX = g.VIEWPORT_WIDTH / 2 - g.GRID_SIZE;
    const startY = 30;
    mapViewContext.font = "12px courier new";
    mapViewContext.fillStyle = '#222'
    mapViewContext.fillRect(startX, startY, g.GRID_SIZE * 2, g.GRID_SIZE * 2);
    mapViewContext.strokeStyle = "silver";
    mapViewContext.strokeRect(startX - 1, startY - 1, (g.GRID_SIZE * 2 + 2), (g.GRID_SIZE * 2) + 2);
    mapViewContext.fillStyle = '#CCC'
    mapViewContext.fillText("Inventory", startX + 160, startY + 30);



    player.inventory.forEach((i, index) => {

        mapViewContext.fillText(i.name, startX, 100 + (startY * index));

    });


}

function drawMessages(player, messages) {

    messagesContext.fillStyle = "black";
    messagesContext.font = "12px courier new";
    messagesContext.fillRect(0, 0, g.VIEWPORT_WIDTH, g.MESSAGES_HEIGHT);

    messages.recentMessages.forEach((m, i) => {
        messagesContext.fillStyle = messages.messageColour[i];
        messagesContext.fillText(m, 10, (i + 1) * 14);
    });

    messagesContext.fillStyle = "silver";
    messagesContext.fillText("X: " + player.x + " | Y: " + player.y, g.VIEWPORT_WIDTH - 160, 20)
    messagesContext.fillText("HP: " + player.hp, g.VIEWPORT_WIDTH - 160, 40)
   
}

function drawGridSection(gridSection, charMap) {
    mapViewContext.fillStyle = "black";
    mapViewContext.font = "16pt courier new";
    mapViewContext.fillRect(0, 0, g.VIEWPORT_WIDTH, g.VIEWPORT_HEIGHT);
    mapViewContext.fillStyle = "white";

    for (var x = 0; x < g.VIEWPORT_WIDTH / g.ELEMENT_SIZE; x++) {
        for (var y = 0; y < g.VIEWPORT_HEIGHT / g.ELEMENT_SIZE; y++) {

            if (gridSection[x][y].lit) {
                mapViewContext.fillStyle = '#CCC';
                mapViewContext.fillText(gridSection[x][y].char, x * g.ELEMENT_SIZE, y * g.ELEMENT_SIZE);

            }
            else if (gridSection[x][y].visited) {
                mapViewContext.fillStyle = '#444';
                if (gridSection[x][y].char != charMap.get('wall')) {
                    mapViewContext.fillText(charMap.get('floor'), x * g.ELEMENT_SIZE, y * g.ELEMENT_SIZE);
                } else {
                    mapViewContext.fillText(gridSection[x][y].char, x * g.ELEMENT_SIZE, y * g.ELEMENT_SIZE);
                }
            }
        }
    }
}

function drawEntireMap(grid, player, charMap) {

    
    const startX = g.VIEWPORT_WIDTH / 2 - g.GRID_SIZE;
    const startY = 30;
    mapViewContext.fillStyle = '#222'
    mapViewContext.fillRect(startX, startY, g.GRID_SIZE * 2, g.GRID_SIZE * 2);
    mapViewContext.strokeStyle = "silver";
    mapViewContext.strokeRect(startX - 1, startY - 1, (g.GRID_SIZE * 2 + 2), (g.GRID_SIZE * 2) + 2);

    mapViewContext.fillStyle = "gray";
    for (let x = 0; x < g.GRID_SIZE; x++) {
        for (let y = 0; y < g.GRID_SIZE; y++) {

            if (grid[x][y].char == charMap.get('floor')) {
                mapViewContext.fillRect(startX + (x * 2), startY + (y * 2), 2, 2);
            }

        }
    }

    mapViewContext.fillStyle = "red";
    mapViewContext.strokeStyle = "red";
    mapViewContext.fillRect(startX + (player.x * 2), startY + (player.y * 2), 2, 2);
    mapViewContext.strokeRect(startX + (player.x * 2) - g.VIEWPORT_WIDTH / g.ELEMENT_SIZE / 2, startY + (player.y * 2) - g.VIEWPORT_HEIGHT / g.ELEMENT_SIZE / 2, g.VIEWPORT_WIDTH / g.ELEMENT_SIZE, g.VIEWPORT_HEIGHT / g.ELEMENT_SIZE)
}