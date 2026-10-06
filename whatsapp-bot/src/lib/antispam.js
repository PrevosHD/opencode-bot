const spamMap = new Map();

function isSpamming(userId) {
    const now = Date.now();
    const userLogs = spamMap.get(userId) || [];
    
    // Behalte nur Nachrichten der letzten 5 Sekunden
    const recentLogs = userLogs.filter(timestamp => now - timestamp < 5000);
    recentLogs.push(now);
    spamMap.set(userId, recentLogs);

    // Wenn mehr als 5 Nachrichten in 5 Sekunden -> Spam
    return recentLogs.length > 5;
}

module.exports = { isSpamming };
