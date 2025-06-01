const mongoose=require('mongoose');

const PostSchema=new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    userName: {
         type:String, 
         ref: 'Profile',
         required: true 
        },
    likes:[{
        type:[String],
        default:[]
    }],
    comments:[
        {
            userName:String,
            comment:String,
            timestamp:{
                type:Date,
                default:Date.now
            }
        }
    ]

})

const PostModel=mongoose.model('posts',PostSchema)

module.exports=PostModel