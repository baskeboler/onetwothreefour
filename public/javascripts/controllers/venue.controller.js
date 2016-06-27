(function () {
    'use strict';

    angular
        .module('app')
        .controller('VenueController', VenueController);

    VenueController.$inject = ['Venue', '_', 'Utilities', 'leafletData' ];
    function VenueController(Venue, _, Utilities,leafletData) {
        var vm = this;
        vm.loadAll = loadAll;
        vm.total = 0;
        vm.page = 1;
        vm.pageSize = 5;
        vm.maxPageButtons = 5;
        vm.center = {};
        vm.markers = [];
        activate();

        ////////////////

        function activate() {
            vm.loadAll();
            leafletData.getMap().then(function (map) {
                vm.map = map;
            });
        }

        function loadAll() {
            Venue.query({ page: vm.page, pageSize: vm.pageSize }, function (venues, headers) {
                vm.venues = venues;
                vm.total = headers('X-Total-Elements');
                // vm.page = 0;
                vm.numberOfPages = vm.total / vm.pageSize;
                var locations = _(venues).map(function (venue) {
                    return venue.location;
                });
                vm.bb = Utilities.getBoundingBox(locations);
                vm.map.fitBounds([vm.bb.topLeft, vm.bb.bottomRight]);
                vm.markers = _.map(vm.venues, function (v) {
                    return {
                        label: {
                            message: v.name
                        },
                        message: v.name,
                        lng: v.location.coordinates[1],
                        lat: v.location.coordinates[0]
                    };
                });
            });
        }
    }
})();