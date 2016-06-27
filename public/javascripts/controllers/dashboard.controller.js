(function() {
  angular.module('app')
    .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['Venue', 'Band'];

    function DashboardController(Venue, Band){
      var vm = this;
      vm.title = '1,2,3,4! Dashboard';

      activate();
      function activate() {
        Band.query({}, function(bands) {
          if (bands.length > 0) {
            vm.band = bands[0];
          }
        });
        Venue.query({}, function(venues) {
          if (venues.length > 0) {
            vm.venue = venues[0];
          }
        });
      }      
    }
})();
