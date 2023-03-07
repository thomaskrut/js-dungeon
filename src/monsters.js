export { generateMonstersArray };
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
    let newMonsters = [];
    const numberOfMonsters = 10 + getRandom(20);
    for (let i = 0; i < numberOfMonsters; i++) {

        let r = getRandom(1000);
        
        templates.forEach(m => {
            if (m.prob >= r) {
                newMonsters.push(generateMonster(grid, charMap, m));
            }
        })


    }

    return newMonsters;

}