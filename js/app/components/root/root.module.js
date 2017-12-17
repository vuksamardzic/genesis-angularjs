(function() {
    'use strict';

    angular
        .module('app.components.root', [])
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider)
    {
        $stateProvider
            .state('root',
                {
                    url: '/',
                    parent: 'app',
                    views:
                    {
                        'main-layout':
                        {
                            controller: 'RootController',
                            controllerAs: 'ctrlRoot',
                            templateUrl: 'app/components/root/views/root.html'
                        }
                    }
                }
            );
    }
})();
