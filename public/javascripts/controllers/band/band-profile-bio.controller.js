(function () {
    'use strict';

    angular
        .module('app')
        .controller('BandProfileBioController', BandProfileBioController);

    BandProfileBioController.$inject = ['band', '$state', 'Notification'];
    function BandProfileBioController(band, $state, Notification) {
        var vm = this;
        vm.band = band;
        vm.saveBio = saveBio;
        vm.back=back;
        activate();

        ////////////////
        function saveBio() {
            vm.band.$update(function() {
                Notification.success('Bio saved successfully!');
                $state.go('^', null, {reload: true});
            });
        }

        function back() {
            $state.go('^');
        }
        function activate() { }
    }
})();