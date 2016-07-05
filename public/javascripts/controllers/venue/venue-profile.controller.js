(function () {
    'use strict';

    angular
        .module('app')
        .controller('VenueProfileController', VenueProfileController);

    VenueProfileController.$inject = ['Venue', 'venue', '$log', '$http', '$q'];
    function VenueProfileController(Venue, venue, $log,$http, $q) {
        var vm = this;
        vm.venue = venue;
        vm.center = {
            zoom: 18,
            lat: venue.location.coordinates[1],
            lng: venue.location.coordinates[0]
        };
        vm.markers = [{
            lat: venue.location.coordinates[1],
            lng: venue.location.coordinates[0],
            message: venue.name, focus: true
        }];
        vm.mapDefaults = {
            scrollWheelZoom: false,
            doubleClickZoom: false,
            dragging: false
        };
        vm.eventSources = [];
        vm.alertEventOnClick = alertEventOnClick;
        vm.alertOnDrop = alertOnDrop;
        vm.alertOnResize = alertOnResize;
        vm.dayRender = dayRender;
        vm.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                header: {
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                dayClick: vm.alertEventOnClick,
                eventDrop: vm.alertOnDrop,
                eventResize: vm.alertOnResize,
                dayRender: vm.dayRender
            }
        };
        vm.bands=[];
        activate();

        ////////////////
        function bandsNearby() {
            var deferred = $q.defer();
            var url = '/api/venue/' + vm.venue._id + '/bandsNearby';
            $http.get(url).then(function(response) {
                deferred.resolve(response.data);
            }, function(reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        }

        function dayRender(date, cell) {
            $log.info('dayRender: ', date, ', ', cell);
            $(cell).append('<span class="badge">3 bands</span>');
        }
        function alertEventOnClick() {
            $log.info('day clicked');
        }

        function alertOnDrop() {

        }

        function alertOnResize() {

        }
        function activate() { 
            bandsNearby().then(function(bands){
                vm.bands=bands;
            });
        }
    }
})();