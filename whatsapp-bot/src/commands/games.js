const { updateBalance } = require('../lib/db');

const MAX_BET = 10000;

const games = {
    'plinko': async (sock, remoteJid, sender, args, user) => {
        const bet = parseFloat(args[0]);
        if (isNaN(bet) || bet <= 0 || bet > MAX_BET) return sock.sendMessage(remoteJid, { text: `Invalid bet. Max ${MAX_BET}` });
        if (user.balance < bet) return sock.sendMessage(remoteJid, { text: 'Insufficient funds!' });

        const multipliers = [5, 2, 0.5, 0.2, 0.5, 2, 5];
        const resultIdx = Math.floor(Math.random() * multipliers.length);
        const win = bet * multipliers[resultIdx];
        const diff = win - bet;

        await updateBalance(sender, diff, diff > 0 ? 'gamble_win' : 'gamble_loss');
        await sock.sendMessage(remoteJid, { text: `Plinko! You hit multiplier x${multipliers[resultIdx]}. Result: ${win} coins (Profit: ${diff})` });
    },
    'roulette': async (sock, remoteJid, sender, args, user) => {
        const bet = parseFloat(args[0]);
        const color = args[1]?.toLowerCase(); // 'red' or 'black'
        if (isNaN(bet) || bet <= 0 || bet > MAX_BET || !['red', 'black'].includes(color)) return sock.sendMessage(remoteJid, { text: 'Usage: !roulette amount red/black' });
        if (user.balance < bet) return sock.sendMessage(remoteJid, { text: 'Insufficient funds!' });

        const winColor = Math.random() > 0.5 ? 'red' : 'black';
        const win = color === winColor ? bet * 2 : 0;
        const diff = win - bet;

        await updateBalance(sender, diff, diff > 0 ? 'gamble_win' : 'gamble_loss');
        await sock.sendMessage(remoteJid, { text: `Roulette! Ball landed on ${winColor}. ${color === winColor ? 'You won!' : 'You lost!'}. Result: ${win} coins` });
    },
    'blackjack': async (sock, remoteJid, sender, args, user) => {
        const bet = parseFloat(args[0]);
        if (isNaN(bet) || bet <= 0 || bet > MAX_BET) return sock.sendMessage(remoteJid, { text: 'Invalid bet' });
        if (user.balance < bet) return sock.sendMessage(remoteJid, { text: 'Insufficient funds!' });

        const win = Math.random() > 0.5 ? bet * 2 : 0;
        const diff = win - bet;
        await updateBalance(sender, diff, diff > 0 ? 'gamble_win' : 'gamble_loss');
        await sock.sendMessage(remoteJid, { text: `Blackjack! Result: ${win === 0 ? 'House wins' : 'You win!'}. Result: ${win} coins` });
    },
    'coinflip': async (sock, remoteJid, sender, args, user) => {
        const bet = parseFloat(args[0]);
        if (isNaN(bet) || bet <= 0 || bet > MAX_BET) return sock.sendMessage(remoteJid, { text: 'Invalid bet' });
        if (user.balance < bet) return sock.sendMessage(remoteJid, { text: 'Insufficient funds!' });

        const win = Math.random() > 0.5 ? bet * 2 : 0;
        const diff = win - bet;
        await updateBalance(sender, diff, diff > 0 ? 'gamble_win' : 'gamble_loss');
        await sock.sendMessage(remoteJid, { text: `Coinflip! Result: ${win === 0 ? 'Tails' : 'Heads'}. Result: ${win} coins` });
    },
    'dice': async (sock, remoteJid, sender, args, user) => {
        const bet = parseFloat(args[0]);
        if (isNaN(bet) || bet <= 0 || bet > MAX_BET) return sock.sendMessage(remoteJid, { text: 'Invalid bet' });
        if (user.balance < bet) return sock.sendMessage(remoteJid, { text: 'Insufficient funds!' });

        const roll = Math.floor(Math.random() * 6) + 1;
        const win = roll >= 4 ? bet * 2 : 0;
        const diff = win - bet;
        await updateBalance(sender, diff, diff > 0 ? 'gamble_win' : 'gamble_loss');
        await sock.sendMessage(remoteJid, { text: `Dice! Rolled a ${roll}. ${win > 0 ? 'Win!' : 'Loss!'}. Result: ${win} coins` });
    },
    'crash': async (sock, remoteJid, sender, args, user) => {
        const bet = parseFloat(args[0]);
        if (isNaN(bet) || bet <= 0 || bet > MAX_BET) return sock.sendMessage(remoteJid, { text: 'Invalid bet' });
        if (user.balance < bet) return sock.sendMessage(remoteJid, { text: 'Insufficient funds!' });

        const crashPoint = Math.random() * 10;
        const win = Math.random() > 0.5 ? bet * 1.5 : 0; // Simplified simulation
        const diff = win - bet;
        await updateBalance(sender, diff, diff > 0 ? 'gamble_win' : 'gamble_loss');
        await sock.sendMessage(remoteJid, { text: `Crash! It crashed at ${crashPoint.toFixed(2)}x. Result: ${win} coins` });
    },
    'slots': async (sock, remoteJid, sender, args, user) => {
        const bet = parseFloat(args[0]);
        if (isNaN(bet) || bet <= 0 || bet > MAX_BET) return sock.sendMessage(remoteJid, { text: 'Invalid bet' });
        if (user.balance < bet) return sock.sendMessage(remoteJid, { text: 'Insufficient funds!' });

        const symbols = ['🍒', '🍋', '💎', '🔔'];
        const s1 = symbols[Math.floor(Math.random() * 4)];
        const s2 = symbols[Math.floor(Math.random() * 4)];
        const s3 = symbols[Math.floor(Math.random() * 4)];
        const win = s1 === s2 && s2 === s3 ? bet * 10 : (s1 === s2 || s2 === s3) ? bet * 2 : 0;
        const diff = win - bet;
        await updateBalance(sender, diff, diff > 0 ? 'gamble_win' : 'gamble_loss');
        await sock.sendMessage(remoteJid, { text: `Slots: [${s1}][${s2}][${s3}]. Result: ${win} coins` });
    },
    'mines': async (sock, remoteJid, sender, args, user) => {
        const bet = parseFloat(args[0]);
        if (isNaN(bet) || bet <= 0 || bet > MAX_BET) return sock.sendMessage(remoteJid, { text: 'Invalid bet' });
        if (user.balance < bet) return sock.sendMessage(remoteJid, { text: 'Insufficient funds!' });

        const win = Math.random() > 0.7 ? bet * 3 : 0;
        const diff = win - bet;
        await updateBalance(sender, diff, diff > 0 ? 'gamble_win' : 'gamble_loss');
        await sock.sendMessage(remoteJid, { text: `Mines! You survived. Result: ${win} coins` });
    },
    'lottery': async (sock, remoteJid, sender, args, user) => {
        const bet = parseFloat(args[0]);
        if (isNaN(bet) || bet <= 0 || bet > MAX_BET) return sock.sendMessage(remoteJid, { text: 'Invalid bet' });
        if (user.balance < bet) return sock.sendMessage(remoteJid, { text: 'Insufficient funds!' });

        const win = Math.random() > 0.95 ? bet * 100 : 0;
        const diff = win - bet;
        await updateBalance(sender, diff, diff > 0 ? 'gamble_win' : 'gamble_loss');
        await sock.sendMessage(remoteJid, { text: `Lottery! Ticket bought. Result: ${win} coins` });
    },
    'wheel': async (sock, remoteJid, sender, args, user) => {
        const bet = parseFloat(args[0]);
        if (isNaN(bet) || bet <= 0 || bet > MAX_BET) return sock.sendMessage(remoteJid, { text: 'Invalid bet' });
        if (user.balance < bet) return sock.sendMessage(remoteJid, { text: 'Insufficient funds!' });

        const win = Math.random() > 0.5 ? bet * 2 : 0;
        const diff = win - bet;
        await updateBalance(sender, diff, diff > 0 ? 'gamble_win' : 'gamble_loss');
        await sock.sendMessage(remoteJid, { text: `Wheel of Fortune! Result: ${win} coins` });
    }
};

module.exports = games;
