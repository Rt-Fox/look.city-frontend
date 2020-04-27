ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
            center: [59.94, 30.32],
            zoom: 10,
            controls: [],
        }),
        // Создадим пользовательский макет ползунка масштаба.
        ZoomLayout = ymaps.templateLayoutFactory.createClass(
            "<div>" +
                "<div id='zoom-in' class='btn' style='margin-top: 200px'>+</div><br>" +
                "<div id='zoom-out' class='btn'>-</div>" +
                "</div>",
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
        ),
        zoomControl = new ymaps.control.ZoomControl({ options: { layout: ZoomLayout } });

    myMap.controls.add(zoomControl);
}
