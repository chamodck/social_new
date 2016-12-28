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

mongoose.model('Message', MessageSchema);