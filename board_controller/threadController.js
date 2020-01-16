//const Thread = require('./thread');
//const Replies = require('./thread');
var {threads, replies} = require('./thread.js');

exports.createThread = async(data) => {
    try{
        let options = {
            upsert: true,
            setDefaultsOnInsert: true,
            new: true
        };
        let threadData = new threads({
            text: data.text,
            created_on: Date.now(),
            bumped_on: Date.now(),
            reported: data.reported,
            delete_password: data.delete_password,
            replies: []
        });
        console.log('Thread data in controller: ' + JSON.stringify(data));
        //const newThread = await Thread.findOneAndUpdate({_id: data.id}, threadData, options);
        const newThread = await threadData.save();

        console.log('Thread created: ' + JSON.stringify(newThread));
        return newThread;
    }
    catch(err){
        console.log('failed to create thread: ' + err);
    }
}

exports.createReply = async(data) => {
    try {
        let options = {
            new: true
        };
        let replyToInsert = new replies(data);
        const newReply = await Thread.findByIdAndUpdate({_id: data.id}, 
            { $set:{bumped_on: Date.now()}, $push:{replies: replyToInsert}, options});
        return newReply;
    }
    catch(err) {
        console.log('failed to create reply: ' + err);
    }
}