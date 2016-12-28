app.controller('LeftCtrl',[
'$scope',
'users',
    'posts',
function($scope,users,posts){
  $scope.users=users.users;

    $scope.addAsFriend=function (friend) {
        users.addAsFriend(friend);
    }
}]);