(function () {
    'use strict';

    angular
        .module('app')
        .factory('GeoCoding', GeoCoding);

    GeoCoding.$inject = ['$http', '$q'];
    function GeoCoding($http, $q) {
        var service = {
            searchCity: searchCity,
            searchCountry: searchCountry
        };

        return service;

        ////////////////
        function searchCity(query) {
            var deferred = $q.defer();
            $http.get('/api/geocoding/search/city/' + query).then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (response) {
                    deferred.resolve([]);
                }
            );
            return deferred.promise;
        }

        function searchCountry(query) {
            var deferred = $q.defer();
            $http.get('/api/geocoding/search/country/' + query).then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (response) {
                    deferred.resolve([]);
                }
            );
            return deferred.promise;
        }
    }
})();