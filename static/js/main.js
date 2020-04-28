let vm = new Vue({
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

let reg = /android/g;
if (reg.test(navigator.userAgent.toLowerCase())) {
    document.write(
        '<meta name="viewport" content="width=device-width, height=' + window.innerHeight + ', initial-scale=1.0">'
    );
}
