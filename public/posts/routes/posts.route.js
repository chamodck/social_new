/**
 * Created by chamod on 20-Nov-16.
 */
app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('posts',{
                url: '/posts/{id}',
                views: {
                    'Center': {
                        templateUrl: 'posts/views/comments.html',
                        controller: 'PostsCtrl',
                        resolve: {
                            post: ['$stateParams', 'posts', function($stateParams, posts) {
                                return posts.get($stateParams.id);
                            }]
                        }
                    }
                }
            });
        $urlRouterProvider.otherwise('index');
    }]);