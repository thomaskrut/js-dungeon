export { itemTemplates, monsterTemplates };

const itemTemplates = [
    {
        name: "Gold",
        prefix: "pieces of",
        char: "$",
        prob: 900,
        value: 0, maxValue: 500, minValue: 5,
        pickupAction: "addGold"
    },
    {
        name: "Apple",
        prefix: "an",
        char: "õ",
        prob: 850,
        value: 10, minValue: 10, maxValue: 10,
        pickupAction: "addToInventory",
        useAction: "eatFood"
    },
    {
        name: "Candy",
        prefix: "a",
        char: "¤",
        prob: 700,
        value: 10, minValue: 1, maxValue: 10,
        pickupAction: "addToInventory",
        useAction: "throwItem"
    }
];

const monsterTemplates = [
    {
        name: "Rat",
        char: "r",
        prob: 400,
        attack: "bites",
        str: 3,
        hp: 10,
        moves: true,
        aggressive: false,
        speed: 10
    },
    {
        name: "Slime",
        char: "S",
        prob: 500,
        attack: "slimes",
        str: 2,
        hp: 40,
        moves: true,
        aggressive: true,
        speed: 60,
    }

];