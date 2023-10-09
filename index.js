// Dotenv

require('dotenv').config()

// TeleJsApi

const { TeleJsApi } = require('telejsapi')
const tele = new TeleJsApi(process.env.STRING,Number(process.env.API_ID),process.env.API_HASH)


// Telegraf Module

const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const stage = new Stage()
bot.use(session())
bot.use(stage.middleware())


// Mongoose Connection

const { connect, pluralize, model } = require('mongoose')
connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true } )
pluralize(null);

const userinfoSchema = require('./Database/userinfoSchema/userinfoSchema')
const Userinfo = model('userinfo', userinfoSchema);

const chatadsinfoSchema = require('./Database/chatadsinfoSchema/chatadsinfoSchema')
const Chatadsinfo = model('chatadsinfo', chatadsinfoSchema);

const botadsinfoSchema = require('./Database/botadsinfoSchema/botadsinfoSchema')
const Botadsinfo = model('botadsinfo', botadsinfoSchema);

const urladsinfoSchema = require('./Database/urladsinfoSchema/urladsinfoSchema')
const Urladsinfo = model('urladsinfo', urladsinfoSchema);

const postadsinfoSchema = require('./Database/postadsinfoSchema/postadsinfoSchema')
const Postadsinfo = model('postadsinfo', postadsinfoSchema);

const taskinfoSchema = require('./Database/taskinfoSchema/taskinfoSchema')
const Taskinfo = model('taskinfo', taskinfoSchema);

const sceneinfoSchema = require('./Database/sceneinfoSchema/sceneinfoSchema')
const Sceneinfo = model('sceneinfo', sceneinfoSchema);

const depositinfoSchema = require('./Database/depositinfoSchema/depositinfoSchema')
const Depositinfo = model('depositinfo', depositinfoSchema);

const withdrawinfoSchema = require('./Database/withdrawinfoSchema/withdrawinfoSchema')
const Withdrawinfo = model('withdrawinfo', withdrawinfoSchema);

const broadcastinfoSchema = require('./Database/broadcastinfoSchema/broadcastinfoSchema');
const Broadcastinfo = model('broadcastinfo', broadcastinfoSchema);



// Coinbase Connection

const { Client } = require('coinbase')
const client = new Client({'apiKey': process.env.COINBASE_API_KEY, 'apiSecret': process.env.COINBASE_API_SECRET, strictSSL: false });


// Third Party Module 

const axios = require('axios')
const validator = require('validator')


// Require Some Function

const { Escape, HtmlParser } = require('./Middleware/middleware')
const { TryCatchErrorHandler } = require('./Error/TryCatchErrorHandler/TryCatchErrorHandler')
const { ErrorMessageHandler } = require('./Error/ErrorMessageHandler/ErrorMessageHandler')
const { JoinChatsMessageHandler, DoneChat, SearchChatPendingTask, SkipChatAd } = require('./Task/JoinChatsMessageHandler/JoinChatsMessageHandler')
const { MessagebotsMessageHandler, Done_Bot_Start, SkipBotAd, Done_Bot_Finished } = require('./Task/MessagebotsMessageHandler/MessagebotsMessageHandler')
const { ViewPostsMessageHandler } = require('./Task/ViewPostsMessageHandler/ViewPostsMessageHandler')
const { VisitSitesMessageHandler, SkipUrlAd } = require('./Task/VisitSitesMessageHandler/VisitSitesMessageHandler')
const { MyadsMessageHandler, MyAdsMessageHandler } = require('./Myads/MyadsMessageHandler/MyadsMessageHandler')
const { NewAdMessageHandler } = require('./Handler/NewAdMessageHandler/NewAdMessageHandler')
const { NewChatStart, NewChatTitleStart, NewChatDescriptionStart, NewChatStayTimeStart, NewChatCpcStart, NewChatBudgetStart } = require('./NewAd/NewChatAdsMessageHandler/NewChatAdsMessageHandler')
const { NewBotStart, NewBotTitleStart, NewBotDescriptionStart, NewBotCpcStart, NewBotBudgetStart, NewBotLinkStart } = require('./NewAd/NewBotAdsMessageHandler/NewBotAdsMessageHandler')
const { NewUrlStart, NewUrlTitleStart, NewUrlDescriptionStart, NewUrlStayTimeStart, NewUrlCpcStart, NewUrlBudgetStart } = require('./NewAd/NewUrlAdsMessageHandler/NewUrlAdsMessageHandler')
const { NewPostStart, NewPostTypeStart, NewPostStayTimeStart, NewPostCpcStart, NewPostBudgetStart }  = require('./NewAd/NewPostAdsMessageHandler/NewPostAdsMessageHandler')
const { MyChatAdsMessageHandler, MyChatAdsList } = require('./Myads/MyChatAdsMessageHandler/MyChatAdsMessageHandler')
const { MyBotAdsMessageHandler, MyBotAdsList } = require('./Myads/MyBotAdsMessageHandler/MyBotAdsMessageHandler')
const { MyPostAdsMessageHandler, MyPostAdsList } = require('./Myads/MyPostAdsMessageHandler/MyPostAdsMessageHandler')
const { MyUrlAdsMessageHandler, MyUrlAdsList } = require('./Myads/MyUrlAdsMessageHandler/MyUrlAdsMessageHandler')
const { isBotAdmin, ChatType } = require('./ChatValidation/ChatValidation')
const { TitleValidation, CanceledNewAdMessage, DescriptionValidation, StayTimeValidation, CpcValidation, BudgetValidation, CanceledEditAdMessage, CanceledReportMessage, CanceledBotForwardMessage } = require('./Handler/AdsMessageHandler/AdsMessageHandler')
const { CreateNewChatAd } = require('./NewAd/CreateNewChatAd/CreateNewChatAd')
const { Edit_Title_Start, Edit_Title_Finished } = require('./Handler/EditTitleHandler/EditTitleHandler')
const { Edit_Description_Start, Edit_Description_Finished } = require('./Handler/EditDescriptionHandler/EditDescriptionHandler')
const { Edit_Ad_Start, Edit_Ad_Finished, EditBotLinkStart, EditPostStart } = require('./Handler/EditAdHandler/EditAdHandler')
const { Edit_Submission_Start, Edit_Submission_Finished } = require('./Handler/EditSubmissionHandler/EditSubmissionHandler')
const { Delete_Ad_Start, Delete_Ad_Finished } = require('./Handler/DeleteAdHandler/DeleteAdHandler')
const { isBot, isBotLink } = require('./BotValidation/BotValidation')
const { CreateNewBotAd } = require('./NewAd/CreateNewBotAd/CreateNewBotAd')
const { Report_Ad_Finished, Report_Ad_Start } = require('./Handler/ReportAdHandler/ReportAdHandler')
const { isURL } = require('./UrlValidation/UrlValidation')
const { CreateNewUrlAd } = require('./NewAd/CreateNewUrlAd/CreateNewUrlAd')
const { messageTypeCheck, messageContent } = require('./PostValidation/PostValidation')
const { CreateNewPostAd } = require('./NewAd/CreateNewPostAd/CreateNewPostAd')
const { pagination } = require('./Pagination/pagination')
const { SendTextMessage, ForwardMessage, PhotoMessage, VideoMessage } = require('./Broadcast/Broadcast')


// Always Run 

var botprocess = [0]

const ChatTypeChecker = async (ctx,next) => {

    if (ctx.chat.type == 'group' || ctx.chat.type == 'supergroup' || ctx.chat.type == 'channel') {
        return false
    }

    if (botprocess[0]==1) {
        return await ctx.replyWithHTML(`<i>Bot Going To Maintenane</i>`)
    }

    // var is_verified = await Userinfo.VerifiedStatus(ctx.from.id)

    // if (!is_verified) {
    //     return await ctx.replyWithHTML(`<i>You Have To Complete The Verification Process Below To Continue Using Our Bot</i>`,{
    //         reply_markup:{
    //             inline_keyboard:[[{text:'✅ Verify Your Self',url:`${process.env.HOST_NAME}/verify?user_id=${ctx.from.id}`}]]
    //         }
    //     })
    // }

    var ban_status = await Userinfo.BanStatus(ctx.from.id)

    if (ban_status === true) {
        var ban_reason = await Userinfo.BanReason(ctx.from.id)
        return await ctx.replyWithHTML(`You Are Banned For ${ban_reason}`)       
    }

    // var Ip = await Userinfo.Ip(ctx.from.id)
    // var IpCheck = await Userinfo.UniqueIpIndentifier(Ip)

    // if (IpCheck > 1 && ctx.from.id != process.env.ADMIN_CHAT_ID) {
    //     return await Userinfo.UpdateIsBan(ctx.from.id,true,`Multiple Account`)
    // }

    var total_warning = await Userinfo.TotalWarning(ctx.from.id)

    if (total_warning > 150 && ctx.from.id != process.env.ADMIN_CHAT_ID) {
        return await Userinfo.UpdateIsBan(ctx.from.id,true,`Fraud Activity`)    
    }

    await Userinfo.UpdateIsBlock(ctx.from.id,false)
    await next()
}


setInterval(async () => {
    await SearchChatPendingTask(bot)
}, 5000);




///Error Catch Message

