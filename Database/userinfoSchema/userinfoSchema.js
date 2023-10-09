const { randomBytes } = require("crypto");

const { pluralize, model, Schema } = require('mongoose');
pluralize(null);

const REFPARCENTAGE = 0.05


const userinfoSchema = Schema({
    user_id: { type: Number, required: true, unique: true, index: true },

    total_earning: { type: Number, default: 0 },
    main_balance: { type: Number, default: 0 },

    total_deposit: { type: Number, default: 0 },
    deposit_balance: { type: Number, default: 0 },

    total_deposit_count: { type: Number, default: 0},

    total_withdraw_count: { type: Number, default: 0 },
    total_withdraw: { type: Number, default: 0 },

    ref_count: { type: Number, default: 0 },
    ref_balance: { type: Number, default: 0 },
    ref_id: { type:Number, default: process.env.ADMIN_CHAT_ID },

    email: { type:String, default: false },

    first_name: { type: String },
    last_name: { type: String },
    username: { type: String },
    language_code: { type: String, default: 'en' },
    ip: { type: String },
    country: { type: String },
    country_code: { type: String },

    can_withdraw: { type: Boolean, default: true },
    is_ban: { type: Boolean, default: false },
    is_block: { type: Boolean, default: false },
    is_verified: { type: Boolean, default: false },
    is_set_email: { type: Boolean, default: false },
    is_bot: { type: Boolean, default: false },
    task_notification: { type: Boolean, default: true },

    ban_reason: { type: String, default: false },
    withdraw_reason: { type: String, default: false },

    total_create_ads: { type: Number, default: 0 },
    total_chatads_create: { type: Number, default: 0 },
    total_botads_create: { type: Number, default: 0 },
    total_postads_create: { type: Number, default: 0 },
    total_urlads_create: { type: Number, default: 0 },

    total_complete_task: { type: Number, default: 0 },
    total_chat_complete_task: { type: Number, default: 0 },
    total_bot_complete_task: { type: Number, default: 0 },
    total_post_complete_task: { type: Number, default: 0 },
    total_url_complete_task: { type: Number, default: 0 },

    visit_id: { type: String, default: randomBytes(20).toString('hex')},

    join_time: { type: Date, default: Date.now },
    last_click: { type: Date, default: Date.now },

    total_warning: { type: Number, default: 0 }
})


