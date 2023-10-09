const { TryCatchErrorHandler } = require("../../Error/TryCatchErrorHandler/TryCatchErrorHandler");

const CHATCOSTPERMEMBER = 0.0003


const CancelledKeyboard = [[{text:'❌Cancel'}]]

const NewChatStartMessage = `Enter The Username Of The Channel Or Group You Want To Promote:`


const NewChatTitleMessage = `Enter A <b>Title</b> For Your Ad :

It Must Be Between <b>5</b> And <b>80</b> Characters.`


const NewChatDescriptionMessage = `Enter A <b>Description</b> For Your Ad :

It Must Be Between <b>10</b> And <b>180</b> Characters.`

const NewChatStayTimeMessage = `How Many <b>Hours</b> Are Users Required To <b>Stay In Your %chat_type%?</b> ⏲

<i>Using A Higher Value Results In A Lower Display Rank, Meaning It Will Take Longer For People To See Your Ad.</i>

Enter A Value Between <b>1</b> And <b>120</b> :`


const NewChatCpcMessage = `What Is The Most You Want To <b>Pay Per Member?</b>

Users Will Be Required To Stay In Your %chat_type% For <b>%stay_time% Hours</b>

The Minimum Amount Is <b>%cpc% USD</b>

<i>Enter A Value In USD :</i>`


const NewChatBudgetMessage = `🔻 <b>How Much Budget You Want To Add To This Promotion</b> ❓

The Minimum Amount Is <b>%cpc% USD</b>

<i>Enter A Value In USD :</i>`



const NewChatStart = async (ctx,sceneID) => {
    try {
        await ctx.replyWithHTML(NewChatStartMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewChat_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}



const NewChatTitleStart = async (ctx,sceneID) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewChatTitleMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewChatTitle_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}



const NewChatDescriptionStart = async (ctx,sceneID) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewChatDescriptionMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewChatDescription_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}



const NewChatStayTimeStart = async (ctx,sceneID,chat_type) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewChatStayTimeMessage.replace(/%chat_type%/gi,chat_type),{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewChatStayTime_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}



const NewChatCpcStart = async (ctx,sceneID,chat_type,stay_time) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewChatCpcMessage.replace(/%chat_type%/gi,chat_type).replace(/%cpc%/gi,CHATCOSTPERMEMBER*stay_time).replace(/%stay_time%/gi,stay_time),{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewChatCpc_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}



const NewChatBudgetStart = async (ctx,sceneID,cpc) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewChatBudgetMessage.replace(/%cpc%/gi,cpc),{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewChatBudget_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


module.exports = { NewChatStart, NewChatTitleStart, NewChatDescriptionStart, NewChatStayTimeStart, NewChatCpcStart, NewChatBudgetStart }