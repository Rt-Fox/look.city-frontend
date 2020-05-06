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

    // Создание точек
    vm.info.points.forEach((point) => {
        myMap.geoObjects.add(
            new ymaps.Placemark(
                // Координаты
                [+point.lat, +point.lon],
                // Контент
                {
                    balloonContent: "-",
                },
                {
                    preset: "islands#dotIcon",
                    iconColor: "#735184",
                }
            )
        );
    });
}
