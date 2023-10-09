const { TryCatchErrorHandler } = require("../../Error/TryCatchErrorHandler/TryCatchErrorHandler");

const Delete_Ad_Start_Message = `Are You Sure You Want To <b>DELETE</b> This Ad?

<b>This Action Cannot Be Undone.</b>`
const Delete_Ad_Finished_Message = `Your Ad Has Been <b>DELETED!</b>`

const MyAdsKeyboard = [[{text:'📢 My Chat Ads'},{text:'🤖 My Bot Ads'}],[{text:'🔗 My Url Ads'},{text:'📄 My Post Ads'}],[{text:'↩️ Return'}]]


const Delete_Ad_Start = async (ctx) => {
    try {
        await ctx.editMessageText(Delete_Ad_Start_Message,{
            parse_mode:'HTML',
            reply_markup:{
                inline_keyboard:
                [[
                    {text:'✅ Yes',callback_data:`Confirm_${ctx.match[0]}`},
                    {text:'❌ Cancel',callback_data:`Not_${ctx.match[0]}`}
                ]]
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


const Delete_Ad_Finished = async (ctx) => {
    try {
        await ctx.replyWithHTML(Delete_Ad_Finished_Message,{
            reply_markup:{
                keyboard :MyAdsKeyboard,
                resize_keyboard:true
            }
        }) 
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


module.exports = {
    Delete_Ad_Start,
    Delete_Ad_Finished
}