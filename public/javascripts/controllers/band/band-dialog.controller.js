(function() {
'use strict';

    angular
        .module('app')
        .controller('BandDialogController', BandDialogController);

    BandDialogController.$inject = ['$uibModalInstance', 'band', 'GeoCoding', '$q', '_'];
    function BandDialogController($uibModalInstance, band, GeoCoding, $q, _) {
        var vm = this;
        vm.band = band;
        vm.ok = ok;
        vm.cancel = cancel;
        vm.searchCity = searchCity;
        vm.searchCountry=searchCountry;
        activate();

        ////////////////
        function ok() {
            $uibModalInstance.close(vm.band);
        }

        function cancel(){
            $uibModalInstance.dismiss('cancel');
        }

        function searchCity(query) {
            var deferred = $q.defer();
            GeoCoding.searchCity(query).then(function (results) {
                var filtered = _(results).filter(function(r) {
                    return !_.isUndefined(r.address.city);
                }).map(function(r) {
                  return {
                      name: r.address.city
                  }  
                }).toArray().uniq();
                deferred.resolve(filtered);
            });

            return deferred.promise;
        }

        function searchCountry(query) {
            return GeoCoding.searchCountry(query);
        }
        function activate() { 
            
        }
    }
})();