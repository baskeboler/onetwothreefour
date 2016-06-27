(function () {
    'use strict';

    angular
        .module('app')
        .controller('VenueController', VenueController);

    VenueController.$inject = ['Venue'];
    function VenueController(Venue) {
        var vm = this;
        vm.loadAll = loadAll;
        vm.total = 0;
        vm.page = 1;
        vm.pageSize = 5;
        vm.maxPageButtons = 10;

        activate();

        ////////////////

        function activate() {
            vm.loadAll();
        }

        function loadAll() {
            Venue.query({ page: vm.page, pageSize: vm.pageSize }, function (venues, headers) {
                vm.venues = venues;
                vm.total = headers('X-Total-Elements');
                // vm.page = 0;
                vm.numberOfPages = vm.total / vm.pageSize;
            });
        }
    }
})();