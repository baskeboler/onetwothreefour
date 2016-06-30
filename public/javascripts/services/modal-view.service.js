(function () {
    'use strict';

    angular
        .module('app')
        .factory('ModalView', ModalView);

    ModalView.$inject = ['$uibModal'];
    function ModalView($uibModal) {
        var service = {
            open: open
        };

        return service;

        ////////////////
        function open(config) {
            return $uibModal.open({
                templateUrl: '/partials/modals/modal-view.html',
                controller: ['config', '$uibModalInstance',
                    function (config, $modalInstance) {
                        var vm = this;
                        vm.config = config;
                        vm.ok = ok;

                        function ok() {
                            $modalInstance.dismiss('ok');
                        }
                    }],
                controllerAs: 'vm',
                resolve: {
                    config: function () {
                        return config;
                    }
                }
            });
        }
    }
})();