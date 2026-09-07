const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    PermissionsBitField
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = process.env.TOKEN;

if (!TOKEN) {
    console.error('❌ ما حصلت TOKEN في Secrets');
    process.exit(1);
}

const prefix = '!';

const kickMessages = [
    '🚪 تم طرد {user} بأمر {executor} — روحة بلا رَدّة 😂',
    '🚪 تم طرد {user} بأمر {executor} — الباب من هناك يا أخوي 👋',
    '🚪 تم طرد {user} بأمر {executor} — مع السلامة 😂',
    '🚪 تم طرد {user} بأمر {executor} — الله يستر عليك 😂',
    '🚪 تم طرد {user} بأمر {executor} — الرحلة انتهت هنا 🚪',
    '🚪 تم طرد {user} بأمر {executor} — نورتنا وطلعتنا 😂',
    '🚪 تم طرد {user} بأمر {executor} — خروج اضطراري 🚨',
    '🚪 تم طرد {user} بأمر {executor} — الباب مفتوح، تفضل 😂',
    '🚪 تم طرد {user} بأمر {executor} — نشوفك على خير 👋',
    '🚪 تم طرد {user} بأمر {executor} — انتهى المشوار 😂',
    '🚪 تم طرد {user} بأمر {executor} — مع السلامة يا أسطورة 👋',
    '🚪 تم طرد {user} بأمر {executor} — وقت المغادرة حان ⏰',
    '🚪 تم طرد {user} بأمر {executor} — تشرفنا، الطريق من هنا 😂',
    '🚪 تم طرد {user} بأمر {executor} — تم تسجيل المغادرة 🚪',
    '🚪 تم طرد {user} بأمر {executor} — خلاص يا حبيبنا 😂',
    '🚪 تم طرد {user} بأمر {executor} — انتهى الدور 🎭',
    '🚪 تم طرد {user} بأمر {executor} — رحلة موفقة خارج السيرفر 😂',
    '🚪 تم طرد {user} بأمر {executor} — نورت VOLT، والآن مع السلامة ⚡',
    '🚪 تم طرد {user} بأمر {executor} — الباب ينتظرك 😂🚪',
    '🚪 تم طرد {user} بأمر {executor} — خروجك تم بنجاح ✅'
];

const warnMessages = [
    '⚠️ انتبه يا {user}، خلك هادي 😂',
    '⚠️ يا {user}، هذا تنبيه خفيف بس 👀',
    '⚠️ {user}، وقف شوي وراجع نفسك 😂',
    '⚠️ تنبيه لـ {user} — لا تخلينا نكررها 😭',
    '⚠️ {user}، خلك على السليم يا أخوي 😂',
    '⚠️ تم تنبيه {user} — المرة الجاية انتبه أكثر.',
    '⚠️ {user}، نبهناك يا بطل، لا تعيدها 😂',
    '⚠️ يا {user}، خذها نصيحة قبل لا تكبر السالفة 👀',
    '⚠️ {user}، شد حيلك وخلك ملتزم 😂',
    '⚠️ تنبيه رسمي لـ {user} — انتبه يا حبيبنا.',
    '⚠️ {user}، هذي لفتة انتباه قبل التصعيد 👀',
    '⚠️ تم تسجيل تنبيه على {user}.',
    '⚠️ {user}، خلنا نعدّيها هالمرة 😂',
    '⚠️ يا {user}، لا نبي نكرر التنبيه 😭',
    '⚠️ {user}، رجاءً التزم بالقوانين.',
    '⚠️ تم تنبيه {user} — انتبه المرة الجاية 😂',
    '⚠️ {user}، وصلت الرسالة؟ 👀',
    '⚠️ تنبيه لـ {user} — خلك رايق والتزم بالنظام.',
    '⚠️ {user}، لا نبي نشوف نفس المخالفة مرة ثانية 😂',
    '⚠️ تم تنبيه {user} — نبيك معنا بدون مخالفات ❤️'
];

