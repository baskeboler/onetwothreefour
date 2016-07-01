(function () {
    'use strict';

    angular
        .module('app')
        .factory('Confirmation', Confirmation);

    Confirmation.$inject = ['$uibModal', '$log'];
    function Confirmation($uibModal, $log) {
        var service = {
            confirm: confirm
        };

        return service;

        ////////////////
        function confirm(config) {
            var configObj = {};
            if (angular.isObject(config)) {
                configObj.title = config.title || 'Confirmation';
                configObj.message = config.message || 'Are you sure?';
            }
            else if (angular.isString(config)) {
                configObj = {
                    title: 'Confirmation',
                    message: config
                };
            } else $log.error('Bad confirmation config.');
            var modal = $uibModal.open({
                templateUrl: '/partials/modals/confirmation.html',
                size: 'sm',
                controller: ConfirmationCtrl,
                controllerAs: 'vm',
                resolve: {
                    config: function () {
                        return configObj;
                    }
                }
            });
            return modal.result;
        }
    }

    ConfirmationCtrl.$inject = ['config', '$uibModalInstance'];
    function ConfirmationCtrl(config, $modalInstance) {
        var vm = this;
        vm.config = config;
        vm.ok = ok;
        vm.cancel = cancel;

        function ok() {
            $modalInstance.close(true);
        }

        function cancel() {
            $modalInstance.dismiss('cancelled');
        }
    }
})();