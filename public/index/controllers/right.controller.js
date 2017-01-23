app.controller('RightCtrl',[
'$scope',
    'auth','$rootScope','messages',

function($scope,auth,$rootScope,messages){

    $scope.currentUserName = auth.currentUserName();
    

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