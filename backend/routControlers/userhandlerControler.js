import Conversation from "../Models/conversationModels.js";
import User from "../Models/userModels.js";
import { io } from "../Socket/socket.js";

export const getUserProfile=async(req,res)=>{
try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    
    if(!user) {
        return res.status(404).send({
            success: false,
            message: "User not found"
        });
    }
    
    res.status(200).send(user);
} catch (error) {
    res.status(500).send({
        success: false,
        message: error
    })
    console.log(error);
}
}

export const getUserBySearch=async(req,res)=>{
try {
    const search = req.query.search || '';
    const currentUserID = req.user._id;
    const user = await User.find({
        $and:[
            {
                $or:[
                    {username:{$regex:'.*'+search+'.*',$options:'i'}},
                    {fullname:{$regex:'.*'+search+'.*',$options:'i'}}
                ]
            },{
                _id:{$ne:currentUserID}
            }
        ]
    }).select("-password")

    res.status(200).send(user)

} catch (error) {
    res.status(500).send({
        success: false,
        message: error
    })
    console.log(error);
}
}


export const getCorrentChatters=async(req,res)=>{
    try {
        const currentUserID = req.user._id;
        const currenTChatters = await Conversation.find({
            participants:currentUserID
        }).sort({
            updatedAt: -1
            });

            if(!currenTChatters || currenTChatters.length === 0)  return res.status(200).send([]);

            const partcipantsIDS = currenTChatters.reduce((ids,conversation)=>{
                const otherParticipents = conversation.participants.filter(id => id !== currentUserID);
                return [...ids , ...otherParticipents]
            },[])

            const otherParticipentsIDS = partcipantsIDS.filter(id => id.toString() !== currentUserID.toString());

            const user = await User.find({_id:{$in:otherParticipentsIDS}}).select("-password").select("-email");

            const users = otherParticipentsIDS.map(id => user.find(user => user._id.toString() === id.toString()));

            res.status(200).send(users)

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}

export const updateProfilePic=async(req,res)=>{
    try {
        const userId = req.user._id;
        console.log('updateProfilePic called, body size:', JSON.stringify(req.body).length);
        const { profilepic } = req.body;

        if (!profilepic) {
            return res.status(400).send({
                success: false,
                message: "No image provided"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilepic },
            { new: true }
        ).select("-password");

        // emit socket event to notify all clients that this user's profile pic changed
        io.emit('profilePicUpdated', {
            userId: userId.toString(),
            profilepic: profilepic
        });

        res.status(200).send({
            success: true,
            message: "Profile picture updated successfully",
            user: updatedUser
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
        console.log('error in updateProfilePic', error);
    }
}