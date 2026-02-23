import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js";
import { getReciverSocketId,io } from "../Socket/socket.js";

const filterBadWords = (text) => {
    const badWords = [
        'damn', 'hell', 'crap', 'ass', 'bitch', 'bastard', 'shit', 'fuck',
        'asshole', 'prick', 'dick', 'cock', 'pussy', 'motherfucker', 'fucker'
    ];
    
    // Words to exclude from filtering
    const exceptions = [
        'hello', 'class', 'bass', 'pass', 'grass', 'glass', 'mass', 'compass',
        'embarrass', 'assassin', 'harassment', 'cockroach', 'cocktail', 'cocky',
        'dickens', 'dickinsons'
    ];
    
    let filtered = text;
    badWords.forEach(word => {
        // Use word boundaries to match only whole words
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        filtered = filtered.replace(regex, (match) => {
            // Check if the matched word is in the exceptions list
            if (exceptions.includes(match.toLowerCase())) {
                return match;
            }
            return '*'.repeat(word.length);
        });
    });
    return filtered;
};

export const sendMessage =async(req,res)=>{
try {
    const {messages} = req.body;
    const {id:reciverId} = req.params;
    const senderId = req.user._conditions._id;

    // Apply profanity filter
    const filteredMessage = filterBadWords(messages);

    let chats = await Conversation.findOne({
        participants:{$all:[senderId , reciverId]}
    })

    if(!chats){
        chats = await Conversation.create({
            participants:[senderId , reciverId],
        })
    }

    const newMessages = new Message({
        senderId,
        reciverId,
        message:filteredMessage,
        conversationId: chats._id
    })

    if(newMessages){
        chats.messages.push(newMessages._id);
    }

    await Promise.all([chats.save(),newMessages.save()]);

     //SOCKET.IO function 
     const reciverSocketId = getReciverSocketId(reciverId);
     if(reciverSocketId){
        io.to(reciverSocketId).emit("newMessage",newMessages)
     }

    res.status(201).send(newMessages)

} catch (error) {
    res.status(500).send({
        success: false,
        message: error
    })
    console.log(`error in sendMessage ${error}`);
}
}


export const getMessages=async(req,res)=>{
try {
    const {id:reciverId} = req.params;
    const senderId = req.user._conditions._id;

    const chats = await Conversation.findOne({
        participants:{$all:[senderId , reciverId]}
    }).populate("messages")

    if(!chats)  return res.status(200).send([]);
    const message = chats.messages;
    res.status(200).send(message)
} catch (error) {
    res.status(500).send({
        success: false,
        message: error
    })
    console.log(`error in getMessage ${error}`);
}
}
