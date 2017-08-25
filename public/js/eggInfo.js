var app = angular.module('eggInfoApp', []);
app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
app.controller('eggInfoCtrl', function ($scope, $http) {
    var map;
    function setMarker(res) {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: new google.maps.LatLng(36.445314, 127.897339),
            mapTypeId: google.maps.MapTypeId.ROEADMAP
        });
        res.forEach(function (v) {
            let location = [v.address, JSON.parse(v.location).lat, JSON.parse(v.location).lng];
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(location[1], location[2]),
                map: map
            });
            google.maps.event.addListener(marker, 'click', function () {
                var infoWindow = new google.maps.InfoWindow({
                    content: `<tag>${v.code}</tag> ${location[0]}`
                });
                infoWindow.open(map, marker);
                setTimeout(function () {
                    marker.hideInfoWindow();
                }, 3000)
            })
        });
    }
    var total;
    $http.get('/api/eggInfoList').then(function (res) {
        total = res.data;
        res.data.map(function (v) {
            v.code = v.code.split(',');
            return v
        });
        $scope.eggs = res.data;
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: new google.maps.LatLng(36.445314, 127.897339),
            mapTypeId: google.maps.MapTypeId.ROEADMAP
        });
        setMarker(res.data);
    });
    $scope.showDetail = function (egg) {
        $('#detailModal').modal('show');
        $scope.eggInfo = egg;
    };
    $scope.search = function (searchKey) {
        if(!searchKey) setMarker(total);
        else setMarker($scope.filteredEggs);
    }
});
app.filter('setImg', function () {
    return function (item, index) {
        let number = index % 10;
        return `egg${number}.png`;
    }
});
app.directive('krInput', ['$parse', function($parse) {
    return {
        priority : 1,
        restrict : 'A',
        compile : function(element) {
            element.on('compositionstart', function(e) {
                e.stopImmediatePropagation();
            });
        },
    };
}]);

$( document ).ready(function() {
    $('.trigger').on('click', function() {
        $('.modal-wrapper').toggleClass('open');
        $('.page-wrapper').toggleClass('blur-it');
        return false;
    });
});