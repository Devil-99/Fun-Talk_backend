const express = require('express');
const { registerMiddleware, loginMiddleware, getAllUsers, updateUsernameMiddleware } = require('../controller/usersController');

const router = express.Router();

router.post('/register',registerMiddleware);
router.post('/login',loginMiddleware);
router.post('/updateUsername',updateUsernameMiddleware);

router.get('/allUsers/:id',getAllUsers);

module.exports=router;