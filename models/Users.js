var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true},
  hash: String,
  salt: String,
  friends: [{_id: { type: String, ref: 'User' }}],
  messageGroups : [{ type: mongoose.Schema.Types.ObjectId, ref: 'MessageGroup' }]
});

UserSchema.methods.setPassword = function(password){
  console.log("req.body.username");
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};


mongoose.model('User', UserSchema);