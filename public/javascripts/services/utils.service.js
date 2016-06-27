(function () {
    'use strict';

    angular
        .module('app')
        .factory('Utilities', Utilities);

    Utilities.$inject = ['_'];
    function Utilities(_) {
        var service = {
            getBoundingBox: getBoundingBox
        };

        return service;

        ////////////////
        function getBoundingBox(locations) {
            var maxX = _(locations).map(function (loc) {
                return loc.coordinates[0];
            }).max(),
                minX = _(locations).map(function (loc) {
                    return loc.coordinates[0];
                }).min(),
                maxY = _(locations).map(function (loc) {
                    return loc.coordinates[1];
                }).max(),
                minY = _(locations).map(function (loc) {
                    return loc.coordinates[1];
                }).min();

            var topLeft = [minX - 0.01, minY - 0.01],
                bottomRight = [maxX + 0.01, maxY + 0.01];
            return {
                topLeft: topLeft,
                bottomRight: bottomRight
            };
        }
    }
})();