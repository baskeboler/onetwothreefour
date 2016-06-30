(function () {
    'use strict';

    angular
        .module('app')
        .controller('BandProfileController', BandProfileController);

    BandProfileController.$inject = ['band', 'leafletData', '$log', 'ModalView', '_'];
    function BandProfileController(band, leafletData, $log, ModalView, _) {
        var vm = this;
        vm.band = band;
        vm.center = {
            autoDiscover: true,
            zoom: 12
        };
        vm.slides = _.map(_.range(vm.band.pictures.length), function (index) {
            return {
                url: '/api/band/' + band._id + '/pictures/' + index
            };
        });
        vm.viewBio = viewBio;
        activate();

        ////////////////
        function viewBio() {
            ModalView.open({
                title: vm.band.name,
                subtitle: 'band bio',
                content: vm.band.bio
            });
        }
        function activate() {
            leafletData.getMap().then(function (map) {
                $log.info('got map');
                vm.map = map;
            });
        }
    }
})();