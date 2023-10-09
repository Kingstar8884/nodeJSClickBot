const { HtmlParser } = require("../Middleware/middleware")

const messageTypeCheck = async (ctx) => {
    var message = (ctx.message.text=='📝 Text')?'text':(ctx.message.text=='⏩ Forward')?'forward':(ctx.message.text=='📹 Video')?'video':(ctx.message.text=='📷 Photo')?'photo':false

    if (!message) {
        await ctx.scene.leave()
        await ctx.replyWithHTML(`Select Which Kind Of Message You Want To Promote :`)
        return false
    }

    return message
}


const messageContent = async (ctx,messageType) => {

    if (ctx.updateSubTypes.find(data=>data==messageType)==undefined){
        console.log(ctx.updateSubTypes);
        await ctx.scene.leave();
        messageType = `${messageType} Message`
        await ctx.replyWithHTML(`Send Me The <b>${messageType}</b> Which You Want To Promote :`)
        return false
    }

    var checkhtmlparser = (messageType=='text')?/*await HtmlParser(ctx,ctx.message.text)*/true:(messageType=='video' || messageType=='photo')?(ctx.message.caption)?await HtmlParser(ctx,ctx.message.caption):true:true
    console.log(checkhtmlparser)
    if (!checkhtmlparser) {
        await ctx.replyWithHTML(`Message was not parsed properly.`)
        return false
    }

    return ctx.message
}


module.exports = { messageTypeCheck, messageContent }