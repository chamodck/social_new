/**
 * Created by chamod on 13-Dec-16.
 */
app.controller('NavCtrl', [
    '$scope',
    'auth',
    function($scope, auth){
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUserName = auth.currentUserName;
        $scope.logOut = auth.logOut;
    }]);