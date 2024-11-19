
//Usando LEAFLET para el mapa
//const map = L.map('map-template').setView([51.505, -0.09], 13);

// initialize the map on the "map" div with a given center and zoom
var map = L.map('map-template', {
    center: [51.505, -0.09],
    zoom: 13
});

//L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png')

//L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);