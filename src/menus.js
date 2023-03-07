export { menus };

const menus = {
    selectedMenuItem: 0,
    selectedItem: null,
    numberOfMenuItems: 0,
    currentMenu: null,

    createMenu: function (menuItems, title) {
        this.selectedMenuItem = 0;
        this.numberOfMenuItems = menuItems.length;
        this.currentMenu = { menuItems: menuItems, title: title, selectedMenuItem: this.selectedMenuItem };
    },

    getCurrentMenu: function () {
        this.currentMenu.selectedMenuItem = this.selectedMenuItem;
        return this.currentMenu;
    },

    moveUp: function () {
        if (this.selectedMenuItem > 0) this.selectedMenuItem--;
    },

    moveDown: function () {
        if (this.selectedMenuItem < this.numberOfMenuItems - 1) this.selectedMenuItem++;
    }

}

