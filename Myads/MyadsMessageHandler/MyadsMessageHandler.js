const { TryCatchErrorHandler } = require("../../Error/TryCatchErrorHandler/TryCatchErrorHandler")

const MyadsMessage = `<i>Here You Can Create New Ad And Check Current Ads...</i>`

const MyAdsMessage = `<i>🔬 Here You Can Manage All Your Running/Expired Ads.</i>`

const MyadsKeyboard = [[{text:'➕ New Ad'},{text:'📊 My Ads'}],[{text:'🔙 Back'}]]

const MyAdsKeyboard = [[{text:'📢 My Chat Ads'},{text:'🤖 My Bot Ads'}],[{text:'🔗 My Url Ads'},{text:'📄 My Post Ads'}],[{text:'↩️ Return'}]]


const MyadsMessageHandler = async (ctx) => {
    await SentMessage(ctx,MyadsMessage,MyadsKeyboard)
}


const MyAdsMessageHandler = async (ctx) => {
    await SentMessage(ctx,MyAdsMessage,MyAdsKeyboard)
}


const SentMessage = async (ctx,Message,Keyboard) => {
    try {
        await ctx.replyWithHTML(Message,{
            reply_markup:{
                keyboard :Keyboard,
                resize_keyboard:true
            }
        })  
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }          
}


module.exports = { MyadsMessageHandler, MyAdsMessageHandler }