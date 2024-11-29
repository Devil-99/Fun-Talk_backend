const pool = require('../db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const fs = require('fs');

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
                        username: user.username,
                        user_mail: user.mail,
                        creation_date: user.creation_date,
                        dp: user.dp && `data:image/png;base64,${user.dp.toString('base64')}`
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
        const date = new Date();

        await pool.query(
            'INSERT INTO users (user_id, username, mail, password, creation_date) VALUES ($1, $2, $3, $4, $5);',
            [userId, username, email, hashedPassword, date]
        );

        return {
            status: 200,
            data: { message: 'Registration successful' }
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            data: { message: 'Internal server error' }
        };
    }
}

const handleDP = async (file,body)=>{    
    try {
        if (!file) {
            return { status: 400, data: { message: 'No image file provided' } };
        }

        // Read the uploaded file into a buffer
        const imageBuffer = fs.readFileSync(file.path);        

        // Save image to PostgreSQL (assuming a table named `user_profiles` exists)
        const result = await pool.query(
            `UPDATE users SET dp = $1 WHERE user_id = $2 returning dp`,
            [imageBuffer, body.user_id]
        );
        
        // Remove the temporary file from the uploads folder
        fs.unlinkSync(file.path);

        if (result.rowCount === 0) {
            return { status: 404, data: { message: 'User not found' } };
        }

        return { 
            status: 200,
            data: { 
                message: 'Profile picture updated',
                image: `data:image/png;base64,${result.rows[0].dp.toString('base64')}` // Convert buffer to Base64
            } 
        };
    } catch (error) {
        console.error('Error in handleDP:', error);
        throw error;
    }
}

module.exports = {
    handleLogin,
    handleRegister,
    handleDP
}