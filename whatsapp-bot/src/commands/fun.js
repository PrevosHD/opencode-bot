const funCommands = {
    'meme': async (sock, remoteJid) => {
        await sock.sendMessage(remoteJid, { text: '🖼️ [Meme Image Simulation]: "When the code finally works after 5 hours of debugging"' });
    },
    'joke': async (sock, remoteJid) => {
        const jokes = [
            'Why do programmers prefer dark mode? Because light attracts bugs!',
            'There are 10 types of people in the world: those who understand binary, and those who dont.',
            'A SQL query walks into a bar, walks up to two tables, and asks, "Can I join you?"'
        ];
        await sock.sendMessage(remoteJid, { text: `😂 ${jokes[Math.floor(Math.random() * jokes.length)]}` });
    },
    'ascii': async (sock, remoteJid, sender, args) => {
        const text = args.join(' ');
        await sock.sendMessage(remoteJid, { text: `🅰️ ASCII: ${text.toUpperCase()} (Simulation)` });
    },
    'reverse': async (sock, remoteJid, sender, args) => {
        const text = args.join(' ');
        await sock.sendMessage(remoteJid, { text: `🔄 Reversed: ${text.split('').reverse().join('')}` });
    },
    'upper': async (sock, remoteJid, sender, args) => {
        const text = args.join(' ');
        await sock.sendMessage(remoteJid, { text: `⬆️ ${text.toUpperCase()}` });
    },
    'lower': async (sock, remoteJid, sender, args) => {
        const text = args.join(' ');
        await sock.sendMessage(remoteJid, { text: `⬇️ ${text.toLowerCase()}` });
    },
    'repeat': async (sock, remoteJid, sender, args) => {
        const n = parseInt(args[0]) || 1;
        const text = args.slice(1).join(' ');
        await sock.sendMessage(remoteJid, { text: `🔁 ${text.repeat(n)}` });
    },
    'slap': async (sock, remoteJid, sender, args) => {
        const target = args[0] || 'the air';
        await sock.sendMessage(remoteJid, { text: `🖐️ ${sender} slaps ${target} across the face!` });
    },
    'hug': async (sock, remoteJid, sender, args) => {
        const target = args[0] || 'you';
        await sock.sendMessage(remoteJid, { text: `🫂 ${sender} gives ${target} a big warm hug!` });
    },
    'kiss': async (sock, remoteJid, sender, args) => {
        const target = args[0] || 'you';
        await sock.sendMessage(remoteJid, { text: `💋 ${sender} kisses ${target}!` });
    },
    'punch': async (sock, remoteJid, sender, args) => {
        const target = args[0] || 'the wall';
        await sock.sendMessage(remoteJid, { text: `👊 ${sender} punches ${target}!` });
    },
    'joke_dark': async (sock, remoteJid) => {
        await sock.sendMessage(remoteJid, { text: `💀 Dark Joke: I have a lot of jokes about unemployed people, but none of them work.` });
    },
    'fact': async (sock, remoteJid) => {
        await sock.sendMessage(remoteJid, { text: `💡 Fact: Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs.` });
    },
    'quote': async (sock, remoteJid) => {
        await sock.sendMessage(remoteJid, { text: `📜 Quote: "The only way to do great work is to love what you do." - Steve Jobs` });
    },
    'truth': async (sock, remoteJid, sender, args) => {
        await sock.sendMessage(remoteJid, { text: `⚖️ Truth: Tell us your most embarrassing secret!` });
    },
    'dare': async (sock, remoteJid, sender, args) => {
        await sock.sendMessage(remoteJid, { text: `🔥 Dare: Send a random sticker to your crush!` });
    },
    '8ball': async (sock, remoteJid, sender, args) => {
        const answers = ['Yes', 'No', 'Maybe', 'Definitely', 'Ask again later', 'Outlook not so good'];
        await sock.sendMessage(remoteJid, { text: `🎱 Magic 8-Ball says: ${answers[Math.floor(Math.random() * answers.length)]}` });
    },
    'ship': async (sock, remoteJid, sender, args) => {
        const u1 = args[0] || 'Me';
        const u2 = args[1] || 'You';
        const love = Math.floor(Math.random() * 101);
        await sock.sendMessage(remoteJid, { text: `🚢 Shipping ${u1} & ${u2}: ${love}% Match!` });
    },
    'pick': async (sock, remoteJid, sender, args) => {
        const options = args.join(' ').split(',');
        const res = options[Math.floor(Math.random() * options.length)];
        await sock.sendMessage(remoteJid, { text: `🎯 I pick: ${res.trim()}` });
    },
    'love_calc': async (sock, remoteJid, sender, args) => {
        const love = Math.floor(Math.random() * 101);
        await sock.sendMessage(remoteJid, { text: `❤️ Love Calculator: ${love}%` });
    }
};

module.exports = funCommands;
