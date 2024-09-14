const express = require('express')
const router = express.Router();

const auth_controller = require('../controller/authController');

router.post('/login', async (req, res) => {
    try {
        const response = await auth_controller.handleLogin(req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const response = await auth_controller.handleRegister(req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;