const {
  Client,
  GatewayIntentBits,
  PermissionFlagsBits
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = '!';

const warnings = new Map();
const points = new Map();

const TICKET_CHANNEL_ID = '1540913079863353347';

const banMessages = [
  '🔨 تم تبنيد {user}، روحه بلا رده.',
  '🔨 تم تبنيد {user}، الباب من هنا 🚪',
  '🔨 انتهت رحلتك يا {user}، يلا دحدر.'
];

const warningMessages = [
  '⚠️ يا {user}، تبي تخرب القروب؟ انتبه بيب.',
  '⚠️ ياحب {user}، انتبه 🎀'
];

const timeoutMessages = [
  '⏳ تايم اوت {user}، سد حلقك بالع راديو 📻',
  '⏳ تايم اوت {user}، خذ لك بريك واهدأ شوي 🎀',
  '⏳ تايم اوت {user}، الراديو لك اليوم 📻',
  '⏳ تايم اوت {user}، اسكت شوي وخلنا نروق 😂',
  '⏳ تايم اوت {user}، وقت الهدوء حان 🤐'
];

function isAdmin(member) {
  return member.permissions.has(
    PermissionFlagsBits.Administrator
  );
}

function randomMessage(array, user) {
  return array[
    Math.floor(Math.random() * array.length)
  ].replace('{user}', user);
}

function addPoint(userId) {
  points.set(
    userId,
    (points.get(userId) || 0) + 1
  );
}

client.once('ready', () => {
  console.log(`✅ VOLT Bot شغال باسم ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/\s+/);

  const command = args.shift()?.toLowerCase();

  const adminCommands = [
    'بان',
    'فكبان',
    'طرد',
    'تايم',
    'فكتايم',
    'سجن',
    'تحذير',
    'تحذيرات',
    'مسح',
    'قفل',
    'فتح',
    'اخفاء',
    'اظهار',
    'رتبة',
    'فكرتبة'
  ];

  if (adminCommands.includes(command) && !isAdmin(message.member)) {
    return message.reply('❌ هذا الأمر للإدارة فقط.');
  }

  if (command === 'بان') {
    const member = message.mentions.members.first();
    if (!member) return message.reply('❌ منشن الشخص.');
    if (!member.bannable) return message.reply('❌ ما أقدر أبند هذا الشخص.');

    await member.ban();

    return message.reply(
      randomMessage(banMessages, member.user.tag)
    );
  }

  if (command === 'فكبان') {
    const userId = args[0];
    if (!userId) return message.reply('❌ حط آيدي الشخص.');

    try {
      await message.guild.members.unban(userId);
      return message.reply(`✅ تم فك البان عن <@${userId}>.`);
    } catch {
      return message.reply('❌ ما لقيت هذا الشخص ضمن المبندين.');
    }
  }

  if (command === 'طرد') {
    const member = message.mentions.members.first();
    if (!member) return message.reply('❌ منشن الشخص.');
    if (!member.kickable) return message.reply('❌ ما أقدر أطرد هذا الشخص.');

    await member.kick();

    return message.reply(`👢 تم طرد ${member.user.tag}.`);
  }

  if (command === 'تايم') {
    const member = message.mentions.members.first();
    const days = Number(args[1]);

    if (!member) return message.reply('❌ منشن الشخص.');
    if (!days || days < 1 || days > 28)
      return message.reply('❌ حدد المدة بالأيام من 1 إلى 28.');
    if (!member.moderatable)
      return message.reply('❌ ما أقدر أعطيه تايم أوت.');

    await member.timeout(days * 24 * 60 * 60 * 1000);

    return message.reply(
      randomMessage(timeoutMessages, member.user.tag)
    );
  }

  if (command === 'فكتايم') {
    const member = message.mentions.members.first();
    if (!member) return message.reply('❌ منشن الشخص.');

    await member.timeout(null);

    return message.reply(`✅ تم فك التايم عن ${member.user.tag}.`);
  }

  if (command === 'سجن') {
    const member = message.mentions.members.first();
    if (!member) return message.reply('❌ منشن الشخص.');

    const channels = message.guild.channels.cache.filter(
      channel => channel.isTextBased()
    );

    for (const [, channel] of channels) {
      if (channel.id === TICKET_CHANNEL_ID) {
        await channel.permissionOverwrites.edit(member, {
          ViewChannel: true,
          SendMessages: true
        }).catch(() => {});
      } else {
        await channel.permissionOverwrites.edit(member, {
          SendMessages: false
        }).catch(() => {});
      }
    }

    return message.reply(
      `🔒 تم سجن ${member.user.tag}، يقدر يكتب فقط في روم التكتات.`
    );
  }

  if (command === 'تحذير') {
    const member = message.mentions.members.first();
    if (!member) return message.reply('❌ منشن الشخص.');

    const count = (warnings.get(member.id) || 0) + 1;
    warnings.set(member.id, count);

    return message.reply(
      randomMessage(warningMessages, member.user.tag) +
      `\n📌 عدد تحذيراته: ${count}`
    );
  }

  if (command === 'تحذيرات') {
    const member =
      message.mentions.members.first() ||
      message.member;

    const count = warnings.get(member.id) || 0;

    return message.reply(
      `⚠️ تحذيرات ${member.user.tag}: ${count}`
    );
  }

  if (command === 'مسح') {
    const amount = Number(args[0]);

    if (!amount || amount < 1 || amount > 100)
      return message.reply('❌ اكتب رقم من 1 إلى 100.');

    await message.channel.bulkDelete(amount, true);

    return message.channel.send(`🧹 تم مسح ${amount} رسالة.`);
  }

  if (command === 'قفل') {
    await message.channel.permissionOverwrites.edit(
      message.guild.roles.everyone,
      { SendMessages: false }
    );

    return message.reply('🔒 تم قفل الروم.');
  }

  if (command === 'فتح') {
    await message.channel.permissionOverwrites.edit(
      message.guild.roles.everyone,
      { SendMessages: null }
    );

    return message.reply('🔓 تم فتح الروم.');
  }

  if (command === 'اخفاء') {
    await message.channel.permissionOverwrites.edit(
      message.guild.roles.everyone,
      { ViewChannel: false }
    );

    return message.reply('👻 تم إخفاء الروم.');
  }

  if (command === 'اظهار') {
    await message.channel.permissionOverwrites.edit(
      message.guild.roles.everyone,
      { ViewChannel: null }
    );

    return message.reply('👀 تم إظهار الروم.');
  }

  if (command === 'رتبة') {
    const member = message.mentions.members.first();
    const role = message.mentions.roles.first();

    if (!member || !role)
      return message.reply('❌ الاستخدام: !رتبة @الشخص @الرتبة');

    if (
      role.position >=
      message.guild.members.me.roles.highest.position
    )
      return message.reply('❌ ما أقدر أعطي رتبة أعلى من رتبتي.');

    await member.roles.add(role);

    return message.reply(
      `✅ تم إعطاء ${member.user.tag} رتبة ${role.name}.`
    );
  }

  if (command === 'فكرتبة') {
    const member = message.mentions.members.first();
    const role = message.mentions.roles.first();

    if (!member || !role)
      return message.reply('❌ الاستخدام: !فكرتبة @الشخص @الرتبة');

    await member.roles.remove(role);

    return message.reply(
      `✅ تم إزالة رتبة ${role.name} من ${member.user.tag}.`
    );
  }

  if (command === 'معلومات') {
    const member =
      message.mentions.members.first() ||
      message.member;

    return message.reply(
      `👤 **المعلومات**\n` +
      `الاسم: ${member.user.tag}\n` +
      `🆔 الآيدي: ${member.id}\n` +
      `🎭 عدد الرتب: ${member.roles.cache.size - 1}`
    );
  }

  if (command === 'سيرفر') {
    return message.reply(
      `🏠 **معلومات السيرفر**\n` +
      `الاسم: ${message.guild.name}\n` +
      `👥 الأعضاء: ${message.guild.memberCount}`
    );
  }

  if (command === 'صورة') {
    const member =
      message.mentions.members.first() ||
      message.member;

    return message.reply(
      member.user.displayAvatarURL({
        size: 1024,
        extension: 'png'
      })
    );
  }

  if (command === 'بينج') {
    return message.reply(`🏓 البينج: ${client.ws.ping}ms`);
  }

  if (command === 'مساعدة') {
    return message.reply(
      `📚 **أوامر VOLT**\n\n` +
      `🎮 **الألعاب للجميع:**\n` +
      `تخمين - حظ - نرد - عملة - رياضيات\n` +
      `اسرع - ترتيب - نقاطي - لغز - صحخطأ\n` +
      `اكس_او - حجر - ورق - مقص\n\n` +
      `ℹ️ **العامة:**\n` +
      `معلومات - سيرفر - صورة - بينج\n\n` +
      `👑 **الإدارة:**\n` +
      `بان - فكبان - طرد - تايم - فكتايم\n` +
      `سجن - تحذير - تحذيرات - مسح\n` +
      `قفل - فتح - اخفاء - اظهار\n` +
      `رتبة - فكرتبة`
    );
  }

  if (command === 'نرد') {
    const result = Math.floor(Math.random() * 6) + 1;
    addPoint(message.author.id);

    return message.reply(
      `🎲 طلع لك: **${result}**\n⭐ +1 نقطة`
    );
  }

  if (command === 'عملة') {
    const result =
      Math.random() < 0.5
        ? 'وجه 🪙'
        : 'كتابة 🪙';

    addPoint(message.author.id);

    return message.reply(
      `🪙 النتيجة: **${result}**\n⭐ +1 نقطة`
    );
  }

  if (command === 'حظ') {
    const luck = Math.floor(Math.random() * 101);
    addPoint(message.author.id);

    return message.reply(
      `🍀 نسبة حظك اليوم: **${luck}%**\n⭐ +1 نقطة`
    );
  }

  if (command === 'نقاطي') {
    const score = points.get(message.author.id) || 0;

    return message.reply(`⭐ نقاطك: **${score}**`);
  }

  if (command === 'ترتيب') {
    const ranking = [...points.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (!ranking.length)
      return message.reply('📊 ما فيه نقاط للحين.');

    let text = '🏆 **ترتيب النقاط**\n\n';

    for (let i = 0; i < ranking.length; i++) {
      const user = await client.users
        .fetch(ranking[i][0])
        .catch(() => null);

      if (user) {
        text += `${i + 1}. ${user.tag} — ⭐ ${ranking[i][1]}\n`;
      }
    }

    return message.reply(text);
  }

  if (command === 'حجر' || command === 'ورق' || command === 'مقص') {
    const choices = ['حجر 🪨', 'ورق 📄', 'مقص ✂️'];

    const bot =
      choices[Math.floor(Math.random() * choices.length)];

    return message.reply(
      `🎮 اخترت: **${command}**\n🤖 البوت اختار: **${bot}**`
    );
  }

  if (command === 'تخمين') {
    const number = Math.floor(Math.random() * 10) + 1;

    return message.reply(
      `🎯 خمن رقم من **1 إلى 10**!\n🔢 الرقم: **${number}**`
    );
  }

  if (command === 'رياضيات') {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;

    return message.reply(
      `🧮 كم يساوي **${a} + ${b}**؟`
    );
  }

  if (command === 'لغز') {
    return message.reply(
      '🧩 لغز:\nشيء له أسنان ولا يعض، وش هو؟'
    );
  }

  if (command === 'صحخطأ') {
    return message.reply(
      '❓ الشمس نجم.\nاكتب: **صح** أو **خطأ**'
    );
  }

  if (command === 'اسرع') {
    return message.reply(
      '⚡ أسرع واحد يكتب **VOLT** يفوز!'
    );
  }

  if (command === 'اكس_او') {
    return message.reply(
      '❌⭕ لعبة XO\nاكتب **X** أو **O** للبدء.'
    );
  }
});

client.login(process.env.TOKEN);
