const express=require('express')
const mongoose=require('mongoose');
const Profile=require('./models/mongodb');
const PostModel=require('./models/postModel');
const authenticateToken=require('./middlewares/authenticateToken'); 
const Message=require('./models/messages');
const messageRoutes=require('./routes/messages');
const { Server }=require('socket.io');
const http=require('http');
const { CloudinaryStorage }=require('multer-storage-cloudinary');
const cloudinary=require('cloudinary').v2
require('dotenv').config();

const cors=require('cors')
const multer=require('multer')
const path=require('path')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs');
const userRouter=require('./routes/users');



const app=express(); 
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"https://instavillage.netlify.app",
        methods:['GET','POST','OPTIONS'],
        allowedHeaders:['Content-Type', 'Authorization'],
    }
});

const onlineUsers=new Map();

io.on('connection', (socket) => {
    //console.log('User connected:', socket.id);
    socket.on('user_connected', (userName) => {
        onlineUsers.set(userName, socket.id);
    });

    socket.on('send_message', ({ sender, receiver, text }) => {
        //console.log(sender+" "+receiver+" "+text)
        const message=new Message({sender, receiver, text});
        //console.log(message);
        message.save();
        const receiverSocket = onlineUsers.get(receiver);
        if (receiverSocket) {
            io.to(receiverSocket).emit('receive_message', {
                sender, text, timestamp: new Date()
            });
        }
    });

    socket.on('disconnect', () => {
        onlineUsers.forEach((value, key) => {
            if (value === socket.id) {
                onlineUsers.delete(key);
            }
        });
        //console.log('User disconnected:', socket.id);
    });
});


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


mongoose.connect(process.env.MONGODB_URI);
const db=mongoose.connection
db.on('error',(error)=> console.error(error))
db.once('open', ()=>console.log("MongoDb connected"))


app.use(cors())
app.use(express.json())



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let resourceType = 'auto';

        if (file.mimetype.startsWith('video/')) {
            resourceType = 'video';
        } else if (file.mimetype.startsWith('audio/')) {
            resourceType = 'audio';
        } else if (file.mimetype === 'application/pdf') {
            resourceType = 'raw';
        }

        return {
            folder: 'uploads',
            allowed_formats: ['jpg', 'png', 'pdf', 'mp4', 'mp3'],
            public_id: file.fieldname + '_' + Date.now(),
            resource_type: resourceType,
            type: 'upload'
        };
    }
});


const upload=multer({storage:storage});

app.post('/signup',upload.single('avatar'), async(req, res) => {
    //console.log(req.body)
    try{
        const newPassword=await bcrypt.hash(req.body.password, 10)
        await Profile.create({
            email:req.body.email,
            fullName:req.body.fullName,
            userName:req.body.userName,
            bio:req.body.bio,
            avatar:req.file.path,
            password:newPassword
        })
        res.json({status: 'ok'})

    }catch (err) {
        res.json({status: 'error', error: 'Duplicate email'})
    }
})


app.post('/api/login', async (req, res) => {
   //console.log(req.body)
       const user= await Profile.findOne({
            userName:req.body.userName
        })

        if(!user)
            {
                return res.json({status: 'error', error:"Invalid"})
            }

        const isPasswordValid= await bcrypt.compare(req.body.password, user.password)

        if(isPasswordValid)
            {
                const token=jwt.sign(
                    {
                        userName:user.userName,
                        email:user.email,
                },
                process.env.JWT_SECRET)
               return  res.json({"status":"ok", user:token})
            }
        else{
            res.json({"status": "error",user:false})
        }
})


app.get('/profile', authenticateToken, async(req,res)=>{
    try
    {
        //console.log(req.user)
        const userName=await Profile.findOne({userName:req.user.userName})
        if(!userName)
        {
            return res.status(404).json({message:"User not found"});
        }

       // console.log("Username"+userName)

        res.json(userName);
    }catch(error)
    {
       res.status(401).json({message:"Unauthorised"}); 
    }
});


app.post('/upload',upload.single('file'),authenticateToken,(req,res)=>{

    //console.log(req.file);
    //console.log(req.body.caption)
    if(!(req.file || req.body.caption))
    {
        return res.status(400).send('File and caption are required');
    }

    const userName=req.user.userName;

    try
    {
        PostModel.create({
        image: req.file.path,
        caption:req.body.caption,
        userName:userName
    })
    .then((result)=>{
        //console.log("Post created: ",result):
        res.status(201).json(result);
    })
    .catch((err)=>console.log(err))
}
catch(err)
{
    res.status(500).send('server error')
}
});


app.get('/poster',authenticateToken,(req,res)=>{


    const userName=req.user.userName;

    PostModel.find({userName:userName})
    .then((result)=>res.json(result))
    .catch((err)=>console.log(err))
})

