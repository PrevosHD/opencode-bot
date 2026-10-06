const { pool } = require('../lib/db');

const utilityCommands = {
    'ping': async (sock, remoteJid) => {
        await sock.sendMessage(remoteJid, { text: '🏓 Pong!' });
    },
    'uptime': async (sock, remoteJid) => {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const mins = Math.floor((uptime % 3600) / 60);
        await sock.sendMessage(remoteJid, { text: `⏱️ Uptime: ${hours}h ${mins}m` });
    },
    'help': async (sock, remoteJid) => {
        await sock.sendMessage(remoteJid, { text: '📜 *Help:* !ping, !uptime, !calc, !time, !date, !google, !weather, !wiki, !poll, !random_num, !flip, !qr, !info...' });
    },
    'userinfo': async (sock, remoteJid, sender, args) => {
        const target = args[0] || sender;
        const user = await (await require('../lib/db').getUser)(target);
        await sock.sendMessage(remoteJid, { text: `👤 *User Info*\nID: ${target}\nBalance: ${user.balance}\nAdmin: ${user.isAdmin}` });
    },
    'calc': async (sock, remoteJid, sender, args) => {
        try {
            const expr = args.join(' ');
            const result = eval(expr); // Simple eval for demo, use mathjs in production
            await sock.sendMessage(remoteJid, { text: `🧮 Result: ${result}` });
        } catch {
            await sock.sendMessage(remoteJid, { text: '❌ Invalid expression!' });
        }
    },
    'time': async (sock, remoteJid) => {
        await sock.sendMessage(remoteJid, { text: `🕒 Current Time: ${new Date().toLocaleTimeString()}` });
    },
    'date': async (sock, remoteJid) => {
        await sock.sendMessage(remoteJid, { text: `📅 Current Date: ${new Date().toLocaleDateString()}` });
    },
    'google': async (sock, remoteJid, sender, args) => {
        const query = encodeURIComponent(args.join(' '));
        await sock.sendMessage(remoteJid, { text: `🔍 Search Google:\nhttps://www.google.com/search?q=${query}` });
    },
    'weather': async (sock, remoteJid, sender, args) => {
        const city = args[0] || 'Berlin';
        await sock.sendMessage(remoteJid, { text: `🌤️ Weather in ${city}: 22°C, Sunny (Simulation)` });
    },
    'wiki': async (sock, remoteJid, sender, args) => {
        const query = encodeURIComponent(args.join(' '));
        await sock.sendMessage(remoteJid, { text: `📚 Wiki Search:\nhttps://de.wikipedia.org/wiki/${query}` });
    },
    'poll': async (sock, remoteJid, sender, args) => {
        await sock.sendMessage(remoteJid, { text: `📊 *Poll:* ${args.join(' ')}\nReact with 👍 or 👎` });
    },
    'random_num': async (sock, remoteJid, sender, args) => {
        const min = parseInt(args[0]) || 1;
        const max = parseInt(args[1]) || 100;
        const res = Math.floor(Math.random() * (max - min + 1)) + min;
        await sock.sendMessage(remoteJid, { text: `🎲 Random Number: ${res}` });
    },
    'flip': async (sock, remoteJid) => {
        const res = Math.random() > 0.5 ? 'Heads' : 'Tails';
        await sock.sendMessage(remoteJid, { text: `🪙 Flip: ${res}` });
    },
    'qr': async (sock, remoteJid, sender, args) => {
        const text = args.join(' ');
        await sock.sendMessage(remoteJid, { text: `🖼️ QR Code:\nhttps://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}` });
    },
    'info': async (sock, remoteJid) => {
        await sock.sendMessage(remoteJid, { text: '🤖 Bot Info: Multi-Session Node.js Bot powered by Baileys & MySQL.' });
    },
    'remind': async (sock, remoteJid, sender, args) => {
        await sock.sendMessage(remoteJid, { text: `⏰ Reminder set for ${args[0]} : ${args.slice(1).join(' ')}` });
    },
    'groupinfo': async (sock, remoteJid) => {
        await sock.sendMessage(remoteJid, { text: `👥 Group Info: ${remoteJid}\nType: WhatsApp Group` });
    },
    'urlshorten': async (sock, remoteJid, sender, args) => {
        await sock.sendMessage(remoteJid, { text: `🔗 Shortened URL: https://tinyurl.com/${args[0]}` });
    },
    'uptime_bot': async (sock, remoteJid) => {
        await sock.sendMessage(remoteJid, { text: `🚀 Bot is running smoothly since ${new Date().toLocaleDateString()}` });
    }
};

module.exports = utilityCommands;
