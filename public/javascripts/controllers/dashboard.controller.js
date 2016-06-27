(function() {
  angular.module('app')
    .controller('DashboardController', DashboardController);

    DashboardController.$inject = [];

    function DashboardController(){
      var vm = this;
      vm.title = '1,2,3,4! Dashboard';
      
    }
})();
