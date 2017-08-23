var app = angular.module('eggInfoApp', []);
app.controller('eggInfoCtrl', function ($scope, $http) {
    $http.get('/api/geocode').then(function (res) {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 8,
            center: new google.maps.LatLng(36.445314, 127.897339),
            mapTypeId: google.maps.MapTypeId.ROEADMAP
        });
        res.data.forEach(function (v) {
            let location = [v.query.address, v.json.results[0].geometry.location.lat, v.json.results[0].geometry.location.lng];
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(location[1], location[2]),
                map: map
            });
            google.maps.event.addListener(marker, 'click', function () {
                var infoWindow = new google.maps.InfoWindow({
                    content: location[0]
                });
                infoWindow.open(map, marker);
                setTimeout(function () {
                    marker.hideInfoWindow();
                },3000)
            })
        });
    })
});