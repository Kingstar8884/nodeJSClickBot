const { model } = require('mongoose')

const chatadsinfoSchema = require('../Database/chatadsinfoSchema/chatadsinfoSchema');
const Chatadsinfo = model('chatadsinfo', chatadsinfoSchema);

const { TryCatchErrorHandler } = require('../Error/TryCatchErrorHandler/TryCatchErrorHandler');

const NewAdsKeyboard = [[{text:'📢 New Chat Ads'},{text:'🤖 New Bot Ads'}],[{text:'🔗 New Url Ads'},{text:'📄 New Post Ads'}],[{text:'↩️ Return'}]]

const AdminFailedMessage = `<b>⚠️ Attention !!!</b>

You Must Make @${process.env.BOT_NAME} An Administrator Of %chatvar%.

<b>1) Go To :</b>

Manage Channel/Group > Administrators > Add Administrator

<b>2) Then Enter :</b>

@${process.env.BOT_NAME}

<i>This Is Needed To Verify That Users Joined Your Channel/Group.
Your Ad Will Not Start Until You Do This</i>`


const InvalidChatMessage = `⚠️ <b>Channel/Group Not Found Or Not Valid!</b> 
        
Please Try This Format <code>@Chatusername</code>`


const isChat = async (ctx) => {
    try {
        var chat = (ctx.message.text.startsWith('@')) ? ctx.message.text : `@${ctx.message.text}`
        var getChat = await ctx.telegram.getChat(chat)
        return chat
    } catch (error) {
        return false
    }
}


const isBotAdmin = async (ctx) => {
    try {
        var chat = (ctx.message.text.startsWith('@')) ? ctx.message.text : `@${ctx.message.text}`
        var isAdmin = await ctx.telegram.getChatMember(chat,process.env.BOT_ID)

        if(isAdmin.status=='administrator'){
            return chat
        }

        await AdminFailed(ctx,chat)
        await ctx.scene.leave()
        return false

    } catch (error) {
        await InvalidChat(ctx)
        await ctx.scene.leave()
        return false
    }
}


const CustomAdminChecker = async (ctx,chat_name) => {
    try {
        var isAdmin = await ctx.telegram.getChatMember(chat_name,process.env.BOT_ID)
        if(isAdmin.status=='administrator'){
            return true
        }
        console.log('Bot Not Admin');
        await Chatadsinfo.ChatAdStatus(chat_name,false,true,`⚠️ Inaccessible: You Must Make @${process.env.BOT_NAME} An Administrator Of Your Chat.`)
        return false
    } catch (error) {
        if(error.message=='400: Bad Request: user not found'){
            console.log('Bot Left The Chat')
            await Chatadsinfo.ChatAdStatus(chat_name,false,true,`⚠️ Inaccessible: You Must Make @${process.env.BOT_NAME} An Administrator Of Your Chat.`)
            return false
        }
        if(error.message=='400: Bad Request: chat not found'){
            console.log('Chat Invalid CustomAdminChecker')
            await Chatadsinfo.ChatAdStatus(chat_name,false,true,`⚠️ Your Chat Not Exist.`)
            return false
        }
        await Chatadsinfo.ChatAdStatus(chat_name,false,true,`⚠️ There Are Something Wrong Contact Admin`)
        return false
    }
}


const CustomUserChecker = async (ctx,chat_name,chat_id) => {
    try {
        var isAdmin = await ctx.telegram.getChatMember(chat_name,chat_id)
        if(isAdmin.status=='administrator' || isAdmin.status=='creator' || isAdmin.status=='member'){
            console.log('User Available In Chat');
            return true
        }
        console.log('User Left The Chat')
        return false
    } catch (error) {
        if(error.message=='400: Bad Request: user not found'){
            var res = await CustomAdminChecker(ctx,chat_name)
            if (!res) {
                console.log('Bot Not Admin');
                return true
            }
            console.log('User Left The Chat')
            return false
        }
        if(error.message=='400: Bad Request: chat not found'){
            console.log('Chat Invalid CustomUserChecker')
            await Chatadsinfo.ChatAdStatus(chat_name,false,true,`⚠️ Your Chat Not Exist.`)
            return true
        }
        await Chatadsinfo.ChatAdStatus(chat_name,false,true,`⚠️ There Are Something Wrong Contact Admin`)
        return true
    }
}



const ChatType = async (ctx) => {
    try {
        var chat = (ctx.message.text.startsWith('@')) ? ctx.message.text : `@${ctx.message.text}`
        var getChat = await ctx.telegram.getChat(chat)
        return (getChat.type =='channel') ? getChat.type:'group'
    } catch (error) {
        if(error.message=='400: Bad Request: user not found'){
            return false
        }
        if(error.message=='400: Bad Request: chat not found'){
            return false
        }
        await TryCatchErrorHandler(ctx,error)
        return false
    }
}


const AdminFailed = async (ctx,chat) => {
    try {
        await ctx.replyWithHTML(AdminFailedMessage.replace('%chatvar%',chat),{
            reply_markup:{
                keyboard:NewAdsKeyboard,
                resize_keyboard:true
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


const InvalidChat = async (ctx) => {
    try {
        await ctx.replyWithHTML(InvalidChatMessage,{
            reply_markup:{
                keyboard:NewAdsKeyboard,
                resize_keyboard:true
            }
        })
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}



module.exports = {
    isChat,isBotAdmin,CustomAdminChecker,CustomUserChecker,ChatType
}