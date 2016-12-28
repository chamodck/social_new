app.controller('PostsCtrl', [
'$scope',
'posts',
'post',
'auth',
function($scope,posts,post,auth){
	
	$scope.post = post;
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.posts = posts.posts;

	$scope.addPost = function(){
	  if(!$scope.title || $scope.title === '') { return; }
	  posts.create({
	    title: $scope.title,
	    link: $scope.link,
	  });
	  $scope.title = '';
	  $scope.link = '';
	};


	$scope.incrementUpvotes = function(post) {
		posts.upvote(post);
	};
	
	$scope.addComment = function(){
	  if($scope.body === '') { return; }
	  posts.addComment(post._id, {
	    body: $scope.body,
	    author: 'user',
	  }).success(function(comment) {
	    $scope.post.comments.push(comment);
	  });
	  $scope.body = '';
	};

	$scope.incrementCommentUpvotes = function(comment){
	  posts.upvoteComment(post, comment);
	};

}]);