const express = require('express');
const { addMessege , getAllMessege , deleteMessege } = require('../controller/messegesController');

const router = express.Router();

router.post('/addmsg',addMessege);
router.post('/getmsg',getAllMessege);
router.post('/deletemsg',deleteMessege);

module.exports=router;