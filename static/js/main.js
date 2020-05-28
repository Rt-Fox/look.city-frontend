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
        filterNames: {
            0: "АКТЕРЫ",
            1: "РЕЖИССЕРЫ",
            2: "ПЕРСОНАЖИ",
            3: "ФИЛЬМЫ",
            4: "ГОДЫ",
            5: "ЖАНРЫ",
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
        filteredData: [],
        filterOpen: false,
        filterChosen: null,
        filterType: null,
        firstPopUp: false,
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

        // Открытие нужного Поп-апа фрагмента
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

        // Закрытие поп-апа фрагмента
        closePopUp(e) {
            let back = document.querySelector("#pointPop"),
                x = document.querySelector("#x");

            if (e.target == back || e.target == x) {
                this.pointPopUp = false;
            }
        },

        closeFirstPopUp(e) {
            let firstBg = document.querySelector("#first_pop"),
                firstX = document.querySelector("#first_x");
            if (e.target == firstBg || e.target == firstX) {
                this.firstPopUp = false;
            }
        },

        // Следующий фрагмент в поп-апе точки
        nextFragment() {
            if (this.fragmentNumber >= this.pointFragments.length - 1) {
                this.fragmentNumber = 0;
            } else {
                this.fragmentNumber += 1;
            }
            this.showPopUp(this.pointFragments, this.fragmentNumber);
        },

        // Предыдущий фрагмент в поп-апе точки
        previousFragment() {
            if (this.fragmentNumber <= 0) {
                this.fragmentNumber = this.pointFragments.length - 1;
            } else {
                this.fragmentNumber -= 1;
            }
            this.showPopUp(this.pointFragments, this.fragmentNumber);
        },

        // Показывает другие точки фрагмента
        OtherFragments(val) {
            this.filterType = 3;
            this.filterData({ id: val });
        },

        // Передает все данные по выбранному фильтру и выбирает функцию фильтрации
        filterData(val) {
            myMap.setCenter([55.75, 37.61], 10);
            this.filterChosen = val["id"];
            if (this.filterType == 4) {
                window.history.pushState(
                    {},
                    document.title,
                    window.location.pathname + "?t=" + this.filterType + "&i=" + val["name"]
                );
            } else if (!!this.filterType) {
                window.history.pushState(
                    {},
                    document.title,
                    window.location.pathname + "?t=" + this.filterType + "&i=" + val["id"]
                );
            }
            switch (this.filterType) {
                case 0:
                    this.filterDataActors();
                    break;
                case 1:
                    this.filterDataProducers();
                    break;
                case 2:
                    this.filterDataHeroes();
                    break;
                case 3:
                    this.filterDataMovie();
                    break;
                case 4:
                    this.filterChosen = val["name"];
                    this.filterDataYear();
                    break;
                case 5:
                    this.filterDataGenre();
                    break;
                case 6:
                    this.filterDataFragment();
                    break;
                case 7:
                    this.filterDataPoint();
            }

            this.pointPopUp = false;
            this.filterOpen = false;
            this.map = true;
        },

        // Открывает список фильтров, закрывает карту
        OpenFilter(t) {
            this.pointPopUp = false;
            this.filterType = t;
            this.filterOpen = true;
            this.map = false;
        },
        // Закрывает список фильтров, открывает карту
        closeFilter() {
            this.pointPopUp = false;
            this.filterType = null;
            this.filterOpen = false;
            this.map = true;
        },
        // Сброс фильтров
        FilterRemoven() {
            this.filterType = null;
            this.filterChosen = null;
            this.filteredData = [];

            myMap.setCenter([55.75, 37.61], 10);
            window.history.pushState({}, document.title, window.location.pathname);
            this.updateMap(this.info.points);
        },

        // Находит все точки с заданным фрагментом обновляет карту
        filterDataFragment() {
            this.filteredData = [];
            this.info.points.forEach((point) => {
                for (let i = 0; i < point.fragments_id.length; i++) {
                    if (point.fragments_id[i] == this.filterChosen) {
                        filteredData.push(point);
                    }
                }
            });
            this.updateMap(this.filteredData);
        },

        // Находит точку
        filterDataPoint() {
            this.filteredData = [];
            let matchedPoint = this.info.points.find((point) => {
                return point.id == this.filterChosen;
            });

            this.filteredData.push(matchedPoint);

            this.updateMap(this.filteredData);
        },
        // Фильтрует дату по фильтру кино
        filterDataMovie() {
            this.filteredData = [];
            let matchedFragments = this.info.fragments.filter((fragment) => {
                if (fragment.movie.id == this.filterChosen) {
                    return true;
                }
            });

            let temporary_data = Object.assign([], this.info.points);

            matchedFragments.forEach((fragment) => {
                for (let a = 0; a < temporary_data.length; a++) {
                    for (let i = 0; i < temporary_data[a].fragments_id.length; i++) {
                        if (temporary_data[a].fragments_id[i] == fragment.id) {
                            this.filteredData.push(temporary_data[a]);
                            temporary_data.splice(a, 1);
                            break;
                        }
                    }
                }
            });

            this.updateMap(this.filteredData);
        },

        // Фильтрует дату по фильтру жанра
        filterDataGenre() {
            this.filteredData = [];
            let matchedFragments = this.info.fragments.filter((fragment) => {
                for (let i = 0; i < fragment.genre.length; i++) {
                    if (fragment.genre[i].id == this.filterChosen) {
                        return true;
                    }
                }
            });

            let temporary_data = Object.assign([], this.info.points);

            matchedFragments.forEach((fragment) => {
                for (let a = 0; a < temporary_data.length; a++) {
                    for (let i = 0; i < temporary_data[a].fragments_id.length; i++) {
                        if (temporary_data[a].fragments_id[i] == fragment.id) {
                            this.filteredData.push(temporary_data[a]);
                            temporary_data.splice(a, 1);
                            break;
                        }
                    }
                }
            });

            this.updateMap(this.filteredData);
        },

        // Фильтрует дату по фильтру жанра
        filterDataActors() {
            this.filteredData = [];
            let matchedFragments = this.info.fragments.filter((fragment) => {
                for (let i = 0; i < fragment.actors.length; i++) {
                    if (fragment.actors[i].id == this.filterChosen) {
                        return true;
                    }
                }
            });

            let temporary_data = Object.assign([], this.info.points);

            matchedFragments.forEach((fragment) => {
                for (let a = 0; a < temporary_data.length; a++) {
                    for (let i = 0; i < temporary_data[a].fragments_id.length; i++) {
                        if (temporary_data[a].fragments_id[i] == fragment.id) {
                            this.filteredData.push(temporary_data[a]);
                            temporary_data.splice(a, 1);
                            break;
                        }
                    }
                }
            });

            this.updateMap(this.filteredData);
        },

        // Фильтрует дату по персонажам
        filterDataHeroes() {
            this.filteredData = [];
            let matchedFragments = this.info.fragments.filter((fragment) => {
                for (let i = 0; i < fragment.heroes.length; i++) {
                    if (fragment.heroes[i].id == this.filterChosen) {
                        return true;
                    }
                }
            });

            let temporary_data = Object.assign([], this.info.points);

            matchedFragments.forEach((fragment) => {
                for (let a = 0; a < temporary_data.length; a++) {
                    for (let i = 0; i < temporary_data[a].fragments_id.length; i++) {
                        if (temporary_data[a].fragments_id[i] == fragment.id) {
                            this.filteredData.push(temporary_data[a]);
                            temporary_data.splice(a, 1);
                            break;
                        }
                    }
                }
            });

            this.updateMap(this.filteredData);
        },

        // Фильтрует дату по фильтру года
        filterDataYear() {
            this.filteredData = [];
            let matchedFragments = this.info.fragments.filter((fragment) => {
                if (~~(fragment.year / 10) == this.filterChosen.slice(0, -2)) {
                    return true;
                }
            });

            let temporary_data = Object.assign([], this.info.points);

            matchedFragments.forEach((fragment) => {
                for (let a = 0; a < temporary_data.length; a++) {
                    for (let i = 0; i < temporary_data[a].fragments_id.length; i++) {
                        if (temporary_data[a].fragments_id[i] == fragment.id) {
                            this.filteredData.push(temporary_data[a]);
                            temporary_data.splice(a, 1);
                            break;
                        }
                    }
                }
            });

            this.updateMap(this.filteredData);
        },

        // Фильтрует дату по режиссерам
        filterDataProducers() {
            this.filteredData = [];
            let matchedFragments = this.info.fragments.filter((fragment) => {
                if (fragment.producer.id == this.filterChosen) {
                    return true;
                }
            });

            let temporary_data = Object.assign([], this.info.points);

            matchedFragments.forEach((fragment) => {
                for (let a = 0; a < temporary_data.length; a++) {
                    for (let i = 0; i < temporary_data[a].fragments_id.length; i++) {
                        if (temporary_data[a].fragments_id[i] == fragment.id) {
                            this.filteredData.push(temporary_data[a]);
                            temporary_data.splice(a, 1);
                            break;
                        }
                    }
                }
            });

            this.updateMap(this.filteredData);
        },

        // Обновление карты (на вход список точек)
        updateMap(points) {
            myMap.geoObjects.removeAll();
            geoObjects = [];
            points.forEach(function add_placemark(point) {
                new_placemark = new ymaps.Placemark(
                    // Координаты
                    [+point.lat, +point.lon],
                    // Контент
                    {
                        iconContent: point.text,
                        hasBalloon: false,
                    },
                    {
                        preset: "islands#" + vm.colors[point.group] + "StretchyIcon",
                        iconColor: vm.colors[point.group],
                    }
                );
                new_placemark.events.add("click", function () {
                    vm.showPopUp(point.fragments_id, 0);
                });
                geoObjects.push(new_placemark);
            });

            // Создание кластеризатора
            let clusterer = new ymaps.Clusterer({
                // Макет метки кластера pieChart.
                clusterIconLayout: "default#pieChart",
                // Радиус диаграммы в пикселях.
                clusterIconPieChartRadius: 25,
                // Определяет наличие поля balloon.
                hasBalloon: false,
                // Группировать только по одиаковым координатам
                groupByCoordinates: false,
                // Размер ячейки кластеризатора
                gridSize: 50,
                clusterDisableClickZoom: true,
            });

            clusterer.events.add("click", (e) => {
                myMap.setCenter(e.get("coords"), myMap.getZoom() + 2);
            });
            // Добавление точек в кластеризатор
            clusterer.add(geoObjects);
            // Добавление кластеризатора в карту
            myMap.geoObjects.add(clusterer);
        },

        updateMapQuerry() {
            let queryString = window.location.search;
            if (queryString) {
                let urlParams = new URLSearchParams(queryString);
                let type = urlParams.get("t");
                this.filterType = +type;
                let value = urlParams.get("i");
                let filterValues = {
                    id: +value,
                    name: value,
                };
                this.filterData(filterValues);
            } else {
                this.updateMap(this.info.points);
            }
        },

        searchFunc() {
            let input = document.querySelector("#searchInput"),
                value = input.value;

            input.value = "";
            ymaps
                .geocode(value, {
                    result: 1,
                })
                .then((res) => {
                    let coords = res.geoObjects.get(0).geometry.getCoordinates();
                    myMap.setCenter(coords, 14);
                });
        },
    },

    mounted() {
        // Получение даты
        axios.get("/points.json").then(function (response) {
            vm.info = response.data;
            ymaps.ready(init);

            setTimeout(function () {
                fadeOutnojquery(hellopreloader);
            }, 1000);
        });

        console.log(document.cookie);
        let cookieDate = new Date();
        cookieDate.setTime(cookieDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        let visit_reg = /visited=true/g;
        if (!visit_reg.test(document.cookie)) {
            this.firstPopUp = true;
        }
        document.cookie = "visited=true; expires=" + cookieDate.toGMTString();
    },
});

let reg = /android/g;
if (reg.test(navigator.userAgent.toLowerCase())) {
    document.write(
        '<meta name="viewport" content="width=device-width, height=' + window.innerHeight + ', initial-scale=1.0">'
    );
}
