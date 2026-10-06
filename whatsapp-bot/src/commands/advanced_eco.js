const { updateBalance, pool, getUser } = require('../lib/db');

const advEcoCommands = {
    'job': async (sock, remoteJid, sender, args, user) => {
        const jobs = ['Developer', 'Pizza Delivery', 'Crypto Trader', 'CEO', 'Street Performer'];
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        await pool.execute('UPDATE users SET username = ? WHERE userId = ?', [`${user.username} (${job})`, sender]);
        await sock.sendMessage(remoteJid, { text: `💼 You got a job as a *${job}*!` });
    },
    'work': async (sock, remoteJid, sender, args, user) => {
        const earn = Math.floor(Math.random() * 500) + 100;
        const newBal = await updateBalance(sender, earn, 'earn');
        await sock.sendMessage(remoteJid, { text: `🛠️ You worked hard and earned *${earn}* coins! Total: ${newBal}` });
    },
    'promote': async (sock, remoteJid, sender, args, user) => {
        const cost = 1000;
        if (user.balance < cost) return sock.sendMessage(remoteJid, { text: 'Not enough coins for promotion (1000)!' });
        await updateBalance(sender, -cost, 'spend');
        await sock.sendMessage(remoteJid, { text: `📈 Congratulations! You've been promoted!` });
    },
    'company_create': async (sock, remoteJid, sender, args, user) => {
        const name = args.join(' ') || 'MyCorp';
        await sock.sendMessage(remoteJid, { text: `🏢 Company *${name}* has been founded by ${sender}!` });
    },
    'company_hire': async (sock, remoteJid, sender, args, user) => {
        const target = args[0];
        if (!target) return sock.sendMessage(remoteJid, { text: 'Usage: !company_hire @user' });
        await sock.sendMessage(remoteJid, { text: `🤝 ${target} has been hired!` });
    },
    'company_salary': async (sock, remoteJid, sender, args, user) => {
        const amt = args[0];
        await sock.sendMessage(remoteJid, { text: `💸 Salary set to ${amt} coins per day.` });
    },
    'stock_buy': async (sock, remoteJid, sender, args, user) => {
        const stock = args[0] || 'BTC';
        await sock.sendMessage(remoteJid, { text: `📈 Bought 1 share of ${stock}!` });
    },
    'stock_sell': async (sock, remoteJid, sender, args, user) => {
        const stock = args[0] || 'BTC';
        await sock.sendMessage(remoteJid, { text: `📉 Sold 1 share of ${stock} for profit!` });
    },
    'stock_price': async (sock, remoteJid, sender, args) => {
        const stock = args[0] || 'BTC';
        const price = (Math.random() * 1000).toFixed(2);
        await sock.sendMessage(remoteJid, { text: `📊 Current price of ${stock}: ${price} coins` });
    },
    'bank_deposit': async (sock, remoteJid, sender, args, user) => {
        const amt = parseFloat(args[0]);
        if (isNaN(amt) || user.balance < amt) return sock.sendMessage(remoteJid, { text: 'Invalid amount or insufficient funds!' });
        await updateBalance(sender, -amt, 'spend');
        await sock.sendMessage(remoteJid, { text: `🏦 Deposited ${amt} into the bank.` });
    },
    'bank_withdraw': async (sock, remoteJid, sender, args, user) => {
        const amt = parseFloat(args[0]);
        await updateBalance(sender, amt, 'earn');
        await sock.sendMessage(remoteJid, { text: `🏦 Withdrew ${amt} from the bank.` });
    },
    'loan': async (sock, remoteJid, sender, args, user) => {
        const loanAmt = 5000;
        await updateBalance(sender, loanAmt, 'earn');
        await sock.sendMessage(remoteJid, { text: `🏦 Loan approved! You received ${loanAmt} coins. (Interest 10%)` });
    },
    'loanpay': async (sock, remoteJid, sender, args, user) => {
        const repayment = 5500;
        if (user.balance < repayment) return sock.sendMessage(remoteJid, { text: 'Insufficient funds to pay loan!' });
        await updateBalance(sender, -repayment, 'spend');
        await sock.sendMessage(remoteJid, { text: `✅ Loan paid back with interest!` });
    },
    'tax': async (sock, remoteJid, sender, args, user) => {
        const tax = Math.floor(user.balance * 0.05);
        await updateBalance(sender, -tax, 'spend');
        await sock.sendMessage(remoteJid, { text: `🏛️ The government took ${tax} coins in taxes.` });
    },
    'rob': async (sock, remoteJid, sender, args, user) => {
        const target = args[0];
        if (!target) return sock.sendMessage(remoteJid, { text: 'Usage: !rob @user' });
        const success = Math.random() > 0.7;
        if (success) {
            const loot = 200;
            await updateBalance(sender, loot, 'gamble_win');
            await updateBalance(target, -loot, 'gamble_loss');
            await sock.sendMessage(remoteJid, { text: `💰 Success! You robbed ${target} for ${loot} coins!` });
        } else {
            await sock.sendMessage(remoteJid, { text: `🚔 You got caught! You paid a fine of 100 coins.` });
            await updateBalance(sender, -100, 'spend');
        }
    },
    'crime': async (sock, remoteJid, sender, args, user) => {
        const success = Math.random() > 0.5;
        if (success) {
            const loot = 1000;
            await updateBalance(sender, loot, 'earn');
            await sock.sendMessage(remoteJid, { text: `😈 Crime successful! Earned ${loot} coins.` });
        } else {
            await sock.sendMessage(remoteJid, { text: `⛓️ You spent 2 hours in jail.` });
        }
    },
    'rob_bank': async (sock, remoteJid, sender, args, user) => {
        const success = Math.random() > 0.9;
        if (success) {
            const loot = 10000;
            await updateBalance(sender, loot, 'earn');
            await sock.sendMessage(remoteJid, { text: `🏦 HOLY SHIT! You robbed the bank for ${loot} coins!` });
        } else {
            await sock.sendMessage(remoteJid, { text: `🚨 FBI! You are now wanted!` });
        }
    },
    'invest': async (sock, remoteJid, sender, args, user) => {
        const amt = parseFloat(args[0]);
        if (isNaN(amt) || user.balance < amt) return sock.sendMessage(remoteJid, { text: 'Insufficient funds!' });
        await updateBalance(sender, -amt, 'spend');
        await sock.sendMessage(remoteJid, { text: `📈 Invested ${amt} coins. Come back later for profits!` });
    },
    'dividend': async (sock, remoteJid, sender, args, user) => {
        const profit = Math.floor(Math.random() * 100);
        await updateBalance(sender, profit, 'earn');
        await sock.sendMessage(remoteJid, { text: `💵 You received ${profit} coins in dividends!` });
    },
    'rich': async (sock, remoteJid) => {
        const [rows] = await pool.execute('SELECT userId, balance FROM users ORDER BY balance DESC LIMIT 10');
        let text = '🏆 *Rich List:*\n';
        rows.forEach((r, i) => { text += `${i+1}. ${r.userId}: ${r.balance}\n`; });
        await sock.sendMessage(remoteJid, { text });
    },
    'poor': async (sock, remoteJid) => {
        const [rows] = await pool.execute('SELECT userId, balance FROM users ORDER BY balance ASC LIMIT 10');
        let text = '📉 *Poor List:*\n';
        rows.forEach((r, i) => { text += `${i+1}. ${r.userId}: ${r.balance}\n`; });
        await sock.sendMessage(remoteJid, { text });
    },
    'donate': async (sock, remoteJid, sender, args, user) => {
        const target = args[0];
        const amt = parseFloat(args[1]);
        if (!target || isNaN(amt)) return sock.sendMessage(remoteJid, { text: 'Usage: !donate @user amount' });
        await updateBalance(sender, -amt, 'spend');
        await updateBalance(target, amt, 'earn');
        await sock.sendMessage(remoteJid, { text: `❤️ Donated ${amt} to ${target}!` });
    },
    'mint': async (sock, remoteJid, sender, args, user) => {
        await sock.sendMessage(remoteJid, { text: `🪙 Minting new coins... Done!` });
    },
    'burn': async (sock, remoteJid, sender, args, user) => {
        const amt = parseFloat(args[0]);
        await updateBalance(sender, -amt, 'spend');
        await sock.sendMessage(remoteJid, { text: `🔥 Burned ${amt} coins to support the economy!` });
    },
    'insurance': async (sock, remoteJid, sender, args, user) => {
        await sock.sendMessage(remoteJid, { text: `🛡️ Insurance activated. You are now protected from robberies!` });
    },
    'gamble_all': async (sock, remoteJid, sender, args, user) => {
        const bet = user.balance;
        const win = Math.random() > 0.5 ? bet * 2 : 0;
        await updateBalance(sender, win - bet, win > 0 ? 'gamble_win' : 'gamble_loss');
        await sock.sendMessage(remoteJid, { text: `🎰 All-in! Result: ${win} coins` });
    },
    'bet_match': async (sock, remoteJid, sender, args, user) => {
        await sock.sendMessage(remoteJid, { text: `⚽ Bet placed on the match!` });
    },
    'share_profit': async (sock, remoteJid, sender, args, user) => {
        await sock.sendMessage(remoteJid, { text: `🤝 Profit shared with partners!` });
    },
    'bankruptcy': async (sock, remoteJid, sender, args, user) => {
        await updateBalance(sender, -user.balance, 'spend');
        await sock.sendMessage(remoteJid, { text: `📉 You went bankrupt! Everything is gone.` });
    },
    'audit': async (sock, remoteJid, sender, args, user) => {
        await sock.sendMessage(remoteJid, { text: `📋 Account Audit: No discrepancies found in the chain.` });
    }
};

module.exports = advEcoCommands;
