const { TryCatchErrorHandler } = require("../../Error/TryCatchErrorHandler/TryCatchErrorHandler");

const URLCOSTPERMEMBER = 0.00005

const CancelledKeyboard = [[{text:'❌Cancel'}]]

const NewUrlStartMessage = `Enter The URL To Send Traffic To:

It Should Begin With https:// or http://`

const NewUrlTitleMessage = `Enter A <b>Title</b> For Your Ad :

It Must Be Between <b>5</b> And <b>80</b> Characters.`

const NewUrlDescriptionMessage = `Enter A <b>Description</b> For Your Ad :

It Must Be Between <b>10</b> And <b>180</b> Characters.`

const NewUrlStayTimeMessage = `How Many <b>Seconds</b> Are Visitors Required To <b>Stay On The Page</b>?

<i>Using A Higher Value Results In A Lower Display Rank, Meaning It Will Take Longer For People To See Your Ad.</i>

Enter A Value Between <b>10</b> And <b>60</b>:`

const NewUrlCpcMessage = `What Is The Most You Want To <b>Pay Per Click</b>?

The Higher Your Cost Per Click, The Faster People Will See Your Ad.

The Minimum Amount Is <b>%cpc% USD</b>

<i>Enter A Value In USD :</i>`

const NewUrlBudgetMessage = `🔻 <b>How Much Budget You Want To Add To This Promotion</b> ❓

The Minimum Amount Is <b>%cpc% USD</b>

<i>Enter A Value In USD :</i>`



const NewUrlStart = async (ctx,sceneID) => {
    try {
        await ctx.replyWithHTML(NewUrlStartMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewUrl_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}



const NewUrlTitleStart = async (ctx,sceneID) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewUrlTitleMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewUrlTitle_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}



const NewUrlDescriptionStart = async (ctx,sceneID) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewUrlDescriptionMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewUrlDescription_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}



const NewUrlStayTimeStart = async (ctx,sceneID) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewUrlStayTimeMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewUrlStayTime_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}



const NewUrlCpcStart = async (ctx,sceneID,stay_time) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewUrlCpcMessage.replace(/%cpc%/gi,URLCOSTPERMEMBER*stay_time),{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewUrlCpc_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}



const NewUrlBudgetStart = async (ctx,sceneID,cpc) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewUrlBudgetMessage.replace(/%cpc%/gi,cpc),{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewUrlBudget_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


module.exports = { NewUrlStart, NewUrlTitleStart, NewUrlDescriptionStart, NewUrlStayTimeStart, NewUrlCpcStart, NewUrlBudgetStart }