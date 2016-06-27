(function() {
'use strict';

    angular
        .module('app')
        .controller('BandController', BandController);

    BandController.$inject = ['Band', '$uibModal', '$log'];
    function BandController(Band, $uibModal,$log) {
        var vm = this;
        vm.loadAll = loadAll;
        vm.create = create;
        vm.edit = edit;
        activate();

        ////////////////
        function loadAll() {
            Band.query({}, function(bands) {
                vm.bands = bands;
            });
        }

        function create() {
            var modal = $uibModal.open({
                templateUrl: '/partials/bands/band-dialog.html',
                controller: 'BandDialogController',
                controllerAs: 'vm',
                resolve: {
                    band: function() {
                        return {};
                    }
                }
            });

            modal.result.then(function(newBand) {
                $log.info('Save new band');
                Band.save(newBand, vm.loadAll);
            }, function(reason) {
                $log.info('cancelled, reason: ' + reason);
            });
        }

        function edit(band) {
            var modal = $uibModal.open({
                templateUrl: '/partials/bands/band-dialog.html',
                controller: 'BandDialogController',
                controllerAs: 'vm',
                resolve: {
                    band: function() {
                        return Band.get({id: band._id}).$promise;
                    }
                }
            });

            modal.result.then(function(newBand) {
                $log.info('Save new band');
                Band.update(newBand, vm.loadAll);
            }, function(reason) {
                $log.info('cancelled, reason: ' + reason);
            });
        }
        function activate() { 
            vm.loadAll();
        }
    }
})();