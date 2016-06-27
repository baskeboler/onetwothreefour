(function() {
'use strict';

    angular
        .module('app')
        .controller('BandProfileController', BandProfileController);

    BandProfileController.$inject = ['band', 'leafletData', '$log'];
    function BandProfileController(band, leafletData, $log) {
        var vm = this;
        vm.band = band;
        vm.center = {
            autoDiscover: true,
            zoom: 12
        };
        activate();

        ////////////////

        function activate() {
            leafletData.getMap().then(function(map) {
                $log.info('got map');
                vm.map = map;
            });
         }
    }
})();