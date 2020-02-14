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
        let findSelectedPost = await threads.findById({_id: data.threadId}, function(err, threadData) {
            if (err) {
                return console.error(err);
            }
            let postDeleteResult = ''
            threadData.replies.forEach(function(post) {
                console.log('Posts: ' + post.id);
                if(post.id === data.replyId && post.delete_password === data.deletePass) {
                    post.text = '[delete]';
                    postDeleteResult = 'success';
                }
                else if(post.id === data.replyID && post.delete_password !== data.deletePass){
                    postDeleteResult = 'incorrect password';
                }
                else {
                    postDeleteResult = 'post does not exist';
                }
            });

            threadData.save();
            return postDeleteResult;
        });
        
        return(findSelectedPost);
        //console.log('Found selected post: ' + JSON.stringify(findSelectedPost[0].replies));        
        
        //console.log('Type of replies: ' + findSelectedPost[0].replies.length)    
       
        /* let selectedPostReplies = findSelectedPost[0].replies;
        for(index of selectedPostReplies) {
            console.log('Each reply: ' + index);
            if(index._id == data.replyId) {
                let positionOfIndex = selectedPostReplies.indexOf(index);
                if(index.delete_password == data.deletePass) {
                    findSelectedPost[0].replies[positionOfIndex].text = '[deleted]';
                    let deletedPost = await findSelectedPost.save();
                    return 'success';
                }
                else {
                    return 'incorrect password';
                }
            }

        }
        return 'invalid reply id';*/
    }
    catch(err){
        console.log('Failed to delete post: ' + err);
    }
}