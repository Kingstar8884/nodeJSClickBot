const { model } = require('mongoose')

const botadsinfoSchema = require('../../Database/botadsinfoSchema/botadsinfoSchema')
const Botadsinfo = model('botadsinfo', botadsinfoSchema);
const { generateKeyboard } = require('../../Pagination/pagination')
const { ExploreRank, Escape } = require('../../Middleware/middleware')

var message = `<b>🆔 Campaign #%campaign_id%</b> - Bot 🤖

<b>📝 Title : %title%</b>  
<b>💬 Description :</b> %description%
<b>🔗 URL :</b> %bot_link%  
<b>✅ Status : %status%</b>  
<b>🏆 Display Rank : %display_rank%</b>  
<b>💵 CPC : %cpc% USD</b>   
<b>👥 Refferals : %joined%</b>
<b>⌛️ Remain Submission : %remain_submission%</b>`


const MyBotAdsMessageHandler = async (ctx) => {

    var TotalCreateAd = await Botadsinfo.TotalCreateAd(ctx.from.id)

    if (TotalCreateAd<=0) {
        return await ctx.replyWithHTML(`You Don't Have Any Bot Ad Campaign Yet.`)
    }

    await SentMessage(ctx,0,1)
}

    
const SentMessage = async (ctx,skip,count) => {

    var data = await Botadsinfo.BotAdOne(ctx.from.id,skip)

    if (!data) {
        return await ctx.replyWithHTML(`You Don't Have Any Bot Ad Campaign Yet.`)
    }

    var { campaign_id,title,description,bot_link,status,cpc,joined,remain_submission,isError,error_message,display_rank } = data
    var page = await Botadsinfo.TotalCreateAd(ctx.from.id)
    var Ad_Name = 'BotAd'
    var StatusText = (!status)?'Active ✅':'Disabled 🚫'
    var StatusCheck = (status)?'Disabled':'Active'

    var keyboard = await generateKeyboard(count,campaign_id,page,Ad_Name,StatusText,StatusCheck)

    await ctx.replyWithHTML(message
        .replace(/%campaign_id%/gi,campaign_id)
        .replace(/%title%/gi,Escape(title))
        .replace(/%description%/gi,Escape(description))
        .replace(/%bot_link%/gi,bot_link)
        .replace(/%status%/gi,(!isError)?(status)?(remain_submission>0)?'Active ✅':'⏸ Paused: Submission Reached Out.':'Disabled 🚫':Escape(error_message))
        .replace(/%display_rank%/gi,(display_rank) ? await ExploreRank(display_rank):`Disabled 🚫`)
        .replace(/%cpc%/gi,cpc)
        .replace(/%joined%/gi,joined)
        .replace(/%remain_submission%/gi,remain_submission),{
            disable_web_page_preview: true,
            reply_markup:{
            inline_keyboard :keyboard
        }
    })
}



const MyBotAdsList = async (ctx,skip,count) => {

    var data = await Botadsinfo.BotAdOne(ctx.from.id,skip)

    if (!data) {
        return await ctx.replyWithHTML(`You Don't Have Any Bot Ad Campaign Yet.`)
    }

    var { campaign_id,title,description,bot_link,status,cpc,joined,remain_submission,isError,error_message,display_rank } = data
    var page = await Botadsinfo.TotalCreateAd(ctx.from.id)
    var Ad_Name = 'BotAd'
    var StatusText = (!status)?'Active ✅':'Disabled 🚫'
    var StatusCheck = (status)?'Disabled':'Active'

    var keyboard = await generateKeyboard(count,campaign_id,page,Ad_Name,StatusText,StatusCheck)

    await ctx.editMessageText(message
        .replace(/%campaign_id%/gi,campaign_id)
        .replace(/%title%/gi,Escape(title))
        .replace(/%description%/gi,Escape(description))
        .replace(/%bot_link%/gi,bot_link)
        .replace(/%status%/gi,(!isError)?(status)?(remain_submission>0)?'Active ✅':'⏸ Paused: Submission Reached Out.':'Disabled 🚫':Escape(error_message))
        .replace(/%display_rank%/gi,(display_rank) ? await ExploreRank(display_rank):`Disabled 🚫`)
        .replace(/%cpc%/gi,cpc)
        .replace(/%joined%/gi,joined)
        .replace(/%remain_submission%/gi,remain_submission),{
            disable_web_page_preview: true,
            parse_mode:'HTML',
            reply_markup:{
            inline_keyboard :keyboard
        }
    })
}

module.exports = { MyBotAdsMessageHandler, MyBotAdsList }