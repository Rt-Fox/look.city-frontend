//let info = axios.GET().then((response) => response.data)
var myMap;

function init() {
    myMap = new ymaps.Map("map", {
        center: [55.75, 37.61],
        zoom: 10,
        controls: [],
    });

    // Создадим пользовательский макет ползунка масштаба.
    let ZoomLayout = ymaps.templateLayoutFactory.createClass(
        "<ul class='zoom'>" +
            "<li id='zoom-in'>" +
            "<button>+</button>" +
            "</li>" +
            "<li id='zoom-out'>" +
            "<button>&#8722;</button>" +
            "</li>" +
            "</ul>",
        {
            // Переопределяем методы макета, чтобы выполнять дополнительные действия
            // при построении и очистке макета.
            build: function () {
                // Вызываем родительский метод build.
                ZoomLayout.superclass.build.call(this);

                // Привязываем функции-обработчики к контексту и сохраняем ссылки
                // на них, чтобы потом отписаться от событий.
                this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
                this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

                // Начинаем слушать клики на кнопках макета.
                $("#zoom-in").bind("click", this.zoomInCallback);
                $("#zoom-out").bind("click", this.zoomOutCallback);
            },

            clear: function () {
                // Снимаем обработчики кликов.
                $("#zoom-in").unbind("click", this.zoomInCallback);
                $("#zoom-out").unbind("click", this.zoomOutCallback);

                // Вызываем родительский метод clear.
                ZoomLayout.superclass.clear.call(this);
            },

            zoomIn: function () {
                var map = this.getData().control.getMap();
                map.setZoom(map.getZoom() + 1, { checkZoomRange: true });
            },

            zoomOut: function () {
                var map = this.getData().control.getMap();
                map.setZoom(map.getZoom() - 1, { checkZoomRange: true });
            },
        }
    );
    let zoomControl = new ymaps.control.ZoomControl({ options: { layout: ZoomLayout } });
    myMap.controls.add(zoomControl);

    /*     // Создание макета точки
    let pointLayout = ymaps.templateLayoutFactory.createClass(
        "<div class='point'>" +
            "<svg viewBox='0 0 688 1038' xmlns='http://www.w3.org/2000/svg'>" +
            "<g>" +
            "<path class= '{{ properties.class }}' d='M688 343C688 532.434 533.986 686 344 686C154.014 686 0 532.434 0 343C0 153.566 154.014 0 344 0C533.986 0 688 153.566 688 343ZM57.0249 343C57.0249 501.031 185.508 629.141 344 629.141C502.492 629.141 630.975 501.031 630.975 343C630.975 184.969 502.492 56.8591 344 56.8591C185.508 56.8591 57.0249 184.969 57.0249 343Z' fill='#422B1F'/>" +
            "<path class= '{{ properties.class }}' d='M409 165C409 202.555 378.555 233 341 233C303.445 233 273 202.555 273 165C273 127.445 303.445 97 341 97C378.555 97 409 127.445 409 165Z' fill='#422B1F'/>" +
            "<path class= '{{ properties.class }}' d='M563 252C563 289.555 532.555 320 495 320C457.445 320 427 289.555 427 252C427 214.445 457.445 184 495 184C532.555 184 563 214.445 563 252Z' fill='#422B1F'/>" +
            "<path class= '{{ properties.class }}' d='M557 426C557 463.555 526.555 494 489 494C451.445 494 421 463.555 421 426C421 388.445 451.445 358 489 358C526.555 358 557 388.445 557 426Z' fill='#422B1F'/>" +
            "<path class= '{{ properties.class }}' d='M409 513C409 550.555 378.555 581 341 581C303.445 581 273 550.555 273 513C273 475.445 303.445 445 341 445C378.555 445 409 475.445 409 513Z' fill='#422B1F'/>" +
            "<path class= '{{ properties.class }}' d='M261 426C261 463.555 230.555 494 193 494C155.445 494 125 463.555 125 426C125 388.445 155.445 358 193 358C230.555 358 261 388.445 261 426Z' fill='#422B1F'/>" +
            "<path class= '{{ properties.class }}' d='M255 252C255 289.555 224.555 320 187 320C149.445 320 119 289.555 119 252C119 214.445 149.445 184 187 184C224.555 184 255 214.445 255 252Z' fill='#422B1F'/>" +
            "<path class= '{{ properties.class }}' d='M383 342C383 364.644 364.644 383 342 383C319.356 383 301 364.644 301 342C301 319.356 319.356 301 342 301C364.644 301 383 319.356 383 342Z' fill='#422B1F'/>" +
            "<path class= '{{ properties.class }}' d='M117.746 657H116L342.975 1038L571 657H570.304C508.365 706.239 429.674 735.702 344.025 735.702C258.377 735.702 179.686 706.239 117.746 657Z' fill='#422B1F'/>" +
            "<path class= '{{ properties.class }}' d='M236.733 657C270.068 669.556 306.235 676.432 344.025 676.432C381.816 676.432 417.983 669.556 451.317 657H236.733Z' fill='#422B1F'/>" +
            "<text x='50%' y='50%' font-size='360' dominant-baseline='middle' text-anchor='middle' fill='white'>2:28</text>" +
            "</g>" +
            "</svg>" +
            "</div>"
    ); */

    let geoObjects = [];

    // Создание точек
    vm.info.points.forEach((point) => {
        geoObjects.push(
            new ymaps.Placemark(
                // Координаты
                [+point.lat, +point.lon],
                // Контент
                {
                    iconContent: "текст",
                    hasBalloon: false,
                },
                {
                    preset: "islands#blackStretchyIcon",
                    iconColor: "#0095b6",
                }
            )
        );
    });

    /* vm.info.points.forEach((point) => {
        geoObjects.push(
            new ymaps.Placemark(
                // Координаты
                [+point.lat, +point.lon],
                // Контент
                {
                    class: "p" + point.group.slice(0, -1),
                },
                {
                    iconLayout: pointLayout,
                    iconShape: {
                        type: "Rectangle",
                        // Прямоугольник описывается в виде двух точек - верхней левой и нижней правой.
                        coordinates: [
                            [-10, -10],
                            [10, 10],
                        ],
                    },
                }
            )
        );
    }); */

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
        gridSize: 100,
        clusterDisableClickZoom: true,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false,
    });

    // Добавление точек в кластеризатор
    clusterer.add(geoObjects);
    // Добавление кластеризатора в карту
    myMap.geoObjects.add(clusterer);
}
