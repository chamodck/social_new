/**
 * Created by chamod on 15-Dec-16.
 */
var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    from : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text : String,
    created_at : { type : Date, default: Date.now }
});

var MessageGroupSchema = new mongoose.Schema({
    name : {type:String,default:''},
    members : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    created_at : { type : Date, default: Date.now },
    messages :[MessageSchema],
    type : String
});

mongoose.model('Message', MessageSchema);
mongoose.model('MessageGroup', MessageGroupSchema);