(function () {
    'use strict';

    angular
        .module('app')
        .controller('TourDetailsController', TourDetailsController);

    TourDetailsController.$inject = ['GeoCoding', '_', '$log', 'leafletData'];
    function TourDetailsController(GeoCoding, _, $log, leafletData) {
        var vm = this;
        vm.center = {
            autoDiscover: true,
            zoom: 12
        };
        vm.markers = [];
        vm.locations = [];
        vm.search = search;
        vm.onSelect = onSelect;
        vm.tourLegs = [];
        vm.leg = {};
        vm.addLeg = addLeg;
        vm.clearForm = clearForm;
        function onSelect(item, model) {
            $log.info(item, model);
            addMarker(vm.leg.location);
            vm.center.lat = parseFloat(item.lat);
            vm.center.lng = parseFloat(item.lon);
            // vm.map.panTo(vm.center);
        }

        function addLeg() {
            vm.tourLegs.push(angular.copy(vm.leg));
            vm.leg = {};
        }

        function clearForm() {
            vm.leg = {};
        }

        function addMarker(location) {
            var marker = {
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lon),
                label: {
                    message: location.display_name
                }
            };
            vm.markers.push(marker);
        }
        function search(qstr) {
            return GeoCoding.searchCity(qstr).then(function (results) {
                vm.locations = results;
            });
        }
        activate();

        ////////////////

        function activate() {
            leafletData.getMap().then(function (map) {
                vm.map = map;
                $log.info('Got map');
            });
        }
    }
})();