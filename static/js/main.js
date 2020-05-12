Vue.options.delimiters = ['[[', ']]'];
let vm = new Vue({
    el: "#root",

    data: {
        colors: {
            "1900e": "black",
            "1910e": "black",
            "1920e": "black",
            "1930e": "brown",
            "1940e": "darkOrange",
            "1950e": "yellow",
            "1960e": "olive",
            "1970e": "green",
            "1980e": "darkGreen",
            "1990e": "night",
            "2000e": "violet",
            "2010e": "pink",
            "2020e": "red",
        },
        menu: false,
        map: true,
        addButtons: false,
        info: null,
        search: false,
        feedback: false,
        pointPopUp: false,
        pointsInfo: null
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
        feedbackPopUp(e) {
            let container = document.querySelector(".menu_open.mn"),
                x = container.firstChild.firstChild,
                icon = document.querySelector(".message").firstChild;

            if (e.target == container || e.target == x || e.target == icon) {
                this.feedback = !this.feedback;
            }
        },
        showPopUp(ids) {
            this.pointPopUp = !this.pointPopUp;
            this.pointsInfo = ids;
        },

        closePopUp(e) {
            let back = document.querySelector("#pointPop"),
                x = document.querySelector("#x");

            if (e.target == back || e.target == x) {
                this.pointPopUp = !this.pointPopUp;
            }
        },
    },

    mounted() {
        // Получение дату
        axios.get("/api/points").then(function (response) {
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
