const mongoose=require('mongoose')

const ProfileSchema=new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
        },
        fullName:{
            type:String,
            required:true
        },

        userName:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true
        },
        bio:{
            type:String
        },
        avatar:{
            type:String
        },

        following:[{
            type:String,
            ref:'Profile'
        }],
        followers:[{
            type:String,
            ref:'Profile'
        }]
    }
)

const Profile=mongoose.model('Profile', ProfileSchema)

module.exports=Profile

