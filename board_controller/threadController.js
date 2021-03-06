//const Thread = require('./thread');
//const Replies = require('./thread');
var mongoose = require('mongoose');
var {threads, replies} = require('./thread.js');
var ObjectId= mongoose.Types.ObjectId;

//Creates a new thread on a board
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
        const newThread = await threadData.save();

        return ({
            _id: newThread._id,
            board: newThread.board,
            text: newThread.text,
            created_on: newThread.created_on,
            bumped_on: newThread.bumped_on,
            reported: newThread.reported,
            delete_password: newThread.delete_password,
            replies: newThread.replies
        });

    }
    catch(err){
        console.log('failed to create thread: ' + err);
    }
}

//Creates a reply to the selected thread on a board
exports.createReply = async(data) => {
    try {
        let options = {
            new: true
        };

        let replyToThreadData = {
            text: data.text,
            created_on:  data.createdOn,
            delete_password: data.delete_password,
            reported: data.reported
        };

        let replyToInsert = new replies(replyToThreadData);
        const newReply = await threads.findByIdAndUpdate({_id: new ObjectId(data.threadId)}, 
            { $set:{bumped_on: data.createdOn}, 
            $push:{replies: {$each: [replyToInsert], $sort: {created_on: 1}}}}, 
            options);
        return newReply;
    }
    catch(err) {
        console.log('failed to create reply: ' + err);
    }
}

//Returns 10 threads from the selected board
exports.getBoard = async(data) => {
    try {
        let threadsFromSelectedBoard = await threads.find({board: data}, 
            {delete_password:0, reported:0, __v: 0, 'replies.delete_password':0, 'replies.reported': 0}, 
            {sort: {bumped_on: 1}, limit:10}).slice('replies', 3).exec();
        return threadsFromSelectedBoard    
        
        }
    catch(err) {
        console.log('Failed to return threads: ' + err);
    }
}

//Returns all the replies from the selected thread
exports.getThread = async(data) => {
    try {
        let getSelectedThread = await threads.find({_id: data},
            {delete_password:0, reported:0, __v: 0, 'replies.delete_password':0, 
            'replies.reported': 0}, {sort:{'replies.created_on':1}});
        return getSelectedThread;
    }
    catch(err){
        console.log('Failed to return selected thread: ' + err);
    }
}

//Deletes the selected thread from a board
exports.deleteThread = async(data) => {
    try {
      
        let findSelectedThread = await threads.find({_id: data.threadId});
        if(findSelectedThread[0].delete_password == data.deletePass) {
            let deleteSelectedThread = await threads.findByIdAndDelete({_id: data.threadId});
            return 'success';
        }
        else {
            return 'incorrect password';
        }
    }
    catch(err){
        console.log('Failed to delete thread: ' + err);
    }
}

//Deletes a reply to a thread by replacing it's text with [deleted]
exports.deletePost = async(data) => {
    try{
        let postDeleteResult = '';

        let findSelectedPost = await threads.find({_id: new ObjectId(data.threadId)}, function(err, threadData) {
           
            if (err) {
                return console.error(err);
            }
            for(let post of threadData[0].replies) {
                
                if((post._id).toString() == data.replyId) {
                    if((post.delete_password).toString() === data.deletePass){
                        post.text = '[delete]';
                        postDeleteResult = 'success';
                        break;
                    }    
                    else{
                        postDeleteResult = 'incorrect password';
                        break;
                    }
                }
                else {
                    postDeleteResult = 'post does not exist';
                }
            }

            let saveResult = threadData[0].save(function(err, result) {
                if(err) {return console.err(err)}
                return result;
            });
            
        });
        
        return(postDeleteResult);
    }
    catch(err){
        console.log('Failed to delete post: ' + err);
    }
}

//Reports the selected thread
exports.reportThread = async(data) => {
    try {
       let reportThreadResult = await threads.findByIdAndUpdate(
           {_id: data}, 
           {$set: {reported: true}}, 
           {new: true});
           
        if(reportThreadResult.reported == true){
            return 'success';
        }
        else {
            return 'Thread not found';
        }
    }
    catch(err) {
        console.log('Failed to report thread: ' + err);
    }
}

//Reports a reply to a given thread
exports.reportReply = async(data) => {
    try {
        let postReportResult = false;
        let reportReplyResult = await threads.findById({_id: data.threadId}, function (err, replyData) {
            if (err) {
                return console.error(err);
            }

            replyData.replies.forEach(function(post) {
                if(post.id === data.replyId) {
                    post.reported = true;
                    postReportResult = true;
                    
                }
                
            });
            let saveResult = replyData.save(function(err, result) {
                if(err) {return console.err(err)}
                return result;
            });
        });

        return (postReportResult ? 'success' : 'post does not exist');
        
    }
    catch(err) {
        console.log('Failed to report reply: ' + err);
    }
}

