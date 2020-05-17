Vue.options.delimiters = ["[[", "]]"];
let vm = new Vue({
    el: "#root",

    data: {
        colors: {
            Multiple: "red",
            "1900e": "black",
            "1910e": "black",
            "1920e": "black",
            "1930e": "brown",
            "1940e": "darkOrange",
            "1950e": "yellow",
            "1960e": "olive",
            "1970e": "green",
            "1980e": "darkGreen",
            "1990e": "blue",
            "2000e": "night",
            "2010e": "violet",
            "2020e": "pink",
        },
        menu: false,
        map: true,
        addButtons: false,
        info: null,
        search: false,
        feedback: false,
        pointPopUp: false,
        pointFragments: null,
        fragmentNumber: null,
        currentFragment: null,
        moreThanOne: false,
        popUpText: false,
        isFilter: false,
        filterType: null,
        currentFilter: null,
        chosenFiter: null,
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
        showPopUp(ids, i) {
            this.pointFragments = ids;
            this.fragmentNumber = i;

            this.info.fragments.forEach((fragment) => {
                if (fragment.id == this.pointFragments[i]) {
                    this.currentFragment = fragment;
                }
            });

            if (this.pointFragments.length > 1) {
                this.moreThanOne = true;
            } else {
                this.moreThanOne = false;
            }

            if (this.currentFragment.short_description == null) {
                this.popUpText = false;
            } else {
                this.popUpText = true;
            }
            this.pointPopUp = true;
        },

        closePopUp(e) {
            let back = document.querySelector("#pointPop"),
                x = document.querySelector("#x");

            if (e.target == back || e.target == x) {
                this.pointPopUp = false;
            }
        },

        nextFragment() {
            if (this.fragmentNumber >= this.pointFragments.length - 1) {
                this.fragmentNumber = 0;
            } else {
                this.fragmentNumber += 1;
            }
            this.showPopUp(this.pointFragments, this.fragmentNumber);
        },

        previousFragment() {
            if (this.fragmentNumber <= 0) {
                this.fragmentNumber = this.pointFragments.length - 1;
            } else {
                this.fragmentNumber -= 1;
            }
            this.showPopUp(this.pointFragments, this.fragmentNumber);
        },

        movieFilter() {
            this.filterType = "movies";
            this.currentFilter = this.info.filters[this.filterType];

            this.isFilter = true;
        },

        filterChoosen(index) {
            this.chosenFiter = index;
            this.closeFilter();
        },

        closeFilter() {
            this.isFilter = false;
            this.map = true;
        },
    },

    mounted() {
        // Получение даты
        axios.get("/points.json").then(function (response) {
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
