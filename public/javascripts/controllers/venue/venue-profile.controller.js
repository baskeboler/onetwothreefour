(function () {
    'use strict';

    angular
        .module('app')
        .controller('VenueProfileController', VenueProfileController);

    VenueProfileController.$inject = ['Venue', 'venue', '$log'];
    function VenueProfileController(Venue, venue, $log) {
        var vm = this;
        vm.venue = venue;
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
        activate();

        ////////////////

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
        function activate() { }
    }
})();