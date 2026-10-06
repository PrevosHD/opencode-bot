const { createUser, getUser, updateBalance, pool } = require('./lib/db');
const { createSession } = require('./lib/sessionManager');
const { checkCooldown } = require('./lib/cooldowns');
const { isSpamming } = require('./lib/antispam');
const fs = require('fs');
const path = require('path');

const sessions = new Map();

async function init() {
    // Simple session loader (in real app, would load from DB or config)
    const sessionDirs = fs.readdirSync(path.join(__dirname, '../sessions')).filter(f => fs.lstatSync(path.join(__dirname, '../sessions', f)).isDirectory());
    
    for (const sessionId of sessionDirs) {
        await startBot(sessionId);
    }
}

async function startBot(sessionId) {
    console.log(`Starting session: ${sessionId}`);
    const sock = await createSession(sessionId, 
        (qr) => console.log(`QR for ${sessionId}:\n${qr}`),
        async (sock) => {
            console.log(`Session ${sessionId} connected!`);
            sock.ev.on('messages.upsert', async ({ messages }) => {
                const msg = messages[0];
                if (!msg.message || msg.key.fromMe) return;
                
                const remoteJid = msg.key.remoteJid;
                const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
                const sender = msg.key.participant || remoteJid;

                // --- ANTI SPAM CHECK ---
                if (isSpamming(sender)) {
                    await sock.sendMessage(remoteJid, { text: '🚫 Stop spamming! Chill out for a moment.' });
                    return;
                }

                if (!text.startsWith('!')) return;

                const args = text.slice(1).trim().split(/ +/);
                const command = args.shift().toLowerCase();

                // User Setup
                const user = await createUser(sender, 'User');

                // AFK Check
                if (user.isAfk && command !== 'unafk') {
                    await sock.sendMessage(remoteJid, { text: `User ${sender} is currently AFK: ${user.afkReason}` });
                    return;
                }

                // Cooldown Check (Dynamic: Check if command has custom cooldown, else 5s)
                const cooldownTime = 5; // Default
                const cooldown = checkCooldown(sender, command, cooldownTime);
                if (cooldown > 0) {
                    await sock.sendMessage(remoteJid, { text: `⏳ Please wait ${cooldown} seconds before using this command again!` });
                    return;
                }

                // Command Router
                await handleCommand(sock, remoteJid, sender, command, args, user);
            });
        }
    );
    sessions.set(sessionId, sock);
}

async function handleCommand(sock, remoteJid, sender, command, args, user) {
    const mod = require('./commands/moderation');
    const eco = require('./commands/economy');
    const games = require('./commands/games');
    const afk = require('./commands/afk');

    const allCommands = { ...mod, ...eco, ...games, ...afk };
    
    if (allCommands[command]) {
        try {
            await allCommands[command](sock, remoteJid, sender, args, user);
        } catch (e) {
            console.error(e);
            await sock.sendMessage(remoteJid, { text: 'An error occurred while executing the command.' });
        }
    } else {
        await sock.sendMessage(remoteJid, { text: 'Unknown command!' });
    }
}

init().catch(console.error);
