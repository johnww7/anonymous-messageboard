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
            reported: data.reported
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

exports.deleteThread = async(data) => {
    try {
        let findSelectedThread = await threads.find({_id: data.threadId});
            //where('delete_password').equals(data.deletePass).exec();
        console.log('Found selected: ' + JSON.stringify(findSelectedThread));
        if(findSelectedThread[0].delete_password == data.deletePass) {
            let deleteSelectedThread = await threads.findByIdAndDelete({_id: data.threadId});
            console.log('Result of delete: ' + deleteSelectedThread);
            return {result: 'success'};
        }
        else {
            return {result: 'incorrect password'};
        }
    }
    catch(err){
        console.log('Failed to delete thread: ' + err);
    }
}

exports.deletePost = async(data) => {
    try{
        let postDeleteResult = '';
        let findSelectedPost = await threads.findById({_id: data.threadId}, function(err, threadData) {
            if (err) {
                return console.error(err);
            }
            //let postDeleteResult = ''
            threadData.replies.forEach(function(post) {
                console.log('Posts: ' + post.id + ' dataID: ' + data.replyId );
                console.log('Type post delete password: ' + typeof(post.delete_password));
                console.log('Type of deletePass: ' + typeof(data.deletePass));
                if(post.id === data.replyId) {
                    if(post.delete_password === data.deletePass){
                        post.text = '[delete]';
                        postDeleteResult = 'success';
                        console.log('succes');
                    }    
                    else{
                        postDeleteResult = 'incorrect password';
                        console.log('incorrect password');
                    }
                }
                else {
                    postDeleteResult = 'post does not exist';
                    console.log('post does not exist');
                }
            });

            let saveResult = threadData.save(function(err, result) {
                if(err) {return console.err(err)}
                return result;
            });
            //return saveResult;
        });
        
        console.log('Result of what happened: ' + postDeleteResult);
        
        return(postDeleteResult);
    }
    catch(err){
        console.log('Failed to delete post: ' + err);
    }
}

exports.reportThread = async(data) => {
    try {
       let reportThreadResult = await threads.findByIdAndUpdate(
           {_id: data}, 
           {$set: {reported: true}}, 
           {new: true});
        console.log('Result of reporting thread: ' + JSON.stringify(reportThreadResult));

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

exports.reportReply = async(data) => {
    try {
        let postReportResult = '';
        let reportReplyResult = await threads.findById({_id: data.threadId}, function (err, replyData) {
            if (err) {
                return console.error(err);
            }
            console.log('What we found: ' + JSON.stringify(replyData));
            replyData.replies.forEach(function(post) {
                console.log('Each reply: ' + JSON.stringify(post))
                if(post.id === data.replyId) {
                    post.reported = true;
                    postReportResult = 'success';
                    console.log('succes');
                }
                else {
                    postReportResult = 'post does not exist';
                    console.log('post does not exist');
                }
            });
            let saveResult = replyData.save(function(err, result) {
                if(err) {return console.err(err)}
                return result;
            });
        });
        console.log('Result of reporting reply: ' + JSON.stringify(reportReplyResult));

        return postReportResult;
    }
    catch(err) {
        console.log('Failed to report reply: ' + err);
    }
}

