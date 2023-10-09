const { model } = require('mongoose')

const postadsinfoSchema = require('../../Database/postadsinfoSchema/postadsinfoSchema')
const Postadsinfo = model('postadsinfo', postadsinfoSchema);

const { generateKeyboard } = require('../../Pagination/pagination')
const { ExploreRank, Escape } = require('../../Middleware/middleware')

var message = `<b>🆔 Campaign #%campaign_id%</b> - POST 📄

<b>📜 Post Type :</b> %type%  
<b>✅ Status : %status%</b>  
<b>🏆 Display Rank : %display_rank%</b>  
<b>⏰ Watch Time : %stay_time% Seconds</b>  
<b>💵 CPC : %cpc% USD</b>   
<b>⌚️ Watched : %joined%</b>
<b>⌛️ Remain Submission : %remain_submission%</b>`


const MyPostAdsMessageHandler = async (ctx) => {

    var TotalCreateAd = await Postadsinfo.TotalCreateAd(ctx.from.id)

    if (TotalCreateAd<=0) {
        return await ctx.replyWithHTML(`You Don't Have Any POST Ad Campaign Yet.`)
    }

    await SentMessage(ctx,0,1)
}

    
const SentMessage = async (ctx,skip,count) => {

    var data = await Postadsinfo.PostAdOne(ctx.from.id,skip)

    if (!data) {
        return await ctx.replyWithHTML(`You Don't Have Any POST Ad Campaign Yet.`)
    }

    var { campaign_id,type,status,stay_time,cpc,joined,remain_submission,isError,error_message,display_rank } = data

    var page = await Postadsinfo.TotalCreateAd(ctx.from.id)
    var Ad_Name = 'PostAd'
    var StatusText = (!status)?'Active ✅':'Disabled 🚫'
    var StatusCheck = (status)?'Disabled':'Active'

    var keyboard = await generateKeyboard(count,campaign_id,page,Ad_Name,StatusText,StatusCheck)

    await ctx.replyWithHTML(message
        .replace(/%campaign_id%/gi,campaign_id)
        .replace(/%type%/gi,type)
        .replace(/%status%/gi,(!isError)?(status)?(remain_submission>0)?'Active ✅':'⏸ Paused: Submission Reached Out.':'Disabled 🚫':Escape(error_message))
        .replace(/%display_rank%/gi,(display_rank) ? await ExploreRank(display_rank):`Disabled 🚫`)
        .replace(/%stay_time%/gi,stay_time)
        .replace(/%cpc%/gi,cpc)
        .replace(/%joined%/gi,joined)
        .replace(/%remain_submission%/gi,remain_submission),{
            disable_web_page_preview: true,
            reply_markup:{
            inline_keyboard :keyboard
        }
    })
}



const MyPostAdsList = async (ctx,skip,count) => {

    var data = await Postadsinfo.PostAdOne(ctx.from.id,skip)

    if (!data) {
        return await ctx.replyWithHTML(`You Don't Have Any POST Ad Campaign Yet.`)
    }

    var { campaign_id,type,status,stay_time,cpc,joined,remain_submission,isError,error_message,display_rank } = data

    var page = await Postadsinfo.TotalCreateAd(ctx.from.id)
    var Ad_Name = 'PostAd'
    var StatusText = (!status)?'Active ✅':'Disabled 🚫'
    var StatusCheck = (status)?'Disabled':'Active'

    var keyboard = await generateKeyboard(count,campaign_id,page,Ad_Name,StatusText,StatusCheck)

    await ctx.editMessageText(message
        .replace(/%campaign_id%/gi,campaign_id)
        .replace(/%type%/gi,type)
        .replace(/%status%/gi,(!isError)?(status)?(remain_submission>0)?'Active ✅':'⏸ Paused: Submission Reached Out.':'Disabled 🚫':Escape(error_message))
        .replace(/%display_rank%/gi,(display_rank) ? await ExploreRank(display_rank):`Disabled 🚫`)
        .replace(/%stay_time%/gi,stay_time)
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

module.exports = { MyPostAdsMessageHandler, MyPostAdsList }