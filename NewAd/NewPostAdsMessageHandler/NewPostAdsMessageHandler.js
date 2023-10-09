const { TryCatchErrorHandler } = require("../../Error/TryCatchErrorHandler/TryCatchErrorHandler");

const POSTCOSTPERMEMBER = 0.00005

const CancelledKeyboard = [[{text:'❌Cancel'}]]

const NewPostTypeStartkeyboard = [[{text:'📝 Text'},{text:'⏩ Forward'}],[{text:'📹 Video'},{text:'📷 Photo'}],[{text:'❌Cancel'}]]

const NewPostTypeStartMessage = `Select Which Kind Of Message You Want To Promote :`

const NewPostStartMessage = `Send Me The <b>%messageType%</b> Which You Want To Promote :`

const NewPostStayTimeMessage = `How Many <b>Seconds</b> Are Visitors Required To <b>Stay On This Post Ads</b>?

<i>Using A Higher Value Results In A Lower Display Rank, Meaning It Will Take Longer For People To See Your Ad.</i>

Enter A Value Between <b>10</b> And <b>30</b>:`

const NewPostCpcMessage = `What Is The Most You Want To <b>Pay Per Watch</b>?

The Higher Your Cost Per Watch, The Faster People Will See Your Ad.

The Minimum Amount Is <b>%cpc% USD</b>

<i>Enter A Value In USD :</i>`

const NewPostBudgetMessage = `🔻 <b>How Much Budget You Want To Add To This Promotion</b> ❓

The Minimum Amount Is <b>%cpc% USD</b>

<i>Enter A Value In USD :</i>`


const NewPostTypeStart = async (ctx,sceneID) => {
    try {
        await ctx.replyWithHTML(NewPostTypeStartMessage,{
            reply_markup:{
                keyboard :NewPostTypeStartkeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewPostType_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


const NewPostStart = async (ctx,sceneID,messageType) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewPostStartMessage.replace(/%messageType%/gi,`${messageType} Message`),{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        })
        await ctx.scene.enter(`NewPost_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


const NewPostStayTimeStart = async (ctx,sceneID) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewPostStayTimeMessage,{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewPostStayTime_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


const NewPostCpcStart = async (ctx,sceneID,stay_time) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewPostCpcMessage.replace(/%cpc%/gi,POSTCOSTPERMEMBER*stay_time),{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewPostCpc_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}


const NewPostBudgetStart = async (ctx,sceneID,cpc) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(NewPostBudgetMessage.replace(/%cpc%/gi,cpc),{
            reply_markup:{
                keyboard :CancelledKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.enter(`NewPostBudget_${sceneID}`)
    } catch (error) {
        await ctx.scene.leave()
        await TryCatchErrorHandler(ctx,error)
    }
}

module.exports = { NewPostTypeStart, NewPostStart, NewPostStayTimeStart, NewPostCpcStart, NewPostBudgetStart }