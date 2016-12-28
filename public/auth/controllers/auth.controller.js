app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
  '$window' ,
function($scope, $state, auth,$window){
  $scope.user = {};
  

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $window.location.href='/';
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $window.location.href='/';
    });
  };
}])