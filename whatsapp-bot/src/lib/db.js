const mysql = require('mysql2/promise');
const crypto = require('crypto');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'whatsapp_bot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function getUser(userId) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE userId = ?', [userId]);
    return rows[0];
}

async function createUser(userId, username) {
    await pool.execute('INSERT IGNORE INTO users (userId, username) VALUES (?, ?)', [userId, username]);
    return getUser(userId);
}

async function updateBalance(userId, amount, type) {
    const user = await getUser(userId);
    const newBalance = Number(user.balance) + amount;
    
    // Chain Logic
    const [prevRows] = await pool.execute('SELECT currentHash FROM transactions WHERE userId = ? ORDER BY id DESC LIMIT 1', [userId]);
    const prevHash = prevRows[0]?.currentHash || '0'.repeat(64);
    const currentHash = crypto.createHash('sha256').update(prevHash + amount + type).digest('hex');

    await pool.execute('UPDATE users SET balance = ? WHERE userId = ?', [newBalance, userId]);
    await pool.execute('INSERT INTO transactions (userId, amount, type, previousHash, currentHash) VALUES (?, ?, ?, ?, ?)', 
        [userId, amount, type, prevHash, currentHash]);
    
    return newBalance;
}

module.exports = { pool, getUser, createUser, updateBalance };
