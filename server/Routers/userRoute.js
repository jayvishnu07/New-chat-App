const { registerUser , loginUser } = require('../Controllers/UserController')

const router = require('express').Router()

router.post('/register',registerUser);
router.post('/login',loginUser);

module.exports = router;