(function () {
    'use strict';

    angular
        .module('app')
        .controller('VenueController', VenueController);

    VenueController.$inject = [
        'Venue', '_', 'Utilities',
        'leafletData', '$uibModal',
        '$log', 'Notification'];
    function VenueController(Venue, _, Utilities, leafletData, $uibModal, $log, Notification) {
        var vm = this;
        vm.loadAll = loadAll;
        vm.total = 0;
        vm.page = 1;
        vm.pageSize = 5;
        vm.maxPageButtons = 5;
        vm.center = {};
        vm.markers = [];
        vm.mapDefaults = {
            scrollWheelZoom: false,
            doubleClickZoom: false,
            dragging: false
        };
        vm.create = create;
        activate();

        ////////////////
        function create() {
            var modal = $uibModal.open({
                templateUrl: '/partials/venue/venue-dialog.html',
                controller: 'VenueDialogController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    venue: function () {
                        return {};
                    }
                }
            });
            modal.result.then(function (newVenue) {
                $log.info('i got a new venue', newVenue);
                Venue.save(newVenue, function () {
                    Notification.success('Venue created successfully!');
                    vm.loadAll();
                }, function () {
                    Notification.error('Error creating venue.');
                });
            }, function (reason) {
                $log.info('dialog was dismissed');
            });
        }
        function activate() {
            vm.loadAll();
            leafletData.getMap('venue-list-map').then(function (map) {
                vm.map = map;
            });
        }

        function loadAll() {
            Venue.query({ page: vm.page, pageSize: vm.pageSize }, function (venues, headers) {
                vm.venues = venues;
                vm.total = headers('X-Total-Elements');
                // vm.page = 0;
                vm.numberOfPages = vm.total / vm.pageSize;
                var locations = _.map(venues, function (venue) {
                    return venue.location;
                });
                var latlngs = _.map(locations, function (l) {
                    return L.latLng(l.coordinates[1], l.coordinates[0]);
                });
                // vm.bb = Utilities.getBoundingBox(locations);
                vm.map.fitBounds(L.latLngBounds(latlngs));
                vm.markers = _.map(vm.venues, function (v) {
                    return {
                        label: {
                            message: v.name
                        },
                        message: v.name,
                        lng: v.location.coordinates[0],
                        lat: v.location.coordinates[1]
                    };
                });
            });
        }
    }
})();