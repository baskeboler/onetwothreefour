(function () {
    'use strict';

    angular
        .module('app')
        .controller('VenueDialogController', VenueDialogController);

    VenueDialogController.$inject = ['venue', 'leafletData', '$uibModalInstance'];
    function VenueDialogController(venue, leafletData, $modalInstance) {
        var vm = this;
        vm.venue = venue;
        vm.center={};
        vm.marker={};
        vm.ok=ok;
        vm.cancel=cancel;
        activate();

        ////////////////
        function ok() {
            $modalInstance.close(vm.venue);
        }

        function cancel() {
            $modalInstance.dismiss('cancelled');
        }
        function activate() {
            leafletData.getMap('venue-dialog-map').then(function (map) {
                vm.map = map;
                new L.Control.GeoSearch({
                    provider: new L.GeoSearch.Provider.OpenStreetMap(),
                    // position: 'topcenter',
                    // retainZoomLevel: true,
                    showPopup: true
                }).addTo(vm.map);
                vm.map.on('geosearch_foundlocations', function(evt) {
                    console.log('found locations', evt);
                    vm.location = evt.Locations[0];
                    vm.venue.location = {
                        type: 'Point',
                        coordinates: [parseFloat(vm.location.X), parseFloat(vm.location.Y)]
                    };
                });
            });
        }
    }
})();