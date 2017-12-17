(function() {
    'use strict';

    angular
        .module('app.core.layout', [])
        .config(config);

        config.$inject = ['$stateProvider'];

        function config($stateProvider)
        {
            $stateProvider
                .state('app',
                    {
                        url: '',
                        abstract: true,
                        views:
                        {
                            '':
                            {
                                controller: 'LayoutController',
                                controllerAs: 'ctrlLayout',
                                templateUrl: 'app/core/layout/views/layout.html'
                            }
                        }
                    }
                );
        }
})();