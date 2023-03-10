export { player };
import { setLitAreaSize } from "./grid.js";
import { messages } from "./messages.js";
import { getRandom } from "./util.js";

const player = {
    x: 0,
    y: 0,
    speed: 10,
    gold: 0,
    hp: 30,
    maxhp: 30,
    str: 12,
    hunger: 0,
    turns: 0,
    weapon: {
        prefix: " ",
        name: "fist",
        value: 0
    },
    lightSource: {
        name: "Torch",
        value: 700
    },

    inventory: [],

    inventoryToDraw: new Map(),

    setPosition: function (pos) {
        this.x = pos.x;
        this.y = pos.y;
    },

    checkLightSource: function () {
        this.lightSource.value--;

        if (this.lightSource.value == 50) {
            messages.addMessage("Your light is flickering!");
        }

        if (this.lightSource.value == 10) {
            messages.addMessage("Your light is about to go out!");
        }

        if (this.lightSource.value < 50 && this.lightSource.value > 0) {
            setLitAreaSize(1 + getRandom(4));
        }

        if (this.lightSource.value == 0) {
            
            messages.addMessage("Your light goes out!");
            setLitAreaSize(2);
            this.lightSource = {
                name: "none",
                value: 0
            };
        };

        if (this.lightSource.value < 0) this.lightSource.value = 0;
    },

    checkHp: function () {
        if (this.turns % 10 == 0 && this.hp < this.maxhp) this.hp++;
    },

    moveTurn: function () {

        this.turns++;
        this.checkLightSource();
        this.checkHp();

    },

    eatFood: function (item, messages) {
        this.removeFromInventory(item);
        this.hunger -= item.value;
        messages.addMessage("You ate " + item.prefix + " " + item.name.toLowerCase());
    },

    addGold: function (item, messages) {
        this.gold += item.value;
        messages.addMessage("You found " + item.value + " gold!");
    },

    lightTorch: function (item, messages) {
        if (this.lightSource.name == 'none') {
            setLitAreaSize(5);
            this.lightSource = item;
            this.removeFromInventory(item);
            messages.addMessage("You lit the " + item.name.toLowerCase());
        } else {
            messages.addMessage("You are already using a lit " + this.lightSource.name.toLowerCase());
        }
        
    },

    wieldWeapon: function (item, messages) {
        this.weapon = item;
        messages.addMessage("You are now wielding " + item.prefix + " " + item.name.toLowerCase());
    },

    addToInventory: function (item, messages) {
        this.inventory.push(item);

        if (this.inventoryToDraw.has(item.name)) {
            this.inventoryToDraw.set(item.name, {item: item, amount: this.inventoryToDraw.get(item.name).amount + 1});
        } else {
            this.inventoryToDraw.set(item.name, {item: item, amount: 1});
        }

        console.log(this.inventoryToDraw);
        messages.addMessage("You found " + item.prefix + " " + item.name.toLowerCase());
    },

    getInventoryToDraw: function () {
        let inventoryToDrawArray = [];
        this.inventoryToDraw.forEach((value, key) => inventoryToDrawArray.push({name: value.amount + " x " + key, item: value}));
        return inventoryToDrawArray;
    },

    getSelectedItem: function (selectedMenuItem) {
        return this.getInventoryToDraw()[selectedMenuItem].item.item;
    },

    removeFromInventory: function (selectedItem) {
        this.inventoryToDraw.set(selectedItem.name, {item: selectedItem, amount: this.inventoryToDraw.get(selectedItem.name).amount - 1});
        if (this.inventoryToDraw.get(selectedItem.name).amount == 0) {
            this.inventory.splice(this.inventory.indexOf(selectedItem), 1);
            this.inventoryToDraw.delete(selectedItem.name);
        }
    },

    dropItem: function (selectedItem, messages, items) {
        
        this.removeFromInventory(selectedItem);
        
        messages.addMessage("You dropped " + selectedItem.prefix + " " + selectedItem.name.toLowerCase());
        selectedItem.x = player.x;
        selectedItem.y = player.y;
        items.push(selectedItem);
    }

}