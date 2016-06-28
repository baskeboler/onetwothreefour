(function () {
    'use strict';
    angular.module('app', [
        'ngResource',
        'ngAnimate',
        'ngSanitize',
        'ui.select',
        'ui.router',
        'ui.bootstrap',
        'nemLogging',
        'ui-leaflet',
        'ui.calendar'
    ]);

    angular.module('app')
        .run(function () {
            console.log('Running app');
        })
        .config(configureStates)
        .constant('_', window._);

    configureStates.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider']


    function configureStates($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/dashboard');
        // Use this to enable HTML5 mode
        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });
        // Use this to set the prefix for hash-bangs
        // Example: example.com/#!/page
        $locationProvider.hashPrefix('!');

        $stateProvider
            .state('app', {
                abstract: true,
                views: {
                    'menuView@': {
                        templateUrl: '/partials/menu.html',
                        controller: 'MenuController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.dashboard', {
                url: '/dashboard',
                views: {
                    'contentView@': {
                        templateUrl: '/partials/dashboard.html',
                        controller: 'DashboardController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.band', {
                url: '/bands',
                views: {
                    'contentView@': {
                        templateUrl: '/partials/bands/band.html',
                        controller: 'BandController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.bandprofile', {
                url: '/band/:bandId',
                views: {
                    'contentView@': {
                        templateUrl: '/partials/bands/band-profile.html',
                        controller: 'BandProfileController',
                        controllerAs: 'vm',
                        resolve: {
                            band: ['$stateParams', 'Band', function($stateParams, Band) {
                                return Band.get({id: $stateParams.bandId}).$promise;
                            }]
                        }
                    }
                }  
            })
            .state('app.tourdetails', {
                url: '/tourdetails',
                views: {
                    'contentView@': {
                        templateUrl: '/partials/bands/tour/details.html',
                        controller: 'TourDetailsController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.venue', {
                url: '/venues' ,
                views: {
                    'contentView@': {
                        templateUrl: '/partials/venue/venue.html',
                        controller: 'VenueController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.venueprofile', { 
                url: '/venue/:venueId',
                views: {
                    'contentView@': {
                        templateUrl: '/partials/venue/venue-profile.html',
                        controller: 'VenueProfileController',
                        controllerAs: 'vm',
                        resolve: {
                            venue: ['$stateParams', 'Venue', function($stateParams, Venue) {
                                return Venue.get({id: $stateParams.venueId}).$promise;
                            }]
                        }
                    }
                }  
            });
    }

})();
