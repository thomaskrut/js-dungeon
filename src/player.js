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

   

    setPosition: function (pos) {
        this.x = pos.x;
        this.y = pos.y;
    },

    eatFood: function (item, messages) {
        this.hunger -= item.value;
        messages.addMessage("You ate " + item.prefix + " " + item.name.toLowerCase());
        player.inventory.splice(player.inventory.indexOf(item), 1);
    },

    addGold: function (item, messages) {
        this.gold += item.value;
        messages.addMessage("You found " + item.value + " gold!");
    },

    lightTorch: function (item, messages) {

    },

    addToInventory: function (item, messages) {
        this.inventory.push(item);
        console.log(this.inventory);
        messages.addMessage("You found " + item.prefix + " " + item.name.toLowerCase());
    }

}