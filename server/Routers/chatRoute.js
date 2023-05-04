const { getChat, getAllChats, createGroupChat, removeFriendFromGroup, editGroupChat } = require('../Controllers/ChatController');
const authorization = require('../config/middleware/authorization');

const router = require('express').Router()


router.post('/get-message', authorization,getChat);
router.get('/get-all-chats', authorization, getAllChats);
router.post('/create-new-chat', authorization, createGroupChat);
router.put('/edit-group-chat', authorization, editGroupChat);
router.put('/remove-friend-from-group', authorization, removeFriendFromGroup);


module.exports = router ;
