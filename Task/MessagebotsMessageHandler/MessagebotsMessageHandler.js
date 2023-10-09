const { model } = require('mongoose')

const userinfoSchema = require('../../Database/userinfoSchema/userinfoSchema')
const Userinfo = model('userinfo', userinfoSchema);

const botadsinfoSchema = require('../../Database/botadsinfoSchema/botadsinfoSchema');
const Botadsinfo = model('botadsinfo', botadsinfoSchema);

const taskinfoSchema = require('../../Database/taskinfoSchema/taskinfoSchema');
const Taskinfo = model('taskinfo', taskinfoSchema);

const { CustomBotChecker } = require('../../BotValidation/BotValidation');
const { TryCatchErrorHandler } = require('../../Error/TryCatchErrorHandler/TryCatchErrorHandler');
const { Escape } = require('../../Middleware/middleware');

const StartKeyboard = [[{text:'📢 Join Chats'},{text:'🤖 Message bots'}],[{text:'📄 View Posts'},{text:'🔗 Visit Sites'}],[{text:'💰 Balance'},{text:'👭 Referrals'},{text:'⚙️ Settings'}],[{text:'📊 My ads'}]]

const CancelledKeyboard = [[{text:'❌Cancel'}]]

const NoTaskMessage = `<b>Sorry, There Are No New Ads Available.</b> 😟

Alerts For New Bot Tasks Are <b>%task_notification%</b>

Use The Settings Button To Change Your Preferences.`

const TaskMessage = `⚠️ <i>WARNING: The Following Is A Third Party Advertisement. We Are Not Responsible For This.</i>
---------------------  

%title%
                                    
%description%
  
---------------------  
<i>1️⃣ Press The "✉️ Message bot" Button Below.
2️⃣ Send The Bot A Message Using Its "Start" Function.
3️⃣ Press "✅ Started" Button Then Forward A Message To Me From The Bot To Earn USD.</i>`


const WrongForwardMessage = `Sorry, That Is Not A Valid Forwarded Message.

You Must Forward A Message To Me From %bot_username%`

const SuccessForwardMessage = `✅ <b>Task Completed !</b>
      
💸 <i>You Earned: %reward% USD For Messaging A Bot !</i>`

const InvalidTaskMessage = `Sorry, That Task Is No Longer Valid. 😟`

const DoneBotStartMessage = `<i>🔎 Forward Any Message From That Bot To This Chat.</i>`



const MessagebotsMessageHandler = async (ctx) => {
    try {
        var TaskNotification = await Userinfo.TaskNotification(ctx.from.id)
        var data = await Botadsinfo.FindBotAd(ctx.from.id)

        if (!data) {
            return await ctx.replyWithHTML(NoTaskMessage.replace(/%task_notification%/gi,(TaskNotification)?`On 🔔`:`Off 🔕`),{
                parse_mode:'HTML',
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            });
        }
    
        var { campaign_id, title, description, bot_link } = data
    
        const MessagebotsKeyboard = [[{text:`✉️ Message bot`,url:`${bot_link}`},{text:'✅ Started',callback_data:`DoneBot${campaign_id}`}],[{text:'🛑 Report',callback_data:`Report_BotAd_${campaign_id}`},{text:'⏩ Skip',callback_data:`Skip_BotAd_${campaign_id}`}]]
    
        await ctx.replyWithHTML(TaskMessage.replace(/%title%/gi,Escape(title))
        .replace(/%description%/gi,Escape(description)),{
            disable_web_page_preview:true,
            reply_markup:{
                inline_keyboard :MessagebotsKeyboard
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}



const Done_Bot_Start = async (ctx,sceneID) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(DoneBotStartMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(sceneID)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


const Done_Bot_Finished = async (ctx,sceneID,campaign_id) => {
    try {
        await ctx.scene.leave()
        await DoneBot(ctx,sceneID,campaign_id)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


const DoneBot = async (ctx,sceneID,campaign_id) => {
    try {
        var check = await Botadsinfo.FindBotAd(ctx.from.id)


        if (!check) {
            return await ctx.replyWithHTML(InvalidTaskMessage,{
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            })
        }

        if (check.campaign_id!=campaign_id) {
            return await ctx.replyWithHTML(InvalidTaskMessage,{
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            })
        }

        var data = await Botadsinfo.SearchByCampaingId(campaign_id)

        if (!data) {
            return await ctx.replyWithHTML(InvalidTaskMessage,{
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            })
        }
    
        var { user_id, cpc, bot_username, bot_link } = data
    
        var isValid = await CustomBotChecker(ctx,bot_username)
    
        if (!isValid) {
            return await ctx.scene.enter(sceneID)
        }
    
        var complete = await Taskinfo.CompleteTask(ctx.from.id,campaign_id,`bot`,bot_link,(cpc/2),user_id)
        
        if (!complete) {
            return await ctx.replyWithHTML(InvalidTaskMessage,{
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            })
        }
    
        await Botadsinfo.UpdateSubmission(campaign_id,-1,0,1)
        await Userinfo.MainBalanceAdd(ctx.from.id,(cpc/2))
    
        await ctx.replyWithHTML(SuccessForwardMessage.replace(/%reward%/gi,(cpc/2)),{
            disable_web_page_preview:true,
            reply_markup:{
                keyboard :StartKeyboard,
                resize_keyboard:true
            }
        })
    
        await MessagebotsMessageHandler(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


const SkipBotAd = async (ctx) => {
    try {
        await ctx.replyWithHTML(`Skipping Task...`)
        await MessagebotsMessageHandler(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


module.exports = { MessagebotsMessageHandler, Done_Bot_Start, Done_Bot_Finished, SkipBotAd }