const express=require('express');
const Message=require('../models/messages');
const Conversation=require('../models/conversation');
const router=express.Router();
router.use(express.json())



router.get('/', async (req, res) => {
    const { sender, receiver } = req.query;
  
    try {
        const existingConversation = await Conversation.findOne({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        });

        if (existingConversation) {
    
            return res.status(200).json({ conversation: existingConversation, length: 1 });
        } else {

            return res.status(200).json({ message: 'No existing conversation found', length: 0 });
        }
    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
});



router.post('/', async (req, res) => {
    const { sender, receiver, lastMessage, timestamp } = req.body;

    try {
    
        const existingConversation = await Conversation.findOne({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender } 
            ]
        });

        if (existingConversation) {
        

            return res.status(200).json(existingConversation);
        } else {
            

            const newConversation = new Conversation({
                sender,
                receiver,
                lastMessage: lastMessage || "Text Message",
                timestamp: new Date(timestamp),
            });

            await newConversation.save();
            return res.status(201).json(newConversation);
        }
    } catch (error) {
        console.error("Error creating conversation:", error);
        res.status(500).json({ error: 'Failed to create conversation' });
    }
});




router.get('/convos', async (req, res) => {
    const { user } = req.query;
   // console.log(user);
  
    try {
      const conversations = await Conversation.find({
        $or: [
          { sender: user },
          { receiver: user }
        ]
      });

      //console.log(conversations)
      
      res.status(200).json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  });
  

module.exports = router;




router.get('/:user1/:user2', async(req,res)=>{
    const {user1, user2}=req.params;
    //console.log(user1+" "+user2)

    try{
        const messages=await Message.find({
            $or:[
                {sender: user1, receiver:user2},
                {sender:user2, receiver:user1}
            ]
        })
        .sort({timestamp:1})
        .populate('sender','userName')
        .populate('receiver','userName')

        if(!messages.length)
        {
            return res.status(404).json({error: 'No messages found'});
        }
        res.json(messages);
    }catch(error){
        res.status(500).json({error: 'Failed to fetch messages'});
    }
})


module.exports=router;