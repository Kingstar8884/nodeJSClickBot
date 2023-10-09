const { TryCatchErrorHandler } = require("../../Error/TryCatchErrorHandler/TryCatchErrorHandler");

const Report_Ad_Start_Message = `Choose The Reason You Are Reporting This Ad Below :`
const Report_Ad_Finished_Message = `The Ad Has Been Reported! Thanks For Your Feedback.

Press The <b>"Skip"</b> Button To Skip The Ad.`

const ReportBotAdKeyboard = [[{text:'🚫 Not Working'},{text:'⚠️ Illegal/Scam'},{text:'🦠 Virus/Malware'}],[{text:'❌Cancel'}]]
const ReportAdKeyboard = [[{text:'🔞 Porn/NSFW'},{text:'⚠️ Illegal/Scam'},{text:'🦠 Virus/Malware'}],[{text:'❌Cancel'}]]
const StartKeyboard = [[{text:'📢 Join Chats'},{text:'🤖 Message bots'},{text:'📄 View Posts'},{text:'🔗 Visit Sites'}],[{text:'💰 Balance'},{text:'👭 Referrals'},{text:'⚙️ Settings'}],[{text:'📊 My ads'}]]


const Report_Ad_Start = async (ctx,Ad_Name,sceneID) => {
    try {
        var keyboard = (Ad_Name=='BotAd')?ReportBotAdKeyboard:ReportAdKeyboard
        await ctx.replyWithHTML(Report_Ad_Start_Message,{
            reply_markup:{
                keyboard :keyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(sceneID)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


const Report_Ad_Finished = async (ctx) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(Report_Ad_Finished_Message,{
            reply_markup:{
                keyboard :StartKeyboard,
                resize_keyboard:true
            }
        }) 
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


module.exports = {
    Report_Ad_Start,
    Report_Ad_Finished
}