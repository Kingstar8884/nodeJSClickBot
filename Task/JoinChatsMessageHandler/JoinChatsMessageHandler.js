const { model } = require('mongoose')

const userinfoSchema = require('../../Database/userinfoSchema/userinfoSchema')
const Userinfo = model('userinfo', userinfoSchema);

const chatadsinfoSchema = require('../../Database/chatadsinfoSchema/chatadsinfoSchema');
const Chatadsinfo = model('chatadsinfo', chatadsinfoSchema);

const taskinfoSchema = require('../../Database/taskinfoSchema/taskinfoSchema')
const Taskinfo = model('taskinfo', taskinfoSchema);

const { CustomAdminChecker, CustomUserChecker } = require('../../ChatValidation/ChatValidation');
const { TryCatchErrorHandler } = require('../../Error/TryCatchErrorHandler/TryCatchErrorHandler');
const { Escape } = require('../../Middleware/middleware');


const StartKeyboard = [[{text:'📢 Join Chats'},{text:'🤖 Message bots'}],[{text:'📄 View Posts'},{text:'🔗 Visit Sites'}],[{text:'💰 Balance'},{text:'👭 Referrals'},{text:'⚙️ Settings'}],[{text:'📊 My ads'}]]

const NoTaskMessage = `<b>Sorry, There Are No New Ads Available.</b> 😟

Alerts For New Chat Tasks Are <b>%task_notification%</b>

Use The Settings Button To Change Your Preferences.`

const TaskMessage = `⚠️ <i>WARNING: The Following Is A Third Party Advertisement. We Are Not Responsible For This.</i>
---------------------  
                                    
%title%
                                    
%description%
                                    
---------------------  
<i>Press The "📣 Join The %chat_type%" Button Below.
After Joining, Press The "✅ Joined" button To Earn USD.</i>`


const UserNotJoinChatMessage = `We Cannot Find You In The %chat_type%.

If This Message Persists, Try Rejoining The %chat_type%.`


const SuccessJoinChatMessage = `✅ <b>Success !</b> 👍
                        
<i>You Must Stay In The %chat_type% For At Least %stay_time% Hour To Earn Your Reward.</i>`

const InvalidTaskMessage = `Sorry, That Task Is No Longer Valid. 😟`


