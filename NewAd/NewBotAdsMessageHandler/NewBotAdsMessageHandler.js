const { TryCatchErrorHandler } = require("../../Error/TryCatchErrorHandler/TryCatchErrorHandler");

const BOTCOSTPERMEMBER = 0.0005

const CancelledKeyboard = [[{text:'❌Cancel'}]]

const NewBotStartMessage = `Please Forward A New Message From The Bot You Want To Promote :`

const NewBotLinkStartMessage = `Enter The <b>URL</b> (All The Traffic Will Be Sent To That Link) Of The Bot You Want To Promote :`

const NewBotTitleMessage = `Enter A <b>Title</b> For Your Ad :

It Must Be Between <b>5</b> And <b>80</b> Characters.`

const NewBotDescriptionMessage = `Enter A <b>Description</b> For Your Ad :

It Must Be Between <b>10</b> And <b>180</b> Characters.`

const NewBotCpcMessage = `What Is The <b>Max</b> You Want To <b>Pay Per Referral</b>?

Users Will Be Required To Talk To Your Bot With The <code>/start</code> Command.

<i>We Cannot Guarantee That Each User We Send Will Count As A New Referral In Third Party Bots, Especially If The Bot Is Old Or Popular.</i>

The Minimum Amount Is <b>%cpc% USD</b>

<i>Enter A Value In USD :</i>`

const NewBotBudgetMessage = `🔻 <b>How Much Budget You Want To Add To This Promotion</b> ❓

The Minimum Amount Is <b>%cpc% USD</b>

<i>Enter A Value In USD :</i>`


const NewBotStart = async (ctx,sceneID) => {
    try {
        await ctx.replyWithHTML(NewBotStartMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewBot_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


const NewBotLinkStart = async (ctx,sceneID) => {
    try {
        await ctx.replyWithHTML(NewBotLinkStartMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewBotLink_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


const NewBotTitleStart = async (ctx,sceneID) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewBotTitleMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewBotTitle_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}



const NewBotDescriptionStart = async (ctx,sceneID) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewBotDescriptionMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewBotDescription_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}




const NewBotCpcStart = async (ctx,sceneID) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewBotCpcMessage.replace(/%cpc%/gi,BOTCOSTPERMEMBER),{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewBotCpc_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


const NewBotBudgetStart = async (ctx,sceneID,cpc) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewBotBudgetMessage.replace(/%cpc%/gi,cpc),{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewBotBudget_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


module.exports = { NewBotStart, NewBotLinkStart, NewBotTitleStart, NewBotDescriptionStart, NewBotCpcStart, NewBotBudgetStart }