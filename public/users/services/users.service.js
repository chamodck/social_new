app.factory('users', ['$http','auth','messages',function($http,auth,messages){
	var o = {
		users: [],
		friends:[]
	};

	o.getAll = function() {
		return $http.get('/users').success(function(data){
			angular.copy(data, o.users);
		});
	};

	o.addAsFriend = function(friend) {
		return $http.put('/users/addAsFriend/' + friend._id + '/'+auth.currentUserID()
		).success(function(data){
			messages.messageGroups.push(data);
		});
	};

	o.getAllFriends = function() {
		return $http.get('/users/getAllFriends/'+auth.currentUserID()
		).success(function(data){
			angular.copy(data.friends, o.friends);
		});
	};

	return o;
}]);