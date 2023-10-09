const { TryCatchErrorHandler } = require("../../Error/TryCatchErrorHandler/TryCatchErrorHandler");

const NewAdsMessage = `<b>What Would You Like To Promote?</b>

Choose An Option Below... 👇`

const NewAdsKeyboard = [[{text:'📢 New Chat Ads'},{text:'🤖 New Bot Ads'}],[{text:'🔗 New Url Ads'},{text:'📄 New Post Ads'}],[{text:'↩️ Return'}]]

const NewAdMessageHandler = async (ctx) => {
    try {
        await ctx.replyWithHTML(NewAdsMessage,{
            reply_markup:{
                keyboard :NewAdsKeyboard,
                resize_keyboard:true
            }
        }) 
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


module.exports = { NewAdMessageHandler }