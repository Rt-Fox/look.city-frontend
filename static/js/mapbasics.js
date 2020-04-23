var myMap;

ymaps.ready(init);

function init() {
    // Создание экземпляра карты и его привязка к контейнеру с
    // заданным id ("map").
    myMap = new ymaps.Map(
        "map",
        {
            center: [55.76, 37.64],
            zoom: 10,
        },
        {
            searchControlProvider: "yandex#search",
        }
    );
}
