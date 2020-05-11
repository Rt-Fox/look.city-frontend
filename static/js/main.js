let vm = new Vue({
    el: "#root",

    data: {
        menu: false,
        map: true,
        addButtons: false,
        info: null,
        search: false,
        feedback: false,
    },

    methods: {
        changeMenuState() {
            this.menu = !this.menu;
            this.map = !this.map;
        },
        changeButtons() {
            this.addButtons = !this.addButtons;
        },
        searchAnim() {
            this.search = !this.search;
        },
        feedbackPopUp() {
            this.feedback = !this.feedback;
        },
    },

    mounted() {
        // Получение дату
        axios.get("../points.json").then(function (response) {
            vm.info = response.data;
            ymaps.ready(init);
        });
    },
});

let reg = /android/g;
if (reg.test(navigator.userAgent.toLowerCase())) {
    document.write(
        '<meta name="viewport" content="width=device-width, height=' + window.innerHeight + ', initial-scale=1.0">'
    );
}
