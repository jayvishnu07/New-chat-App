const { registerUser, loginUser, searchNewFriends, changeMyName } = require('../Controllers/UserController')
const authorization = require('../config/middleware/authorization')

const router = require('express').Router()

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/search-new-friends', authorization, searchNewFriends)
router.put('/change-name', authorization, changeMyName)
// router.get('/change-profilePic',authorization,changeMyProfilePic)

module.exports = router;