userinfoSchema.statics = {
    IsNewUser : async function (user_id) {
        try {
            var data = await this.findOne( { user_id: user_id } )
            if (data) {
                return false
            }
            
            return true
        } catch (error) {
            return false   
        }
    },

    InsertNewUser : async function (ctx,ref_id) {
        try {
            var Userinfo = model('userinfo', userinfoSchema)
            await new Userinfo({ user_id: ctx.from.id, ref_id: ref_id, first_name: ctx.from.first_name, last_name: ctx.from.last_name, username: ctx.from.username, language_code: ctx.from.language_code }).save()
            await this.UpdateRefCount(ref_id);
            return true
        } catch (error) {
            return false
        }    
    },

    SearchAllForTaskNotification : async function () {
        try {
            var data = await this.find({ is_ban: false, is_block: false, is_verified: true, is_bot: false, task_notification: true }, { "_id":0, "user_id":1 } )
            return data
        } catch (error) {
            return false
        }
    },

    SearchAllForBroadCast : async function () {
        try {
            var data = await this.find({ is_block: false }, { "_id":0, "user_id":1 } )
            return data
        } catch (error) {
            return false
        }
    },

    SearchUserWithUserId: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id })
            if (user_data) {
                return user_data
            }
            return false
        } catch (error) {
            return false
        }
    },

    SearchUserWithRefId: async function (ref_id) {
        try {
            var user_data = await this.findOne({ ref_id: ref_id })
            if (user_data) {
                return user_data
            }
            return false
        } catch (error) {
            return false
        }
    },

    SearchUserWithEmail: async function (email) {
        try {
            var user_data = await this.findOne({ email: email })
            if (user_data) {
                return user_data
            }
            return false
        } catch (error) {
            return false
        }
    },

    SearchUserWithVisitId: async function (visit_id) {
        try {
            var user_data = await this.findOne({ visit_id: visit_id })
            if (user_data) {
                return user_data
            }
            return false
        } catch (error) {
            return false
        }
    },

    TotalEarning: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            if (user_data) {
                return user_data.total_earning
            }
            return false
        } catch (error) {
            return false
        }
    },

    MainBalance: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.main_balance
        } catch (error) {
            return false
        }
    },

    TotalDeposit: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.total_deposit
        } catch (error) {
            return false
        }
    },

    DepositBalance: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.deposit_balance
        } catch (error) {
            return false
        }
    },

    TotalDepositCount: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.total_deposit_count
        } catch (error) {
            return false
        }
    },


    TotalWithdrawCount: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.total_withdraw_count
        } catch (error) {
            return false
        }
    },

    TotalWithdraw: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.total_withdraw
        } catch (error) {
            return false
        }
    },

    TotalRefCount: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.ref_count
        } catch (error) {
            return false
        }
    },

    TotalRefBalance: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.ref_balance
        } catch (error) {
            return false
        }
    },

    RefId: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.ref_id
        } catch (error) {
            return false
        }
    },

    EmailStatus: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            if (user_data) {
                return user_data.is_set_email
            }
            return false
        } catch (error) {
            return false
        }
    },

    Email: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            if (user_data) {
                return user_data.email                
            }
            return false
        } catch (error) {
            return false
        }
    },

    FirstName: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.first_name
        } catch (error) {
            return false
        }
    },

    LastName: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.last_name
        } catch (error) {
            return false
        }
    },

    UserName: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.user_name
        } catch (error) {
            return false
        }
    },

    ValidName: async function (user_id) {
        try {
            var { first_name, last_name, user_name } = await this.SearchUserWithUserId(user_id)
            var valid_name = first_name || last_name || user_name || user_id
            return valid_name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        } catch (error) {
            return false
        }
    },

    UserStatus: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.is_bot
        } catch (error) {
            return false
        }
    },

    LanguageCode: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.language_code
        } catch (error) {
            return false
        }
    },

    Ip: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.ip
        } catch (error) {
            return false
        }
    },

    Country: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.country
        } catch (error) {
            return false
        }
    },

    CountryCode: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.country_code
        } catch (error) {
            return false
        }
    },

    WithdrawStatus: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.can_withdraw
        } catch (error) {
            return false
        }
    },

    BanStatus: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.is_ban
        } catch (error) {
            return false
        }
    },

    BlockStatus: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.is_block
        } catch (error) {
            return false
        }
    },

    TaskNotification: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.task_notification
        } catch (error) {
            return false
        }
    },

    VerifiedStatus: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            if (user_data) {
                return user_data.is_verified
            }
            return false
        } catch (error) {
            return false
        }
    },

    BanReason: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.ban_reason
        } catch (error) {
            return false
        }
    },

    WithdrawReason: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.withdraw_reason
        } catch (error) {
            return false
        }
    },

    TotalCreateAds: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.total_create_ads
        } catch (error) {
            return false
        }
    },

    TotalChatAdsCreate: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.total_chatads_create
        } catch (error) {
            return false
        }
    },

    TotalBotAdsCreate: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.total_botads_create
        } catch (error) {
            return false
        }
    },

    TotalPostAdsCreate: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.total_postads_create
        } catch (error) {
            return false
        }
    },

    TotalUrlAdsCreate: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.total_urlads_create
        } catch (error) {
            return false
        }
    },

    TotalCompleteTask: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.total_complete_task
        } catch (error) {
            return false
        }
    },

    TotalChatCompleteTask: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.total_chat_complete_task
        } catch (error) {
            return false
        }
    },

    TotalBotCompleteTask: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.total_bot_complete_task
        } catch (error) {
            return false
        }
    },

    TotalPostCompleteTask: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.total_post_complete_task
        } catch (error) {
            return false
        }
    },

    TotalUrlCompleteTask: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.total_url_complete_task
        } catch (error) {
            return false
        }
    },

    VisitId: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.visit_id
        } catch (error) {
            return false
        }
    },

    JoinTime: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.join_time
        } catch (error) {
            return false
        }
    },

    LastClick: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.last_click
        } catch (error) {
            return false
        }
    },

    TotalWarning: async function (user_id) {
        try {
            var user_data = await this.findOne({ user_id: user_id } )
            return user_data.total_warning
        } catch (error) {
            return false
        }
    },

    TotalBalance: async function (user_id) {
        try {
            var main_balance = await this.MainBalance(user_id)
            var deposit_balance = await this.DepositBalance(user_id)
            return main_balance+deposit_balance
        } catch (error) {
            return false
        }
    },

    MainBalanceAdd: async function (user_id,amount) {
        try {
            var ref_id = await this.RefId(user_id)
            var ref_balance = amount*REFPARCENTAGE
            await this.findOneAndUpdate({ user_id: user_id }, { $inc: { total_earning:amount, main_balance:amount } })
            await this.findOneAndUpdate({ user_id: ref_id }, { $inc: { total_earning:ref_balance, main_balance:ref_balance, ref_balance:ref_balance } })
            return true
        } catch (error) {
            return false
        }
    },

    CustomMainBalanceAdd: async function (user_id,amount) {
        try {
            await this.findOneAndUpdate({ user_id: user_id }, { $inc: { total_earning:amount, main_balance:amount } })
            return true
        } catch (error) {
            return false
        }
    },

    DepositBalanceAdd: async function (user_id,amount) {
        try {
            var ref_id = await this.RefId(user_id)
            var ref_balance = amount*REFPARCENTAGE
            await this.findOneAndUpdate({ user_id: user_id }, { $inc: { total_deposit:amount, deposit_balance:amount, total_deposit_count:1 } })
            await this.findOneAndUpdate({ user_id: ref_id }, { $inc: { total_earning:ref_balance, main_balance:ref_balance, ref_balance:ref_balance } })
            return true
        } catch (error) {
            return false
        }
    },

    CustomDepositBalanceAdd: async function (user_id,amount) {
        try {
            await this.findOneAndUpdate({ user_id: user_id }, { $inc: { total_deposit:amount, deposit_balance:amount } })
            return true
        } catch (error) {
            return false
        }
    },

    MainBalanceRemove: async function (user_id,amount) {
        try {
            await this.findOneAndUpdate({ user_id: user_id }, { $inc: { main_balance:-amount } })
            return true
        } catch (error) {
            return false
        }
    },

    DepositBalanceRemove: async function (user_id,amount) {
        try {
            await this.findOneAndUpdate({ user_id: user_id }, { $inc: { deposit_balance:-amount } })
            return true
        } catch (error) {
            return false
        }
    },

    TotalBalanceRemove: async function (user_id,amount) {
        try {
            var main_balance = await this.MainBalance(user_id)

            if (main_balance>amount) {
                await this.MainBalanceRemove(user_id,amount)
                return true
            }  
            
            var need_to_cut_from_deposit_balance = amount-main_balance

            await this.MainBalanceRemove(user_id,main_balance)
            await this.DepositBalanceRemove(user_id,need_to_cut_from_deposit_balance) 
            return true

        } catch (error) {
            return false
        }
    },

    UpdateWithdraw: async function (user_id,amount) {
        try {
            await this.findOneAndUpdate({ user_id: user_id }, { $inc: { total_withdraw_count: 1, total_withdraw: amount } })
            await this.MainBalanceRemove(user_id,amount)
            return true
        } catch (error) {
            return false
        }
    },

    UpdateDeposit: async function (user_id,amount) {
        try {
            await this.findOneAndUpdate({ user_id: user_id }, { $inc: { total_deposit_count: 1, total_deposit: amount } })
            await this.DepositBalanceAdd(user_id,amount)
            return true
        } catch (error) {
            return false
        }
    },

    UpdateRefId: async function (user_id,ref_id) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $set: { ref_id: ref_id } } )
            await this.UpdateRefCount(user_id)
            return true
        } catch (error) {
            return false
        }
    },

    UpdateRefCount: async function (user_id) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $inc: { ref_count: 1, main_balance: 3, ref_balance: 3 } } );
            return true
        } catch (error) {
            return false
        }
    },

    UpdateEmailAddress: async function (user_id,email) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $set: { email: email, is_set_email: true } } )
            return true
        } catch (error) {
            return false
        }
    },

    UserUpdate: async function (ctx) {
        try {
            await this.findOneAndUpdate( { user_id: ctx.from.id }, { $set: { first_name: ctx.from.first_name, last_name: ctx.from.last_name, username: ctx.from.username, language_code: ctx.from.language_code, is_bot: ctx.from.is_bot, is_block: true, last_click: Date.now() } } )
            return true
        } catch (error) {
            return false
        }
    },

    UpdateCanWithdraw: async function (user_id,can_withdraw,withdraw_reason) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $set: { can_withdraw: can_withdraw, withdraw_reason: withdraw_reason } } )
            return true
        } catch (error) {
            return false
        }
    },

    UpdateIsBan: async function (user_id,is_ban,ban_reason) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $set: { is_ban: is_ban, ban_reason: ban_reason } } )
            return true
        } catch (error) {
            return false
        }
    },

    UpdateIsBlock: async function (user_id,is_block) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $set: { is_block: is_block, last_click: Date.now() } } )
            return true
        } catch (error) {
            return false
        }
    },

    UpdateGeoLocation: async function (user_id,ip,country,country_code) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $set: { ip: ip, country: country, country_code: country_code, is_verified: true } } )
            return true
        } catch (error) {
            return false
        }
    },

    UpdateTaskNotification: async function (user_id,task_notification) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $set: { task_notification: task_notification } } )
            return true
        } catch (error) {
            return false
        }
    },

    UpdateTotalChatAdsCreate: async function (user_id) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $inc: { total_chatads_create: 1, total_create_ads: 1 } } )
            return true
        } catch (error) {
            return false
        }
    },

    UpdateTotalBotAdsCreate: async function (user_id) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $inc: { total_botads_create: 1, total_create_ads: 1 } } )
            return true
        } catch (error) {
            return false
        }
    },

    UpdateTotalPostAdsCreate: async function (user_id) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $inc: { total_postads_create: 1, total_create_ads: 1 } } )
            return true
        } catch (error) {
            return false
        }
    },

    UpdateTotalUrlAdsCreate: async function (user_id) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $inc: { total_urlads_create: 1, total_create_ads: 1 } } )
            return true
        } catch (error) {
            return false
        }
    },

    UpdateTotalChatCompletetask: async function (user_id) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $inc: { total_chat_complete_task: 1, total_complete_task: 1 } } )
            return true
        } catch (error) {
            return false
        }
    },

    UpdateTotalBotCompletetask: async function (user_id) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $inc: { total_bot_complete_task: 1, total_complete_task: 1 } } )
            return true
        } catch (error) {
            return false
        }
    },

    UpdateTotalPostCompletetask: async function (user_id) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $inc: { total_post_complete_task: 1, total_complete_task: 1 } } )
            return true
        } catch (error) {
            return false
        }
    },

    UpdateTotalUrlCompletetask: async function (user_id) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $inc: { total_url_complete_task: 1, total_complete_task: 1 } } )
            return true
        } catch (error) {
            return false
        }
    },

    UpdateVisitId: async function (user_id) {
        try {
            var data = await this.findOneAndUpdate( { user_id: user_id }, { $set: { visit_id: randomBytes(20).toString('hex') } }, { new: true } )
            if (data) {
                return data.visit_id
            }
            return false
        } catch (error) {
            return false
        }
    },

    UpdateWarning: async function (user_id,warning) {
        try {
            await this.findOneAndUpdate( { user_id: user_id }, { $inc: { total_warning: warning } })
            return true
        } catch (error) {
            return false
        }
    },

    AdsUniqueCampaignId: async function () {
        try {
            var data = await this.aggregate([{ $match: { total_create_ads: { $gte: 0 } } },{ $group: { _id: null, total_create_ads: { $sum: "$total_create_ads" } } }])
            if (data) {
                return data[0].total_create_ads+1                
            }
            return false
        } catch (error) {
            return false
        }
    },

    WithdrawUniqueId: async function () {
        try {
            var data = await this.aggregate([{ $match: { total_withdraw_count: { $gte: 0 } } },{ $group: { _id: null, total_withdraw_count: { $sum: "$total_withdraw_count" } } }])
            if (data) {
                return data[0].total_withdraw_count+1
            }
            return false
        } catch (error) {
            return false
        }
    },

    DepositUniqueId: async function () {
        try {
            var data = await this.aggregate([{ $match: { total_deposit_count: { $gte: 0 } } },{ $group: { _id: null, total_deposit_count: { $sum: "$total_deposit_count" } } }])
            if (data) {
                return data[0].total_deposit_count+1
            }
            return false
        } catch (error) {
            return false
        }
    },

    TotalUsers: async function () {
        try {
            var data = await this.aggregate([{ $match: { ref_count: { $gte: 0 } } },{ $group: { _id: null, ref_count: { $sum: "$ref_count" } } }])
            if (data) {
                return data[0].ref_count
            }
            return false
        } catch (error) {
            return false
        }
    },

    TotalAds: async function () {
        try {
            var data = await this.aggregate([{ $match: { total_create_ads: { $gte: 0 } } },{ $group: { _id: null, total_create_ads: { $sum: "$total_create_ads" } } }])
            if (data) {
                return data[0].total_create_ads
            }
            return false
        } catch (error) {
            return false
        }
    },

    TotalChatAds: async function () {
        try {
            var data = await this.aggregate([{ $match: { total_chatads_create: { $gte: 0 } } },{ $group: { _id: null, total_chatads_create: { $sum: "$total_chatads_create" } } }])
            if (data) {
                return data[0].total_chatads_create
            }
            return false
        } catch (error) {
            return false
        }
    },

    TotalBotAds: async function () {
        try {
            var data = await this.aggregate([{ $match: { total_botads_create: { $gte: 0 } } },{ $group: { _id: null, total_botads_create: { $sum: "$total_botads_create" } } }])
            if (data) {
                return data[0].total_botads_create
            }
            return false
        } catch (error) {
            return false
        }
    },

    TotalPostAds: async function () {
        try {
            var data = await this.aggregate([{ $match: { total_postads_create: { $gte: 0 } } },{ $group: { _id: null, total_postads_create: { $sum: "$total_postads_create" } } }])
            if (data) {
                return data[0].total_postads_create
            }
            return false
        } catch (error) {
            return false
        }
    },

    TotalUrlAds: async function () {
        try {
            var data = await this.aggregate([{ $match: { total_urlads_create: { $gte: 0 } } },{ $group: { _id: null, total_urlads_create: { $sum: "$total_urlads_create" } } }])
            if (data) {
                return data[0].total_urlads_create
            }
            return false
        } catch (error) {
            return false
        }
    },

    TotalBuyAds: async function () {
        try {
            var data = await this.aggregate([{ $match: { total_buyads_create: { $gte: 0 } } },{ $group: { _id: null, total_buyads_create: { $sum: "$total_buyads_create" } } }])
            if (data) {
                return data[0].total_buyads_create
            }
            return false
        } catch (error) {
            return false
        }
    },

    UniqueIpIndentifier: async function (ip) {
        try {
            return this.countDocuments({ ip : ip, is_ban : false })
        } catch (error) {
            return false
        }
    },

    UniqueEmailIndentifier: async function (email) {
        try {
            return this.countDocuments({ email : email })
        } catch (error) {
            return false
        }
    },

    NewUser: async function () {
        try {
            var join_time = new Date(Date.now()-((86400000/24)*24))
            return this.countDocuments({ join_time: { $gte: join_time } })
        } catch (error) {
            return false
        }
    },

    OnlineActiveUser: async function () {
        try {
            var last_click = new Date(Date.now()-((86400000/24)*1))
            return this.countDocuments({ last_click: { $gte: last_click } })
        } catch (error) {
            return false
        }
    }
}

module.exports = userinfoSchema