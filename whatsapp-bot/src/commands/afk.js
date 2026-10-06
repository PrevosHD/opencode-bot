const { pool } = require('../lib/db');

const afkCommands = {
    'afk': async (sock, remoteJid, sender, args, user) => {
        const reason = args.join(' ') || 'No reason provided';
        await pool.execute('UPDATE users SET isAfk = TRUE, afkReason = ? WHERE userId = ?', [reason, sender]);
        await sock.sendMessage(remoteJid, { text: `You are now AFK: ${reason}` });
    },
    'unafk': async (sock, remoteJid, sender, args, user) => {
        await pool.execute('UPDATE users SET isAfk = FALSE WHERE userId = ?', [sender]);
        await sock.sendMessage(remoteJid, { text: `You are no longer AFK!` });
    }
};

module.exports = afkCommands;
