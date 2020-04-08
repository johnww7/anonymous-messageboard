var mongoose = require('mongoose');

require('dotenv').config()

mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.CONNECTION_STRING, {
    keepAlive: true,
    connectTimeoutMS: 35000,
    socketTimeoutMS: 40000,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db = mongoose. connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function callback() {
    console.log('Connected to database');
});

//Schema for replies to a thread for db
const replySchema = new mongoose.Schema({
    text: String,
    created_on: {type: Date, default: Date.now},
    delete_password: String,
    reported: Boolean
});

//Schema for threads for db
const threadSchema = new mongoose.Schema({
    board: String,
    text: String,
    created_on: {type: Date, default: Date.now},
    bumped_on: {type: Date, default: Date.now},
    reported: Boolean,
    delete_password: String,
    replies: {
        type: [replySchema],
        default: []
    }
});

var threads = mongoose.model('threads', threadSchema);
var replies = mongoose.model('replies', replySchema);

module.exports = {threads, replies};

