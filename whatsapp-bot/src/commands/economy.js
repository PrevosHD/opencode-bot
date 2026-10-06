const { updateBalance, pool } = require('../lib/db');

const economyCommands = {
    'balance': async (sock, remoteJid, sender, args, user) => {
        const target = args[0] || sender;
        const userData = await (await require('../lib/db').getUser)(target);
        await sock.sendMessage(remoteJid, { text: `Balance of ${target}: ${userData.balance} coins` });
    },
    'daily': async (sock, remoteJid, sender, args, user) => {
        const amount = 100;
        const newBal = await updateBalance(sender, amount, 'daily');
        await sock.sendMessage(remoteJid, { text: `You claimed your daily reward: ${amount} coins! Total: ${newBal}` });
    },
    'pay': async (sock, remoteJid, sender, args, user) => {
        const target = args[0];
        const amount = parseFloat(args[1]);
        if (!target || isNaN(amount) || amount <= 0) return sock.sendMessage(remoteJid, { text: 'Usage: !pay @user amount' });
        
        if (user.balance < amount) return sock.sendMessage(remoteJid, { text: 'Insufficient funds!' });
        
        await updateBalance(sender, -amount, 'transfer');
        await updateBalance(target, amount, 'transfer');
        await sock.sendMessage(remoteJid, { text: `Transferred ${amount} to ${target}` });
    },
    'chain': async (sock, remoteJid, sender, args, user) => {
        const [rows] = await pool.execute('SELECT * FROM transactions WHERE userId = ? ORDER BY id DESC LIMIT 5', [sender]);
        let text = `Last 5 transactions for ${sender}:\n`;
        rows.forEach(r => {
            text += `${r.id} | ${r.amount} | ${r.type} | Hash: ${r.currentHash.slice(0, 10)}...\n`;
        });
        await sock.sendMessage(remoteJid, { text });
    }
};

module.exports = economyCommands;
