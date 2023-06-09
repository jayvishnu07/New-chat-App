const ChatModel = require("../Models/ChatModel");
const UserModel = require("../Models/UserModel");

const getChat = async (req, res) => {
    const { oppositeUserId } = req.body;
    console.log(oppositeUserId, 'kicking');

    if (!oppositeUserId) {
        console.log("id not given");
    }

    let chat = await ChatModel.find({
        isGroupChat: false,
        $and: [
            {
                users: { $elemMatch: { $eq: req.currentUser.id } }
            },
            {
                users: { $elemMatch: { $eq: oppositeUserId } }
            }
        ]
    })
        .populate('users', '-password')
        .populate('recentMessage')

    console.log('chat.length', chat);
    if (chat) {
        chat = await UserModel.populate(chat, {
            path: 'recentMessage.sender',
            select: 'name mail_id profilePic'
        })
        console.log('chat.length', chat.length);
        if (chat.length > 0) {
            return res.status(200).send(chat[0])
        }
    }


    console.log(req.currentUser.id);
    console.log(oppositeUserId);
    try {
        const createdChat = await ChatModel.create({
            chatName: 'Direct Chat',
            isGroupChat: false,
            users: [req.currentUser.id, oppositeUserId]
        })
        const wholeChat = await ChatModel.find({ _id: createdChat.id }).populate('users', '-password')
        res.status(200).send(wholeChat)

    } catch (error) {
        console.log('error from getChat', error.message);
    }

}

const getAllChats = async (req, res) => {

    try {
        ChatModel.find({ users: { $elemMatch: { $eq: req.currentUser.id } } })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('recentMessage')
            .sort({ updatedAt: -1 })
            .then(async (result) => {
                result = await UserModel.populate(result, {
                    path: 'recentMessage.sender',
                    select: 'name mail_id profilePic'
                })
                res.status(200).send(result)
            });

    } catch (error) {
        res.status(401).send('error from getAllChats', error.message)
    }

}

const createGroupChat = async (req, res) => {
    const { groupName, groupProfile, users } = req.body;
    if (!groupName || !users) {
        return res.status(400).send('Fill out group name and select users')
    }
    let usersArray = JSON.parse(users);
    usersArray.push(req.currentUser.id);

    if (usersArray.length < 2) {
        return res.status(400).send("Minimun two people required to start a group")
    }

    try {
        const groupchat = await ChatModel.create({
            chatName: groupName,
            isGroupChat: true,
            users: usersArray,
            groupProfile,
            groupAdmin: req.currentUser.id
        })

        const wholeChat = await ChatModel.find({ _id: groupchat._id })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')

        res.status(200).send(wholeChat);

    } catch (error) {
        res.status(401).send('error from createGroupChat', error.message)
    }
}

const editChatName = async (req, res) => {
    let { chatId, newGroupName } = req.body;

    try {

        const group = await ChatModel.findByIdAndUpdate(chatId,
            {
                chatName: newGroupName,
            },
            { new: true })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')

        if (!group) {
            return res.status(404).send("Group Not Found")
        }
        res.status(200).send(group)
    } catch (error) {
        console.log('error from editChatName', error.message);
    }
}

const editChatProfile = async (req, res) => {
    let { chatId, groupProfile } = req.body;

    try {

        const group = await ChatModel.findByIdAndUpdate(chatId,
            {
                groupProfile
            },
            { new: true })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')

        if (!group) {
            return res.status(404).send("Group Not Found")
        }
        res.status(200).send(group)
    } catch (error) {
        console.log('error from editChatProfile', error.message);
    }
}

// const renameGroupChat = async (req, res) => {
//     const { chatId, newGroupName } = req.body;

//     const group = await ChatModel.findByIdAndUpdate(chatId, { chatName: newGroupName }, { new: true })
//         .populate('users', '-password')
//         .populate('groupAdmin', '-password')

//     if (!group) {
//         return res.status(404).send("Group Not Found")
//     }
//     res.status(200).send(group)
// }

// const addFriendToGroup = async (req, res) => {
//     const { chatId, idOfUserToBeAdded } = req.body;

//     const group = await ChatModel.findByIdAndUpdate(chatId, { $push: { users: idOfUserToBeAdded } }, { new: true })
//         .populate('users', '-password')
//         .populate('groupAdmin', '-password')

//     if (!group) {
//         return res.status(404).send("Group Not Found")
//     }
//     res.status(200).send(group)
// }

const editChatMembers = async (req, res) => {
    let { chatId, users } = req.body;

    let usersArray = JSON.parse(users);
    usersArray.push(req.currentUser.id);
    try {
        const group = await ChatModel.findByIdAndUpdate(chatId,
            {
                users: usersArray,
            },
            { new: true })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
    
        if (!group) {
            return res.status(404).send("Group Not Found")
        }
        console.log('Edited group', group);
        res.status(200).send(group)
        
    } catch (error) {
        console.log('error from editChatMembers', error.message);

    }

}

const removeFriendFromGroup = async (req, res) => {
    const { chatId, idOfUserToBeRemoved } = req.body;

    const group = await ChatModel.findByIdAndUpdate(chatId, { $pull: { users: idOfUserToBeRemoved } }, { new: true })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

    if (!group) {
        return res.status(404).send("Group Not Found")
    }
    res.status(200).send(group)
}

const exitFromGroup = async (req, res) => {
    const { chatId, idOfUserToBeRemoved , newAdminId } = req.body;

    const group = await ChatModel.findByIdAndUpdate(chatId, 
        { 
            $pull: { users: idOfUserToBeRemoved },
            groupAdmin : newAdminId
        }, { new: true })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

    if (!group) {
        return res.status(404).send("Group Not Found")
    }
    res.status(200).send(group)
}

const deleteGroup = async (req, res) => {
    const { chatId } = req.body;

    const group = await ChatModel.findByIdAndDelete(chatId)

    if (!group) {
        return res.status(404).send("Group Not Found")
    }
    console.log('deleted group',group);
    res.status(200).send(group)
}




module.exports = {
    getChat,
    getAllChats,
    createGroupChat,
    editChatMembers,
    removeFriendFromGroup,
    editChatName,
    editChatProfile,
    exitFromGroup,
    deleteGroup
}