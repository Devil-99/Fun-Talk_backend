const express = require('express');
const router = express.Router();
const { getUsers, updateUsername } = require('../controller/usersController');

router.get('/users', async (req, res) => {
    try {
        const response = await getUsers(req.query);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports=router;