bot.catch(async (error,ctx) => {
    try {
        await ErrorMessageHandler(ctx,error)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


process.on('uncaughtException', async (error) => {
    try {

        if (error.message=='403: Forbidden: bot was blocked by the user') {
            return await Userinfo.UpdateIsBlock(error.on.payload.chat_id || process.env.ADMIN_CHAT_ID,true)
        }

        await bot.telegram.sendMessage(process.env.ADMIN_CHAT_ID,`There Are An uncaughtException Error => ${error.message}`)
    } catch (error) {
        console.log(`Weird We Can Not Send Message To Admin`);
    }
})


process.on('unhandledRejection', async (error) => {
    try {

        if (error.message=='403: Forbidden: bot was blocked by the user') {
            return await Userinfo.UpdateIsBlock(error.on.payload.chat_id || process.env.ADMIN_CHAT_ID,true)
        }

        await bot.telegram.sendMessage(process.env.ADMIN_CHAT_ID,`There Are An uncaughtException Error => ${error.message}`)
    } catch (error) {
        console.log(`Weird We Can Not Send Message To Admin`);
    }
})


// Start Bot Coding

const AdminChecker = async (ctx,next) => {
    if (ctx.from.id==process.env.ADMIN_CHAT_ID) {
        return await next()
    }
    return await ctx.replyWithHTML(`You Are Not Admin`)
}


bot.hears('.BroadCastAll', AdminChecker, async (ctx) => {
    try {

        const Main_Keyboard = [[{text:'📢 Join Chats'},{text:'🤖 Message bots'}],[{text:'📄 View Posts'},{text:'🔗 Visit Sites'}],[{text:'💰 Balance'},{text:'👭 Referrals'},{text:'⚙️ Settings'}],[{text:'📊 My ads'}]]
        const Cancel_Keyboard = [[{text:'❌Cancel'}]]
        const BroadCastAllType = new Scene(`BroadCastAllType`)
        stage.register(BroadCastAllType)

        const BroadCastAllMessage = new Scene(`BroadCastAllMessage`)
        stage.register(BroadCastAllMessage)


        await ctx.replyWithHTML(`Select From Below Which Type Of Message You Want To Send...`,{
            reply_markup:{
                keyboard:[[{text:'📝 Text'},{text:'⏩ Forward'}],[{text:'📹 Video'},{text:'📷 Photo'}],[{text:'❌Cancel'}]],
                resize_keyboard:true
            }
        })

        await ctx.scene.enter(`BroadCastAllType`)

        BroadCastAllType.hears('❌Cancel', AdminChecker, async (ctx) => {
            await ctx.scene.leave()
            await ctx.replyWithHTML(`Your Request Has Been ❌ Canceled.`,{
                reply_markup:{
                    keyboard:Main_Keyboard,
                    resize_keyboard:true
                }
            }) 
        })

        BroadCastAllType.on('text', AdminChecker, async (ctx) => {
            await ctx.scene.leave()
            var type = (ctx.message.text=='📝 Text')?'text':(ctx.message.text=='⏩ Forward')?'forward':(ctx.message.text=='📹 Video')?'video':(ctx.message.text=='📷 Photo')?'photo':false

            if (!type) {
                await ctx.replyWithHTML(`Select From Below Which Type Of Message You Want To Send...`,{
                    reply_markup:{
                        keyboard:[[{text:'📝 Text'},{text:'⏩ Forward'}],[{text:'📹 Video'},{text:'📷 Photo'}],[{text:'❌Cancel'}]],
                        resize_keyboard:true
                    }
                })
                return await ctx.scene.enter(`BroadCastAllType`)
            }

            await ctx.replyWithHTML(`Send Me The <b>${type} Message</b> Which You Want To Promote :`,{
                reply_markup:{
                    keyboard:Cancel_Keyboard,
                    resize_keyboard:true
                }
            })
            await ctx.scene.enter(`BroadCastAllMessage`)

            BroadCastAllMessage.hears('❌Cancel', AdminChecker, async (ctx) => {
                await ctx.scene.leave()
                await ctx.replyWithHTML(`Your Request Has Been ❌ Canceled.`,{
                    reply_markup:{
                        keyboard:Main_Keyboard,
                        resize_keyboard:true
                    }
                }) 
            })

            BroadCastAllMessage.on('message', AdminChecker, async (ctx) => {
                await ctx.scene.leave()

                if (ctx.updateSubTypes.find(data=>data==type)==undefined){
                    await ctx.replyWithHTML(`Send Me The <b>${type} Message</b> Which You Want To Promote :`,{
                        reply_markup:{
                            keyboard:Cancel_Keyboard,
                            resize_keyboard:true
                        }
                    })
                    return await ctx.scene.enter(`BroadCastAllMessage`)
                }
                    
                var text = (type=='text')?ctx.message.text:false
                var fromChatId = (type=='forward')?ctx.message.from.id:false
                var message_id = (type=='forward')?ctx.message.message_id:false
                var photo_id = (type=='photo')?ctx.message.photo[0].file_id:false
                var video_id = (type=='video')?ctx.message.video.file_id:false
                var caption = (type=='video' || type=='photo')?(ctx.message.caption)?ctx.message.caption:false:false

                var data = await Userinfo.SearchAllForBroadCast()

                if (type == 'text') {
                    data.map((user,index) => {
                        setTimeout(async () => {
                            await SendTextMessage(ctx,user.user_id,text)
                        }, 50*index )
                    })
                    return await ctx.replyWithHTML(`BroadCast Started!`,{
                        reply_markup:{
                            keyboard:Main_Keyboard,
                            resize_keyboard:true
                        }
                    })
                }
            
                if (type == 'forward') {
                    data.map((user,index) => {
                        setTimeout(async () => {
                            await ForwardMessage(ctx,user.user_id,fromChatId,message_id)
                        }, 50*index )
                    })
                    return await ctx.replyWithHTML(`BroadCast Started!`,{
                        reply_markup:{
                            keyboard:Main_Keyboard,
                            resize_keyboard:true
                        }
                    })
                }
            
                if (type == 'photo') {
                    data.map((user,index) => {
                        setTimeout(async () => {
                            await PhotoMessage(ctx,user.user_id,photo_id,caption)
                        }, 50*index )
                    })
                    return await ctx.replyWithHTML(`BroadCast Started!`,{
                        reply_markup:{
                            keyboard:Main_Keyboard,
                            resize_keyboard:true
                        }
                    })
                }
            
                if (type == 'video') {
                    data.map((user,index) => {
                        setTimeout(async () => {
                            await VideoMessage(ctx,user.user_id,video_id,caption)
                        }, 50*index )
                    })
                    return await ctx.replyWithHTML(`BroadCast Started!`,{
                        reply_markup:{
                            keyboard:Main_Keyboard,
                            resize_keyboard:true
                        }
                    })
                }
            })
        })
    } catch (error) {
        if (error.message=='403: Forbidden: bot was blocked by the user') {
            return await Userinfo.UpdateIsBlock(error.on.payload.chat_id,true)
        }
        console.log(error);
    }
})



bot.hears('/startprocess', async (ctx) => {
    try {
        botprocess.push(0)
        botprocess.shift()
        await ctx.replyWithHTML(`Bot Started`)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


bot.hears('/stopprocess', async (ctx) => {
    try {
        botprocess.push(1)
        botprocess.shift()
        await ctx.replyWithHTML(`Bot Stopped`)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})

const shareContactMessage = `
Share your contact now
`
const shareBtn = [[{text: "Share Contact", request_contact: true}]]

const StartMessage = `
<b>👋🏻 Hello welcome to <a href="https://t.me/${process.env.BOT_NAME}">${process.env.BOT_NAME}</a>! 🔥</b>

This bot lets you earn  BIRR by completing simple tasks.

<b>Press 🔗 Visit Sites to earn by clicking links
Press 🤖 Message bots to earn by talking to bots
Press 📢 Join Chats to earn by joining chats
Press 📄 View Posts to earn by viewing  Ads</b>

<b>Read The</b> <a href="https://t.me/${process.env.MAIN_CHANNEL}">FAQ</a> For More Info!
<b>Support Chat :</b> @${process.env.MAIN_GROUP}
`
const StartKeyboard = [[{text:'📢 Join Chats'},{text:'🤖 Message bots'}],[{text:'📄 View Posts'},{text:'🔗 Visit Sites'}],[{text:'💰 Balance'},{text:'👭 Referrals'},{text:'⚙️ Settings'}],[{text:'📊 My ads'}]]



bot.start(async (ctx) =>  {
    const isNew = await Userinfo.IsNewUser(ctx.from.id);
    if (!isNew) {
        return await ctx.replyWithHTML(StartMessage,{
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
        });
        }
        ctx.replyWithHTML(shareContactMessage,{
            disable_web_page_preview:true,
            reply_markup:{
                keyboard :shareBtn,
                one_time_keyboard: true,
                resize_keyboard:true
            }
        });
        let isRef = ctx.message.text.split(" ")[1]; 
        if (!isRef){
            isRef = process.env.ADMIN_CHAT_ID;
        }
        const contactScene = new Scene('contactScene'+ctx.from.id);
        contactScene.on('contact',async ctx => {
            const conid = ctx.message.contact.user_id;
            if (conid != ctx.from.id){
                ctx.reply("This is not your number");
                return;
            }
            ctx.scene.leave();
            ctx.reply("Contact Validated Successfully", {
                reply_markup: {
                    remove_keyboard: true
                }
            });
            const userId = ctx.chat.id;
            const channel = `@${process.env.MAIN_CHANNEL}`;
            let member = await ctx.telegram.getChatMember(channel, userId);
              if (member.status === "left") {
                ctx.replyWithMarkdown("⚠️_ Please make sure to join all channels._", {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: "Channel link", url: "https://t.me/"+channel}
                            ],
                            [
                            {text: 'Joined', callback_data: "Joined$_"+isRef}
                        ]],
                        resize_keyboard:true
                    }
                });
              }else{
                if (isNew){
                    await Userinfo.InsertNewUser(ctx,isRef);
                    if (isRef && !isNaN(isRef) && isRef != ctx.from.id){
                        ctx.telegram.sendMessage(isRef,"You just got a new Referral "+ctx.from.first_name);
                    }
                } 
                ctx.replyWithHTML(StartMessage,{
                    disable_web_page_preview:true,
                    reply_markup:{
                        keyboard :StartKeyboard,
                        resize_keyboard:true
                    }
                });
              }
        });



        contactScene.use( ctx => {
            ctx.reply("Share your Contact only");
        });
        stage.register(contactScene);
        ctx.scene.enter('contactScene'+ctx.from.id);
});


bot.action(/^Joined\$_(.+)$/,async ctx => {
    const isRef = ctx.match[1];
    ctx.reply(isRef);
    ctx.deleteMessage();
    var isNew = await Userinfo.IsNewUser(ctx.from.id);
    if (!isNew){
        return;
    }
    const userId = ctx.from.id;
    const channel = `@${process.env.MAIN_CHANNEL}`;
    let member = await ctx.telegram.getChatMember(channel, userId);
      if (member.status == "left") {
        ctx.replyWithMarkdown("⚠️_ Please make sure to join all channels._", {
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: "Channel link", url: "https://t.me/"+channel}
                    ],
                    [
                    {text: 'Joined', callback_data: "Joined$_"+isRef}
                ]],
                resize_keyboard:true
            }
        });
      }else{
        if (isNew){
            await Userinfo.InsertNewUser(ctx,isRef);
            if (isRef && !isNaN(isRef) && isRef != ctx.from.id){
                ctx.telegram.sendMessage(isRef,"You just got a new Referral "+ctx.from.first_name);
            }
        } 
        ctx.replyWithHTML(StartMessage,{
            disable_web_page_preview:true,
            reply_markup:{
                keyboard :StartKeyboard,
                resize_keyboard:true
            }
        })
      }
});



const BalanceKeyboard = [[{text:'➕ Deposit'},{text:'➖ Withdraw'}],[{text:'💰 Balance'},{text:'🕐 History'}],[{text:'🔙 Back'}]]

