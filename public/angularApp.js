var app = angular.module('flapperNews', ['ui.router','angular-web-notification']);

app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUserName = auth.currentUserName;
  $scope.logOut = auth.logOut;
}]);


app.controller('MessageCtrl', [
  '$rootScope','$scope','auth','messages','socket','notification',

  function($rootScope,$scope,auth,messages,socket,notification){

    $scope.messageGroupsArray=messages.messageGroupsArray;
    $scope.gap=275;
    $scope.width='300px';
    $scope.typingTimer;                //timer identifier
    $scope.doneTypingInterval = 5000;  //time in ms, 5 second for example
    $scope.isTyping=false;
    $scope.currentUserID=auth.currentUserID();
    $scope.isHidden=false;

     document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            $scope.isHidden=true;
        } else {
            $scope.isHidden=false;
        }
    });

    $scope.addNewMessageBox=function(messageGroup){

      var maxNumOfMessageBox=Math.floor(($( window ).width()-30)/$scope.gap);

      if(messages.messageGroupsArray.length<maxNumOfMessageBox){
        var margin=(messages.messageGroupsArray.length*$scope.gap).toString()+'px';

        messageGroup.style={'margin-left':margin,'width':$scope.width};
        messages.messageGroupsArray.push(messageGroup);

      }

      //$scope.doneTyping(messageGroup._id);
    }

    $rootScope.$on("addNewMessageBox", function(event, args){
      $scope.addNewMessageBox(args.messageGroup);

    });

    $scope.removeMessageBox=function(messageGroup){
      var len=messages.messageGroupsArray.length;
      var removed=false;
      var i;

      for(i=0;i<len;i++){

        if (removed){
          var margin=messages.messageGroupsArray[i].style['margin-left'].split('px')[0];
          messages.messageGroupsArray[i].style['margin-left']=(parseInt(margin)-$scope.gap).toString()+'px';
        }else{

          if(messageGroup._id==messages.messageGroupsArray[i]._id){
            messages.messageGroupsArray.splice(i, 1);
            removed=true;
            len =len-1;
            i=i-1;
          }
        }
      }
    }

    $rootScope.$on("removeMessageBox", function(event, args){
      $scope.removeMessageBox(args.messageGroup);
    });

    $scope.addNewMessage=function(id){

      if(!$('#text-input-'+id).val() || $('#text-input-'+id).val() === '') { return; }
      messages.addNewMessage(id,$('#text-input-'+id).val()).then(function (response) {
        var message=response.data;
        message.groupId=id;
        socket.emit('chat message',message);
      });

      $('#text-input-'+id).val('');
      //$("#abc").animate({ scrollTop:1000 }, "slow");
      $('#msg-container-base-'+id).animate({scrollTop: $('#msg-container-base-'+id).prop("scrollHeight")}, 500);
      $('#text-input-'+id).focus();
    }

    socket.on('chat message', function(message){

      messages.addRecievedMessage(message);//.then(function (response) {
      console.log(message);
      $scope.$apply();
      $('#msg-container-base-'+message.groupId).animate({scrollTop: $('#msg-container-base-'+message.groupId).prop("scrollHeight")}, 500);
      
       if ($scope.isHidden) {
          
          notification.showNotification(message.text);
        }
      

    });

    $scope.focus=function (id) {
      console.log(id);
      $('#text-input-'+id).focus();
    }

    $scope.typing=function (id) {

      $(window).keydown(function (event) {
        if(event.which===13){
          clearTimeout($scope.typingTimer);
          $scope.typingTimer = setTimeout(function(){$scope.doneTyping(id)}, 0);
          return;
        }
      });

      $('#btn-send-'+id).click(function(){
        clearTimeout($scope.typingTimer);
        $scope.typingTimer = setTimeout(function(){$scope.doneTyping(id)},0);
        return;
      });

      if(!$scope.isTyping){
        $scope.isTyping=true;
        socket.emit('typing',{groupId:id,username:auth.currentUserName()});
      }

      clearTimeout($scope.typingTimer);
      $scope.typingTimer = setTimeout(function(){$scope.doneTyping(id)}, $scope.doneTypingInterval);
    }

    $scope.doneTyping=function(id){
      $scope.isTyping=false;
      socket.emit('doneTyping',id);
    }

    socket.on('typing', function(data){
      console.log('typing');
      $('#typing-'+data.groupId).text(data.username+' is typing...');
      $('#typing-'+data.groupId).show();
      $('#msg-container-base-'+data.groupId).animate({scrollTop: $('#msg-container-base-'+data.groupId).prop("scrollHeight")}, 500);
    });

    socket.on('doneTyping', function(id){
      console.log('doneTyping');
      $('#typing-'+id).hide();
    });

    $(document).on('click', '.panel-heading span.icon_minim', function (e) {
      var $this = $(this);
      if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('fa-minus').addClass('fa-plus');
      } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('fa-plus').addClass('fa-minus');
      }
    });

    // $scope.focus=function(id){
    //   //console.log(id);
    //   var $this = $(this);
    //   if ($('#minim_chat_window_'+id).hasClass('panel-collapsed')) {
    //     console.log(id);
    //     $this.parents('.panel').find('.panel-body').slideDown();
    //     $('#minim_chat_window_'+id).removeClass('panel-collapsed');
    //     $('#minim_chat_window_'+id).removeClass('fa-plus').addClass('fa-minus');
    //   }
    // }

    // $(document).on('focus', '.panel-footer input.chat_input', function (e) {
    //   var $this = $(this);
    //   if ($('#minim_chat_window').hasClass('panel-collapsed')) {
    //     $this.parents('.panel').find('.panel-body').slideDown();
    //     $('#minim_chat_window').removeClass('panel-collapsed');
    //     $('#minim_chat_window').removeClass('fa-plus').addClass('fa-minus');
    //   }
    // });

    // $(document).on('click', '#new_chat', function (e) {
    //   var size = $( ".chat-window:last-child" ).css("margin-left");
    //   size_total = parseInt(size) + 400;
    //   alert(size_total);
    //   var clone = $( "#chat_window_1" ).clone().appendTo( ".container" );
    //   clone.css("margin-left", size_total);
    //
    // });
  }]);


app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider

  $urlRouterProvider.otherwise('index');
}]);