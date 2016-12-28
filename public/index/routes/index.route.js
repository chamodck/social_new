app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
	  .state('index',{
	  	url: '/index',
	    views: {
	      'Left': {
	        templateUrl: 'index/views/left.html',
	        controller: 'LeftCtrl',
			resolve: {
				postPromise: ['users', function(users){
					return users.getAll();
				}]
			}
	      },
	      'Center': {
	        templateUrl: 'index/views/center.html' ,
	        controller: 'CenterCtrl',
	        resolve: {
			    postPromise: ['posts', function(posts){
			      return posts.getAll();
			    }]
			  }
	      },
	      'Right': {
	        templateUrl:'index/views/right.html' ,
	        controller: 'RightCtrl',
			  resolve: {
				  postPromise: ['messages', function(messages) {
					  return messages.getAllMessageGroups();
				  }]
			  }
	      }
	    }
	  })
    
}]);