const JoinChatsMessageHandler = async (ctx) => {
    try {
        var TaskNotification = await Userinfo.TaskNotification(ctx.from.id)
        var data = await Chatadsinfo.FindChatAd(ctx.from.id)

        if (!data) {
            return await ctx.replyWithHTML(NoTaskMessage.replace(/%task_notification%/gi,(TaskNotification)?`On 🔔`:`Off 🔕`),{
                parse_mode:'HTML',
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            })
        }
    
        var { user_id, campaign_id, title, description, chat_name, chat_type } = data
    
        var res = await CustomAdminChecker(ctx,chat_name)
    
        if (!res) {
            return await ctx.replyWithHTML(NoTaskMessage.replace(/%task_notification%/gi,(TaskNotification)?`On 🔔`:`Off 🔕`),{
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            })
        }
        
        const JoinChatKeyboard = [
            [{text:`📣 Join The ${chat_type.replace(/^./, chat_type[0].toUpperCase())}`,url:`https://t.me/${chat_name.substring(1)}`},{text:'✅ Joined',callback_data:`DoneChat${campaign_id}`}],
            [{text:'🛑 Report',callback_data:`Report_ChatAd_${campaign_id}`},{text:'⏩ Skip',callback_data:`Skip_ChatAd_${campaign_id}`}]
        ]
    
        await ctx.replyWithHTML(TaskMessage.replace(/%title%/gi,Escape(title))
        .replace(/%description%/gi,Escape(description))
        .replace(/%chat_type%/gi,chat_type.replace(/^./, chat_type[0].toUpperCase())),{
            disable_web_page_preview:true,
            reply_markup:{
                inline_keyboard :JoinChatKeyboard
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


const DoneChat = async (ctx) => {
    try {
        var valid = await Chatadsinfo.FindChatAd(ctx.from.id)

        if (!valid) {
            await Userinfo.UpdateWarning(ctx.from.id,3)
            return await ctx.replyWithHTML(InvalidTaskMessage,{
                parse_mode:'HTML',
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            })
        }

        if (valid.campaign_id!=ctx.match[1]) {
            await Userinfo.UpdateWarning(ctx.from.id,3)
            return await ctx.replyWithHTML(InvalidTaskMessage,{
                parse_mode:'HTML',
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            }) 
        }

        var data = await Chatadsinfo.SearchByCampaingId(ctx.match[1])

        if (!data) {
            return await ctx.replyWithHTML(InvalidTaskMessage,{
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            })
        }

        var { user_id, campaign_id, chat_name, chat_type, cpc, stay_time, budget } = data

        var isAdmin = await CustomAdminChecker(ctx,chat_name)
        console.log(isAdmin);

        if (!isAdmin) {
            return await ctx.replyWithHTML(InvalidTaskMessage,{
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            })
        }

        var res = await CustomUserChecker(ctx,chat_name,ctx.from.id)

        if (!res) {
            return await ctx.replyWithHTML(UserNotJoinChatMessage.replace(/%chat_type%/gi,chat_type.replace(/^./, chat_type[0].toUpperCase())),{
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            })
        }

        var completed_at = new Date(Date.now()+((86400000/24)*stay_time))
        var complete = await Taskinfo.PendingTask(ctx.from.id,campaign_id,chat_type,chat_name,(cpc/2),user_id,completed_at)
        
        if (!complete) {
            return await ctx.replyWithHTML(InvalidTaskMessage,{
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            })
        }

        await Chatadsinfo.UpdateSubmission(campaign_id,-1,0,1)
        await ctx.replyWithHTML(SuccessJoinChatMessage.replace(/%stay_time%/gi,stay_time)
        .replace(/%chat_type%/gi,chat_type),{
            disable_web_page_preview:true,
            reply_markup:{
                keyboard :StartKeyboard,
                resize_keyboard:true
            }
        })

        await JoinChatsMessageHandler(ctx)

    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
        return await ctx.replyWithHTML(InvalidTaskMessage,{
            disable_web_page_preview:true,
            reply_markup:{
                keyboard :StartKeyboard,
                resize_keyboard:true
            }
        })
    }
}



const SkipChatAd = async (ctx) => {
    try {
        await ctx.replyWithHTML(`Skipping Task...`)
        await JoinChatsMessageHandler(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}



const SearchChatPendingTask = async (ctx) => {
    try {
        var completed_at = new Date(Date.now())
        var data = await Taskinfo.SearchChatPendingTask(completed_at)

        if (!data) {
            return console.log(`No Pending Chat Task Found`);
        }
    
        var { _id, tasker_id, campaign_id, task_type, task_data:chat_name, rewarded, advertiser_id, completed_at } = data

        var isAdmin = await CustomAdminChecker(ctx,chat_name)

        if (!isAdmin) {
            await Userinfo.UpdateWarning(advertiser_id,1)
            await Taskinfo.DeleteTask(_id)
            return console.log(`No Reward Delete This From Data Advertiser Fault`)
        }

        var result = await CustomUserChecker(ctx,chat_name,tasker_id)
    
        if (!result) {
            await Userinfo.UpdateWarning(tasker_id,1)
            await Chatadsinfo.UpdateSubmission(campaign_id,1,0,-1)
            await Taskinfo.DeleteTask(_id)
            return console.log(`No Reward Delete This From Data Tasker Fault`)
        }
    
        var update = await Taskinfo.UpdateTask(_id)
        var user = await Userinfo.MainBalanceAdd(tasker_id,rewarded)

        if (!user || !update) {
            return false
        }

        await ctx.telegram.sendMessage(tasker_id,`You Earned ${rewarded} USD For Joining A ${task_type.replace(/^./, task_type[0].toUpperCase())}!`)

    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}



module.exports = { JoinChatsMessageHandler, DoneChat, SkipChatAd, SearchChatPendingTask }