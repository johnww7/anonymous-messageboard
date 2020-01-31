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
            board: data.board,
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

        let replyToThreadData = {
            text: data.text,
            created_on:  data.createdOn,
            delete_password: data.delete_password,
            reported: data
        };

        let replyToInsert = new replies(replyToThreadData);
        const newReply = await threads.findByIdAndUpdate({_id: data.threadId}, 
            { $set:{bumped_on: data.createdOn}, 
            $push:{replies: {$each: [replyToInsert], $sort: {created_on: 1}}}}, 
            options);
        return newReply;
    }
    catch(err) {
        console.log('failed to create reply: ' + err);
    }
}

exports.getBoard = async(data) => {
    try {
        console.log('what is data: ' + data);
        let threadsFromSelectedBoard = await threads.find({board: data}, 
            {delete_password:0, reported:0, __v: 0, 'replies.delete_password':0, 'replies.reported': 0}, 
            {sort: {bumped_on: 1}, limit:10}).slice('replies', 3).exec();
        return threadsFromSelectedBoard    
        
        }
    catch(err) {
        console.log('Failed to return threads: ' + err);
    }
}

exports.getThread = async(data) => {
    try {
        console.log('get thread data: ' + JSON.stringify(data));
        let getSelectedThread = await threads.find({_id: data},
            {delete_password:0, reported:0, __v: 0, 'replies.delete_password':0, 
            'replies.reported': 0}, {sort:{'replies.created_on':1}});
        return getSelectedThread;
    }
    catch(err){
        console.log('Failed to return selected thread: ' + err);
    }
}

