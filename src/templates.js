export { getMonsterTemplates, getItemTemplates, loadTemplates };

var itemTemplates = [];
var monsterTemplates = [];

function getItemTemplates() {
        return itemTemplates;
}

function getMonsterTemplates() {
        return monsterTemplates;
}

function loadTemplates(source) {

    fetch(source)
        .then((response) => response.json())
        .then(data => {

            itemTemplates = data['items'];
            monsterTemplates = data['monsters'];
        
        });
}