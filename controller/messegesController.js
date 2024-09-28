const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

const getMessages = async () => {
    try {
        const result = await pool.query('SELECT * FROM messages');
        return {
            status: 200,
            data: result.rows
        }
    } catch (exception) {
        return {
            status: 500,
            data: { message: 'Error in Login' }
        };
    }
};

const sendMessage = async ({from, to, message}) => {
    const message_id = uuidv4();
    const timestamp = new Date().toISOString();
    try {
        const result = await pool.query(`
        INSERT INTO messages (message_id, sender_id, receiver_id, message, timestamp) VALUES ($1, $2, $3, $4, $5)
        returning *;
        `,[message_id, from, to, message, timestamp]);
        console.log(result.rows);
        return {
            status: 200,
            data: result.rows
        }
    } catch (error) {
        return {
            status: 500,
            data: { message: 'Error in Message Sending' }
        };
    }
}

module.exports = {
    getMessages,
    sendMessage
}