const timeoutMessages = [
    '🔇 {user}، اسكت شوي يا أخوي 😂',
    '⏳ {user}، خذ لك تايم أوت واهدأ شوي.',
    '🔇 بلّع الراديو يا {user} 😂',
    '⏳ {user}، نحتاج هدوء شوي 😂',
    '🔇 يا {user}، خف علينا السوالف شوي 😭',
    '⏳ تم إعطاء {user} تايم أوت — ارجع بعدين 😂',
    '🔇 {user}، خذ بريك من الكلام شوي.',
    '⏳ يا {user}، وقت الراحة حان 😂',
    '🔇 {user}، خل المايك يرتاح شوي 😂',
    '⏳ تم إعطاء {user} تايم أوت.',
    '🔇 {user}، دقيقة صمت لو سمحت 😂',
    '⏳ {user}، ارجع لنا بعد ما يخلص التايم أوت.',
    '🔇 يا {user}، هدّ اللعب شوي 😂',
    '⏳ {user}، نبي هدوء في VOLT ⚡',
    '🔇 اسكت شوي يا {user} 😂',
    '⏳ {user}، خذ استراحة بسيطة.',
    '🔇 {user}، مرات ما تمل وانت تسولف؟ 😂',
    '⏳ تم إيقاف كلام {user} مؤقتًا.',
    '🔇 {user}، خلنا نرتاح من السوالف شوي 😭',
    '⏳ تايم أوت لـ {user} — ونرجع نكمل 😂'
];

const linkMessages = [
    '🔗 {user}، وش رسلت؟ اعترف 😂',
    '🔗 يا {user}، وش هالرابط؟ 👀',
    '🔗 {user}، الرابط هذا يحتاج تحقيق 😂',
    '🔗 تم رصد رابط من {user} 👀',
    '🔗 {user}، الروابط مو هنا يا أخوي 😂',
    '🔗 يا {user}، وش جالس ترسل لنا؟ 😭',
    '🔗 {user}، امسك نفسك عن الروابط شوي 😂',
    '🔗 رابط جديد من {user} — الوضع مشبوه 👀',
    '🔗 {user}، نعترف؟ وش رسلت؟ 😂',
    '🔗 تم اكتشاف رابط — {user} هو المتهم 😂',
    '🔗 {user}، الرابط وصلنا يا بطل.',
    '🔗 يا {user}، خفف روابط شوي 😂',
    '🔗 {user}، وش السر وراء الرابط؟ 👀',
    '🔗 رابط؟ في VOLT؟ 😭',
    '🔗 {user}، لا ترسل روابط هنا يا أخوي.',
    '🔗 تم رصد إرسال رابط من {user}.',
    '🔗 {user}، وش رسلت ها؟ اعترف 😂',
    '🔗 يا {user}، الرابط هذا مو مكانه هنا.',
    '🔗 {user}، وقف الروابط وخلك معنا 😂',
    '🔗 تم التقاط الرابط — حاول مرة ثانية؟ 😂'
];

function randomMessage(list, user, executor) {
    return list[Math.floor(Math.random() * list.length)]
        .replaceAll('{user}', user)
        .replaceAll('{executor}', executor);
}

function embed(title, description) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(0x5865F2)
        .setTimestamp();
}

