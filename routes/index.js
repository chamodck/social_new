var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var Message = mongoose.model('Message');
var MessageGroup = mongoose.model('MessageGroup');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

// auth.restrict = function(req, res, next){
//     if (!req.session.userid) {
//         req.session.redirectTo = '/account';
//         res.redirect('/auth/#/login');
//     } else {
//         next();
//     }
// };

/* GET home page. */
router.get('/', /*auth.restrict,*/function(req, res, next) {
  res.render('pages/index', { title: 'index' });
});

router.get('/posts', function(req, res, next) {
	Post.find(function(err, posts){
	   	if(err){ return next(err); }

	    res.json(posts);
	});
});

router.post('/posts',auth, function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;
  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

router.param('post', function(req, res, next, id) {
	var query = Post.findById(id);

	query.exec(function (err, post){
	    if (err) { return next(err); }
	    if (!post) { return next(new Error('can\'t find post')); }

	    req.post = post;
	    return next();
	});
});

router.param('comment', function(req, res, next, id) {
	var query = Comment.findById(id);

	query.exec(function (err, comment){
	    if (err) { return next(err); }
	    if (!comment) { return next(new Error('can\'t find comment')); }

	    req.comment = comment;
	    return next();
	});
});

router.get('/posts/:post', function(req, res, next) {
	req.post.populate('comments', function(err, post) {
	    if (err) { return next(err); }

	    res.json(post);
	});
});

router.put('/posts/:post/upvote',auth, function(req, res, next) {
	req.post.upvote(function(err, post){
	    if (err) { return next(err); }

	    res.json(post);
	});
});

router.post('/posts/:post/comments',auth, function(req, res, next) {
	var comment = new Comment(req.body);
	comment.post = req.post;
	comment.author = req.payload.username;
	comment.save(function(err, comment){
	    if(err){ return next(err); }

	    req.post.comments.push(comment);
	    req.post.save(function(err, post) {
	      if(err){ return next(err); }

	      res.json(comment);
	    });
	});
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
	req.comment.upvote(function(err, comment){
	    if (err) { return next(err); }
	    res.json(comment);
	});
});


router.get('/auth', function(req, res, next) {
	res.render('pages/auth', { title: 'auth' });
});

router.post('/auth/register', function(req, res, next){

	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	var user = new User();

	user.username = req.body.username;
	user.setPassword(req.body.password)

	user.save(function (err,user){
		if(err){ return next(err); }

		return res.json({token: user.generateJWT()})
	});
});

router.post('/auth/login', function(req, res, next){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	passport.authenticate('local', function(err, user, info){
		if(err){ return next(err); }

		if(user){
			return res.json({token: user.generateJWT()});
		} else {
			return res.status(401).json(info);
		}
	})(req, res, next);
});

router.get('/users', function(req, res, next) {
	User.find(function(err, users){
		if(err){ return next(err); }


		res.json(users);
	});
});

router.param('friend', function(req, res, next, id) {
	var query = User.findById(id);

	query.exec(function (err, friend){
		if (err) { return next(err); }
		if (!friend) { return next(new Error('can\'t find friend')); }

		req.friend = friend;

		return next();

	});
});

router.param('currentUser', function(req, res, next, id) {
	var query = User.findById(id);

	query.exec(function (err, currentUser){
		if (err) { return next(err); }
		if (!currentUser) { return next(new Error('can\'t find friend')); }

		req.currentUser = currentUser;

		return next();

	});
});

router.put('/users/addAsFriend/:friend/:currentUser',function(req, res, next) {

	var currentUser=req.currentUser;
	var friend=req.friend;

	// var firstMessage=new Message({
	// 	text : 'Hello world',
	// 	from : currentUser
	// })
	
	var Group=new MessageGroup({
		type:'private',
		friendname1:currentUser.username,
		friendname2:friend.username,
		members:[currentUser,friend],
		messages:[],
		name : ''
	})

	Group.save(function(err, group) {
		if(err){ return next(err); }
		Group=group;
	});

	currentUser.messageGroups.push(Group);
	currentUser.friends.push(friend);
	currentUser.save(function(err, user) {
		if(err){ return next(err); }

	});

	friend.messageGroups.push(Group);
	friend.friends.push(currentUser);
	friend.save(function(err, user) {
		if(err){ return next(err); }
	});

	res.json(Group);
});

router.param('currentUserID', function(req, res, next, id) {
	req.currentUserID = id;
	return next();
});

router.get('/users/getAllFriends/:currentUserID', function(req, res, next) {
	User
		.findById(req.currentUserID)
		.populate('friends._id') // only works if we pushed refs to children
		.exec(function (err, user) {
			//if (err) return handleError(err);
			if (err) { return next(err); }
			res.json(user);
		})
});

router.get('/users/getAllMessageGroups/:currentUserID', function(req, res, next) {
	User
		.findById(req.currentUserID)
		.populate('messageGroups') // only works if we pushed refs to children
		.exec(function (err, messageGroups) {
			//if (err) return handleError(err);
			if (err) { return next(err); }

			res.json(messageGroups);

		})
});

router.param('messageGroup', function(req, res, next, id) {
	var query = MessageGroup.findById(id);

	query.exec(function (err, messageGroup){
		if (err) { return next(err); }
		if (!messageGroup) { return next(new Error('can\'t find messageGroup')); }

		req.messageGroup = messageGroup;

		return next();

	});
});

router.param('text', function(req, res, next, text) {
	req.text = text;
	return next();
});

router.put('/messages/addNewMessage/:currentUser/:messageGroup/:text',function(req, res, next) {
	var currentUser=req.currentUser;
	var messageGroup=req.messageGroup;
	var text=req.text;

	var message=new Message({
		text : text,
		from : currentUser
	})

	messageGroup.messages.push(message);
	messageGroup.save(function(err, group) {
		if(err){ return next(err); }

	});

	res.json(message);
});

module.exports = router;