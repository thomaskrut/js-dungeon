export {drawGridSection, drawMessages, drawInventory, drawEntireMap};

const mapViewContext = document.getElementById('mapView').getContext("2d");
const messagesContext = document.getElementById('messages').getContext("2d");

const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 480;
const MESSAGES_HEIGHT = 100;
const ELEMENT_SIZE = 20;
const GRID_SIZE = 200;

function drawInventory(items) {
    updateMapView();
    const startX = VIEWPORT_WIDTH / 2 - GRID_SIZE;
    const startY = 30;
    mapViewContext.font = "12px courier new";
    mapViewContext.fillStyle = '#222'
    mapViewContext.fillRect(startX, startY, GRID_SIZE * 2, GRID_SIZE * 2);
    mapViewContext.strokeStyle = "silver";
    mapViewContext.strokeRect(startX - 1, startY - 1, (GRID_SIZE * 2 + 2), (GRID_SIZE * 2) + 2);
    mapViewContext.fillStyle = '#CCC'
    mapViewContext.fillText("Inventory", startX + 160, startY + 30);



    player.inventory.forEach((i, index) => {

        mapViewContext.fillText(i.name, startX, 100 + (startY * index));

    });


}

function drawMessages(player, messages) {

    messagesContext.fillStyle = "black";
    messagesContext.font = "12px courier new";
    messagesContext.fillRect(0, 0, VIEWPORT_WIDTH, MESSAGES_HEIGHT);

    messages.recentMessages.forEach((m, i) => {
        messagesContext.fillStyle = "silver";
        messagesContext.fillText(m, 10, (i + 1) * 14);
    });

    messagesContext.fillStyle = messages.messageColour[0];
    messagesContext.fillText("X: " + player.x + " | Y: " + player.y, VIEWPORT_WIDTH - 160, 20)
    messagesContext.fillText("HP: " + player.hp, VIEWPORT_WIDTH - 160, 40)
}

function drawGridSection(gridSection, charMap) {
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
                if (gridSection[x][y].char != charMap.get('wall')) {
                    mapViewContext.fillText(charMap.get('floor'), x * ELEMENT_SIZE, y * ELEMENT_SIZE);
                } else {
                    mapViewContext.fillText(gridSection[x][y].char, x * ELEMENT_SIZE, y * ELEMENT_SIZE);
                }
            }
        }
    }
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