/**
 * Created by chamod on 20-Nov-16.
 */
app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('messages',{
                url: '/messages',
                views: {
                    'Center': {
                        templateUrl: 'messages/views/message.html',
                        controller: 'MessageCtrl as vm'
                    }
                }
            });
        $urlRouterProvider.otherwise('index');
    }]);