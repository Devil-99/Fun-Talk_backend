const express = require('express');
const { registerMiddleware, loginMiddleware, getAllUsers } = require('../controller/usersController');

const router = express.Router();

router.post('/register',registerMiddleware);
router.post('/login',loginMiddleware);

router.get('/allUsers/:id',getAllUsers);

module.exports=router;