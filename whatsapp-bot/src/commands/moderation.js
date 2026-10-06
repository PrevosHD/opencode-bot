const { updateBalance, getUser, pool } = require('../lib/db');

const moderationCommands = {
    'ban': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        const target = args[0];
        if (!target) return sock.sendMessage(remoteJid, { text: 'Usage: !ban @user' });
        await pool.execute('UPDATE users SET isAdmin = FALSE WHERE userId = ?', [target]);
        await sock.sendMessage(remoteJid, { text: `Banned ${target}` });
    },
    'unban': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        const target = args[0];
        await pool.execute('UPDATE users SET isAdmin = TRUE WHERE userId = ?', [target]);
        await sock.sendMessage(remoteJid, { text: `Unbanned ${target}` });
    },
    'mute': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await sock.sendMessage(remoteJid, { text: `Muted ${args[0]}` });
    },
    'unmute': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await sock.sendMessage(remoteJid, { text: `Unmuted ${args[0]}` });
    },
    'kick': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await sock.sendMessage(remoteJid, { text: `Kicked ${args[0]}` });
    },
    'warn': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await sock.sendMessage(remoteJid, { text: `Warned ${args[0]}` });
    },
    'clear': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await sock.sendMessage(remoteJid, { text: 'Cleared messages (Simulated)' });
    },
    'setadmin': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await pool.execute('UPDATE users SET isAdmin = TRUE WHERE userId = ?', [args[0]]);
        await sock.sendMessage(remoteJid, { text: `Set ${args[0]} as admin` });
    },
    'removeadmin': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await pool.execute('UPDATE users SET isAdmin = FALSE WHERE userId = ?', [args[0]]);
        await sock.sendMessage(remoteJid, { text: `Removed admin status from ${args[0]}` });
    },
    'slowmode': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await sock.sendMessage(remoteJid, { text: `Slowmode set to ${args[0]}s` });
    },
    'setbalance': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        const amount = parseFloat(args[1]);
        await updateBalance(args[0], amount, 'admin_set');
        await sock.sendMessage(remoteJid, { text: `Set balance of ${args[0]} to ${amount}` });
    },
    'purge': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await sock.sendMessage(remoteJid, { text: 'Purged chat' });
    },
    'lock': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await sock.sendMessage(remoteJid, { text: 'Chat locked' });
    },
    'unlock': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await sock.sendMessage(remoteJid, { text: 'Chat unlocked' });
    },
    'setnickname': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await sock.sendMessage(remoteJid, { text: `Nickname of ${args[0]} set to ${args.slice(1).join(' ')}` });
    },
    'forceafk': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await pool.execute('UPDATE users SET isAfk = TRUE, afkReason = ? WHERE userId = ?', [args[1] || 'Forced by admin', args[0]]);
        await sock.sendMessage(remoteJid, { text: `Forced ${args[0]} to AFK` });
    },
    'unforceafk': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await pool.execute('UPDATE users SET isAfk = FALSE WHERE userId = ?', [args[0]]);
        await sock.sendMessage(remoteJid, { text: `Removed AFK from ${args[0]}` });
    },
    'announcement': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await sock.sendMessage(remoteJid, { text: `📢 *Announcement* 📢\n\n${args.join(' ')}` });
    },
    'checklogs': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await sock.sendMessage(remoteJid, { text: 'Fetching logs...' });
    },
    'setlevel': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await sock.sendMessage(remoteJid, { text: `Set level of ${args[0]} to ${args[1]}` });
    },
    'info': async (sock, remoteJid, sender, args, user) => {
        if (!user.isAdmin) return sock.sendMessage(remoteJid, { text: 'Admin only!' });
        await sock.sendMessage(remoteJid, { text: `Admin Info: ${sender}` });
    }
};

module.exports = moderationCommands;
