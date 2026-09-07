const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  ["اوامر", "عرض جميع أوامر البوت"],
  ["بنق", "معرفة سرعة استجابة البوت"],
  ["افتار", "عرض افتار عضو"],
  ["معلومات", "معلومات عن عضو"],
  ["سيرفر", "معلومات السيرفر"],
  ["مستخدم", "معلومات حسابك"],
  ["رتب", "عرض رتب السيرفر"],
  ["اعضاء", "عدد أعضاء السيرفر"],
  ["بوت", "معلومات البوت"],
  ["وقت", "عرض الوقت"],
  ["تاريخ", "عرض التاريخ"],
  ["مساعدة", "معلومات عن استخدام البوت"],
  ["رابط", "رابط دعوة البوت"],
  ["صورة", "عرض صورة عضو"],
  ["احصائيات", "إحصائيات السيرفر"],
  ["روم", "معلومات الروم الحالي"],
  ["ايدي", "عرض الـ ID"],
  ["تاريخ-الحساب", "معرفة تاريخ إنشاء الحساب"]
].map(([name, description]) =>
  new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .toJSON()
);

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    { body: commands }
  );
})();

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.commandName;

  if (command === "اوامر") {
    const embed = new EmbedBuilder()
      .setTitle("📋 أوامر البوت")
      .addFields(
        {
          name: "🛠️ الأوامر العامة",
          value:
            "`/اوامر` — عرض جميع الأوامر\n" +
            "`/مساعدة` — معلومات عن استخدام البوت\n" +
            "`/بنق` — معرفة سرعة البوت\n" +
            "`/بوت` — معلومات البوت"
        },
        {
          name: "👤 أوامر الأعضاء",
          value:
            "`/معلومات` — معلومات عن عضو\n" +
            "`/مستخدم` — معلومات حسابك\n" +
            "`/افتار` — عرض افتار عضو\n" +
            "`/صورة` — عرض صورة عضو\n" +
            "`/ايدي` — عرض الـ ID\n" +
            "`/تاريخ-الحساب` — تاريخ إنشاء الحساب"
        },
        {
          name: "🏠 أوامر السيرفر",
          value:
            "`/سيرفر` — معلومات السيرفر\n" +
            "`/اعضاء` — عدد أعضاء السيرفر\n" +
            "`/رتب` — عرض رتب السيرفر\n" +
            "`/روم` — معلومات الروم\n" +
            "`/احصائيات` — إحصائيات السيرفر"
        },
        {
          name: "🕐 الوقت والتاريخ",
          value:
            "`/وقت` — عرض الوقت\n" +
            "`/تاريخ` — عرض التاريخ"
        },
        {
          name: "🔗 الروابط",
          value: "`/رابط` — رابط دعوة البوت"
        }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }

  if (command === "بنق") {
    return interaction.reply(`🏓 البنق: **${client.ws.ping}ms**`);
  }

  if (command === "افتار" || command === "صورة") {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`🖼️ صورة ${interaction.user.username}`)
          .setImage(interaction.user.displayAvatarURL({ size: 1024 }))
      ]
    });
  }

  if (command === "معلومات" || command === "مستخدم") {
    const user = interaction.user;
    return interaction.reply(
      `👤 **معلومات العضو**\n\nالاسم: **${user.username}**\n🆔 ID: **${user.id}**`
    );
  }

  if (command === "سيرفر") {
    return interaction.reply(
      `🏠 **${interaction.guild.name}**\n👥 الأعضاء: **${interaction.guild.memberCount}**\n🆔 ID: **${interaction.guild.id}**`
    );
  }

  if (command === "اعضاء") {
    return interaction.reply(
      `👥 عدد أعضاء السيرفر: **${interaction.guild.memberCount}**`
    );
  }

  if (command === "رتب") {
    const roles = interaction.guild.roles.cache
      .filter(role => role.id !== interaction.guild.id)
      .map(role => `• ${role.name}`)
      .slice(0, 30);

    return interaction.reply(
      `🎖️ **رتب السيرفر**\n\n${roles.join("\n") || "لا توجد رتب"}`
    );
  }

  if (command === "بوت") {
    return interaction.reply(
      `🤖 **${client.user.username}**\n🏓 البنق: **${client.ws.ping}ms**`
    );
  }

  if (command === "وقت") {
    const time = new Date().toLocaleTimeString("ar-SA", {
      timeZone: "Asia/Riyadh"
    });
    return interaction.reply(`🕐 الوقت: **${time}**`);
  }

  if (command === "تاريخ") {
    const date = new Date().toLocaleDateString("ar-SA", {
      timeZone: "Asia/Riyadh",
      dateStyle: "full"
    });
    return interaction.reply(`📅 التاريخ: **${date}**`);
  }

  if (command === "مساعدة") {
    return interaction.reply("💡 اكتب `/اوامر` لعرض جميع الأوامر المتوفرة.");
  }

  if (command === "رابط") {
    return interaction.reply(
      `🔗 https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=0&scope=bot%20applications.commands`
    );
  }

  if (command === "احصائيات") {
    const guild = interaction.guild;
    return interaction.reply(
      `📊 **إحصائيات السيرفر**\n\n👥 الأعضاء: **${guild.memberCount}**\n💬 الرومات: **${guild.channels.cache.size}**\n🎖️ الرتب: **${guild.roles.cache.size - 1}**`
    );
  }

  if (command === "روم") {
    return interaction.reply(
      `📌 **الروم الحالي**\n\nالاسم: **${interaction.channel.name}**\n🆔 ID: **${interaction.channel.id}**`
    );
  }

  if (command === "ايدي") {
    return interaction.reply(
      `🆔 ID الخاص بك:\n**${interaction.user.id}**`
    );
  }

  if (command === "تاريخ-الحساب") {
    return interaction.reply(
      `📅 تاريخ إنشاء حسابك:\n<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:F>`
    );
  }
});

client.once("ready", () => {
  console.log(`تم تشغيل البوت: ${client.user.tag} ✅`);
});

client.login(TOKEN);MTU0MzkyODEyNTYzMTUwMDM4MA.GYxYHy.F86vX2Y7uc-pDMluI6Dsu_zS2i5ut2kp3hYr1w
