const { getChat, getAllChats, createGroupChat, renameGroupChat, addFriendToGroup, removeFriendFromGroup } = require('../Controllers/ChatController');
const authorization = require('../config/middleware/authorization');

const router = require('express').Router()

router.post('/get-chat',authorization,getChat);
router.get('/get-all-chats',authorization,getAllChats);
router.post('/create-new-chat',authorization,createGroupChat);
router.put('/rename-chat',authorization,renameGroupChat);
router.put('/add-friend-to-group',authorization,addFriendToGroup);
router.put('/remove-friend-from-group',authorization,removeFriendFromGroup);


module.exports = router;
