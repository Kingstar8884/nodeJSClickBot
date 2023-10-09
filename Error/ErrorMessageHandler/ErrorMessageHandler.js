const { model } = require("mongoose");

const userinfoSchema = require("../../Database/userinfoSchema/userinfoSchema")
const Userinfo = model('userinfo', userinfoSchema);

const ErrorMessageHandler = async (ctx, error) => {
    try {

        if (error.message=='403: Forbidden: bot was blocked by the user') {
            return await Userinfo.UpdateIsBlock(ctx.from.id,true)
        }

        await ctx.telegram.sendMessage(process.env.ADMIN_CHAT_ID,`Telegraf Bot Catch Detect An Error The Error Message Was => ${error.stack}`)        
    } catch (error) {
        console.log(`We Can Not Send Error Message To This ${process.env.ADMIN_CHAT_ID} Admin Id`)
    }
}


module.exports = { ErrorMessageHandler }