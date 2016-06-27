(function() {
'use strict';

    angular
        .module('app')
        .factory('Venue', Venue);

    Venue.$inject = ['$resource'];
    function Venue($resource) {
        var service = $resource('/api/venue/:id', {}, {
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

        ////////////////
        function exposedFn() { }
    }
})();