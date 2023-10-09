const { pluralize, model, Schema } = require('mongoose')
pluralize(null);

const userinfoSchema = require('../userinfoSchema/userinfoSchema')
const Userinfo = model('userinfo', userinfoSchema);

const taskinfoSchema = require('../taskinfoSchema/taskinfoSchema')
const Taskinfo = model('taskinfo', taskinfoSchema);

const botadsinfoSchema = Schema({
    user_id : { type: Number, required: true },
    campaign_id : { type: Number, required: true, unique: true, index: true },
    title : { type: String },
    description : { type: String },
    bot_username : { type: String, required: true },
    bot_link : { type: String, required: true },
    status : { type: Boolean, required: true },
    cpc : { type: Number, required: true },
    budget : { type: Number, required: true },
    joined : { type: Number, default: 0 },
    remain_submission : { type: Number, required: true },
    is_error : { type: Boolean, default: false },
    error_message : { type: String, default: false },
    last_update_at : { type: Date, default: Date.now },
    created_at : { type: Date, default: Date.now }
})



botadsinfoSchema.statics = {
    InsertNewBotAd : async function (user_id, campaign_id, title, description, bot_username, bot_link, cpc, budget, remain_submission ) { //yes
        try {
            var Botadsinfo = model('botadsinfo', botadsinfoSchema)
            await new Botadsinfo({ user_id: user_id, campaign_id: campaign_id, title: title, description: description, bot_username: bot_username, bot_link: bot_link, status: true, cpc: cpc, budget: budget, remain_submission: remain_submission }).save()
            await Userinfo.UpdateTotalBotAdsCreate(user_id)
            return true
        } catch (error) {
            return false
        }    
    },

    RemoveOneAdByCampaignId : async function (campaign_id) { //yes
        try {
            await this.deleteOne( { campaign_id: campaign_id } );
            return true
        } catch (error) {
            return false
        }
    },

    SearchByCampaingId : async function (campaign_id) { //yes
        try {
            var data = await this.findOne( { campaign_id: campaign_id } )
            if (data) {
                return data                
            }
            return false
        } catch (error) {
            return false
        }
    },

    ListOfCampaignId : async function (user_id) {
        try {
            var result = await this.find( { user_id: user_id } ,{ "_id":0, "campaign_id":1 } ).sort( { campaign_id : 1 } )
            return result
        } catch (error) {
            return false
        }
    },

    ListOfBotAd : async function (user_id) {
        try {
            var result = await this.find( { user_id: user_id } ).sort( { campaign_id: 1 } )
            return result
        } catch (error) {
            return false
        }
    },

    TotalCreateAd : async function (user_id) {
        try {
            return await this.countDocuments({ user_id: user_id })
        } catch (error) {
            return false
        }
    },

    DispalyRank : async function (campaign_id) {
        try {
            let value = false;
            var res = await this.find( { status : true, is_error : false, remain_submission : { $gt : 0 } }, { "_id":0, "campaign_id":1 } ).sort( { cpc:-1 } )
            await res.forEach(async function (data,index){
                if (data.campaign_id == campaign_id) {
                    value = index+1
                }
            })

            return value
        } catch (error) {
            return false
        }
    },

    BotAdOne : async function (user_id,skip) {
        try {
            var result = await this.findOne( { user_id : user_id } ).sort( { campaign_id : 1 } ).skip(skip)
            var display_rank = await this.DispalyRank(result.campaign_id)
            result['display_rank'] = display_rank
            return result
        } catch (error) {
            return false
        }
    },

    FindBotAd : async function (user_id) {
        try {
            var filter = []
            var res = await Taskinfo.find( { tasker_id: user_id, task_type:'bot' }, { "_id":0,"campaign_id":1 } )      
            res.forEach((data)=>{
                filter.push(data.campaign_id)
            })
            var data = await this.findOne( { user_id : { $ne: user_id }, campaign_id : { $nin: filter }, status : true, is_error : false, remain_submission : { $gt : 0 } } ).sort( { cpc : -1 } ).limit(1)
            if (data) {
                return data
            }
            return false
        } catch (error) {
            return false
        }
    },

    UpdateSubmission : async function (campaign_id,remain_submission,budget,joined) { //yes
        try {
            await this.findOneAndUpdate( { campaign_id : campaign_id }, { $inc: { remain_submission: remain_submission, budget: budget, joined: joined }, $set: { last_update_at : Date.now() } } )
            return true
        } catch (error) {
            return false
        }
    }, 

    UpdateStatus : async function (campaign_id,status) { //yes
        try {
            await this.findOneAndUpdate( { campaign_id : campaign_id }, { $set : { status : status, last_update_at : Date.now() } } )
            return true
        } catch (error) {
            return false
        }
    },

    EditTitle : async function (campaign_id,title) {
        try {
            await this.findOneAndUpdate( { campaign_id : campaign_id }, { $set: { title : title, last_update_at : Date.now() } } )
            return true
        } catch (error) {
            return false
        }
    },

    EditDescription: async function (campaign_id,description) {
        try {
            await this.findOneAndUpdate( { campaign_id : campaign_id }, { $set: { description : description, last_update_at : Date.now() } } )
            return true
        } catch (error) {
            return false
        }
    },

    EditAd: async function (campaign_id,bot_username,bot_link) {
        try {
            await this.findOneAndUpdate( { campaign_id : campaign_id }, { $set: { bot_username : bot_username, bot_link : bot_link } } )
            return true
        } catch (error) {
            return false
        }
    },

    BotAdStatus : async function (bot_username,status,is_error,error_message) { //yes
        try {
            await this.updateMany( { bot_username : bot_username }, { $set: { status : status, is_error : is_error, error_message : error_message, last_update_at : Date.now() } } )
            return true
        } catch (error) {
            return false
        }
    }
}


module.exports = botadsinfoSchema