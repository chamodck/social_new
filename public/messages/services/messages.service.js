app.factory('messages', ['$http','auth',function($http,auth){
	var o = {
		messageGroups:[],
        messageGroupsArray:[]
	};

	o.getAllMessageGroups = function() {
		return $http.get('/users/getAllMessageGroups/'+auth.currentUserID()
		).success(function(data){
			angular.copy(data.messageGroups, o.messageGroups);
		});
	};

	o.addNewMessage = function(groupId,text) {
		return $http.put('/messages/addNewMessage/'+auth.currentUserID()+'/'+groupId+'/'+text
		).success(function(data){
            for(var i=0;i<o.messageGroupsArray.length;i++){
                if(groupId==o.messageGroupsArray[i]._id){
                    o.messageGroupsArray[i].messages.push(data);
					return data;
                }
            }
		});
	};

	o.addRecievedMessage=function(message){
		for(var i=0;i<o.messageGroupsArray.length;i++){
			if(message.groupId==o.messageGroupsArray[i]._id){

				o.messageGroupsArray[i].messages.push(message);
                return true;
			}
		}
		return false;
	}

	return o;
}]);