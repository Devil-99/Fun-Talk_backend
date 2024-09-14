const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "49.50.85.179",
    database: "TechTalk",
    password: "Y7hb&t6#",
    port: 80
  });

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database successfully!');
        release();
    }
});

module.exports = pool ;

