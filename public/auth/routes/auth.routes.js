app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
	.state('/login', {
	  url: '/login',
	  templateUrl: 'views/login.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth','$window', function($state, auth,$window){
	    if(auth.isLoggedIn()){
			$window.location.href='/';
		}
	  }]
	})
	.state('/register', {
	  url: '/register',
	  templateUrl: 'views/register.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth','$window', function($state, auth,$window){
	    if(auth.isLoggedIn()){
			$window.location.href='/';
	    }
	  }]
	})
}]);