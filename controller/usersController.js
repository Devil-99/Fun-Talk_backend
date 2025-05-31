const pool = require('../db');

const getUsers = async ({ user_id }) => {
    try {
        const result = await pool.query('SELECT user_id, username, dp, is_active FROM users WHERE user_id != $1', [user_id]);
        // Transforming the result to include dp in base64 format
        const transformedData = result.rows.map(user => ({
            user_id: user.user_id,
            username: user.username,
            dp: user.dp ? `data:image/png;base64,${user.dp.toString('base64')}` : null,
            online: user.is_active
        }));
        return {
            status: 200,
            data: transformedData
        }
    } catch (exception) {
        console.error('Error in login:', error);
        return {
            status: 500,
            data: { message: 'Internal Server Error' }
        };
    }
};

const updateUsername = async (req, res, next) => {
    try {
        const { currUser, newUsername } = req.body;
        const updateStatus = await pool.query(
            'UPDATE users SET username = $1 WHERE user_id = $2',
            [newUsername, currUser.user_id]
        );
        if (updateStatus.rowCount === 0) {
            return res.status(500).json({ message: 'Failed to update username' });
        }
        return res.status(200).json({ message: 'Username updated successfully' });
    }
    catch (exception) {
        next(exception);
    }
}

module.exports = {
    getUsers,
    updateUsername
}