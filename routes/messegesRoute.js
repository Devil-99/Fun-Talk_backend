const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, deleteMessage } = require('../controller/messegesController');

router.get('/messages', async (req, res) => {
    try {
        const response = await getMessages(req.query);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/message', async (req,res)=>{
    try {
        const response = await sendMessage(req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/deletemessege', async (req,res)=>{
    try {
        const response = await deleteMessage(req.query);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports=router;