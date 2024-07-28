const { Client, GatewayIntentBits } = require('discord.js');
const { factCheckCommand } = require('./commands/factcheck');
const { BOT_TOKEN } = require('../config/config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

//Logs a message showing that the bot is online and accessible
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

//The bots fact checking sequence
client.on('messageCreate', async message => {

    if (message.author.bot) return;

    // Check for the @FactChecker command and message reference
    if (message.content.startsWith('!factcheck') && message.reference) {

        //Calls the factcheckCommand function from ./commands/factcheck
        await factCheckCommand(message);
    }

});

//Bot Login
client.login(BOT_TOKEN);