let vm = new Vue({
    el: "#root",

    data: {
        menu: false,
        map: true,
        addButtons: false,
        info: null,
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

    mounted() {
        axios.get("/points.json").then(function (response) {
            vm.info = response.data;
        });
    },
});

let reg = /android/g;
if (reg.test(navigator.userAgent.toLowerCase())) {
    document.write(
        '<meta name="viewport" content="width=device-width, height=' + window.innerHeight + ', initial-scale=1.0">'
    );
}
