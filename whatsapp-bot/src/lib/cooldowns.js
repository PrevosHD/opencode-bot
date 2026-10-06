const cooldowns = new Map();

function checkCooldown(userId, command, seconds) {
    const key = `${userId}:${command}`;
    const now = Date.now();
    const lastUsed = cooldowns.get(key);

    if (lastUsed && now - lastUsed < seconds * 1000) {
        const remaining = Math.ceil((seconds * 1000 - (now - lastUsed)) / 1000);
        return remaining; // Sekunden, die noch warten muss
    }

    cooldowns.set(key, now);
    return 0; // Kein Cooldown
}

module.exports = { checkCooldown };
