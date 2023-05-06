const { getChat, getAllChats, createGroupChat, removeFriendFromGroup, editGroupChat, editChatName, editChatProfile, editChatMembers, exitFromGroup, deleteGroup } = require('../Controllers/ChatController');
const authorization = require('../config/middleware/authorization');

const router = require('express').Router()


router.post('/get-message', authorization,getChat);
router.get('/get-all-chats', authorization, getAllChats);
router.post('/create-new-chat', authorization, createGroupChat);
// router.put('/edit-group-chat', authorization, editGroupChat);
router.put('/remove-friend-from-group', authorization, removeFriendFromGroup);


// new functions

router.put('/edit-chat-name', authorization, editChatName);
router.put('/edit-chat-profile', authorization, editChatProfile);
router.put('/edit-chat-members', authorization, editChatMembers);
router.put('/admin-exit-from-group', authorization, exitFromGroup);
router.put('/delete-group', authorization, deleteGroup);



module.exports = router ;
