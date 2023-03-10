export { player };

const player = {
    x: 0,
    y: 0,
    speed: 10,
    gold: 0,
    hp: 30,
    str: 12,
    hunger: 0,

    inventory: [],

    inventoryToDraw: new Map(),

    setPosition: function (pos) {
        this.x = pos.x;
        this.y = pos.y;
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
        console.log(this.getInventoryToDraw()[selectedMenuItem].item.item);
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