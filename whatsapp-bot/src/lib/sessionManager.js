const { default: makeWASocket, useMultiFileAuthState, disconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

async function createSession(sessionId, onQR, onConnected) {
    const sessionPath = path.join(__dirname, '../../sessions', sessionId);
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) onQR(qr);
        if (connection === 'close') {
            const shouldReconnect = disconnectReason(lastDisconnect)?.toLowerCase() !== 'logged out';
            if (shouldReconnect) createSession(sessionId, onQR, onConnected);
        } else if (connection === 'open') {
            onConnected(sock);
        }
    });

    sock.ev.on('creds.update', saveCreds);
    return sock;
}

module.exports = { createSession };