bot.hears('💰 Balance', ChatTypeChecker, async (ctx) => {
    try {
        var TotalBalance = await Userinfo.TotalBalance(ctx.from.id)

        await ctx.replyWithHTML(`<b>Your Available 💰 Balance :</b> <code>${TotalBalance.toFixed(5)}</code> <b>USD</b>`,{
            reply_markup:{
                keyboard :BalanceKeyboard,
                resize_keyboard:true
            }
        }) 
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


const imbb = "https://i.ibb.co/Ryz657s/IMG-1987.jpg";

const DepositMessage = `<b>To Deposit Funds, Send At Least 100  BIRR To The Following Address:</b>

<u>Payment method Name</u> - Telebirr

<b>Account Holder Name - REKAN
Account Number:</b> <code>0914086037</code>`;

const DepositKeyboard = [
    [
        {text:'Deposit Birr ☄️', callback_data:'/deposit_birr$'}
    ]
];

bot.hears('➕ Deposit', ChatTypeChecker, async (ctx) => {
    try {
        await ctx.replyWithPhoto({url: imbb},{
            caption: DepositMessage,
            parse_mode: 'HTML',
            reply_markup:{
                inline_keyboard:DepositKeyboard
            }
        })   
    } catch (error) {
        await TryCatchErrorHandler(ctx,error);
    }
});

const DepositAddressMessage = `<b>If you sure about the payment Send your payment Screenshot proof.

⛔️ NOTE:</b> <i>Fake screenshot can leads to Ban from the Bot</i>.
`

bot.action('/deposit_birr$', ChatTypeChecker, async (ctx) => {
    ctx.answerCbQuery();
    ctx.editMessageCaption(DepositAddressMessage, {
        parse_mode: 'HTML'
    });
    const depositt = new Scene(`Depositt${ctx.from.id}`);
    depositt.on('text', async (ctx) => {
        ctx.reply('⛔️<b> Invalid:</b> <i>Only a screenshot is Required</i>', {
            parse_mode: 'HTML'
        });
        });
    depositt.on('photo', async (ctx) => {
        const amount = ctx.message.caption;
        if (!amount){
            ctx.replyWithHTML("⛔️<b> Invalid:</b> <i>Send your photo screenshot with a caption of the the Amount Sent</i>");
            return;
        }
        if (isNaN(amount)){
            ctx.replyWithHTML("⛔️<b> Invalid:</b> <i>Send your photo screenshot with a caption of the the Amount Sent not Alphabet</i>");
            return;
        }

        ctx.scene.leave()
        ctx.replyWithMarkdown('*👋🏻 Wait*: _Deposit Approval is needed from the Administrator_');
        const depImg = ctx.message.photo[0].file_id;
        ctx.telegram.sendPhoto(process.env.ADMIN_CHAT_ID,depImg, {
            caption: `
<b>NEW_DEPOSIT_REQUEST_NOTIFICATION</b>

NAME: ${ctx.chat.first_name}
USER_ID: ${ctx.chat.id}
AMOUNT: ${amount} BIRR
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{text: "✅ Confirm Deposit", callback_data: "conv$_"+ctx.chat.id+"£"+amount}],
                    [{text: "⛔️ Decline Deposit", callback_data: "decl$_"+ctx.chat.id+"£"+amount}]          
                ]
            }
        });
            });
    stage.register(depositt);
    ctx.scene.enter(`Depositt${ctx.from.id}`)
});

bot.action(/^conv\$_(.+)$/,async ctx => {
    const user = ctx.match[1].split("£")[0];
    const amo = ctx.match[1].split("£")[1];
    ctx.deleteMessage();
    await Depositinfo.InsertDeposit(user,"BIRR",amo,amo,"ADMIN BANK","hash")
    ctx.telegram.sendMessage(user,"Your Deposit of "+amo+" BIRR has been Confirmed");
    ctx.reply("User Deposit has been confirmed successfully");
});

bot.action(/^decl\$_(.+)$/, ctx => {
    const user = ctx.match[1].split("£")[0];
    const amo = ctx.match[1].split("£")[1];
    ctx.deleteMessage();
    ctx.telegram.sendMessage(user,"Your Deposit of "+amo+" BIRR has been cancelled");
    ctx.reply("User Deposit has been Cancelled");
});


const LowBalanceMessage = `Your Balance Is Too Small To Withdraw. 

Your Withdrawable Balance Is Only <b>%main_balance% BIRR</b>

Minimum Withdraw Is <b>${process.env.MINIMUM_WITHDRAW_AMOUNT} BIRR</b>`

const EmailFailedMessage = `❌ You Did Not Setup Withdrawal Bank Details.`

const WithdrawStartMessage = `<i>Please Select Currency From Below.</i>`

const WithdrawKeyboard = [
    [
        {text:'BIRR', callback_data:'/Withdraw_BIRR'},

    ]
]

bot.hears('➖ Withdraw', ChatTypeChecker, async (ctx) => {
    try {
        var MainBalance = await Userinfo.MainBalance(ctx.from.id)

        if (MainBalance<process.env.MINIMUM_WITHDRAW_AMOUNT) {
            return await ctx.replyWithHTML(LowBalanceMessage.replace(/%main_balance%/gi,MainBalance),{
                reply_markup:{
                    keyboard :BalanceKeyboard,
                    resize_keyboard:true
                }
            })
        }

        var is_set_email = await Userinfo.EmailStatus(ctx.from.id)

        if (!is_set_email) {
            return await ctx.replyWithHTML(EmailFailedMessage,{
                reply_markup:{
                    keyboard :BalanceKeyboard,
                    resize_keyboard:true
                }
            })
        }

        await ctx.replyWithHTML(WithdrawStartMessage,{
            reply_markup:{
                inline_keyboard:WithdrawKeyboard
            }
        }) 
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


const WithdrawnRequestMessage = `Enter The Amount To Withdraw :

Minimum: ${process.env.MINIMUM_WITHDRAW_AMOUNT} BIRR`

const MinimuAlertMessage = `Minimum Withdraw ${process.env.MINIMUM_WITHDRAW_AMOUNT} BIRR.

You Must Enter A Value Equal ${process.env.MINIMUM_WITHDRAW_AMOUNT} Or Higher`

const WithdrawSuccessMessage = `<b>✅ New Withdrawal Requested</b>
      
<b>🗣 User :</b> <a href="tg://user?id=%user_id%">%username%</a>
<b>🆔 User ID :</b> <code>%user_id%</code>
<b>🌐 Address :</b> <i>%currency_address%</i>
<b>💸 Amount :</b> <code>%currency_amount%</code> <b>%currency%</b> (<code>%usd_amount%</code> <b>USD</b>)
<b>📅 Date And Time :</b> <i>%created_at%</i>
<b>🤖 Bot Link :</b> <a href="https://t.me/${process.env.BOT_NAME}">${process.env.BOT_NAME}</a> 
<b>✅ Status : Paid</b>`

const CancelledKeyboard = [[{text:'❌Cancel'}]]

bot.action(/^\/Withdraw_(.+$)/, ChatTypeChecker, async (ctx) => {

    const Witdrawn = new Scene(`Witdrawn_${ctx.from.id}`)
    stage.register(Witdrawn)

    var currency = ctx.match[1]

    await ctx.deleteMessage()

    var MainBalance = await Userinfo.MainBalance(ctx.from.id)

    if (MainBalance<process.env.MINIMUM_WITHDRAW_AMOUNT) {
        return await ctx.replyWithHTML(LowBalanceMessage.replace(/%main_balance%/gi,MainBalance),{
            reply_markup:{
                keyboard :BalanceKeyboard,
                resize_keyboard:true
            }
        })
    }

    var is_set_email = await Userinfo.EmailStatus(ctx.from.id)

    if (!is_set_email) {
        return await ctx.replyWithHTML(EmailFailedMessage,{
            reply_markup:{
                keyboard :BalanceKeyboard,
                resize_keyboard:true
            }
        })
    }

    await ctx.replyWithHTML(WithdrawnRequestMessage,{
        reply_markup:{
            keyboard :CancelledKeyboard,
            resize_keyboard:true
        }
    })  

    await ctx.scene.enter(`Witdrawn_${ctx.from.id}`)

    Witdrawn.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
        await ctx.scene.leave()
        await ctx.replyWithHTML(`Your Withdraw Request Has Been ❌ Canceled.`,{
            reply_markup:{
                keyboard :StartKeyboard,
                resize_keyboard:true
            }
        })
    })

    Witdrawn.on('text', ChatTypeChecker, async (ctx) => {
        await ctx.scene.leave()

        var MainBalance = await Userinfo.MainBalance(ctx.from.id)

        if (MainBalance<process.env.MINIMUM_WITHDRAW_AMOUNT) {
            await ctx.scene.leave()
            return await ctx.replyWithHTML(LowBalanceMessage.replace(/%main_balance%/gi,MainBalance),{
                reply_markup:{
                    keyboard :BalanceKeyboard,
                    resize_keyboard:true
                }
            })
        }
    
        var is_set_email = await Userinfo.EmailStatus(ctx.from.id)
    
        if (!is_set_email) {
            await ctx.scene.leave()
            return await ctx.replyWithHTML(EmailFailedMessage,{
                reply_markup:{
                    keyboard :BalanceKeyboard,
                    resize_keyboard:true
                }
            })
        }

        if (!Number.parseFloat(ctx.message.text)) { 
            await ctx.scene.enter(`Witdrawn_${ctx.from.id}`)
            return await ctx.replyWithHTML(`You Must Input A Valid Number`,{
                reply_markup:{
                    keyboard :CancelledKeyboard,
                    resize_keyboard:true
                }
            }) 
        }

        if (ctx.message.text<process.env.MINIMUM_WITHDRAW_AMOUNT) {
            await ctx.scene.leave()
            return await ctx.replyWithHTML(MinimuAlertMessage,{
                reply_markup:{
                    keyboard :BalanceKeyboard,
                    resize_keyboard:true
                }
            }) 
        }

        if (ctx.message.text>MainBalance) {
            await ctx.scene.leave()
            return await ctx.replyWithHTML(LowBalanceMessage.replace(/%main_balance%/gi,MainBalance),{
                reply_markup:{
                    keyboard :BalanceKeyboard,
                    resize_keyboard:true
                }
            }) 
        }

        await ctx.scene.leave()
        await ctx.replyWithHTML(`<b>✅ Withdraw Requested Successfully...</b>`,{
            reply_markup:{
                keyboard :BalanceKeyboard,
                resize_keyboard:true
            }
        })

        var user_id = ctx.from.id
        var usd_amount = ctx.message.text
        var username = await Userinfo.ValidName(ctx.from.id)
        var currency_address = await Userinfo.Email(ctx.from.id)

        ctx.telegram.sendMessage(process.env.ADMIN_CHAT_ID,
 `
<b>WITHDRAWAL_REQUEST_NOTIFICATION</b>

<b>NAME:</b> ${ctx.chat.first_name}
<b>USER_ID:</b> ${user_id}
<b>AMOUNT:</b> ${usd_amount} BIRR

<b>BANK_DETAILS:</b> <code>${currency_address}</code>
`,{
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: "Transaction Id",
                    callback_data: "withtxid$_"+user_id+"£"+usd_amount
                }
            ]
        ]
    }
        });
        await Withdrawinfo.InsertWithdraw(user_id, "BIRR", usd_amount, usd_amount, currency_address, "hash");

    });
});

bot.action(/^withtxid\$_(.+)$/,async ctx => {
    const user = ctx.match[1].split("£")[0];
    const amo = ctx.match[1].split("£")[1];
    ctx.answerCbQuery();
    ctx.editMessageText('Send the transction id');
    const noti = new Scene('noti'+ctx.chat.id);
    noti.on('text', ctx => {
        ctx.scene.leave();
        ctx.telegram.sendMessage(user,"*Your Withdrawal of "+amo+" BIRR is Completed\n\nID:* `"+ctx.message.text+"`", {
            parse_mode: "markdown"
        });
        ctx.replyWithMarkdown("*Withdrawal Notification sent to User*");
    });
    stage.register(noti);
    ctx.scene.enter('noti'+ctx.chat.id);
});

const HistoryMessage = `Click Which History You Want To Check`

const HistoryKeyboard = [
    [
        {text:'📥 Deposit History', callback_data:'DepositHistory_1'},
        {text:'📤 Withdraw History', callback_data:'/WithdrawHistory_1'}
    ]
]

bot.hears('🕐 History', ChatTypeChecker, async (ctx) => {
    try {
        await ctx.replyWithHTML(HistoryMessage,{
            reply_markup:{
                inline_keyboard:HistoryKeyboard
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


bot.action('History', ChatTypeChecker, async (ctx) => {
    try {
        await ctx.editMessageText(HistoryMessage,{
            parse_mode:'HTML', 
            reply_markup:{
                inline_keyboard :HistoryKeyboard 
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


var DWHistoryMessage = `<i>Here Are Your Latest Transactions :</i>
      
<b>🆔 ID :</b> %unique_id%
<b>♻️ Type : %type%</b>
<b>💸 Amount :</b> <code>%currency_amount%</code> <b>%currency%</b> 
<b>💳 Address :</b> <i>%currency_address%</i>
<b>📅 Date :</b> <i>%created_at%</i>
<b>✅ Status : Completed ✅</b>
`


bot.action(/^\DepositHistory_(.+$)/, ChatTypeChecker, async (ctx) => {
    try {
        var count = Number(ctx.match[1])
        var skip = (count<=0) ? 0:Number(count-1)

        var TotalDeposit = await Depositinfo.TotalCreateByUserId(ctx.from.id)

        if (TotalDeposit<=0) {
            return await ctx.editMessageText(`You Don't Have Any Deposit Transactions Yet.`,{
                parse_mode:'HTML', 
                reply_markup:{
                    inline_keyboard :[[{text:'⬆️ Return', callback_data:'History'}]] 
                }
            })
        }
    
        var data = await Depositinfo.SearchOne(ctx.from.id,skip)
    
        if (!data) {
            return await ctx.editMessageText(`You Don't Have Any Deposit Transactions Yet.`,{
                parse_mode:'HTML', 
                reply_markup:{
                    inline_keyboard :[[{text:'⬆️ Return', callback_data:'History'}]] 
                }
            })
        }
    
        var { unique_id, currency, currency_amount, usd_amount, currency_address, hash, created_at } = data
    
        var page = await Depositinfo.TotalCreateByUserId(ctx.from.id)
        var paginate = await pagination(page,count,'DepositHistory')
    
        if (!paginate) {
            return await ctx.editMessageText(DWHistoryMessage.replace(/%type%/gi,'Deposit 📥')
            .replace(/%unique_id%/gi,unique_id)
            .replace(/%currency_amount%/gi,currency_amount)
            .replace(/%currency%/gi,currency)
            .replace(/%usd_amount%/gi,usd_amount)
            .replace(/%currency_address%/gi,currency_address)
            .replace(/%hash%/gi,hash)
            .replace(/%created_at%/gi,created_at),{
                parse_mode:'HTML', 
                reply_markup:{
                    inline_keyboard :[[{text:'⬆️ Return', callback_data:'History'}]] 
                }
            })
        }
    
        var keyboard = [paginate,[{text:'⬆️ Return', callback_data:'History'}]]
    
        await ctx.editMessageText(DWHistoryMessage.replace(/%type%/gi,'Deposit 📥')
            .replace(/%unique_id%/gi,unique_id)
            .replace(/%currency_amount%/gi,currency_amount)
            .replace(/%currency%/gi,currency)
            .replace(/%usd_amount%/gi,usd_amount)
            .replace(/%currency_address%/gi,currency_address)
            .replace(/%hash%/gi,hash)
            .replace(/%created_at%/gi,created_at),{
                parse_mode:'HTML', 
                reply_markup:{
                inline_keyboard :keyboard 
            }
        })
    
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


bot.action(/^\/WithdrawHistory_(.+$)/, ChatTypeChecker, async (ctx) => {
    try {
        var count = Number(ctx.match[1])
        var skip = (count<=0) ? 0:Number(count-1)

        var TotalWithdraw = await Withdrawinfo.TotalCreateByUserId(ctx.from.id)

        if (TotalWithdraw<=0) {
            return await ctx.editMessageText(`You Don't Have Any Withdraw Transactions Yet.`,{
                parse_mode:'HTML', 
                reply_markup:{
                    inline_keyboard :[[{text:'⬆️ Return', callback_data:'History'}]] 
                }
            })
        }
    
        var data = await Withdrawinfo.SearchOne(ctx.from.id,skip)
    
        if (!data) {
            return await ctx.editMessageText(`You Don't Have Any Withdraw Transactions Yet.`,{
                parse_mode:'HTML', 
                reply_markup:{
                    inline_keyboard :[[{text:'⬆️ Return', callback_data:'History'}]] 
                }
            })
        }
    
        var { unique_id, currency, currency_amount, usd_amount, currency_address, hash, created_at } = data
    
        var page = await Withdrawinfo.TotalCreateByUserId(ctx.from.id)
        var paginate = await pagination(page,count,'/WithdrawHistory')
    
        if (!paginate) {
            return await ctx.editMessageText(DWHistoryMessage.replace(/%type%/gi,'Withdraw 📤')
            .replace(/%unique_id%/gi,unique_id)
            .replace(/%currency_amount%/gi,currency_amount)
            .replace(/%currency%/gi,currency)
            .replace(/%usd_amount%/gi,usd_amount)
            .replace(/%currency_address%/gi,currency_address)
            .replace(/%hash%/gi,hash)
            .replace(/%created_at%/gi,created_at),{
                parse_mode:'HTML', 
                reply_markup:{
                    inline_keyboard :[[{text:'⬆️ Return', callback_data:'History'}]] 
                }
            })
        }
    
        var keyboard = [paginate,[{text:'⬆️ Return', callback_data:'History'}]]
    
        await ctx.editMessageText(DWHistoryMessage.replace(/%type%/gi,'Withdraw 📤')
            .replace(/%unique_id%/gi,unique_id)
            .replace(/%currency_amount%/gi,currency_amount)
            .replace(/%currency%/gi,currency)
            .replace(/%usd_amount%/gi,usd_amount)
            .replace(/%currency_address%/gi,currency_address)
            .replace(/%hash%/gi,hash)
            .replace(/%created_at%/gi,created_at),{
                parse_mode:'HTML', 
                reply_markup:{
                inline_keyboard :keyboard 
            }
        })
    
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})




const RefferalMessage = `<b>👭 You Have Total :</b> <code>%ref_count%</code> <b>Referrals</b>

<b>💸 Total Earned :</b> <code>%ref_balance%</code> <b>BIRR</b>

<b>🔗 Your Referral Link :</b> https://t.me/${process.env.BOT_NAME}?start=%user_id%

<i>You Will Earn 3 BIRR per Referrals</i>`


bot.hears('👭 Referrals', ChatTypeChecker, async (ctx) => {
    try {
        var data = await Userinfo.SearchUserWithUserId(ctx.from.id)

        if (!data) {
            return await ctx.replyWithHTML(`Please /start Bot Again!`,{
                reply_markup : {
                    remove_keyboard : true
                }
            })
        }

        var { ref_count, ref_balance } = data
        
        await ctx.replyWithHTML(RefferalMessage.replace(/%ref_count%/gi,ref_count)
        .replace(/%ref_balance%/gi,ref_balance.toFixed(5))
        .replace(/%user_id%/gi,ctx.from.id),{
            disable_web_page_preview:true,
            reply_markup:{
                keyboard :StartKeyboard,
                resize_keyboard:true
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})

const SettingsMessage = `<b>Choose A Setting To Edit Below :</b>`

const SettingsKeyboard = [[{text:'📩 Set Up Bank', callback_data:'CoinbaseEmail'}],[{text:'🔔 Task Alerts', callback_data:'TaskAlerts'}]]

bot.hears('⚙️ Settings', ChatTypeChecker, async (ctx) => {    
    try {
        await ctx.replyWithHTML(SettingsMessage,{
            reply_markup:{
                inline_keyboard:SettingsKeyboard
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


bot.action('Settings', ChatTypeChecker, async (ctx) => {    
    try {
        await ctx.editMessageText(SettingsMessage,{
            parse_mode:'HTML',
            reply_markup:{
                inline_keyboard:SettingsKeyboard
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})

const CurrentEmailMessage = `<b>Here Are Your Settings For Bank.</b>

<b>📧 Current Bank :</b> <code>%email%</code>

<i>Use The Buttons Below To Update Bank.</i>`

const CoinbaseEmailKeyboard = [
    [{text:'📩 Update Bank Details',callback_data:'UpdateCoinbaseEmail'}],
    [{text:'⬅️ Back',callback_data:'Settings'}]
]


bot.action('CoinbaseEmail', ChatTypeChecker, async (ctx) => {
    try {
        var email = await Userinfo.Email(ctx.from.id)

        if (!email || email==`false`) {
            email = `Not Set`
        }

        await ctx.editMessageText(CurrentEmailMessage.replace(/%email%/,email),{
            parse_mode:'HTML',
            reply_markup:{
                inline_keyboard :CoinbaseEmailKeyboard
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


const UpdateCoinbaseEmailMessage = `<b>✅ Successfully Your 📩 New Bank Added</b>

<b>📩 New Bank :</b> %email%`

bot.action('UpdateCoinbaseEmail', ChatTypeChecker, async (ctx) => {
    
    const CoinbaseEmail = new Scene(`CoinbaseEmail_${ctx.from.id}`)
    stage.register(CoinbaseEmail)

    await ctx.deleteMessage()
    await ctx.replyWithHTML(`📝 <i>Write Your Full Bank 10 Digit NO</i>.....`,{
        reply_markup:{
            keyboard :CancelledKeyboard,
            resize_keyboard:true
        }
    })  

    await ctx.scene.enter(`CoinbaseEmail_${ctx.from.id}`) 

    CoinbaseEmail.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
        await ctx.scene.leave()
        await ctx.replyWithHTML(`Your Edit Has Been ❌ Canceled.`,{            
            reply_markup:{
                keyboard :StartKeyboard,
                resize_keyboard:true
            }
        }) 
    })

    CoinbaseEmail.on('text', ChatTypeChecker, async (ctx) => {
        const deal = ctx.message.text;

        if (isNaN(deal)){
            ctx.reply("Please enter only a number");
            return;
        }

        if (!deal.startsWith("09")){
            ctx.reply("Bank number must start with 09....");
            return;
        }

        if (deal.length != 10){
            ctx.reply("Bank number must be a 10 digit number");
            return;
        }

        await ctx.scene.leave();

        await Userinfo.UpdateEmailAddress(ctx.from.id,ctx.message.text)
        await ctx.replyWithHTML(UpdateCoinbaseEmailMessage.replace(/%email%/,deal),{
            reply_markup:{
                keyboard :StartKeyboard,
                resize_keyboard:true
            }
        })



    });




})

const TaskAlertsMessage = `<b>Here Are Your Settings For New Task Alerts</b>

Task Notification : <b>%status%</b>

<i>Use The Buttons Below To Turn On/Off Alerts For Task.</i>`


const TaskNotifier = async (ctx) => {
    try {
        var callback_text
        var callback_data
        var TaskNotification = await Userinfo.TaskNotification(ctx.from.id)
    
        if (!TaskNotification) {
            TaskNotification = `Off 🔕`
            callback_text = `On 🔔`
            callback_data = `TaskAlertsOn`
        }else{
            TaskNotification = `On 🔔`
            callback_text = `Off 🔕`
            callback_data = `TaskAlertsOff`
        }
    
        await ctx.editMessageText(TaskAlertsMessage.replace(/%status%/gi,TaskNotification),{
            parse_mode:'HTML',
            reply_markup:{
                inline_keyboard:[
                    [{text:callback_text, callback_data:callback_data}],
                    [{text:'⬅️ Back',callback_data:'Settings'}]
                ]
            }
        })   
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


bot.action('TaskAlerts', ChatTypeChecker, async (ctx) => {
    try {
        await TaskNotifier(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})



bot.action('TaskAlertsOn', ChatTypeChecker, async (ctx) => {
    try {
        await Userinfo.UpdateTaskNotification(ctx.from.id,true)
        await TaskNotifier(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})



bot.action('TaskAlertsOff', ChatTypeChecker, async (ctx) => {
    try {
        await Userinfo.UpdateTaskNotification(ctx.from.id,false)
        await TaskNotifier(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})



bot.action(/^\Report_(.+$)/, ChatTypeChecker, async (ctx) => {
    try {
        var scene_id = ctx.match[0]
        var Ad_Name = ctx.match[1].split('_')[0]
        var campaign_id = Number(ctx.match[1].split('_')[1])
    
        const Report_Ad = new Scene(scene_id)
        stage.register(Report_Ad)
    
        await Report_Ad_Start(ctx,Ad_Name,scene_id)
    
        Report_Ad.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
            await CanceledReportMessage(ctx)
        })
    
        Report_Ad.hears('🚫 Not Working', ChatTypeChecker, async (ctx) => {
            if (Ad_Name=='BotAd') {
                var { user_id, bot_username } = await Botadsinfo.SearchByCampaingId(campaign_id)
                var { result } = await tele.BotStatus(bot_username)
                if (!result) {
                    await Userinfo.UpdateWarning(user_id,10)
                    await Botadsinfo.BotAdStatus(bot_username,false,true,`Bot Not Response`)
                    return
                }

                await Userinfo.UpdateWarning(ctx.from.id,5)
                return await Report_Ad_Finished(ctx)
            }
            await Report_Ad_Finished(ctx)
        })
    
        Report_Ad.hears('🔞 Porn/NSFW', ChatTypeChecker, async (ctx) => {
            if (Ad_Name=='ChatAd') {
                var { user_id } = await Chatadsinfo.SearchByCampaingId(campaign_id)
                await Userinfo.UpdateWarning(user_id,1)
                return await Report_Ad_Finished(ctx)
            }

            if (Ad_Name=='BotAd') {
                await Botadsinfo.SearchByCampaingId(campaign_id)
                await Userinfo.UpdateWarning(user_id,1)
                return await Report_Ad_Finished(ctx)
            }

            if (Ad_Name=='UrlAd') {
                await Urladsinfo.SearchByCampaingId(campaign_id)
                await Userinfo.UpdateWarning(user_id,1)
                return await Report_Ad_Finished(ctx)
            }

            await Report_Ad_Finished(ctx)
        })
    
        Report_Ad.hears('⚠️ Illegal/Scam', ChatTypeChecker, async (ctx) => {
            if (Ad_Name=='ChatAd') {
                var { user_id } = await Chatadsinfo.SearchByCampaingId(campaign_id)
                await Userinfo.UpdateWarning(user_id,1)
                return await Report_Ad_Finished(ctx)
            }

            if (Ad_Name=='BotAd') {
                await Botadsinfo.SearchByCampaingId(campaign_id)
                await Userinfo.UpdateWarning(user_id,1)
                return await Report_Ad_Finished(ctx)
            }

            if (Ad_Name=='UrlAd') {
                await Urladsinfo.SearchByCampaingId(campaign_id)
                await Userinfo.UpdateWarning(user_id,1)
                return await Report_Ad_Finished(ctx)
            }

            await Report_Ad_Finished(ctx)
        })
    
        Report_Ad.hears('🦠 Virus/Malware', ChatTypeChecker, async (ctx) => {
            if (Ad_Name=='ChatAd') {
                var { user_id } = await Chatadsinfo.SearchByCampaingId(campaign_id)
                await Userinfo.UpdateWarning(user_id,1)
                return await Report_Ad_Finished(ctx)
            }

            if (Ad_Name=='BotAd') {
                await Botadsinfo.SearchByCampaingId(campaign_id)
                await Userinfo.UpdateWarning(user_id,1)
                return await Report_Ad_Finished(ctx)
            }

            if (Ad_Name=='UrlAd') {
                await Urladsinfo.SearchByCampaingId(campaign_id)
                await Userinfo.UpdateWarning(user_id,1)
                return await Report_Ad_Finished(ctx)
            }

            await Report_Ad_Finished(ctx)
        })
        
        Report_Ad.on('text', ChatTypeChecker, async (ctx) => {
            await Report_Ad_Start(ctx,Ad_Name,scene_id)
        })       
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


bot.action(/^\Skip_(.+$)/, ChatTypeChecker, async (ctx) => {

    var Ad_Name = ctx.match[1].split('_')[0]
    var campaign_id = Number(ctx.match[1].split('_')[1])
    
    if (Ad_Name=='ChatAd') {
        var { user_id:advertiser_id, chat_name:task_data, chat_type:task_type, cpc:rewarded } = await Chatadsinfo.SearchByCampaingId(campaign_id) 
        await Taskinfo.SkipTask(ctx.from.id,campaign_id,task_type,task_data,(rewarded/2),advertiser_id)
        await SkipChatAd(ctx)
        return
    }

    if (Ad_Name=='BotAd') {
        var { user_id:advertiser_id, bot_link:task_data, cpc:rewarded }  = await Botadsinfo.SearchByCampaingId(campaign_id)
        await Taskinfo.SkipTask(ctx.from.id,campaign_id,`bot`,task_data,(rewarded/2),advertiser_id)
        await SkipBotAd(ctx)
        return
    }

    if (Ad_Name=='UrlAd') {
        var { user_id:advertiser_id, url_link:task_data, cpc:rewarded } = await Urladsinfo.SearchByCampaingId(campaign_id)
        await Taskinfo.SkipTask(ctx.from.id,campaign_id,`url`,task_data,(rewarded/2),advertiser_id)
        await SkipUrlAd(ctx)
        return
    }
})



bot.hears('📢 Join Chats', ChatTypeChecker, async (ctx) => {
    try {
        await JoinChatsMessageHandler(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


bot.action(/^\DoneChat(.+$)/, ChatTypeChecker, async (ctx) => {
    try {
        await DoneChat(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})



bot.hears('🤖 Message bots', ChatTypeChecker, async (ctx) => {
    try {
        await MessagebotsMessageHandler(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


bot.action(/^\DoneBot(.+$)/, ChatTypeChecker, async (ctx) => {

    var scene_id = ctx.match[0]
    var campaign_id = Number(ctx.match[1])

    const DoneBotStart = new Scene(scene_id)
    stage.register(DoneBotStart)

    await Done_Bot_Start(ctx,scene_id)

    DoneBotStart.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
        await CanceledBotForwardMessage(ctx)
    })

    DoneBotStart.on(['text','message'], ChatTypeChecker, async (ctx) => {
        await Done_Bot_Finished(ctx,scene_id,campaign_id)
    })
})


const block = new Scene('block')
stage.register(block);


bot.hears('📄 View Posts', ChatTypeChecker, async (ctx) => {
    try {
        await ViewPostsMessageHandler(ctx,block)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


bot.hears('🔗 Visit Sites', ChatTypeChecker, async (ctx)=> {
    try {
        await VisitSitesMessageHandler(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


bot.hears(['📊 My ads','↩️ Return'], ChatTypeChecker, async (ctx) => {
    try {
        await MyadsMessageHandler(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
});


bot.hears('📊 My Ads', ChatTypeChecker, async (ctx) => {
    try {
        await MyAdsMessageHandler(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})



bot.hears('➕ New Ad', ChatTypeChecker, async (ctx) => {
    try {
        await NewAdMessageHandler(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})



bot.hears('📢 New Chat Ads', ChatTypeChecker, async (ctx) => {

var scene_id = await Sceneinfo.UniqueId()

const NewChat = new Scene(`NewChat_${scene_id}`)
stage.register(NewChat)

const NewChatTitle = new Scene(`NewChatTitle_${scene_id}`)
stage.register(NewChatTitle)

const NewChatDescription = new Scene(`NewChatDescription_${scene_id}`)
stage.register(NewChatDescription)

const NewChatStayTime = new Scene(`NewChatStayTime_${scene_id}`)
stage.register(NewChatStayTime)

const NewChatCpc = new Scene(`NewChatCpc_${scene_id}`)
stage.register(NewChatCpc)

const NewChatBudget  = new Scene(`NewChatBudget_${scene_id}`)
stage.register(NewChatBudget)

    await NewChatStart(ctx,scene_id)

    NewChat.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
        await CanceledNewAdMessage(ctx)
    })
    
    
    NewChat.on('text', ChatTypeChecker, async (ctx) => {
        var chat_name = await isBotAdmin(ctx)
        var chat_type = await ChatType(ctx)
        
        if (!chat_name) {
            return false
        }

        await NewChatTitleStart(ctx,scene_id)

        NewChatTitle.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
            await CanceledNewAdMessage(ctx)
        })
        
        
        NewChatTitle.on('text', ChatTypeChecker, async (ctx) => {

            var title = await TitleValidation(ctx)

            if (!title) {
                return await ctx.scene.enter(`NewChatTitle_${scene_id}`) 
            }

            await NewChatDescriptionStart(ctx,scene_id)

            NewChatDescription.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                await CanceledNewAdMessage(ctx)
            })
            
            
            NewChatDescription.on('text', ChatTypeChecker, async (ctx) => {

                var description = await DescriptionValidation(ctx)

                if (!description) {
                    return await ctx.scene.enter(`NewChatDescription_${scene_id}`) 
                }

                await NewChatStayTimeStart(ctx,scene_id,chat_type)

                NewChatStayTime.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                    await CanceledNewAdMessage(ctx)
                })
                                
                NewChatStayTime.on('text', ChatTypeChecker, async (ctx) => {

                    var stay_time = await StayTimeValidation(ctx,1,120)

                    if (!stay_time) {
                        return await ctx.scene.enter(`NewChatStayTime_${scene_id}`) 
                    }

                    await NewChatCpcStart(ctx,scene_id,chat_type,stay_time)

                    NewChatCpc.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                        await CanceledNewAdMessage(ctx)
                    })
                                        
                    NewChatCpc.on('text', ChatTypeChecker, async (ctx) => {

                    var cpc = await CpcValidation(ctx,stay_time,'ChatAd')

                        if (!cpc) {
                            return await ctx.scene.enter(`NewChatCpc_${scene_id}`) 
                        }

                        await NewChatBudgetStart(ctx,scene_id,cpc)

                        NewChatBudget.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                            await CanceledNewAdMessage(ctx)
                        })
                                                
                        NewChatBudget.on('text', ChatTypeChecker, async (ctx) => {
    
                        var budget = await BudgetValidation(ctx,cpc)
    
                            if (!budget) {
                                return await ctx.scene.enter(`NewChatBudget_${scene_id}`) 
                            }

                            if (budget=='lowbalance') {
                                return false
                            }

                            var campaign_id = await Userinfo.AdsUniqueCampaignId()
                            var remain_submission = (budget/cpc).toFixed(0)

                            await CreateNewChatAd(ctx,campaign_id,title,description,chat_name,chat_type,cpc,budget,stay_time,remain_submission)
                        })
                    })
                })
            })
        })
    })
})




bot.hears('🤖 New Bot Ads', ChatTypeChecker, async (ctx) => {

var scene_id = await Sceneinfo.UniqueId()

const NewBot = new Scene(`NewBot_${scene_id}`)
stage.register(NewBot)

const NewBotLink = new Scene(`NewBotLink_${scene_id}`)
stage.register(NewBotLink)

const NewBotTitle = new Scene(`NewBotTitle_${scene_id}`)
stage.register(NewBotTitle)

const NewBotDescription = new Scene(`NewBotDescription_${scene_id}`)
stage.register(NewBotDescription)

const NewBotCpc = new Scene(`NewBotCpc_${scene_id}`)
stage.register(NewBotCpc)

const NewBotBudget  = new Scene(`NewBotBudget_${scene_id}`)
stage.register(NewBotBudget)


    await NewBotStart(ctx,scene_id)

    NewBot.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
        await CanceledNewAdMessage(ctx)
    })
    
    NewBot.on('text', ChatTypeChecker, async (ctx) => {
        var bot_username = await isBot(ctx)
        
        if (!bot_username) {
            return await ctx.scene.enter(`NewBot_${scene_id}`)
        }

        await NewBotLinkStart(ctx,scene_id)

        NewBotLink.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
            await CanceledNewAdMessage(ctx)
        })
        
        NewBotLink.on('text', ChatTypeChecker, async (ctx) => {
            var bot_link = await isBotLink(ctx,bot_username)
            
            if (!bot_link) {
                return await ctx.scene.enter(`NewBotLink_${scene_id}`)
            }

            await NewBotTitleStart(ctx,scene_id)

            NewBotTitle.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                await CanceledNewAdMessage(ctx)
            })
            
            NewBotTitle.on('text', ChatTypeChecker, async (ctx) => {
    
                var title = await TitleValidation(ctx)
    
                if (!title) {
                    return await ctx.scene.enter(`NewBotTitle_${scene_id}`) 
                }

                await NewBotDescriptionStart(ctx,scene_id)

                NewBotDescription.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                    await CanceledNewAdMessage(ctx)
                })
                
                NewBotDescription.on('text', ChatTypeChecker, async (ctx) => {
    
                    var description = await DescriptionValidation(ctx)
    
                    if (!description) {
                        return await ctx.scene.enter(`NewBotDescription_${scene_id}`) 
                    }

                    await NewBotCpcStart(ctx,scene_id)

                    NewBotCpc.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                        await CanceledNewAdMessage(ctx)
                    })
                                       
                    NewBotCpc.on('text', ChatTypeChecker, async (ctx) => {

                    var cpc = await CpcValidation(ctx,1,'BotAd')

                        if (!cpc) {
                            return await ctx.scene.enter(`NewBotCpc_${scene_id}`)
                        }

                        await NewBotBudgetStart(ctx,scene_id,cpc)

                        NewBotBudget.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                            await CanceledNewAdMessage(ctx)
                        })
                                                
                        NewBotBudget.on('text', ChatTypeChecker, async (ctx) => {
    
                        var budget = await BudgetValidation(ctx,cpc)
    
                            if (!budget) {
                                return await ctx.scene.enter(`NewBotBudget_${scene_id}`)
                            }

                            if (budget=='lowbalance') {
                                return false
                            }
                            
                            var campaign_id = await Userinfo.AdsUniqueCampaignId()
                            var remain_submission = (budget/cpc).toFixed(0)

                            await CreateNewBotAd(ctx,campaign_id,title,description,bot_username,bot_link,cpc,budget,remain_submission)
                        })
                    })
                })
            })
        })
    })
})




bot.hears('📄 New Post Ads', ChatTypeChecker, async (ctx) => {

var scene_id = await Sceneinfo.UniqueId()

const NewPostType = new Scene(`NewPostType_${scene_id}`)
stage.register(NewPostType)

const NewPost = new Scene(`NewPost_${scene_id}`)
stage.register(NewPost)

const NewPostStayTime = new Scene(`NewPostStayTime_${scene_id}`)
stage.register(NewPostStayTime)

const NewPostCpc = new Scene(`NewPostCpc_${scene_id}`)
stage.register(NewPostCpc)

const NewPostBudget  = new Scene(`NewPostBudget_${scene_id}`)
stage.register(NewPostBudget)

    await NewPostTypeStart(ctx,scene_id)

    NewPostType.hears('❌Cancel', async (ctx) => {
        await CanceledNewAdMessage(ctx)
    })

    NewPostType.on('text', ChatTypeChecker, async (ctx) => {

        var messageType = await messageTypeCheck(ctx)

        if (!messageType) {
            return await ctx.scene.enter(`NewPostType_${scene_id}`)
        }

        await NewPostStart(ctx,scene_id,messageType)

        NewPost.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
            await CanceledNewAdMessage(ctx)
        })

        NewPost.on('message', ChatTypeChecker, async (ctx) => {

            var content = await messageContent(ctx,messageType)

            if (!content) {
                return await ctx.scene.enter(`NewPost_${scene_id}`)
            }

            var text = (messageType=='text')?content.text:false
            var fromChatId = (messageType=='forward')?content.from.id:false
            var message_id = (messageType=='forward')?content.message_id:false
            var photo_id = (messageType=='photo')?content.photo[0].file_id:false
            var video_id = (messageType=='video')?content.video.file_id:false
            var caption = (messageType=='video' || messageType=='photo')?(content.caption)?content.caption:false:false

            await NewPostStayTimeStart(ctx,scene_id)

            NewPostStayTime.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                await CanceledNewAdMessage(ctx)
            })
                            
            NewPostStayTime.on('text', ChatTypeChecker, async (ctx) => {

                var stay_time = await StayTimeValidation(ctx,10,30)

                if (!stay_time) {
                    return await ctx.scene.enter(`NewPostStayTime_${scene_id}`)
                }

                await NewPostCpcStart(ctx,scene_id,stay_time)

                NewPostCpc.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                    await CanceledNewAdMessage(ctx)
                })
                                    
                NewPostCpc.on('text', ChatTypeChecker, async (ctx) => {

                var cpc = await CpcValidation(ctx,stay_time,'PostAd')

                    if (!cpc) {
                        return await ctx.scene.enter(`NewPostCpc_${scene_id}`)
                    }

                    await NewPostBudgetStart(ctx,scene_id,cpc)

                    NewPostBudget.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                        await CanceledNewAdMessage(ctx)
                    })
                                            
                    NewPostBudget.on('text', ChatTypeChecker, async (ctx) => {

                    var budget = await BudgetValidation(ctx,cpc)

                        if (!budget) {
                            return await ctx.scene.enter(`NewPostBudget_${scene_id}`) 
                        }

                        if (budget=='lowbalance') {
                            return false
                        }

                        var campaign_id = await Userinfo.AdsUniqueCampaignId()
                        var remain_submission = (budget/cpc).toFixed(0)

                        await CreateNewPostAd(ctx,campaign_id,messageType,text,fromChatId,message_id,photo_id,video_id,caption,stay_time,cpc,budget,remain_submission)
                    })
                })
            })
        })
    })
})



bot.hears('🔗 New Url Ads', ChatTypeChecker, async (ctx) => {

var scene_id = await Sceneinfo.UniqueId()

const NewUrl = new Scene(`NewUrl_${scene_id}`)
stage.register(NewUrl)

const NewUrlTitle = new Scene(`NewUrlTitle_${scene_id}`)
stage.register(NewUrlTitle)

const NewUrlDescription = new Scene(`NewUrlDescription_${scene_id}`)
stage.register(NewUrlDescription)

const NewUrlStayTime = new Scene(`NewUrlStayTime_${scene_id}`)
stage.register(NewUrlStayTime)

const NewUrlCpc = new Scene(`NewUrlCpc_${scene_id}`)
stage.register(NewUrlCpc)

const NewUrlBudget  = new Scene(`NewUrlBudget_${scene_id}`)
stage.register(NewUrlBudget)

    await NewUrlStart(ctx,scene_id)

    NewUrl.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
        await CanceledNewAdMessage(ctx)
    })
    
    
    NewUrl.on('text', ChatTypeChecker, async (ctx) => {

        var url_link = await isURL(ctx)
        
        if (!url_link) {
            return await ctx.scene.enter(`NewUrl_${scene_id}`)
        }

        await NewUrlTitleStart(ctx,scene_id)

        NewUrlTitle.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
            await CanceledNewAdMessage(ctx)
        })       
        
        NewUrlTitle.on('text', ChatTypeChecker, async (ctx) => {

            var title = await TitleValidation(ctx)

            if (!title) {
                return await ctx.scene.enter(`NewUrlTitle_${scene_id}`) 
            }

            await NewUrlDescriptionStart(ctx,scene_id)

            NewUrlDescription.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                await CanceledNewAdMessage(ctx)
            })            
            
            NewUrlDescription.on('text', ChatTypeChecker, async (ctx) => {

                var description = await DescriptionValidation(ctx)

                if (!description) {
                    return await ctx.scene.enter(`NewUrlDescription_${scene_id}`)
                }

                await NewUrlStayTimeStart(ctx,scene_id)

                NewUrlStayTime.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                    await CanceledNewAdMessage(ctx)
                })
                                
                NewUrlStayTime.on('text', ChatTypeChecker, async (ctx) => {

                    var stay_time = await StayTimeValidation(ctx,10,60)

                    if (!stay_time) {
                        return await ctx.scene.enter(`NewUrlStayTime_${scene_id}`)
                    }

                    await NewUrlCpcStart(ctx,scene_id,stay_time)

                    NewUrlCpc.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                        await CanceledNewAdMessage(ctx)
                    })
                                        
                    NewUrlCpc.on('text', ChatTypeChecker, async (ctx) => {

                    var cpc = await CpcValidation(ctx,stay_time,'UrlAd')

                        if (!cpc) {
                            return await ctx.scene.enter(`NewUrlCpc_${scene_id}`)
                        }

                        await NewUrlBudgetStart(ctx,scene_id,cpc)

                        NewUrlBudget.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                            await CanceledNewAdMessage(ctx)
                        })
                                                
                        NewUrlBudget.on('text', ChatTypeChecker, async (ctx) => {
    
                        var budget = await BudgetValidation(ctx,cpc)
    
                            if (!budget) {
                                return await ctx.scene.enter(`NewUrlBudget_${scene_id}`) 
                            }

                            if (budget=='lowbalance') {
                                return false
                            }

                            var campaign_id = await Userinfo.AdsUniqueCampaignId()
                            var remain_submission = (budget/cpc).toFixed(0)

                            await CreateNewUrlAd(ctx,campaign_id,title,description,url_link,stay_time,cpc,budget,remain_submission)
                        })
                    })
                })
            })
        })
    })
})




bot.action(/^\Edit_Title_(.+$)/, ChatTypeChecker, async (ctx) => {

    var scene_id = ctx.match[0]
    var Ad_Name = ctx.match[1].split('_')[0]
    var campaign_id = Number(ctx.match[1].split('_')[1])

    const Edit_Title = new Scene(scene_id)
    stage.register(Edit_Title)

    await Edit_Title_Start(ctx,scene_id)


    Edit_Title.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
        await CanceledEditAdMessage(ctx)
    })
    
    
    Edit_Title.on('text', ChatTypeChecker, async (ctx) => {

        var title = await TitleValidation(ctx)

        if (!title) {
            await ctx.scene.enter(scene_id)
            return 
        }

        if (Ad_Name=='ChatAd') {
            await Chatadsinfo.EditTitle(campaign_id,title)
            return await Edit_Title_Finished(ctx) 
        }

        if (Ad_Name=='BotAd') {
            await Botadsinfo.EditTitle(campaign_id,title)
            return await Edit_Title_Finished(ctx)
        }
        if (Ad_Name=='UrlAd') {
            await Urladsinfo.EditTitle(campaign_id,title)
            return await Edit_Title_Finished(ctx)
        }   
    })
})


bot.action(/^\Edit_Description_(.+$)/, ChatTypeChecker, async (ctx) => {

    var scene_id = ctx.match[0]
    var Ad_Name = ctx.match[1].split('_')[0]
    var campaign_id = Number(ctx.match[1].split('_')[1])

    const Edit_Description = new Scene(scene_id)
    stage.register(Edit_Description)

    await Edit_Description_Start(ctx,scene_id)

    Edit_Description.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
        await CanceledEditAdMessage(ctx)
    })
    
    
    Edit_Description.on('text', ChatTypeChecker, async (ctx) => {

        var description = await DescriptionValidation(ctx)

        if (!description) {
            return await ctx.scene.enter(scene_id)
        }

        if (Ad_Name=='ChatAd') {
            await Chatadsinfo.EditDescription(campaign_id,description)
            await Edit_Description_Finished(ctx) 
        }

        if (Ad_Name=='BotAd') {
            await Botadsinfo.EditDescription(campaign_id,description)
            return await Edit_Description_Finished(ctx) 
        }

        if (Ad_Name=='UrlAd') {
            await Urladsinfo.EditDescription(campaign_id,description)
            return await Edit_Description_Finished(ctx) 
        }
   
        await Edit_Description_Finished(ctx) 
    })
})


bot.action(/^\Edit_Ad_(.+$)/, ChatTypeChecker, async (ctx) => {

    var scene_id = ctx.match[0]
    var Ad_Name = ctx.match[1].split('_')[0]
    var campaign_id = Number(ctx.match[1].split('_')[1])

    const Edit_Ad = new Scene(scene_id)
    stage.register(Edit_Ad)

    await Edit_Ad_Start(ctx,scene_id,Ad_Name)

    Edit_Ad.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
        await CanceledEditAdMessage(ctx)
    })
    
    
    Edit_Ad.on('text', ChatTypeChecker, async (ctx) => {

        if (Ad_Name=='ChatAd') {
            var chat_name = await isBotAdmin(ctx)
            var chat_type = await ChatType(ctx)
            
            if (!chat_name) {
                return false
            }
    
            await Chatadsinfo.EditAd(campaign_id,chat_name,chat_type) 
            return await Edit_Ad_Finished(ctx)
        }

        if (Ad_Name=='BotAd') {

            var bot_username = await isBot(ctx)
            
            if (!bot_username) {
                return await ctx.scene.enter(scene_id)
            }

            const EditBotLink = new Scene(`EditBotLinkStart_${campaign_id}`)
            stage.register(EditBotLink)

            await EditBotLinkStart(ctx,campaign_id)

            EditBotLink.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                await CanceledEditAdMessage(ctx)
            })
            
            EditBotLink.on('text', ChatTypeChecker, async (ctx) => {
                var bot_link = await isBotLink(ctx,bot_username)
                
                if (!bot_link) {
                    return await ctx.scene.enter(`EditBotLinkStart_${campaign_id}`)
                }

                await Botadsinfo.EditAd(campaign_id,bot_username,bot_link) 
                await Edit_Ad_Finished(ctx)
            })
            return
        }

        if (Ad_Name=='UrlAd') {
            var url_link = await isURL(ctx)
        
            if (!url_link) {
                return ctx.scene.enter(scene_id)
            }
    
            await Urladsinfo.EditAd(campaign_id,url_link) 
            return await Edit_Ad_Finished(ctx)
        }

        if (Ad_Name=='PostAd') {

            var messageType = await messageTypeCheck(ctx)

            if (!messageType) {
                return await ctx.scene.enter(scene_id)
            }

            const EditPost = new Scene(`EditPost_${campaign_id}`)
            stage.register(EditPost)

            await EditPostStart(ctx,messageType,campaign_id)

            EditPost.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
                await CanceledEditAdMessage(ctx)
            })
    
            EditPost.on('message', ChatTypeChecker, async (ctx) => {
    
                var content = await messageContent(ctx,messageType)
    
                if (!content) {
                    return await ctx.scene.enter(`EditPost_${campaign_id}`)
                }
    
                var text = (messageType=='text')?content.text:false
                var fromChatId = (messageType=='forward')?content.from.id:false
                var message_id = (messageType=='forward')?content.message_id:false
                var photo_id = (messageType=='photo')?content.photo[0].file_id:false
                var video_id = (messageType=='video')?content.video.file_id:false
                var caption = (messageType=='photo' || messageType=='video')?(content.caption)?content.caption:false:false

                await Postadsinfo.EditAd(campaign_id,messageType,text,fromChatId,message_id,photo_id,video_id,caption)
                await Edit_Ad_Finished(ctx) 
            })
            return
        }
    })
})



bot.action(/^\Edit_Submission_(.+$)/, ChatTypeChecker, async (ctx) => {

    var scene_id = ctx.match[0]
    var Ad_Name = ctx.match[1].split('_')[0]
    var campaign_id = Number(ctx.match[1].split('_')[1])

    const Edit_Submission = new Scene(scene_id)
    stage.register(Edit_Submission)

    var { cpc } = (Ad_Name=='ChatAd')?await Chatadsinfo.SearchByCampaingId(campaign_id):(Ad_Name=='BotAd')?await Botadsinfo.SearchByCampaingId(campaign_id):(Ad_Name=='UrlAd')?await Urladsinfo.SearchByCampaingId(campaign_id):(Ad_Name=='PostAd')?await Postadsinfo.SearchByCampaingId(campaign_id):undefined

    await Edit_Submission_Start(ctx,cpc,scene_id)

    Edit_Submission.hears('❌Cancel', ChatTypeChecker, async (ctx) => {
        await CanceledEditAdMessage(ctx)
    })
    
    Edit_Submission.on('text', ChatTypeChecker, async (ctx) => {

        var budget = await BudgetValidation(ctx,cpc)
    
        if (!budget) {
            await ctx.scene.enter(scene_id)
            return 
        }

        if (budget=='lowbalance') {
            return false
        }

        var remain_submission = (budget/cpc).toFixed(0)
        var joined = 0

        await Userinfo.TotalBalanceRemove(ctx.from.id, budget)
        var data = (Ad_Name=='ChatAd')?await Chatadsinfo.UpdateSubmission(campaign_id,remain_submission,budget,joined):(Ad_Name=='BotAd')?await Botadsinfo.UpdateSubmission(campaign_id,remain_submission,budget,joined):(Ad_Name=='UrlAd')?await Urladsinfo.UpdateSubmission(campaign_id,remain_submission,budget,joined):(Ad_Name=='PostAd')?await Postadsinfo.UpdateSubmission(campaign_id,remain_submission,budget,joined):false           
        await Edit_Submission_Finished(ctx)
    })
})


bot.action(/^\Active_(.+$)/, ChatTypeChecker, async (ctx) => {

    var Ad_Name = ctx.match[1].split('_')[0]
    var campaign_id = Number(ctx.match[1].split('_')[1])
    var count = Number(ctx.match[1].split('_')[2])
    var skip = Number(count-1)

    var data = (Ad_Name=='ChatAd')?await Chatadsinfo.UpdateStatus(campaign_id,true):(Ad_Name=='BotAd')?await Botadsinfo.UpdateStatus(campaign_id,true):(Ad_Name=='UrlAd')?await Urladsinfo.UpdateStatus(campaign_id,true):(Ad_Name=='PostAd')?await Postadsinfo.UpdateStatus(campaign_id,true):false        
    var list = (Ad_Name=='ChatAd')?await MyChatAdsList(ctx,skip,count):(Ad_Name=='BotAd')?await MyBotAdsList(ctx,skip,count):(Ad_Name=='UrlAd')?await MyUrlAdsList(ctx,skip,count):(Ad_Name=='PostAd')?await MyPostAdsList(ctx,skip,count):false    
})


bot.action(/^\Disabled_(.+$)/, ChatTypeChecker, async (ctx) => {

    var Ad_Name = ctx.match[1].split('_')[0]
    var campaign_id = Number(ctx.match[1].split('_')[1])
    var count = Number(ctx.match[1].split('_')[2])
    var skip = Number(count-1)

    var data = (Ad_Name=='ChatAd')?await Chatadsinfo.UpdateStatus(campaign_id,false):(Ad_Name=='BotAd')?await Botadsinfo.UpdateStatus(campaign_id,false):(Ad_Name=='UrlAd')?await Urladsinfo.UpdateStatus(campaign_id,false):(Ad_Name=='PostAd')?await Postadsinfo.UpdateStatus(campaign_id,false):false        
    var list = (Ad_Name=='ChatAd')?await MyChatAdsList(ctx,skip,count):(Ad_Name=='BotAd')?await MyBotAdsList(ctx,skip,count):(Ad_Name=='UrlAd')?await MyUrlAdsList(ctx,skip,count):(Ad_Name=='PostAd')?await MyPostAdsList(ctx,skip,count):false    
})


bot.action(/^\Delete_(.+$)/, ChatTypeChecker, async (ctx) => {
    await Delete_Ad_Start(ctx)
})


bot.action(/^\Confirm_Delete_(.+$)/, ChatTypeChecker, async (ctx) => {

    var Ad_Name = ctx.match[1].split('_')[0]
    var campaign_id = Number(ctx.match[1].split('_')[1])

    await ctx.deleteMessage()
    var data = (Ad_Name=='ChatAd')?await Chatadsinfo.RemoveOneAdByCampaignId(campaign_id):(Ad_Name=='BotAd')?await Botadsinfo.RemoveOneAdByCampaignId(campaign_id):(Ad_Name=='UrlAd')?await Urladsinfo.RemoveOneAdByCampaignId(campaign_id):(Ad_Name=='PostAd')?await Postadsinfo.RemoveOneAdByCampaignId(campaign_id):false        
    await Delete_Ad_Finished(ctx)
})


bot.action(/^\Not_Delete_(.+$)/, ChatTypeChecker, async (ctx) => {

    var Ad_Name = ctx.match[1].split('_')[0]
    var count = Number(ctx.match[1].split('_')[2])
    var skip = Number(count-1)

    var list = (Ad_Name=='ChatAd')?await MyChatAdsList(ctx,skip,count):(Ad_Name=='BotAd')?await MyBotAdsList(ctx,skip,count):(Ad_Name=='UrlAd')?await MyUrlAdsList(ctx,skip,count):(Ad_Name=='PostAd')?await MyPostAdsList(ctx,skip,count):false    
})


bot.hears('📢 My Chat Ads', ChatTypeChecker, async (ctx) => {
    try {
        await MyChatAdsMessageHandler(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


bot.action(/^\ChatAd_(.+$)/, ChatTypeChecker, async (ctx) => {
    try {
        var count = Number(ctx.match[1])
        var skip = (ctx.match[1]<=0) ? 0:Number(ctx.match[1]-1)
        await MyChatAdsList(ctx,skip,count) 
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


bot.hears('🤖 My Bot Ads', ChatTypeChecker, async (ctx) => {
    try {
        await MyBotAdsMessageHandler(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


bot.action(/^BotAd_(.+$)/, ChatTypeChecker, async (ctx) => {
    try {
        var count = Number(ctx.match[1])
        var skip = (ctx.match[1]<=0) ? 0:Number(ctx.match[1]-1)
        await MyBotAdsList(ctx,skip,count) 
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


bot.hears('📄 My Post Ads', ChatTypeChecker, async (ctx) => {
    try {
        await MyPostAdsMessageHandler(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})



bot.action(/^\PostAd_(.+$)/, ChatTypeChecker, async (ctx) => {
    try {
        var count = Number(ctx.match[1])
        var skip = (ctx.match[1]<=0) ? 0:Number(ctx.match[1]-1)
        await MyPostAdsList(ctx,skip,count) 
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})



bot.hears('🔗 My Url Ads', ChatTypeChecker, async (ctx) => {
    try {
        await MyUrlAdsMessageHandler(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})


bot.action(/^\UrlAd_(.+$)/, ChatTypeChecker, async (ctx) => {
    try {
        var count = Number(ctx.match[1])
        var skip = (ctx.match[1]<=0) ? 0:Number(ctx.match[1]-1)
        await MyUrlAdsList(ctx,skip,count) 
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})




bot.on('text', ChatTypeChecker, async (ctx) => {
    try {

        if (ctx.chat.type == 'group' || ctx.chat.type == 'supergroup' || ctx.chat.type == 'channel') {
            return false
        }

        var isNew = await Userinfo.IsNewUser(ctx.from.id)
        
        if (!isNew) {
            return await ctx.replyWithHTML(StartMessage,{
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            })
        }
        
        await Userinfo.InsertNewUser(ctx,false)

        await ctx.replyWithHTML(StartMessage,{
            disable_web_page_preview:true,
            reply_markup:{
                keyboard :StartKeyboard,
                resize_keyboard:true
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
})




const express = require('express')
const app = express()
app.use(express.json());
const { urlencoded, json } = require("body-parser")
app.use(json());
app.use(urlencoded({ extended: true }));


app.get('/verify', async (req,res) => {
    try {

        if (!req.query.user_id) {
            return res.sendFile(__dirname + "/error.html")
        }

        var user_id = req.query.user_id

        var is_new_user = await Userinfo.IsNewUser(user_id)

        if (is_new_user) {
            return res.redirect(`https://t.me/${process.env.BOT_NAME}`)
        }

        var is_verified = await Userinfo.VerifiedStatus(user_id)

        if (is_verified) {
            return res.redirect(`https://t.me/${process.env.BOT_NAME}`)
        }

        res.send(`
        <html>

        <head>

            <title>${process.env.BOT_NAME} User Verify</title>

            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link rel="icon" href="https://${process.env.HOST_NAME}/image" type="image/icon type">
            <link href="https://cdn.muicss.com/mui-0.10.2/css/mui.min.css" rel="stylesheet" type="text/css" />

            <script src="https://cdn.muicss.com/mui-0.10.2/js/mui.min.js"></script>
            <script type="text/javascript" data-cfasync="false">
                /*<![CDATA[/* */
                (function(){var b7549336780e07208fc4087bdb23a607="EZ9qeUe6gB_ai_KQ7puNzO8rBVIPMiSVowah8P3IodQcE4NgE1FeMFZrPFvXS9pjtzr4OXgcj_UyepmO-A";var c=['w7fDsj0TQcKucw==','OUIrSMOew4jCu8OoF8Oiw4vCicOG','wpJfT1pAEA==','wrfCjsOaD8OZZ8KgwqYqw4PCsQ7DvyrCohTDvMOMwpXCq8KTN8Oawo7CkTFVf8Oyw4YOwrgb','woVZUVJJJnzDu2AywqI6','wpJgwoIiw5rDhMKjDsKtC8K1','wo3Dv0tsw47Ck8OLSUTDhcO2wrUwW8Od','RMKUKsOdGnIxwr/Dl0sFThk=','KMOBw59Yw48Y','wrLCmUXCqhHCjsKUwr8=','w6nCjMO2w44+wqsvw6jDncOu','w4XCsUoBwr9/cXMiwq7DnAs=','e8OpUCHCqcK3w7MT','wpx7woMTw4DDrw==','d1PCnEAl','MsOGw5hYw7QIbVzCmRXDrFI=','wpjDtFx2wpjClMOFSlY=','wrTCgsK1eMKNE2LCgcK0F8KYwok+wpbCkcKHecOLwrXDkQ==','wp/DkAA=','FsK5X8KC','RybCoVd2wp7Dr8OvwpnDg8K1aMKYw7s=','KMOLw5lUw7YI','W8OYwosp','w7zCrz9UXMK3Z2DCicKnBHNJwrBPJcKbw5EXwo7CiFE4w4fCkXgCw5EYwotFXsOfwoR6EsOSw6l1FcOcw5hbwq4=','w6TDiE4YwpYuGWM=','w7vCv2fDhMO3w4HDsw=='];(function(a,b){var d=function(e){while(--e){a['push'](a['shift']());}};d(++b);}(c,0x1b9));var d=function(a,b){a=a-0x0;var e=c[a];if(d['qwOACk']===undefined){(function(){var h=function(){var k;try{k=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(l){k=window;}return k;};var i=h();var j='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';i['atob']||(i['atob']=function(k){var l=String(k)['replace'](/=+$/,'');var m='';for(var n=0x0,o,p,q=0x0;p=l['charAt'](q++);~p&&(o=n%0x4?o*0x40+p:p,n++%0x4)?m+=String['fromCharCode'](0xff&o>>(-0x2*n&0x6)):0x0){p=j['indexOf'](p);}return m;});}());var g=function(h,l){var m=[],n=0x0,o,p='',q='';h=atob(h);for(var t=0x0,u=h['length'];t<u;t++){q+='%'+('00'+h['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);}h=decodeURIComponent(q);var r;for(r=0x0;r<0x100;r++){m[r]=r;}for(r=0x0;r<0x100;r++){n=(n+m[r]+l['charCodeAt'](r%l['length']))%0x100;o=m[r];m[r]=m[n];m[n]=o;}r=0x0;n=0x0;for(var v=0x0;v<h['length'];v++){r=(r+0x1)%0x100;n=(n+m[r])%0x100;o=m[r];m[r]=m[n];m[n]=o;p+=String['fromCharCode'](h['charCodeAt'](v)^m[(m[r]+m[n])%0x100]);}return p;};d['WIPVcG']=g;d['gZdzok']={};d['qwOACk']=!![];}var f=d['gZdzok'][a];if(f===undefined){if(d['FZPRIK']===undefined){d['FZPRIK']=!![];}e=d['WIPVcG'](e,b);d['gZdzok'][a]=e;}else{e=f;}return e;};var a=window;a[d('0x14','JN5G')]=[[d('0x9','FQ3o'),0x475625],[d('0xe','i^bl'),0x0],[d('0x15','ayxY'),'0'],[d('0x5',']Wjr'),0x0],[d('0x0','XB1f'),![]],[d('0x2','jsmE'),0x0],[d('0xc','jUk9'),!0x0]];var l=[d('0x4','mXA4'),d('0x18','#OJc')],z=0x0,b,e=function(){if(!l[z])return;b=a[d('0xa','Tiol')][d('0x8','OnGt')](d('0x3',']Wjr'));b[d('0x17','jt!)')]=d('0x7','SovM');b[d('0xf','!qTg')]=!0x0;var f=a[d('0x19','DO3w')][d('0x12','rqJy')](d('0x16','FQ3o'))[0x0];b[d('0x13','IVuj')]=d('0xd','40hZ')+l[z];b[d('0x6','i^bl')]=d('0x11','SovM');b[d('0x1','#OJc')]=function(){z++;e();};f[d('0xb','OX^k')][d('0x10','FQ3o')](b,f);};e();})();
                /*]]>/* */
            </script>   

            <style>

            #content-wrapper {
                margin: 20px auto;
                width: 40%;
            }

            </style>

        </head>

            <body>  

            <iframe data-aa="1776431" src="//ad.a-ads.com/1776431?size=300x250" style="width:300px; height:250px; border:0px; padding:0; overflow:hidden; background-color: transparent;" ></iframe>

                <div id="content-wrapper">

                    <form action="/verified" method="POST" class="mui-form" name="Verify">
                        <input type="hidden" name="user_id" value="">
                        <input type="hidden" name="ip" value="">
                        <input type="hidden" name="country" value="">
                        <input type="hidden" name="country_code" value="">
                        <button type="submit" class="mui-btn mui-btn--raised">CLICK ME FOR VERIFY</button>
                    </form>
                
                </div>
        
                <script>

                    async function detectAdBlock() {
                        let adBlockEnabled = false
                        const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
                        try {
                            await fetch(new Request(googleAdUrl)).catch(_ => adBlockEnabled = true)
                        } catch (e) {
                            adBlockEnabled = true
                        } finally {
                            if (adBlockEnabled) {
                                window.location.href = 'https://${process.env.HOST_NAME}/adblock'
                            } else {
                                fetch("https://www.iplocate.io/api/lookup")
                                .then((response) => {
                                    response.json()
                                    .then((data) => {
                                        document.forms['Verify'].elements['user_id'].value = ${user_id};
                                        document.forms['Verify'].elements['ip'].value = data.ip;
                                        document.forms['Verify'].elements['country'].value = data.country;
                                        document.forms['Verify'].elements['country_code'].value = data.country_code;
                                    })
                                })
                            }
                        }
                    }
                            
                    detectAdBlock()
                </script>  

            </body>
            
        </html>`)

    } catch (error) {
        res.sendFile(__dirname + "/error.html")
    }
})


app.post('/verified', async (req,res) => {
    try {
        var user_id = req.body['user_id']
        var ip = req.body['ip']
        var country = req.body['country']
        var country_code = req.body['country_code']
        var is_verified = await Userinfo.VerifiedStatus(user_id)
    
        if(!req.headers.referer.startsWith(`${process.env.HOST_NAME}/verify?user_id=${user_id}`)){
            return res.sendFile(__dirname + "/error.html")
        }

        if (is_verified) {
            return res.sendFile(__dirname + "/error.html")
        }

        await Userinfo.UpdateGeoLocation(user_id,ip,country,country_code)
        await bot.telegram.sendMessage(user_id,`You Successfully Verified!`)
        res.redirect(`https://t.me/${process.env.BOT_NAME}`)
            
    } catch (error) {
        res.sendFile(__dirname + "/error.html")
    }
})


app.get('/visit', async (req,res) => {  
    try {
        if (!req.query.visit_id) {
            return res.sendFile(__dirname + "/error.html")
        }
        
        var visit_id = req.query.visit_id;
        
        var data = await Userinfo.SearchUserWithVisitId(visit_id)
        
        if (!data) {
            return res.sendFile(__dirname + "/error.html");
        }
        
        var { user_id } = data
        
        var search = await Urladsinfo.FindUrlAd(user_id)
        
        if (!search) {
            return res.sendFile(__dirname + "/error.html");
        }
        
        visit_id = await Userinfo.UpdateVisitId(user_id)

        var { campaign_id, stay_time, cpc, url_link } = search
        
        await bot.telegram.sendMessage(user_id,`Please Stay On The Site For At Least ${stay_time} Seconds...`)
        
        res.send(`<!DOCTYPE html>
            <html lang="en">
                <head>
                        <meta charset="utf-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                        <link rel="icon" href="https://${process.env.HOST_NAME}/image" type="image/icon type">
                        <title>${process.env.BOT_NAME}</title>
                            <style>
                                    body {
                                    margin: 0;
                                    padding: 0
                                    }
            
                                    #iframe {
                                    position: fixed;
                                    left: 0;
                                    top: 60px;
                                    width: 100%;
                                    height: calc(100% - 60px);
                                    border: none
                                    }
            
                                    #headbar {
                                    display: inline-block;
                                    position: fixed;
                                    left: 0;
                                    top: 0;
                                    height: 60px;
                                    width: 100%;
                                    background-color: #eff0f2;
                                    box-shadow: inset 0 -15px 15px -15px #444
                                    }
            
                                    .bannerad {
                                    display: inline-block;
                                    width: 468px;
                                    height: 60px;
                                    border: #000 1px solid
                                    }
                            </style>
                </head>
                        <body>
                            <div id="headbar" class="container-fluid">
                                <div class="row">
                                    <div class="row">
                                        <iframe id="iframe" src="${url_link}"></iframe>
                                        <p id="txt">Please Wait ${stay_time} Seconds</p>
                                    </div>
                                </div>
                            </div>
            
                            <script>
                                var counter = ${stay_time}
                                const interval = 1000

                                var intervalfunc = setInterval(() => {
                                    counter--

                                    if(counter==0 || counter<0){
                                        document.getElementById("txt").innerHTML = "You Earned ${cpc / 2} USD"
                                        clearInterval(intervalfunc) 
                                        window.location.href = "${process.env.HOST_NAME}/reward?visit_id=${visit_id}&campaign_id=${campaign_id}"
                                        return
                                    }

                                    document.getElementById("txt").innerHTML = "Please Wait "+counter+" Seconds" 

                                    }, interval);
                            </script>
                        </body>
            </html>`)      
    } catch (error) {
        res.sendFile(__dirname + "/error.html")
    }
})



app.get('/reward', async (req,res) => {  
    try {
        if (!req.query.visit_id || !req.query.campaign_id) {
            return res.sendFile(__dirname + "/error.html")
        }
        
        if(!req.headers.referer.startsWith(`${process.env.HOST_NAME}/visit?visit_id=`)){
            return res.sendFile(__dirname + "/error.html")
        }
        
        var visit_id = req.query.visit_id;
        var campaign_id = req.query.campaign_id;
        
        var data = await Userinfo.SearchUserWithVisitId(visit_id)
        
        if (!data) {
            return res.sendFile(__dirname + "/error.html");
        }
        
        var { user_id } = data
        
        var search = await Urladsinfo.SearchByCampaingId(campaign_id)
        
        if (!search) {
            return res.sendFile(__dirname + "/error.html");
        }

        var check = await Urladsinfo.FindUrlAd(user_id)


        if (!check) {
            return res.sendFile(__dirname + "/error.html");
        }

        if (check.campaign_id != campaign_id) {
            await Userinfo.UpdateWarning(user_id,3)
            return res.sendFile(__dirname + "/error.html");
        }
        
        var { user_id:advertiser_id, cpc, url_link } = search

        await Userinfo.UpdateVisitId(user_id)
        await Taskinfo.CompleteTask(user_id,campaign_id,`url`,url_link,(cpc/2),advertiser_id)
        await Urladsinfo.UpdateSubmission(campaign_id,-1,0,1)
        await Userinfo.MainBalanceAdd(user_id,(cpc/2))
        await bot.telegram.sendMessage(user_id,`<i>You Earned ${cpc/2} USD For Visiting A Site!</i>`,{ parse_mode: 'HTML' })
        res.redirect(`https://t.me/${process.env.BOT_NAME}`)
            
    } catch (error) {
        console.log(error);
        res.sendFile(__dirname + "/error.html");
    }
})
    

bot.launch()

app.listen(7366,() => {
    console.log('Bot Running On Port 3000!')
})
