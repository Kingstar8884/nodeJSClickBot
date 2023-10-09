const { pluralize, model, Schema } = require('mongoose')
pluralize(null);


const userinfoSchema = require('../userinfoSchema/userinfoSchema')
const Userinfo = model('userinfo', userinfoSchema);


const withdrawinfoSchema = Schema({
    user_id: { type: Number, required: true },
    unique_id: { type: Number, required: true, unique: true, index: true },
    currency: { type: String, required: true },
    currency_amount: { type: Number, required: true },
    usd_amount: { type: Number, required: true },
    currency_address: { type: String, required: true },
    hash: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
})


withdrawinfoSchema.statics = {
    InsertWithdraw : async function (user_id,currency,currency_amount,usd_amount,currency_address,hash) {
        try {
            var unique_id = await Userinfo.WithdrawUniqueId()
            var Withdrawinfo = model('withdrawinfo', withdrawinfoSchema)
            await new Withdrawinfo( { user_id : user_id, unique_id : unique_id, currency : currency, currency_amount : currency_amount, usd_amount : usd_amount, currency_address : currency_address, hash : hash } ).save()
            await Userinfo.UpdateWithdraw(user_id,usd_amount)
            return true
        } catch (error) {
            return false
        }    
    },

    SearchOne : async function (user_id,skip) {
        try {
            var result = await this.findOne( { user_id: user_id } ).sort( { unique_id: 1 } ).skip(skip)
            if (result) {
                return result
            }
            return false
        } catch (error) {
            return false
        }
    },

    TotalCreateByUserId : async function (user_id) {
        try {
            return await this.countDocuments({user_id :user_id})
        } catch (error) {
            return false
        }
    }
}


module.exports = withdrawinfoSchema