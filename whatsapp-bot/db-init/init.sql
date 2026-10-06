CREATE DATABASE IF NOT EXISTS whatsapp_bot;
USE whatsapp_bot;

CREATE TABLE IF NOT EXISTS users (
    userId VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255),
    balance DECIMAL(20, 2) DEFAULT 0,
    isAdmin BOOLEAN DEFAULT FALSE,
    isAfk BOOLEAN DEFAULT FALSE,
    afkReason TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(255),
    amount DECIMAL(20, 2),
    type ENUM('earn', 'spend', 'gamble_win', 'gamble_loss', 'transfer'),
    previousHash VARCHAR(64),
    currentHash VARCHAR(64),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS sessions (
    sessionId VARCHAR(255) PRIMARY KEY,
    authData JSON,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
