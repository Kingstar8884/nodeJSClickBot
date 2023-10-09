const { TryCatchErrorHandler } = require("../../Error/TryCatchErrorHandler/TryCatchErrorHandler")

const CanceledEditMessage = async (ctx) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(`Your Edit Has Been ❌ Canceled.`)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


module.exports = { CanceledEditMessage }