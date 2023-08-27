require("dotenv").config();
const {
  Client,
  IntentsBitField,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.login(TOKEN);

const commands = [
  {
    name: "hello",
    description: "Replies to this command",
    options: [],
  },
  {
    name: "yt",
    description: "Replies with a youtube channel",
    options: [],
  },
  {
    name: "clear",
    description: "Deletes Messages",
    options: [
      {
        name: "num_of_messages",
        description: "Enter the number of messages to be deleted",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },
  {
    name: "kick",
    description: "Kicks a member",
    options: [
      {
        name: "user",
        description: "Mention the user to be kicked",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.KickMembers],
  },
  {
    name: "ban",
    description: "Bans a member",
    options: [
      {
        name: "user",
        description: "Mention the user to be banned",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
  },
];

client.on("ready", async () => {
  console.log("Hello bot is online!");
  let server = await client.guilds.fetch("1143066380791455816");
  let applicationCommands = await server.commands;

  for (let index in commands) {
    let command = commands[index];
    await applicationCommands.create(command);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.commandName == "hello") {
    interaction.reply({ content: "Hai", ephemeral: true });
  }
  if (interaction.commandName == "yt") {
    interaction.reply({
      content: "https://www.youtube.com/channel/UCEOHwjMTAqy0LI-lQ2Ag3tA",
      ephemeral: true,
    });
  }
  if (interaction.commandName == "clear") {
    const option = interaction.options.get("num_of_messages").value;
    await interaction.channel.bulkDelete(option);
    interaction.reply({
      content: `Deleted ${option} messages`,
      ephemeral: true,
    });
  }
  if (interaction.commandName == "kick") {
    await interaction.deferReply();
    const option = interaction.options.get("user").value;
    const user = await interaction.guild.members.fetch(option);
    user.kick();
    interaction.editReply({ content: `${user} have been kicked` });
  }
  if (interaction.commandName == "ban") {
    await interaction.deferReply();
    const option = interaction.options.get("user").value;
    const user = await interaction.guild.members.fetch(option);
    user.ban();
    interaction.editReply({
      content: `${user} have been banned by ${interaction.user}`,
    });
  }
});
