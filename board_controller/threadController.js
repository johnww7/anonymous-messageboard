const Thread = require('/thread.js');
const Reply = require('/thread.js')

exports.createThread = async(data) => {
    try{
        let options = {
            upsert: true,
            setDefaultsOnInsert: true,
            new: true
        };
        const newThread = await Thread.findOneAndUpdate({_id: data._id}, data, options);
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
        let replyToInsert = new Reply(data);
        const newReply = await Thread.findByIdAndUpdate({_id: data._id}, 
            { $set:{bumped_on: Date.now()}, $push:{replies: replyToInsert}, options});
        return newReply;
    }
    catch(err) {
        console.log('failed to create reply: ' + err);
    }
}