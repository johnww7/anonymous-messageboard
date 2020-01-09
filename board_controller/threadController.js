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