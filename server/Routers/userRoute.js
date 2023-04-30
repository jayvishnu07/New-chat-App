const { registerUser , loginUser, searchNewFriends } = require('../Controllers/UserController')
const authorization = require('../config/middleware/authorization')

const router = require('express').Router()

router.post('/auth/register',registerUser);
router.post('/auth/login',loginUser);
router.get('/search-new-friends',authorization,searchNewFriends)

module.exports = router;