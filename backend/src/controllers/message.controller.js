import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) =>{
    // We want to fetch every single user but not ourselfs, we want to see it in the contact list.
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password");// Find the user where != the same as the current id, 
        // and also we want to fetch everything except the passwords, we dont want to send it to the client.

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in  getUsersForSidebar: ", error);
        res.status(500).json({ error: "Internal server error"});
    }
};

/* Next we hace to get the messages between two users */

export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId}= req.params;
        const myId = req.user._id;

        const messages =  await Message.find({
            $or: [
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })
    res.status(200).json(message);    
    } catch (error) {
        console.error("Error in getMessages controller: ", error);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const sendMessage = async(req, res) => {
try {
    const {text, image} = req.body;
    const {id: receiverId} = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if(!imageUrl){
        // Upload the base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;

    }


    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
    });

    await newMessage.save();
    res.status(201).json(newMessage); 
    /* TODO:  RealTime Funcionality will be here => socket.io */

} catch (error) {
    console.error("Error in sendMessage controller: ", error);
    res.status(500).json({ error: "Internal server error"});
}
};