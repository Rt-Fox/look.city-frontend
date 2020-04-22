new Vue({
    el: "#root",

    data: {
        menu: false,
        map: true,
        addButtons: false,
    },

    methods: {
        changeMenuState() {
            this.menu = !this.menu;
            this.map = !this.map;
        },
        changeButtons() {
            this.addButtons = !this.addButtons;
        },
    },
});
