export { generateItemsArray, removeItem };
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

function removeItem(item, grid, charMap, items) {
    grid[item.x][item.y].char = charMap.get('floor');
    items.splice(items.indexOf(item), 1);

}

function generateItemsArray(grid, charMap, player) {
    const templates = getItemTemplates();
    let newItems = [];

    const numberOfItems = 10 + getRandom(20);

    for (let i = 0; i < numberOfItems; i++) {

        let r = getRandom(1000);
        console.log(getItemTemplates());
        templates.forEach(i => {
            if (i.prob >= r) {
                newItems.push(generateItem(i, grid, charMap, player, newItems));
            }
        })


    }

    return newItems;

}