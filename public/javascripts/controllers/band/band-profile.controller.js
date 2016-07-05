(function () {
    'use strict';

    angular
        .module('app')
        .controller('BandProfileController', BandProfileController);

    BandProfileController.$inject = [
        'band', 'leafletData', '$log',
        'ModalView', '_', 'Band'];
    function BandProfileController(band, leafletData, $log, ModalView, _, Band) {
        var vm = this;
        vm.band = band;
        vm.center = {
            autoDiscover: true,
            zoom: 12
        };
        vm.slides = _.map(vm.band.pictures, function (id) {
            return {
                url: '/api/band/' + band._id + '/pictures/' + id
            };
        });
        vm.mapDefaults = {
            scrollWheelZoom: false,
            doubleClickZoom: false,
            dragging: false
        };
        vm.viewBio = viewBio;
        vm.saveLocation = saveLocation;
        activate();

        ////////////////
        function saveLocation() {
            var checkin = {
                location: vm.currentLocation,
                date: new Date()
            };
            vm.band.lastCheckIn = checkin;
            Band.update(vm.band, function (savedBand) {
                $log.info('location saved, ', savedBand);
                vm.band = savedBand;
            });
        }
        function viewBio() {
            ModalView.open({
                title: vm.band.name,
                subtitle: 'band bio',
                content: vm.band.bio
            });
        }
        function activate() {
            leafletData.getMap('band-profile-map').then(function (map) {
                $log.info('got map');
                vm.map = map;
                map.locate();
                map.on('locationfound', function (evt) {
                    $log.info('location found: ', evt);
                    map.fitBounds(evt.bounds);
                    var marker = L.marker(evt.latlng, { title: 'Current location' }).addTo(map);
                    vm.currentLocation = marker.toGeoJSON().geometry;
                    $log.info('currentLocation: ', vm.currentLocation);
                });
            });
        }
    }
})();