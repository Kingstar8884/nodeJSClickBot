const { model } = require('mongoose')

const userinfoSchema = require('../../Database/userinfoSchema/userinfoSchema')
const Userinfo = model('userinfo', userinfoSchema);

const chatadsinfoSchema = require('../../Database/chatadsinfoSchema/chatadsinfoSchema');
const Chatadsinfo = model('chatadsinfo', chatadsinfoSchema);

const { TryCatchErrorHandler } = require('../../Error/TryCatchErrorHandler/TryCatchErrorHandler');
const { SendTextMessage } = require('../../Broadcast/Broadcast');

const TaskNotificationMessage = `<i>✅ New Tasks Available

🔔 You Have 1 New Tasks Available In 📢 Join Chats</i>`

const MyAdsKeyboard = [[{text:'📢 My Chat Ads'},{text:'🤖 My Bot Ads'}],[{text:'🔗 My Url Ads'},{text:'📄 My Post Ads'}],[{text:'↩️ Return'}]]


const CreateNewChatAd = async (ctx,campaign_id,title,description,chat_name,chat_type,cpc,budget,stay_time,remain_submission) => {
    try {
        var isCreate = await Chatadsinfo.InsertNewChatAd(ctx,campaign_id,title,description,chat_name,chat_type,cpc,budget,stay_time,remain_submission)
        
        if (!isCreate) {
            return ctx.replyWithHTML(`Something Went Wrong Try Later`,{
                reply_markup:{
                    keyboard :MyAdsKeyboard,
                    resize_keyboard:true
                }
            }) 
        }

        var charged = await Userinfo.TotalBalanceRemove(ctx.from.id,budget)

        if (!charged) {
            await Chatadsinfo.RemoveOneAdByCampaignId(campaign_id)
            return ctx.replyWithHTML(`Something Went Wrong Try Later`,{
                reply_markup:{
                    keyboard :MyAdsKeyboard,
                    resize_keyboard:true
                }
            }) 
        }

        await ctx.replyWithHTML(`Your 📢 <b>${chat_type.toUpperCase()} Ad</b> Has Been Created And Is Now Active ! ✅`,{
            reply_markup:{
                keyboard :MyAdsKeyboard,
                resize_keyboard:true
            }
        }) 

        var data = await Userinfo.SearchAllForBroadCast()
        data.map((user,index) => {
            setTimeout(async () => {
                await SendTextMessage(ctx,user.user_id,TaskNotificationMessage)
            }, 50*index )
        })

    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}



module.exports = { CreateNewChatAd }