app.get('/allPosts', async (req, res) => {
    try {
      const { userId } = req.query;
  
      const loggedInUser = await Profile.findById(userId);
      if (!loggedInUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
      const posts = await PostModel.find({
        $or: [
          { userName: { $in: loggedInUser.following } },        
          { createdAt: { $gte: threeDaysAgo } },               
          { userName: loggedInUser.userName }                    
        ]
      }).sort({ createdAt: -1 });
  
      res.json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });
  
  
  

app.post('/posts/:id/like', async(req,res)=>{
    try{
        const post=await PostModel.findById(req.params.id);

        if(!post){
            return res.status(404).json({message: 'Post not found'});
        }
        
        const userName=req.body.userName
        //console.log(post);

        if(!userName){
            return res.status(400).json({message: 'userName is required'});
        }

        if(post.likes.includes(userName))
        {
            post.likes=post.likes.filter(like=> like !==userName)
        }else{
             //console.log(userName)
            post.likes.push(userName);
        }

        //console.log(post)

        await post.save();
        res.json({likes: post.likes});
    }catch(err){
        res.status(500).json({message: 'Error updating likes'});
    }
})


app.post('/posts/:id/comment', async(req,res)=>{
    try{

        const post=await PostModel.findById(req.params.id);

        //console.log(post)
        const comment={
            userName:req.body.userName,
            comment:req.body.comment,
            timestamp:new Date()
        };

        post.comments.push(comment);

        await post.save();

        res.json({comments: post.comments});
    }catch(err){

        res.status(500).json({message: 'Error adding comment'});
    }
})


app.post('/follow',authenticateToken, async (req,res)=>{
    const followUserId=req.body.followId;
    //console.log(followUserId);


    try{
    
        const loggedInUser=await Profile.findOne({userName: req.user.userName})
       // console.log(loggedInUser)

        if(loggedInUser.following.includes(followUserId)===false){
        
            loggedInUser.following.push(followUserId);
           // console.log(loggedInUser.following)

            const followUser=await Profile.findOne({userName:followUserId});

           // console.log(followUser)
            followUser.followers.push(loggedInUser.userName);

            //console.log(followUser.followers)

            await loggedInUser.save();
            await followUser.save();

            res.status(200).json({message: 'Following'})
        }else{
            res.status(200).json({message: 'Already following'})
        }
    }catch(error){
        res.status(500).json({error: 'Error'});
    }
})


app.post('/unfollow',authenticateToken,async (req,res)=>{
    const unfollowUserName=req.body.unfollowId;
    
    //console.log(unfollowUserName)


    try{

        const loggedInUser=await Profile.findOne({userName: req.user.userName})

        if(loggedInUser.following.includes(unfollowUserName)){
        
            loggedInUser.following=loggedInUser.following.filter(userName=> userName !==unfollowUserName);
            await loggedInUser.save();
            const unfollowUser=await Profile.findOne({userName: unfollowUserName});
            console.log(unfollowUser.userName)
            unfollowUser.followers=unfollowUser.followers.filter(userName=> userName !==loggedInUser.userName);

            //console.log(unfollowUser.followers)
            await unfollowUser.save();

            res.status(200).json({message: 'Unfollowed'})
        }else{
            res.status(400).json({message: 'Not following'})
        }
    }catch(error){
        res.status(500).json({error: 'Error'});
    }
})

app.get('/search', async(req,res)=>{
    try{
        const query=req.query.q;

        //console.log(query);

        if(!query){
            return res.status(400).json({messasge: 'Search query is required'});
        }

        const users=await Profile.find({
            userName:{$regex:query, $options: 'i'}
        })

        res.json({users});
    
    }catch(err){
        res.status(500).json({message: 'Error performing search'});
    }
})



app.get('/profile/followers', async (req, res) => {
    const { askedUser } = req.query; 


    try {
        
        const user = await Profile.findOne({ userName:askedUser  });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        res.json({ followers: user.followers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving followers' });
    }
});


app.get('/profile/following', async (req, res) => {
    const { askedUser } = req.query; 

    //console.log(askedUser)

    try {

        const user = await Profile.findOne({ userName: askedUser  });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

       //console.log(user.following)    
        res.json({ following: user.following });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving following' });
    }
});

app.delete('/posts/:id',authenticateToken, async(req,res)=>{
    const loggedInUser=req.user.userName;
    try{
        const post =await PostModel.findById(req.params.id)
        if(!post){
            return res.status(404).json({message: 'Post not found'});
        }

        if(post.userName!==loggedInUser)
        {
            return res.status(403).json({message: 'You are not authorized to delete this post'});
        }

        await PostModel.findByIdAndDelete(post);

        res.status(200).json({message: 'Post deleted successfully'});
    }catch(error){
        console.log('Error deleting post:',error);
        res.status(500).json({message: 'Server error'});
    }
})


app.use('/users',userRouter)
app.use('/conversations',messageRoutes)
app.use(authenticateToken)


server.listen(3000,()=>{
    console.log("server connected")
});
