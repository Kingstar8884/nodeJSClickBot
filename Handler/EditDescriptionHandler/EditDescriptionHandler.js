const { TryCatchErrorHandler } = require("../../Error/TryCatchErrorHandler/TryCatchErrorHandler");

const Edit_Description_Start_Message = `Enter The New Description For Your Ad :`
const Edit_Description_Finished_Message = `Your Ad Has Been Updated!✅`

const CancelledKeyboard = [[{text:'❌Cancel'}]]
const MyAdsKeyboard = [[{text:'📢 My Chat Ads'},{text:'🤖 My Bot Ads'}],[{text:'🔗 My Url Ads'},{text:'📄 My Post Ads'}],[{text:'↩️ Return'}]]


const Edit_Description_Start = async (ctx,sceneID) => {
    try {
        await ctx.replyWithHTML(Edit_Description_Start_Message,{
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


const Edit_Description_Finished = async (ctx) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(Edit_Description_Finished_Message,{
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
    Edit_Description_Start,
    Edit_Description_Finished
}