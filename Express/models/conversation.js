const mongoose=require('mongoose');

const conversationSchema=new mongoose.Schema({
    sender:
        {
        type:String,
        required:true,
    },

    receiver:{
        type:String,
        required:true,
    },

    lastMessage:{
        type:String,
        required:true,
    },
    timestamp:{
        type:Date,
        required:true,
    }
})

module.exports=mongoose.model('Conversation',conversationSchema);