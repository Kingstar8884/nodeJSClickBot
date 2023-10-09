const { model } = require('mongoose')

const chatadsinfoSchema = require('../../Database/chatadsinfoSchema/chatadsinfoSchema')
const Chatadsinfo = model('chatadsinfo', chatadsinfoSchema);

const { generateKeyboard } = require('../../Pagination/pagination')
const { ExploreRank, Escape } = require('../../Middleware/middleware')

var message = `<b>🆔 Campaign #%campaign_id%</b> - %chat_type% 📣

<b>📝 Title : %title%</b>  
<b>💬 Description :</b> %description%
<b>📣 %chat_type% :</b> %chat_name%  
<b>✅ Status : %status%</b>  
<b>🏆 Display Rank : %display_rank%</b>  
<b>💵 CPC : %cpc% USD</b>  
<b>⏰ Member Retention : %stay_time%hrs</b>  
<b>✳️ Joined : %joined%</b>
<b>⌛️ Remain Submission : %remain_submission%</b>`


const MyChatAdsMessageHandler = async (ctx) => {

    var TotalCreateAd = await Chatadsinfo.TotalCreateAd(ctx.from.id)

    if (TotalCreateAd<=0) {
        return await ctx.replyWithHTML(`You Don't Have Any Channel/Group Ad Campaign Yet.`)
    }

    await SentMessage(ctx,0,1)
}

    
const SentMessage = async (ctx,skip,count) => {

    var { campaign_id,title,description,chat_name,chat_type,status,cpc,stay_time,joined,remain_submission,isError,error_message,display_rank } = await Chatadsinfo.ChatAdOne(ctx.from.id,skip)
    var page = await Chatadsinfo.TotalCreateAd(ctx.from.id)
    var Ad_Name = 'ChatAd'
    var StatusText = (!status)?'Active ✅':'Disabled 🚫'
    var StatusCheck = (status)?'Disabled':'Active'

    var keyboard = await generateKeyboard(count,campaign_id,page,Ad_Name,StatusText,StatusCheck)

    await ctx.replyWithHTML(message
        .replace(/%campaign_id%/gi,campaign_id)
        .replace(/%title%/gi,Escape(title))
        .replace(/%description%/gi,Escape(description))
        .replace(/%chat_type%/gi,(chat_type=='channel')?'Channel':'Group')
        .replace(/%chat_name%/gi,chat_name)
        .replace(/%status%/gi,(!isError)?(status)?(remain_submission>0)?'Active ✅':'⏸ Paused: Submission Reached Out.':'Disabled 🚫':Escape(error_message))
        .replace(/%display_rank%/gi,(display_rank) ? await ExploreRank(display_rank):`Disabled 🚫`)
        .replace(/%cpc%/gi,cpc)
        .replace(/%stay_time%/gi,stay_time)
        .replace(/%joined%/gi,joined)
        .replace(/%remain_submission%/gi,remain_submission),{
            disable_web_page_preview: true,
            reply_markup:{
                inline_keyboard :keyboard
            }
        })
}



const MyChatAdsList = async (ctx,skip,count) => {

    var { campaign_id,title,description,chat_name,chat_type,status,cpc,stay_time,joined,remain_submission,isError,error_message,display_rank } = await Chatadsinfo.ChatAdOne(ctx.from.id,skip)
    var page = await Chatadsinfo.TotalCreateAd(ctx.from.id)
    var Ad_Name = 'ChatAd'
    var StatusText = (!status)?'Active ✅':'Disabled 🚫'
    var StatusCheck = (status)?'Disabled':'Active'

    var keyboard = await generateKeyboard(count,campaign_id,page,Ad_Name,StatusText,StatusCheck)

    await ctx.editMessageText(message
        .replace(/%campaign_id%/gi,campaign_id)
        .replace(/%title%/gi,Escape(title))
        .replace(/%description%/gi,Escape(description))
        .replace(/%chat_type%/gi,(chat_type=='channel')?'Channel':'Group')
        .replace(/%chat_name%/gi,chat_name)
        .replace(/%status%/gi,(!isError)?(status)?(remain_submission>0)?'Active ✅':'⏸ Paused: Submission Reached Out.':'Disabled 🚫':Escape(error_message))
        .replace(/%display_rank%/gi,(display_rank) ? await ExploreRank(display_rank):`Disabled 🚫`)
        .replace(/%cpc%/gi,cpc)
        .replace(/%stay_time%/gi,stay_time)
        .replace(/%joined%/gi,joined)
        .replace(/%remain_submission%/gi,remain_submission)
        .replace(/%display_rank%/gi,display_rank),{
            disable_web_page_preview: true,
            parse_mode:'HTML',
            reply_markup:{
                inline_keyboard :keyboard
            }
        })
}

module.exports = { MyChatAdsMessageHandler, MyChatAdsList }