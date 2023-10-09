const { model } = require('mongoose')

const userinfoSchema = require('../../Database/userinfoSchema/userinfoSchema');
const Userinfo = model('userinfo', userinfoSchema);

const urladsinfoSchema = require('../../Database/urladsinfoSchema/urladsinfoSchema');
const Urladsinfo = model('urladsinfo', urladsinfoSchema);

const { TryCatchErrorHandler } = require('../../Error/TryCatchErrorHandler/TryCatchErrorHandler');
const { Escape } = require('../../Middleware/middleware');

const StartKeyboard = [[{text:'📢 Join Chats'},{text:'🤖 Message bots'}],[{text:'📄 View Posts'},{text:'🔗 Visit Sites'}],[{text:'💰 Balance'},{text:'👭 Referrals'},{text:'⚙️ Settings'}],[{text:'📊 My ads'}]]

const NoTaskMessage = `<b>Sorry, There Are No New Ads Available.</b> 😟

Alerts For New Visit Site Tasks Are <b>%task_notification%</b>

Use The Settings Button To Change Your Preferences.`

const TaskMessage = `⚠️ <i>WARNING: The Following Is A Third Party Advertisement. We Are Not Responsible For This.</i>
---------------------  

%title%
                                    
%description%
  
---------------------  
<i>Press The "🔗 Visit Sites" Button To Earn USD.
You Will Be Redirected To A Third Party Site.</i>`



const VisitSitesMessageHandler = async (ctx) => {
    try {
        var TaskNotification = await Userinfo.TaskNotification(ctx.from.id)
        var data = await Urladsinfo.FindUrlAd(ctx.from.id)

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
    
        var { campaign_id, title, description } = data
    
        var visit_id = await Userinfo.UpdateVisitId(ctx.from.id)

        if (!visit_id) {
            return await ctx.replyWithHTML(NoTaskMessage.replace(/%task_notification%/gi,(TaskNotification)?`On 🔔`:`Off 🔕`),{
                parse_mode:'HTML',
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            });
        }

        const VisitSitesKeyboard = [[{text:`🔗 Visit Sites`,url:`${process.env.HOST_NAME}/visit?visit_id=${visit_id}`}],[{text:'🛑 Report',callback_data:`Report_UrlAd_${campaign_id}`},{text:'⏩ Skip',callback_data:`Skip_UrlAd_${campaign_id}`}]]
    
        await ctx.replyWithHTML(TaskMessage
            .replace(/%title%/gi,Escape(title))
            .replace(/%description%/gi,Escape(description)),{
            disable_web_page_preview:true,
            reply_markup:{
                inline_keyboard :VisitSitesKeyboard
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}



const SkipUrlAd = async (ctx) => {
    try {
        await ctx.replyWithHTML(`Skipping Task...`)
        await VisitSitesMessageHandler(ctx)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


module.exports = { VisitSitesMessageHandler, SkipUrlAd }