client.once('ready', () => {
    console.log(`⚡ تم تشغيل VOLT: ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    if (
        /https?:\/\/\S+/i.test(message.content) &&
        !message.content.startsWith(prefix)
    ) {
        await message.channel.send(
            randomMessage(
                linkMessages,
                `<@${message.author.id}>`,
                message.author.username
            )
        );
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const command = args.shift()?.toLowerCase();

    const target =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);

    if (command === 'اوامر') {
        const e = new EmbedBuilder()
            .setTitle('⚡ أوامر VOLT')
            .setDescription(`
**🛡️ الإدارة**
\`!تنبيه @عضو\`
\`!تايم @عضو\`
\`!طرد @عضو\`
\`!سجن @عضو\`
\`!فك-سجن @عضو\`
\`!قفل\`
\`!فتح\`
\`!مسح 10\`

**🎮 الألعاب**
\`!حظ\`
\`!نرد\`
\`!عملة\`
\`!تخمين\`
\`!رياضيات\`
\`!سرعة\`

**👤 الأعضاء**
\`!افتار\`
\`!معلومات @عضو\`
\`!ايدي\`
\`!مستخدم\`

**🏠 السيرفر**
\`!سيرفر\`
\`!اعضاء\`
\`!احصائيات\`
\`!روم\`

**🤖 البوت**
\`!بنق\`
\`!بوت\`
\`!وقت\`
\`!تاريخ\`
            `)
            .setColor(0x5865F2);

        return message.channel.send({ embeds: [e] });
    }

    if (command === 'بنق') {
        return message.channel.send(`🏓 بنق VOLT: **${client.ws.ping}ms**`);
    }

    if (command === 'بوت') {
        const e = embed(
            '🤖 معلومات VOLT',
            `**الاسم:** ${client.user.username}\n**ID:** ${client.user.id}\n**البنق:** ${client.ws.ping}ms`
        ).setThumbnail(client.user.displayAvatarURL());

        return message.channel.send({ embeds: [e] });
    }

    if (command === 'افتار') {
        const user = target?.user || message.author;

        const e = new EmbedBuilder()
            .setTitle(`🖼️ افتار ${user.username}`)
            .setImage(user.displayAvatarURL({ size: 1024 }))
            .setColor(0x5865F2);

        return message.channel.send({ embeds: [e] });
    }

    if (command === 'معلومات') {
        const user = target?.user || message.author;

        const e = embed(
            `👤 معلومات ${user.username}`,
            `**الاسم:** ${user.username}\n**ID:** ${user.id}\n**الحساب:** <t:${Math.floor(user.createdTimestamp / 1000)}:F>`
        ).setThumbnail(user.displayAvatarURL());

        return message.channel.send({ embeds: [e] });
    }

    if (command === 'مستخدم') {
        const user = message.author;

        return message.channel.send({
            embeds: [
                embed(
                    '👤 معلوماتك',
                    `**الاسم:** ${user.username}\n**ID:** ${user.id}\n**تاريخ الحساب:** <t:${Math.floor(user.createdTimestamp / 1000)}:F>`
                ).setThumbnail(user.displayAvatarURL())
            ]
        });
    }

    if (command === 'ايدي') {
        return message.channel.send(`🆔 ID حقك: \`${message.author.id}\``);
    }

    if (command === 'اعضاء') {
        return message.channel.send(
            `👥 عدد أعضاء السيرفر: **${message.guild.memberCount}**`
        );
    }

    if (command === 'سيرفر') {
        const g = message.guild;

        return message.channel.send({
            embeds: [
                embed(
                    `🏠 ${g.name}`,
                    `**👥 الأعضاء:** ${g.memberCount}\n**💬 الرومات:** ${g.channels.cache.size}\n**🎭 الرتب:** ${g.roles.cache.size}`
                ).setThumbnail(g.iconURL())
            ]
        });
    }

    if (command === 'احصائيات') {
        return message.channel.send({
            embeds: [
                embed(
                    '📊 إحصائيات VOLT',
                    `👥 الأعضاء: **${message.guild.memberCount}**\n💬 الرومات: **${message.guild.channels.cache.size}**\n🎭 الرتب: **${message.guild.roles.cache.size}**`
                )
            ]
        });
    }

    if (command === 'روم') {
        return message.channel.send(
            `📁 الروم الحالي: ${message.channel}\n🆔 ID: \`${message.channel.id}\``
        );
    }

    if (command === 'وقت') {
        return message.channel.send(
            `🕐 الوقت: **${new Date().toLocaleTimeString('ar-SA', {
                timeZone: 'Asia/Riyadh'
            })}**`
        );
    }

    if (command === 'تاريخ') {
        return message.channel.send(
            `📅 التاريخ: **${new Date().toLocaleDateString('ar-SA', {
                timeZone: 'Asia/Riyadh'
            })}**`
        );
    }

    if (command === 'تنبيه') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('❌ ما عندك صلاحية التنبيه.');
        }

        if (!target) {
            return message.reply('❌ منشن العضو أول.');
        }

        return message.channel.send(
            randomMessage(
                warnMessages,
                `<@${target.id}>`,
                message.author.username
            )
        );
    }

    if (command === 'تايم') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('❌ ما عندك صلاحية التايم أوت.');
        }

        if (!target) {
            return message.reply('❌ منشن العضو أول.');
        }

        const minutes = Math.min(
            Math.max(parseInt(args[0]) || 10, 1),
            40320
        );

        try {
            await target.timeout(
                minutes * 60 * 1000,
                `Timeout بواسطة ${message.author.username}`
            );

            return message.channel.send(
                `${randomMessage(
                    timeoutMessages,
                    `<@${target.id}>`,
                    message.author.username
                )}\n⏱️ المدة: **${minutes} دقيقة**`
            );
        } catch {
            return message.reply(
                '❌ ما قدرت أعطيه تايم أوت. تأكد من صلاحيات البوت وترتيب الرتب.'
            );
        }
    }

    if (command === 'طرد') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('❌ ما عندك صلاحية الطرد.');
        }

        if (!target) {
            return message.reply('❌ منشن العضو أول.');
        }

        try {
            await target.kick(`طرد بواسطة ${message.author.username}`);

            return message.channel.send(
                randomMessage(
                    kickMessages,
                    `<@${target.id}>`,
                    message.author.username
                )
            );
        } catch {
            return message.reply(
                '❌ ما قدرت أطرده. تأكد من صلاحيات البوت وترتيب الرتب.'
            );
        }
    }

    if (command === 'سجن') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return message.reply('❌ ما عندك صلاحية إدارة الرتب.');
        }

        if (!target) {
            return message.reply('❌ منشن العضو أول.');
        }

        let jailRole = message.guild.roles.cache.find(
            r => r.name === '🔒 سجن'
        );

        try {
            if (!jailRole) {
                jailRole = await message.guild.roles.create({
                    name: '🔒 سجن',
                    reason: 'رتبة سجن VOLT'
                });
            }

            await target.roles.add(jailRole);

            return message.channel.send(
                `🔒 تم سجن <@${target.id}> بواسطة **${message.author.username}** 😂`
            );
        } catch {
            return message.reply(
                '❌ ما قدرت أسجنه. تأكد من صلاحيات البوت وترتيب الرتب.'
            );
        }
    }

    if (command === 'فك-سجن') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return message.reply('❌ ما عندك صلاحية إدارة الرتب.');
        }

        if (!target) {
            return message.reply('❌ منشن العضو أول.');
        }

        const jailRole = message.guild.roles.cache.find(
            r => r.name === '🔒 سجن'
        );

        if (!jailRole) {
            return message.reply('❌ ما فيه رتبة سجن.');
        }

        try {
            await target.roles.remove(jailRole);

            return message.channel.send(
                `🔓 تم فك سجن <@${target.id}> بواسطة **${message.author.username}**.`
            );
        } catch {
            return message.reply('❌ ما قدرت أفك السجن.');
        }
    }

    if (command === 'قفل') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('❌ ما عندك صلاحية إدارة الرومات.');
        }

        try {
            await message.channel.permissionOverwrites.edit(
                message.guild.roles.everyone,
                { SendMessages: false }
            );

            return message.channel.send('🔒 تم قفل الروم.');
        } catch {
            return message.reply('❌ ما قدرت أقفل الروم.');
        }
    }

    if (command === 'فتح') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('❌ ما عندك صلاحية إدارة الرومات.');
        }

        try {
            await message.channel.permissionOverwrites.edit(
                message.guild.roles.everyone,
                { SendMessages: true }
            );

            return message.channel.send('🔓 تم فتح الروم.');
        } catch {
            return message.reply('❌ ما قدرت أفتح الروم.');
        }
    }

    if (command === 'مسح') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('❌ ما عندك صلاحية مسح الرسائل.');
        }

        const amount = Math.min(
            Math.max(parseInt(args[0]) || 10, 1),
            100
        );

        try {
            await message.channel.bulkDelete(amount, true);

            const msg = await message.channel.send(
                `🧹 تم مسح **${amount}** رسالة.`
            );

            setTimeout(() => msg.delete().catch(() => {}), 3000);
        } catch {
            return message.reply('❌ ما قدرت أمسح الرسائل.');
        }
    }

    if (command === 'حظ') {
        const results = [
            '🍀 حظك اليوم ممتاز!',
            '😎 الحظ معك اليوم.',
            '😂 الحظ نايم اليوم.',
            '🔥 اليوم يومك!',
            '👀 جرب مرة ثانية يمكن يضبط.'
        ];

        return message.channel.send(
            `${message.author} ${results[Math.floor(Math.random() * results.length)]}`
        );
    }

    if (command === 'نرد') {
        const number = Math.floor(Math.random() * 6) + 1;

        return message.channel.send(
            `🎲 ${message.author} رمى النرد وطلع له: **${number}**`
        );
    }

    if (command === 'عملة') {
        const result = Math.random() < 0.5 ? '🪙 وجه' : '🪙 كتابة';

        return message.channel.send(
            `${message.author} قلب العملة وطلعت: **${result}**`
        );
    }

    if (command === 'تخمين') {
        const number = Math.floor(Math.random() * 10) + 1;

        return message.channel.send(
            `🎯 رقم عشوائي من 1 إلى 10: **${number}**`
        );
    }

    if (command === 'رياضيات') {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;

        return message.channel.send(
            `🧠 حلها يا ${message.author}: **${a} + ${b} = ؟**`
        );
    }

    if (command === 'سرعة') {
        const start = Date.now();

        const msg = await message.channel.send(
            '⚡ ارسل أي شيء بسرعة!'
        );

        const collector = message.channel.createMessageCollector({
            filter: m => m.author.id === message.author.id,
            max: 1,
            time: 10000
        });

        collector.on('collect', async () => {
            const time = Date.now() - start;

            await msg.edit(`⚡ سرعتك: **${time}ms**`);
        });

        collector.on('end', collected => {
            if (!collected.size) {
                msg.edit('⌛ تأخرت 😂').catch(() => {});
            }
        });
    }
});

client.login(TOKEN);
