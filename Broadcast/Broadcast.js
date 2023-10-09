const { model } = require("mongoose");

const userinfoSchema = require("../Database/userinfoSchema/userinfoSchema");
const Userinfo = model('userinfo', userinfoSchema);


const SendTextMessage = async (ctx, user_id, text) => {
    try {
        await ctx.telegram.sendMessage(user_id,text,{ parse_mode:'HTML', disable_web_page_preview:true })
    } catch (error) {
        if (error.message=='403: Forbidden: bot was blocked by the user') {
            return await Userinfo.UpdateIsBlock(user_id,true)
        }
        console.log(error);
    }
}


const ForwardMessage = async (ctx, user_id, fromChatId, message_id) => {
    try {
        await ctx.telegram.forwardMessage(user_id, fromChatId, message_id)
    } catch (error) {
        if (error.message=='403: Forbidden: bot was blocked by the user') {
            return await Userinfo.UpdateIsBlock(user_id,true)
        }
        console.log(error);
    }
}


const PhotoMessage = async (ctx, user_id, photo_id, caption) => {
    try {
        if (!caption) {
            return await ctx.telegram.sendPhoto(user_id,photo_id)
        }
     
        return await ctx.telegram.sendPhoto(user_id,photo_id,{ 
            caption: caption, 
            disable_web_page_preview: true, 
            parse_mode: 'HTML' 
        })
    } catch (error) {
        if (error.message=='403: Forbidden: bot was blocked by the user') {
            return await Userinfo.UpdateIsBlock(user_id,true)
        }
        console.log(error);
    }
}


const VideoMessage = async (ctx, user_id, video_id, caption) => {
    try {
        if (!caption) {
            return await ctx.telegram.sendVideo(user_id,video_id)
        }

        return await ctx.telegram.sendVideo(user_id,video_id,{ 
            caption: caption, 
            disable_web_page_preview: true, 
            parse_mode: 'HTML' 
        })
    } catch (error) {
        if (error.message=='403: Forbidden: bot was blocked by the user') {
            return await Userinfo.UpdateIsBlock(user_id,true)
        }
        console.log(error);
    }
}


module.exports = {
    SendTextMessage,
    ForwardMessage,
    PhotoMessage,
    VideoMessage
}