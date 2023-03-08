export { generateItemsArray, removeItem, dropItem };
import { getRandom, getEmptyPoint } from "./util.js";
import { getItemTemplates } from "./templates.js";
import { messages } from "./messages.js";

function generateItem(template, grid, charMap, player, items) {

    let newItem = Object.assign({}, template);

    let point = getEmptyPoint(grid, charMap);
    newItem.x = point.x;
    newItem.y = point.y;
    newItem.value = template.minValue + getRandom(template.maxValue - template.minValue);
    newItem.pickUp = function () {
        player[template.pickupAction]?.call(player, newItem, messages);
        removeItem(newItem, grid, charMap, items);
    }
    newItem.use = function () {
        player[template.useAction]?.call(player, newItem, messages)
    }
    return newItem;

}

function dropItem(selectedItem, player, messages, items) {
    player.inventory.splice(player.inventory.indexOf(selectedItem), 1);
    messages.addMessage("You dropped " + selectedItem.prefix + " " + selectedItem.name.toLowerCase());
    selectedItem.x = player.x;
    selectedItem.y = player.y;
    items.push(selectedItem);
}

function removeItem(item, grid, charMap, items) {
    grid[item.x][item.y].char = charMap.get('floor');
    items.splice(items.indexOf(item), 1);

}

function generateItemsArray(grid, charMap, player) {
    const templates = getItemTemplates();
    let newItems = [];

    const numberOfItems = 10 + getRandom(20);

    for (let i = 0; i < numberOfItems; i++) {

        const randomNumber = getRandom(1000);
     
        templates.forEach(itemTemplate => {
            if (itemTemplate.prob >= randomNumber) {
                newItems.push(generateItem(itemTemplate, grid, charMap, player, newItems));
            }
        })


    }

    return newItems;

}