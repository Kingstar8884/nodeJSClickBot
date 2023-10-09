const { model } = require('mongoose')

const userinfoSchema = require('../../Database/userinfoSchema/userinfoSchema')
const Userinfo = model('userinfo', userinfoSchema);

const validator = require('validator')
const { TryCatchErrorHandler } = require('../../Error/TryCatchErrorHandler/TryCatchErrorHandler');

const CHATCOSTPERMEMBER = 0.0003
const BOTCOSTPERMEMBER = 0.0005
const URLCOSTPERMEMBER = 0.00005
const POSTCOSTPERMEMBER = 0.00005

const StartKeyboard = [[{text:'📢 Join Chats'},{text:'🤖 Message bots'},{text:'📄 View Posts'},{text:'🔗 Visit Sites'}],[{text:'💰 Balance'},{text:'👭 Referrals'},{text:'⚙️ Settings'}],[{text:'📊 My ads'}]]
const MyAdsKeyboard = [[{text:'📢 My Chat Ads'},{text:'🤖 My Bot Ads'}],[{text:'🔗 My Url Ads'},{text:'📄 My Post Ads'}],[{text:'↩️ Return'}]]
const NewAdsKeyboard = [[{text:'📢 New Chat Ads'},{text:'🤖 New Bot Ads'}],[{text:'🔗 New Url Ads'},{text:'📄 New Post Ads'}],[{text:'↩️ Return'}]]
const BalanceKeyboard = [[{text:'➕ Deposit'},{text:'➖ Withdraw'}],[{text:'💰 Balance'},{text:'🕐 History'}],[{text:'🔙 Back'}]]


const CanceledWithdrawnMessage = async (ctx) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(`Your Withdraw Request Has Been ❌ Canceled.`,{
            reply_markup:{
                keyboard :StartKeyboard,
                resize_keyboard:true
            }
        }) 
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


const CanceledNewAdMessage = async (ctx) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(`Your New Ad Has Been ❌ Canceled.`,{
            reply_markup:{
                keyboard :NewAdsKeyboard,
                resize_keyboard:true
            }
        }) 
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


const CanceledEditAdMessage = async (ctx) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(`Your Edit Has Been ❌ Canceled.`,{
            reply_markup:{
                keyboard :MyAdsKeyboard,
                resize_keyboard:true
            }
        }) 
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


const CanceledReportMessage = async (ctx) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(`Your Report Has Been ❌ Canceled.`,{
            reply_markup:{
                keyboard :StartKeyboard,
                resize_keyboard:true
            }
        }) 
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


const CanceledBotForwardMessage = async (ctx) => {
    try {
        await ctx.scene.leave()
        await ctx.replyWithHTML(`Your 🤖 <b>Message bots Task</b> Has Been ❌ Canceled.`,{
            reply_markup:{
                keyboard :StartKeyboard,
                resize_keyboard:true
            }
        }) 
    } catch (error) {
        await TryCatchErrorHandler(ctx,error)
    }
}


const TitleValidation = async (ctx) => {

    if (ctx.message.text.length<5 || ctx.message.text.length>80) {
        await ctx.scene.leave()
        await ctx.replyWithHTML(`Please Enter A <b>Title</b> Between <b>5</b> And <b>80</b> Characters.`)
        return false
    }
    await ctx.scene.leave()
    return ctx.message.text
}


const DescriptionValidation = async (ctx) => {

    if (ctx.message.text.length<10 || ctx.message.text.length>180) {
        await ctx.scene.leave()
        await ctx.replyWithHTML(`Please Enter A <b>Description</b> Between <b>10</b> And <b>180</b> Characters.`)
        return false
    }
    await ctx.scene.leave()
    return ctx.message.text
}


const StayTimeValidation = async (ctx,min,max) => {

    if (!Number.parseFloat(ctx.message.text)) {
        await ctx.replyWithHTML(`You Must Input A Valid Number`)
        return false
    }

    if (!validator.isInt(ctx.message.text,{ min:min, max:max })) {
        await ctx.replyWithHTML(`You Must Enter A Value Between <b>${min}</b> And <b>${max}</b>`)
        return false
    }
    await ctx.scene.leave()
    return ctx.message.text
}


const CpcValidation = async (ctx,stay_time,ad) => {

    var cost = (ad=='ChatAd')?CHATCOSTPERMEMBER:(ad=='BotAd')?BOTCOSTPERMEMBER:(ad=='UrlAd')?URLCOSTPERMEMBER:(ad=='PostAd')?POSTCOSTPERMEMBER:0

    if (!Number.parseFloat(ctx.message.text)) {
        await ctx.replyWithHTML(`You Must Input A Valid Number`)
        return false
    }

    if (ctx.message.text<(cost*stay_time)) {
        await ctx.replyWithHTML(`You Must Enter A Value Equal <b>${cost*stay_time}</b> Or Higher`)
        return false
    }
    await ctx.scene.leave()
    return ctx.message.text
}



const BudgetValidation = async (ctx,cpc) => {

    var TotalBalance = await Userinfo.TotalBalance(ctx.from.id)

    if (!Number.parseFloat(ctx.message.text)) {
        await ctx.replyWithHTML(`You Must Input A Valid Number`)
        return false
    }

    if (ctx.message.text<cpc) {
        await ctx.replyWithHTML(`You Must Enter A Value Equal <b>${cpc}</b> Or Higher`)
        return false
    }

    if (ctx.message.text>TotalBalance) {
        await ctx.replyWithHTML(`Your Balance Is Only ${TotalBalance} USD. Please Deposit First Then Try Again`,{
            reply_markup:{
                keyboard :BalanceKeyboard,
                resize_keyboard:true
            }
        }) 
        await ctx.scene.leave()
        return `lowbalance`
    }

    await ctx.scene.leave()
    return ctx.message.text
}



module.exports = { CanceledWithdrawnMessage, CanceledNewAdMessage, CanceledEditAdMessage, CanceledReportMessage, CanceledBotForwardMessage, TitleValidation, DescriptionValidation, StayTimeValidation, CpcValidation, BudgetValidation }