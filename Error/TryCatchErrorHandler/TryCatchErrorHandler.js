const { model } = require("mongoose");

const userinfoSchema = require("../../Database/userinfoSchema/userinfoSchema")
const Userinfo = model('userinfo', userinfoSchema);

const TryCatchErrorHandler = async (ctx,error) => {
    try {

        if (error.message=='403: Forbidden: bot was blocked by the user') {
            return await Userinfo.UpdateIsBlock(ctx.from.id || error.on.payload.chat_id,true)
        }

        await ctx.telegram.sendMessage(process.env.ADMIN_CHAT_ID,`An Error Found In Try Catch Block => ${error.stack}`)
    } catch (error) {
        console.log(`We Can Not Send Error Message To This ${process.env.ADMIN_CHAT_ID} Admin Id`)
    }
}


module.exports = { TryCatchErrorHandler }