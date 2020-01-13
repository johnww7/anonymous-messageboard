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

const replySchema = new mongoose.Schema({
    //_id: String,
    text: String,
    created_on: {type: Date, default: Date.now},
    delete_password: String,
    reported: Boolean
});

const threadSchema = new mongoose.Schema({
    //_id: String,
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

module.exports = mongoose.model('Thread', threadSchema);
module.exports = mongoose.model('Replies', replySchema);
