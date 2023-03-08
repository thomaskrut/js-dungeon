export { generateMonstersArray, removeMonster };
import { getRandom, getEmptyPoint } from "./util.js";
import { getMonsterTemplates } from "./templates.js";


function generateMonster(grid, charMap, template) {
    let newMonster = Object.assign({}, template);
    let point = getEmptyPoint(grid, charMap);
    newMonster.x = point.x;
    newMonster.y = point.y;
    newMonster.hp = template.hp + getRandom(5);
    newMonster.moveCounter = getRandom(template.speed);
    return newMonster;
}

function generateMonstersArray(grid, charMap) {
    const templates = getMonsterTemplates();
    let newMonstersArray = [];
    const numberOfMonsters = 10 + getRandom(20);
    for (let i = 0; i < numberOfMonsters; i++) {

        let randomNumber = getRandom(1000);
        
        templates.forEach(monsterTemplate => {
            if (monsterTemplate.prob >= randomNumber) {
                newMonstersArray.push(generateMonster(grid, charMap, monsterTemplate));
            }
        })


    }

    return newMonstersArray;

}

function removeMonster(monsters, monster, grid, charMap) {
    grid[monster.x][monster.y].char = charMap.get('floor');
    monsters.splice(monsters.indexOf(monster), 1);
}