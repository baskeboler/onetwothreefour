(function () {
    'use strict';

    angular
        .module('app')
        .controller('BandPicturesController', BandPicturesController);

    BandPicturesController.$inject = ['band', '_', 'Upload', '$log', '$q', '$state', '$http'];
    function BandPicturesController(band, _, Upload, $log, $q, $state, $http) {
        var vm = this;
        vm.band = band;
        vm.uploads = [];
        vm.progress = [];
        vm.uploadUrl = '/api/band/' + band._id + '/pictures';
        vm.pictureIndexes = _.range(vm.band.pictures.length);
        vm.imageLinks = _.map(vm.pictureIndexes, function (index) {
            var r = _.random(1, 111111);
            return '/api/band/' + vm.band._id + '/pictures/' + index + '?size=medium&r=' + r;
        });
        vm.upload = upload;
        vm.remove = remove;
        activate();

        ////////////////
        function remove(index) {
            $http.delete(vm.imageLinks[index])
                .then(function (response) {
                    $log.info('got updated band: ', response.data);
                    vm.band=response.data;
                    vm.imageLinks.splice(index, 1);
                    vm.pictureIndexes =_.range(vm.band.pictures.length);
                    resolveLinks();
                });
        }

        function resolveLinks() {
            vm.imageLinks = _.map(vm.pictureIndexes, function (index) {
                var r = _.random(1, 111111);
                return '/api/band/' + vm.band._id + '/pictures/' + index + '?size=medium&r=' + r;
            });
        }

        function upload() {
            if (vm.uploads && vm.uploads.length > 0) {
                var promises = [];
                for (var i = 0; i < vm.uploads.length; ++i) {
                    var deferred = $q.defer();
                    promises.push(deferred.promise);
                    Upload.upload({
                        url: vm.uploadUrl,
                        data: {
                            image: vm.uploads[i]
                        }
                    }).then(
                        function (resp) {
                            $log.info('upload successful!');
                            deferred.resolve(true);
                        }, function (resp) {
                            $log.error('Error uploading: ', resp.status);
                            deferred.resolve(false);
                        }, function (evt) {
                            var progress = parseInt(100.0 * evt.loaded / evt.total);
                            vm.progress[i] = progress;
                            $log.info('progress: ' + progress + '% ' + evt.config.data.image.name);
                        }
                        );
                }
                $q.all(promises).then(function () {
                    $log.info('all downloads finished');
                    $state.reload();
                });
            }
        }
        function activate() { }
    }
})();