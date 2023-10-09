const { model } = require('mongoose')

const userinfoSchema = require('../../Database/userinfoSchema/userinfoSchema')
const Userinfo = model('userinfo', userinfoSchema);

const postadsinfoSchema = require('../../Database/postadsinfoSchema/postadsinfoSchema');
const Postadsinfo = model('postadsinfo', postadsinfoSchema);

const taskinfoSchema = require('../../Database/taskinfoSchema/taskinfoSchema');
const Taskinfo = model('taskinfo', taskinfoSchema);

const { TryCatchErrorHandler } = require('../../Error/TryCatchErrorHandler/TryCatchErrorHandler')

const StartKeyboard = [[{text:'📢 Join Chats'},{text:'🤖 Message bots'}],[{text:'📄 View Posts'},{text:'🔗 Visit Sites'}],[{text:'💰 Balance'},{text:'👭 Referrals'},{text:'⚙️ Settings'}],[{text:'📊 My ads'}]]

const NoTaskMessage = `<b>Sorry, There Are No New Ads Available.</b> 😟

Alerts For New Visit Site Tasks Are <b>%task_notification%</b>

Use The Settings Button To Change Your Preferences.`

const TaskMessage = `⚠️ <i>WARNING: The Following Is A Third Party Advertisement. We Are Not Responsible For This.</i>
---------------------  
---------------------  
<i>Watch The Below Message For %stay_time% Seconds To Earn USD.
After %stay_time% Seconds You Will Received USD</i>`

const SuccessMessage = `✅ <b>Task Completed !</b>
      
💸 <i>You Earned: %reward% USD For Watching Ads !</i>`


function Timer(fn, t) {
    var timerObj = setTimeout(fn, t);

    this.stop = function() {
        if (timerObj) {
            clearTimeout(timerObj);
            timerObj = null;
        }
        return this;
    }

    this.start = function() {
        if (!timerObj) {
            this.stop();
            timerObj = setTimeout(fn, t);
        }
        return this;
    }

    this.reset = function(newT = t) {
        t = newT;
        return this.stop().start();
    }

    this.status = function () {
        if (!timerObj || timerObj == null) {
            return false
        }
        return true
    }
}


const ViewPost = async (ctx,block,user_id,campaign_id,type,text,fromChatId,message_id,photo_id,video_id,caption,stay_time,cpc) => {

    if (type=='text') {
        return await sendTextMessage(ctx,user_id,campaign_id,cpc,text,stay_time,block)
    }

    if (type=='forward') {
        return await sendForwardMessage(ctx,user_id,campaign_id,cpc,fromChatId,message_id,stay_time,block)
    }

    if (type=='photo') {
        return await sendPhotoMessage(ctx,user_id,campaign_id,cpc,photo_id,caption,stay_time,block)
    }

    if (type=='video') {
        return await sendVideoMessage(ctx,user_id,campaign_id,cpc,video_id,caption,stay_time,block)
    }
}


const ViewPostsMessageHandler = async (ctx,block) => {
    try {
        var TaskNotification = await Userinfo.TaskNotification(ctx.from.id)
        var data = await Postadsinfo.FindPostAd(ctx.from.id)

        if (!data) {
            return await ctx.replyWithHTML(NoTaskMessage.replace(/%task_notification%/gi,(TaskNotification)?`On 🔔`:`Off 🔕`),{
                parse_mode:'HTML',
                disable_web_page_preview:true,
                reply_markup:{
                    keyboard :StartKeyboard,
                    resize_keyboard:true
                }
            })
        }
    
        var { user_id,campaign_id,type,text,fromChatId,message_id,photo_id,video_id,caption,stay_time,cpc } = data
    
        await ctx.replyWithHTML(TaskMessage.replace(/%stay_time%/gi,stay_time),{reply_markup:{remove_keyboard:true}})
        await ViewPost(ctx,block,user_id,campaign_id,type,text,fromChatId,message_id,photo_id,video_id,caption,stay_time,cpc)
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


const sendTextMessage = async (ctx,user_id,campaign_id,cpc,text,stay_time,block) => {
    await ctx.replyWithHTML(text)
    var timer = new Timer(async function() { await Success(ctx,user_id,campaign_id,cpc) }, stay_time*1000);
    await ctx.scene.enter('block')
    block.on('text', async (ctx) => {

        if(!timer.status){
            return await ctx.scene.leave()  
        }

        await ctx.reply(`Wait Please ${stay_time} Seconds...`)
        return
    })
}



const sendForwardMessage = async (ctx,user_id,campaign_id,cpc,fromChatId,message_id,stay_time,block) => {
    await ctx.telegram.forwardMessage(ctx.from.id,fromChatId,message_id,{ parse_mode: 'HTML' })
    var timer = new Timer(async function() { await Success(ctx,user_id,campaign_id,cpc) }, stay_time*1000);
    await ctx.scene.enter('block')
    block.on('text', async (ctx) => {

        if(!timer.status){
            return await ctx.scene.leave()  
        }

        await ctx.reply(`Wait Please ${stay_time} Seconds...`)
        return
    })
}



const sendPhotoMessage = async (ctx,user_id,campaign_id,cpc,photo_id,caption,stay_time,block) => {
    var photo = (!caption || caption=='false')?await ctx.replyWithPhoto(photo_id):await ctx.replyWithPhoto(photo_id,{ caption: caption, parse_mode: 'HTML' })
    var timer = new Timer(async function() { await Success(ctx,user_id,campaign_id,cpc) }, stay_time*1000);
    await ctx.scene.enter('block')
    block.on('text', async (ctx) => {

        if(!timer.status){
            return await ctx.scene.leave()  
        }

        await ctx.reply(`Wait Please ${stay_time} Seconds...`)
        return
    })
}


const sendVideoMessage = async (ctx,user_id,campaign_id,cpc,video_id,caption,stay_time,block) => {
    var video = (!caption || caption=='false')?await ctx.replyWithVideo(video_id):await ctx.replyWithVideo(video_id,{ caption: caption, parse_mode: 'HTML' })
    var timer = new Timer(async function() { await Success(ctx,user_id,campaign_id,cpc) }, stay_time*1000);
    await ctx.scene.enter('block')
    block.on('text', async (ctx) => {

        if(!timer.status){
            return await ctx.scene.leave()  
        }

        await ctx.reply(`Wait Please ${stay_time} Seconds...`)
        return
    })
}


const Success = async (ctx,user_id,campaign_id,cpc) => {

    await Taskinfo.CompleteTask(ctx.from.id,campaign_id,`post`,`Post Ads`,(cpc/2),user_id)
    await Postadsinfo.UpdateSubmission(campaign_id,-1,0,1)
    await Userinfo.MainBalanceAdd(ctx.from.id,(cpc/2))

    await ctx.replyWithHTML(SuccessMessage.replace(/%reward%/gi,(cpc/2)),{
        reply_markup:{
            keyboard :StartKeyboard,
            resize_keyboard:true
        }
    })
    await ctx.scene.leave()
}


module.exports = { ViewPostsMessageHandler }