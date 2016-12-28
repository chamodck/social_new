app.controller('RightCtrl',[
'$scope',
    'users','$rootScope','messages',

function($scope,users,$rootScope,messages){

    //$scope.friends=users.friends;
    $scope.messageGroups=messages.messageGroups;
    //console.log(users.messageGroups);

    $scope.addNewMessageBox = function(messageGroup) {
        $rootScope.$emit("addNewMessageBox", {messageGroup:messageGroup});
    }

    $scope.removeMessageBox = function(messageGroup) {
        $rootScope.$emit("removeMessageBox", {messageGroup:messageGroup});
    }

    // $scope.focus = function(id) {
    //
    //     $rootScope.$emit("focus", {id:messageGroup._id});
    // }
}
]);