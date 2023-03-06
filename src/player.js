export { player };
import { messages } from "./messages.js";

const player = {
    x: 0,
    y: 0,
    speed: 10,
    gold: 0,
    hp: 30,
    str: 12,
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