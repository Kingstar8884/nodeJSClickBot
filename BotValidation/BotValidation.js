const { TryCatchErrorHandler } = require("../Error/TryCatchErrorHandler/TryCatchErrorHandler")

const RequireForwardMessage = `Sorry, That Is Not A Valid Forwarded Message.

Please Forward A New Message To Me From The Bot You Are Trying To Promote.`

const WrongForwardMessage = `Sorry, That Is Not A Valid Forwarded Message.

You Must Forward A Message To Me From %bot_username%`

const TimeOutMessage = `The Message You Forwarded Is Too Old. 🕰

Please Send A Newer Message From %bot_username%.`

const WrongBotLinkMessage = `That Does Not Look Like A Valid %bot_username% URL.

Please Enter The URL From The Bot You Are Trying To Promote.`

const CancelledKeyboard = [[{text:'❌Cancel'}]]

const isBot = async (ctx) => {

    if (!ctx.message.forward_from) {
        await RequireForward(ctx)
        return false
    }

    if (!ctx.message.forward_from.is_bot) {
        await RequireForward(ctx)
        return false
    }

    if ((ctx.message.forward_date+15)<ctx.message.date) {
        await TimeOut(ctx)
        return false
    }

    return ctx.message.forward_from.username
}


const isBotLink = async (ctx,bot_username) => {

    if (!ctx.message.text.startsWith(`https://t.me/${bot_username}`)) {
        await WrongBotLink(ctx,bot_username)
        return false
    }

    return ctx.message.text
}


const CustomBotChecker = async (ctx,bot_username) => {

    if (!ctx.message.forward_from) {
        await WrongForward(ctx,bot_username)
        return false
    }

    if (!ctx.message.forward_from.is_bot) {
        await WrongForward(ctx,bot_username)
        return false
    }

    if ((ctx.message.forward_date+15)<ctx.message.date) {
        await TimeOut(ctx)
        return false
    }

    if (ctx.message.forward_from.username==bot_username) {
        return true
    }

    await WrongForward(ctx,bot_username)
    return false
}


const WrongForward = async (ctx,bot_username) => {
    try {
        await ctx.replyWithHTML(WrongForwardMessage.replace(/%bot_username%/gi,bot_username),{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    } 
}


const RequireForward = async (ctx) => {
    try {
        await ctx.replyWithHTML(RequireForwardMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    } 
}


const TimeOut = async (ctx) => {
    try {
        await ctx.replyWithHTML(TimeOutMessage.replace(/%bot_username%/gi,ctx.message.forward_from.username),{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    } 
}


const WrongBotLink = async (ctx,bot_username) => {
    try {
        await ctx.replyWithHTML(WrongBotLinkMessage.replace(/%bot_username%/gi,bot_username),{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


module.exports = { isBot, isBotLink, CustomBotChecker }