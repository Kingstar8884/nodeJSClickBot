const validator = require('validator')

const CancelledKeyboard = [[{text:'❌Cancel'}]]

const InvalidUrlMessage = `That Does Not Look Like A Valid URL.

Please Enter A URL That Begins With http:// or https://`

const isURL = async (ctx) => {
    try {
        var isURL = await validator.isURL(ctx.message.text,{ protocols: ['http','https']})  

        if (!isURL) {
            await InvalidUrl(ctx)
            return false
        }
        return ctx.message.text 
    } catch (error) {
        await InvalidUrl(ctx)
        return false
    }
}


const InvalidUrl = async (ctx) => {
    try {
        await ctx.replyWithHTML(InvalidUrlMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
                }
            })  
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
        return false
    }
}



module.exports = { isURL }