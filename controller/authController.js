const pool = require('../db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const handleLogin = async (body) => {
    try {
        const { mail, password } = body;
        const result = await pool.query('SELECT * FROM users WHERE mail = $1;', [mail]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                // Return user details upon successful login
                return {
                    status: 200,
                    data: {
                        user_id: user.user_id,
                        username: user.name,
                        user_mail: user.mail
                    }
                };
            } else {
                // Invalid password case
                return {
                    status: 401,
                    data: { message: 'Invalid password!' }
                };
            }
        } else {
            // User not found case
            return {
                status: 404,
                data: { message: 'User not found!' }
            };
        }
    } catch (error) {
        console.error('Error in login:', error);
        return {
            status: 500,
            data: { message: 'Internal server error' }
        };
    }
};

const handleRegister = async (body) => {
    try {
        const { username, email, password } = body;

        try {
            let existingUser = await pool.query('SELECT * FROM users WHERE mail = $1;', [email]);
            if (existingUser.rows.length > 0) {
                return {
                    status: 404,
                    data: { message: 'User already exist!' }
                };
            };
        } catch (error) {
            return {
                status: 500,
                data: { message: 'Internal server error' }
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        await pool.query(
            'INSERT INTO users (user_id, name, mail, password) VALUES ($1, $2, $3, $4);',
            [userId, username, email, hashedPassword]
        );

        return {
            status: 200,
            data: { message: 'Registration successful' }
        };
    } catch (error) {
        return {
            status: 500,
            data: { message: 'Internal server error' }
        };
    }
}

module.exports = {
    handleLogin,
    handleRegister
}