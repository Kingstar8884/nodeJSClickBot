const { TryCatchErrorHandler } = require("../../Error/TryCatchErrorHandler/TryCatchErrorHandler");

const Edit_ChatAd_Start_Message = `Enter The New Username Of The Chat You Want To Promote :`
const Edit_BotAd_Start_Message = `Please Forward A New Message From The Bot You Want To Promote :`
const Edit_UrlAd_Start_Message = `Enter the New URL For Your Ad :`
const Edit_PostAd_Start_Message = `Select Which Kind Of Message You Want To Promote :`
const Edit_Ad_Finished_Message = `Your Ad Has Been Updated!✅`

const EditBotLinkStartMessage = `Enter The <b>URL</b> (All The Traffic Will Be Sent To That Link) Of The Bot You Want To Promote :`
const EditPostStartMessage = `Send Me The <b>%messageType%</b> Which You Want To Promote :`

const CancelledKeyboard = [[{text:'❌Cancel'}]]
const PostTypekeyboard = [[{text:'📝 Text'},{text:'⏩ Forward'}],[{text:'📹 Video'},{text:'📷 Photo'}],[{text:'❌Cancel'}]]
const MyAdsKeyboard = [[{text:'📢 My Chat Ads'},{text:'🤖 My Bot Ads'}],[{text:'🔗 My Url Ads'},{text:'📄 My Post Ads'}],[{text:'↩️ Return'}]]


const Edit_Ad_Start = async (ctx,sceneID,Ad_Name) => {
    try {
        var Edit_Ad_Start_Message = (Ad_Name=='ChatAd') ? Edit_ChatAd_Start_Message : (Ad_Name=='BotAd') ? Edit_BotAd_Start_Message : (Ad_Name=='UrlAd') ? Edit_UrlAd_Start_Message : (Ad_Name=='PostAd') ? Edit_PostAd_Start_Message : undefined
        await ctx.replyWithHTML(Edit_Ad_Start_Message,{
            reply_markup:{
                keyboard :(Ad_Name=='PostAd') ? PostTypekeyboard : CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(sceneID)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


const EditBotLinkStart = async (ctx,campaign_id) => {
    try {
        await ctx.replyWithHTML(EditBotLinkStartMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`EditBotLinkStart_${campaign_id}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


const EditPostStart = async (ctx,messageType,campaign_id) => {
    try {
        await ctx.replyWithHTML(EditPostStartMessage.replace(/%messageType%/gi,messageType),{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`EditPost_${campaign_id}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


const Edit_Ad_Finished = async (ctx) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(Edit_Ad_Finished_Message,{
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
    Edit_Ad_Start,
    EditBotLinkStart,
    EditPostStart,
    Edit_Ad_Finished
}