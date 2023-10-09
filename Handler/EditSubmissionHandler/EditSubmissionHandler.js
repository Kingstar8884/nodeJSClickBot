const { TryCatchErrorHandler } = require("../../Error/TryCatchErrorHandler/TryCatchErrorHandler");

const Edit_Submission_Start_Message = `🔻 <b>How Much Budget You Want To Add To This Promotion</b> ❓

The Minimum Amount Is <b>%cpc% USD</b>

<i>Enter A Value In USD :</i>`

const Edit_Submission_Finished_Message = `Your Ad Has Been Updated!✅`

const CancelledKeyboard = [[{text:'❌Cancel'}]]
const MyAdsKeyboard = [[{text:'📢 My Chat Ads'},{text:'🤖 My Bot Ads'}],[{text:'🔗 My Url Ads'},{text:'📄 My Post Ads'}],[{text:'↩️ Return'}]]


const Edit_Submission_Start = async (ctx,cpc,sceneID) => {
    try {
        await ctx.replyWithHTML(Edit_Submission_Start_Message.replace(/%cpc%/gi,cpc),{
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


const Edit_Submission_Finished = async (ctx) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(Edit_Submission_Finished_Message,{
            reply_markup:{
                keyboard :MyAdsKeyboard,
                resize_keyboard:true
            }
        }) 
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


module.exports = {
    Edit_Submission_Start,
    Edit_Submission_Finished
}