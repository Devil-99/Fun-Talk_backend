const pool = require('../db');

const getUsers = async ({user_id}) => {
    try {
        const result = await pool.query('SELECT user_id, username FROM users WHERE user_id != $1',[user_id]);
        if (result.rows.length > 0) {
            return {
                status: 200,
                data: result.rows
            }
        } else {
            return {
                status: 404,
                data: { message: 'No Users Found!' }
            };
        }
        return res.json(response.rows);
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
        const user = await User.findByIdAndUpdate({ _id: currUser._id }, {
            $set: {
                username: newUsername
            }
        }, {
            new: true
        });
        return res.json({ status: true, user });
    }
    catch (exception) {
        next(exception);
    }
}

module.exports = {
    getUsers,
    updateUsername
}