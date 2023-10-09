const { TryCatchErrorHandler } = require("../../Error/TryCatchErrorHandler/TryCatchErrorHandler");

const Edit_Title_Start_Message = `Enter The New Title For Your Ad :`
const Edit_Title_Finished_Message = `Your Ad Has Been Updated!✅`

const CancelledKeyboard = [[{text:'❌Cancel'}]]
const MyAdsKeyboard = [[{text:'📢 My Chat Ads'},{text:'🤖 My Bot Ads'}],[{text:'🔗 My Url Ads'},{text:'📄 My Post Ads'}],[{text:'↩️ Return'}]]


const Edit_Title_Start = async (ctx,sceneID) => {
    try {
        await ctx.replyWithHTML(Edit_Title_Start_Message,{
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


const Edit_Title_Finished = async (ctx) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(Edit_Title_Finished_Message,{
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
    Edit_Title_Start,
    Edit_Title_Finished
}