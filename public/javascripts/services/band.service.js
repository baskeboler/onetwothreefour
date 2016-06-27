(function() {
'use strict';

    angular
        .module('app')
        .factory('Band', Band);

    Band.$inject = ['$resource'];
    function Band($resource) {
        var service = $resource('/api/band/:id', {}, {
            query: {
                method: 'GET',
                isArray: true
            },
            save: {method: 'POST'},
            update: {method: 'PUT'},
            remove: {method: 'DELETE'},
            get: {method: 'GET'}
        });
        
        return service;

    }
})();