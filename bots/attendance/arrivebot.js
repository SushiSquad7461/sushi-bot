import { Client, GatewayIntentBits } from 'discord.js';

export default function createArrivalBot(token, notion, attendees) {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
        ],
    });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('messageCreate', async (message) => {
        if (message.mentions.has(client.user) && message.author !== client.user) {
            const user = `${message.author.username}#${message.author.discriminator}`;
            const date = new Date(message.createdTimestamp);

            let ping = attendees.attendees_id.map(id => `<@${id}>`).join(" ");

            try {
                await notion.markPresent(message.author.username + "#" + message.author.discriminator, date);
            } catch (error) {
                console.warn(`ArriveBot: Failed to mark user "${user}" as present.`, error);
            }

            if (ping === "") {
                ping = `Welcome, <@${message.author.id}>. There is no one here yet.`;
            } else {
                const messageContentWithoutPing = message.content.replace(`<@${client.user.id}>`, "").trim();

                // keep message content first so people see that first on their phone notifications
                ping = `${messageContentWithoutPing} ${ping}`;
            }

            if (message.content.includes("door") || message.content.includes("inner")) {
                message.reply(ping);
            } else {
                message.reply(`Welcome, <@${message.author.id}>. If you need to be let in, please specify which door you're at.`);
            }

            if (!attendees.findAttendee(message.author.id)) {
                try {
                    await notion.logPing(false, user);
                } catch (error) {
                    console.warn(`ArriveBot: Failed to log attendance for user "${user}".`, error);
                }

                attendees.addAttendee(user, message.author.id);
            }
        }
    });

    client.login(token);

    return client;
}