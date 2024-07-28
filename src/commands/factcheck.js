const axios = require('axios');
const { CHATGPT_API_URL, CHATGPT_API_KEY } = require('../../config/config.json');

//Function for using ChatGPT API and checking fact
async function factCheckCommand(message) {

    //Bot fetches message content
    const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
    const text = referencedMessage.content;

    //Gives acknoledgement
    await message.channel.send('Checking facts, please wait...');

    try {
        //API request to ChatGPT
        const response = await axios.post(CHATGPT_API_URL, {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 
                `Fact-check the following message and respond with whether the following statement is factual or ficticious. If it is factual, say that it is factual and provide a link to a website that supports your claim. If it is ficticious say that is ficticious and provide a link to a website that supports your claim: "${text}"` 
            }]
        }, {
            headers: {
                'Authorization': `Bearer ${CHATGPT_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        //Returns ChatGPT's response
        const factCheckResult = response.data.choices[0].message.content;

        //Sends the response back to the appropriate channel
        await message.channel.send(`${factCheckResult}`);
    } catch (error) {
        //Deals with any errors that may occur during fact check
        if (error.response && error.response.status === 429) {
            console.error('Rate limit exceeded. Retrying later...');
            await message.channel.send('Rate limit exceeded. Please try again later.');
        } else {
            console.error('Error checking facts: Error Code:', error.response.status);
            await message.channel.send('There was an error checking the facts.');
        }
    }
}

module.exports = { factCheckCommand };